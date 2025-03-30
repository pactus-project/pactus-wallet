import { WalletCore } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';
import * as bip39 from 'bip39';
import { MnemonicError } from './error';
import { Encrypter } from './encrypter/encrypter';
import { Params } from './encrypter/params';
import { generateUUID, sprintf } from './utils';
import {
  AddressInfo,
  KeyStore,
  Ledger,
  MnemonicStrength,
  NetworkType,
  Vault,
  WalletID,
  WalletInfo,
} from './types';
import { StorageKey } from './storage-key';
import { IStorage } from './storage/storage';

/**
 * Pactus Wallet Implementation
 * Manages cryptographic operations using Trust Wallet Core
 */
export class Wallet {
  private core: WalletCore;
  private storage: IStorage;
  private info: WalletInfo;
  private readonly vault: Vault;
  private ledger: Ledger;

  /**
   * Creates a new Wallet instance.
   * Private constructor - use static factory methods instead
   * @param core WalletCore instance.
   * @param storage Storage implementation.
   * @param info Wallet information, including details like name, network, etc.
   * @param vault Vault object that stores encrypted mnemonics and private keys. It is read-only.
   * @param ledger Ledger object that contains all addresses and the path to derive new addresses.
   */
  private constructor(
    core: WalletCore,
    storage: IStorage,
    info: WalletInfo,
    vault: Vault,
    ledger: Ledger
  ) {
    this.core = core;
    this.storage = storage;
    this.info = info;
    this.vault = vault;
    this.ledger = ledger;
  }

  /**
   * Create a new wallet
   * @param core WalletCore instance
   * @param strength Mnemonic strength (security level)
   * @param network Network type (mainnet/testnet)
   * @param name User-defined wallet name
   * @returns A new wallet instance
   */
  static async create(
    core: WalletCore,
    storage: IStorage,
    password: string,
    strength: MnemonicStrength = MnemonicStrength.Normal,
    network: NetworkType = NetworkType.Mainnet,
    name: string = 'My Wallet'
  ): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic(strength);

