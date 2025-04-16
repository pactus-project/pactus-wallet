import {WalletCore} from '@trustwallet/wallet-core';
import {HDWallet} from '@trustwallet/wallet-core/dist/src/wallet-core';
import * as bip39 from 'bip39';
import {MnemonicError, StorageError} from './error';
import {Encrypter} from './encrypter/encrypter';
import {encodeBech32WithType, generateUUID, sprintf} from './utils';
import {Amount} from './types/amount';
import {StorageKey} from './storage-key';
import {IStorage} from './storage/storage';
import {NetworkType, WalletID, WalletInfo} from './types/wallet_info';
import {KeyStore, MnemonicStrength, Vault} from './types/vault';
import {AddressInfo, Ledger, Purposes} from './types/ledger';
import * as grpc from '@grpc/grpc-js';
import {blockchain, blockchainPb} from './grpc';

/**
 * Pactus Wallet Implementation
 * Manages cryptographic operations using Trust Wallet Core
 */
export class Wallet {
  private core: WalletCore;
  private storage: IStorage;
  private info: WalletInfo;
  private vault: Vault;
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

    const type = 1; // Full Wallet
    const walletID = crypto.randomUUID ? crypto.randomUUID() : generateUUID();
    const info = new WalletInfo(type, name, walletID, Date.now(), network);

    const keyStoreObj: KeyStore = {
      master_node: {seed: mnemonic},
      imported_keys: [],
    };

    let encrypter = Encrypter.noEncrypter();
    let keyStore = JSON.stringify(keyStoreObj);
    if (password !== '') {
      encrypter = Encrypter.defaultEncrypter();
      keyStore = await encrypter.encrypt(keyStore, password);
    }
    const vault = new Vault(encrypter, keyStore);

    const coinType = network === NetworkType.Mainnet ? 21888 : 21777;
    const purposes: Purposes = {
      purposeBIP44: {
        nextEd25519Index: 0,
      },
    };
    const ledger = new Ledger(coinType, purposes);

    const infoKey = StorageKey.walletInfoKey(walletID);
    const vaultKey = StorageKey.walletVaultKey(walletID);
    const ledgerKey = StorageKey.walletLedgerKey(walletID);

    storage.set(infoKey, info.serialize());
    storage.set(vaultKey, vault.serialize());
    storage.set(ledgerKey, ledger.serialize());

    return new Wallet(core, storage, info, vault, ledger);
  }

  static load(core: WalletCore, storage: IStorage, id: WalletID): Wallet {
    const infoKey = StorageKey.walletInfoKey(id);
    const infoVal = storage.get(infoKey);
    if (infoVal === null) {
      throw new StorageError('Wallet Info does not exists');
    }
    const info = WalletInfo.deserialize(infoVal!);

    const vaultKey = StorageKey.walletVaultKey(id);
    const vaultVal = storage.get(vaultKey);
    if (vaultVal === null) {
      throw new StorageError('Vault does not exists');
    }
    const vault = Vault.deserialize(vaultVal!);

    const ledgerKey = StorageKey.walletLedgerKey(id);
    const ledgerVal = storage.get(ledgerKey);
    if (ledgerKey === null) {
      throw new StorageError('Ledger does not exists');
    }
    const ledger = Ledger.deserialize(ledgerVal!);

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
    let infos = Array.from(this.ledger.addresses.values());
    infos.sort((r, l) => (r.path < l.path ? -1 : 1));

    return infos;
  }

  getAddressInfo(address: string): AddressInfo | undefined {
    return this.ledger.addresses.get(address);
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
    const publicKey = privateKey.getPublicKeyEd25519();
    const prefix = this.publicKeyPrefix();
    const publicKeyStr = encodeBech32WithType(prefix, publicKey.data(), 3);

    const addressInfo: AddressInfo = {
      address: address,
      label: label,
      path: derivationPath,
      publicKey: publicKeyStr,
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
    this.storage.set(ledgerKey, this.ledger.serialize());
  }

  private saveInfo(): void {
    const infoKey = StorageKey.walletInfoKey(this.info.uuid);
    this.storage.set(infoKey, this.info.serialize());
  }

  private publicKeyPrefix(): string {
    switch (this.info.network) {
      case NetworkType.Mainnet:
        return 'public';
      case NetworkType.Testnet:
        return 'tpublic';
      default:
        throw new Error(`Unknown network type: ${this.info.network}`);
    }
  }
  /**
   * Get balance for a specific address
   * @param address The address to check balance for
   * @returns Promise with balance as Amount type
   */
  async getAddressBalance(address: string): Promise<Amount> {
    return this.fetchAccount(address);
  }

  /**
   * Fetch account information from the Pactus network
   * @private
   * @param address The wallet address
   * @returns Promise with the account balance as Amount
   */
  private async fetchAccount(address: string): Promise<Amount> {
    try {
      const client = this.getGrpcClient();

      const accountRequest = new blockchainPb.GetAccountRequest();
      accountRequest.setAddress(address);

      return new Promise((resolve, reject) => {
        client.getAccount(
          accountRequest,
          (err: Error | null, response: any) => {
            if (err) {
              resolve(Amount.zero());
              return;
            }

            const accountInfo = response.getAccount();
            const balanceStr =
              accountInfo && accountInfo.getBalance
                ? accountInfo.getBalance()
                : '0';

            try {
              // Create Amount instance from the returned string
              const amount = new Amount(balanceStr);
              resolve(amount);
            } catch (error) {
              resolve(Amount.zero());
            }
          }
        );
      });
    } catch (error) {
      return Amount.zero();
    }
  }

  /**
   * Get a gRPC blockchain client
   * @private
   * @returns A Blockchain gRPC client
   */
  private getGrpcClient() {
    const endpoint = 'bootstrap1.pactus.org:50051';
    try {
      // Get the BlockchainClient constructor from pactus-grpc
      const BlockchainClient = blockchain.BlockchainClient;

      // Create client using grpc.credentials from @grpc/grpc-js
      return new BlockchainClient(endpoint, grpc.credentials.createInsecure());
    } catch (error) {
      throw new Error(
        `Failed to create gRPC client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