    return Wallet.restore(core, storage, mnemonic, password, network, name);
  }

  /**
   * Restore a wallet from a mnemonic phrase
   * @param core WalletCore instance
   * @param mnemonic Recovery phrase
   * @param password Password for wallet encryption
   * @param network Network type (mainnet/testnet)
   * @param name User-defined wallet name
   * @returns A new wallet instance created from the mnemonic
   */
  static async restore(
    core: WalletCore,
    storage: IStorage,
    mnemonic: string,
    password: string,
    network: NetworkType = NetworkType.Mainnet,
    name: string = 'My Wallet'
  ): Promise<Wallet> {
    if (bip39.validateMnemonic(mnemonic) == false) {
      throw new MnemonicError();
    }

    const id = crypto.randomUUID ? crypto.randomUUID() : generateUUID();
    const infoKey = StorageKey.walletInfoKey(id);
    const vaultKey = StorageKey.walletVaultKey(id);
    const ledgerKey = StorageKey.walletLedgerKey(id);

    const info: WalletInfo = {
      name: name,
      type: 1,
      uuid: id,
      creationTime: Date.now(),
      network: network,
    };

    const keyStoreObj: KeyStore = {
      master_node: { seed: mnemonic },
      imported_keys: [],
    };

    let encrypter = Encrypter.noEncrypter();
    let keyStore = JSON.stringify(keyStoreObj);
    if (password !== '') {
      encrypter = Encrypter.defaultEncrypter();
      keyStore = await encrypter.encrypt(keyStore, password);
    }

    const vault: Vault = {
      encrypter: encrypter,
      keyStore: keyStore,
    };
    const ledger: Ledger = {
      addresses: new Map<string, AddressInfo>(),
      coinType: network === NetworkType.Mainnet ? 21888 : 21777,
      purposes: {
        purposeBIP44: {
          nextEd25519Index: 0,
        },
      },
    };

    storage.set(infoKey, info);
    storage.set(vaultKey, vault);
    storage.set(ledgerKey, ledger);

    return new Wallet(core, storage, info, vault, ledger);
  }

  // TODO: We can ask for password to check the validity of vault and password before loading the wallet
  static load(core: WalletCore, storage: IStorage, id: WalletID): Wallet {
    const infoKey = StorageKey.walletInfoKey(id);
    const vaultKey = StorageKey.walletVaultKey(id);
    const ledgerKey = StorageKey.walletLedgerKey(id);

    const info = storage.get(infoKey) as WalletInfo;
    const vault = storage.get(vaultKey) as Vault;
    const ledger = storage.get(ledgerKey) as Ledger;

    return new Wallet(core, storage, info, vault, ledger);
  }

  static generateMnemonic(strength: MnemonicStrength): string {
    return bip39.generateMnemonic(strength);
  }

  /**
   * Get all addresses in the wallet
   * @returns Array of addresses with their metadata
   */
  getAddresses(): Array<AddressInfo> {
    let addresses = Array.from(this.ledger.addresses.values());
    addresses.sort((r, l) => (r.path < l.path ? -1 : 1));

    return addresses;
  }

  /**
   * Get the unique identifier (UUID) of the wallet.
   * @returns The wallet's UUID as a string.
   */
  getID(): WalletID {
    return this.info.uuid;
  }

  /**
   * Get the wallet's name
   * @returns The wallet's name
   */
  getName(): string {
    return this.info.name;
  }

  /**
   * Get the network type the wallet is configured for
   * @returns NetworkType (mainnet or testnet)
   */
  getNetworkType(): NetworkType {
    return this.info.network;
  }

  /**
   * Get general wallet information
   * @returns WalletInfo object
   */
  getWalletInfo(): WalletInfo {
    return this.info;
  }

  /**
   * Create a new Ed25519 address
   * @param label User-friendly label for the address
   * @param password Password for wallet encryption
   * @returns AddressInfo object containing the generated address and metadata
   */
  async createAddress(label: string, password: string): Promise<AddressInfo> {
    const derivationPath = sprintf(
      "m/44'/%d'/3'/%d'",
      this.ledger.coinType.toString(),
      this.ledger.purposes.purposeBIP44.nextEd25519Index.toString()
    );

    const hdWallet = await this.hdWallet(password);
    const privateKey = hdWallet.getKey(
      this.core.CoinType.pactus,
      derivationPath
    );
    const address = this.core.CoinTypeExt.deriveAddress(
      this.core.CoinType.pactus,
      privateKey
    );

    // Get public key
    const publicKey = privateKey.getPublicKeyCurve25519();
    const publicKeyHex = Buffer.from(publicKey.data()).toString('hex'); // TODO: use bech32m
    const addressInfo: AddressInfo = {
      address: address,
      label: label,
      path: derivationPath,
      publicKey: publicKeyHex,
    };

    this.ledger.addresses.set(address, addressInfo);
    this.ledger.purposes.purposeBIP44.nextEd25519Index++;

    this.saveLedger();

    return addressInfo;
  }

  /**
   * Get the wallet's recovery phrase
   * @warning This method exposes sensitive information. Handle it with caution.
   * @param password Password for decrypting the wallet
   * @returns The mnemonic phrase
   * @throws An error if the password is incorrect
   */
  async getMnemonic(password: string): Promise<string> {
    const keyStoreJSON = await this.vault.encrypter.decrypt(
      this.vault.keyStore,
      password
    );
    const keyStore = JSON.parse(keyStoreJSON) as KeyStore;

    return keyStore.master_node.seed;
  }

  /**
   * Check if the wallet is created for Testnet
   * @returns true if the wallet is created for Testnet, false otherwise
   */
  isTestnet(): boolean {
    return this.info.network === NetworkType.Testnet;
  }

  /**
   * Check if the wallet is encrypted
   * @returns `true` if the wallet is encrypted, `false` otherwise
   */
  isEncrypted(): boolean {
    return this.vault.encrypter.isEncrypted();
  }

  /**
   * Updates the wallet's name
   * @param name The new name for the wallet
   */
  updateName(name: string): void {
    this.info.name = name;

    this.saveInfo();
  }

  private async hdWallet(password: string): Promise<HDWallet> {
    const mnemonic = await this.getMnemonic(password);
    const hdWallet = this.core.HDWallet.createWithMnemonic(mnemonic, '');

    return hdWallet;
  }

  private saveLedger(): void {
    const ledgerKey = StorageKey.walletLedgerKey(this.info.uuid);
    this.storage.set(ledgerKey, this.ledger);
  }

  private saveInfo(): void {
    const infoKey = StorageKey.walletInfoKey(this.info.uuid);
    this.storage.set(infoKey, this.info);
  }
}
