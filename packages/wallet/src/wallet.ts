import * as bip39 from 'bip39';
import * as crypto from 'crypto';
import { Encrypter } from './encrypter/encrypter';
import { MnemonicError, StorageError, NetworkError } from './error';
import { StorageKey } from './storage-key';
import { AddressInfo, Ledger, Purposes } from './types/ledger';
import { KeyStore, MnemonicStrength, MnemonicValues, Vault } from './types/vault';
import { NetworkType, NetworkValues, WalletID, WalletInfo } from './types/wallet_info';
import { encodeBech32WithType, generateUUID, sprintf } from './utils';
import { IStorage } from './storage/storage';
import { WalletCore } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';
import { Amount } from './types/amount';
import {
  RawTransferTransaction,
  TransactionDetailsType,
  TransferTransaction,
  BondTransaction,
} from './types/transaction';

let PactusOpenRPC;

if (process.env.NODE_ENV !== 'test') {
  import('pactus-jsonrpc').then(module => {
    PactusOpenRPC = module.PactusOpenRPC;
  });
}

// Configuration for RPC endpoints
const RPC_ENDPOINTS = {
  [NetworkValues.MAINNET]: [
    'bootstrap1.pactus.org/jsonrpc',
    'bootstrap2.pactus.org/jsonrpc',
    'bootstrap3.pactus.org/jsonrpc',
    'bootstrap4.pactus.org/jsonrpc',
  ],
  [NetworkValues.TESTNET]: [
    'testnet1.pactus.org/jsonrpc',
    'testnet2.pactus.org/jsonrpc',
    'testnet3.pactus.org/jsonrpc',
    'testnet4.pactus.org/jsonrpc',
  ],
};

// Wallet configuration constants
const WALLET_CONFIG = {
  DEFAULT_FEE: 0.01, // PAC - Fixed fee as requested
  MAX_RPC_ATTEMPTS: 3,
};

// The type of blockchain address used in Pactus.
export enum AddressType {
  Treasury = 0, // Reserved for the treasury account.
  Validator = 1, // Used by validators in the consensus process.
  BLSAccount = 2, // Account with a BLS public key.
  Ed25519Account = 3, // Account with an Ed25519 public key.
}

// The type of cryptographic signature scheme used in Pactus.
// Note: The web wallet currently supports only Ed25519 signatures.
export enum SignatureType {
  BLS = 1,
  Ed25519 = 3,
}

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
    strength: MnemonicStrength = MnemonicValues.NORMAL,
    network: NetworkType = NetworkValues.MAINNET,
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
    network: NetworkType = NetworkValues.MAINNET,
    name: string = 'My Wallet'
  ): Promise<Wallet> {
    if (bip39.validateMnemonic(mnemonic) === false) {
      throw new MnemonicError();
    }

    const type = 1; // Full Wallet
    const walletID = crypto.randomUUID ? crypto.randomUUID() : generateUUID();
    const info = new WalletInfo(type, name, walletID, Date.now(), network);

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

    const vault = new Vault(encrypter, keyStore);

    const coinType = network === NetworkValues.MAINNET ? 21888 : 21777;
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

    const info = WalletInfo.deserialize(infoVal as string);

    const vaultKey = StorageKey.walletVaultKey(id);
    const vaultVal = storage.get(vaultKey);

    if (vaultVal === null) {
      throw new StorageError('Vault does not exists');
    }

    const vault = Vault.deserialize(vaultVal as string);

    const ledgerKey = StorageKey.walletLedgerKey(id);
    const ledgerVal = storage.get(ledgerKey);

    if (ledgerVal === null) {
      throw new StorageError('Ledger does not exists');
    }

    const ledger = Ledger.deserialize(ledgerVal as string);

    return new Wallet(core, storage, info, vault, ledger);
  }

  static generateMnemonic(strength: MnemonicStrength = MnemonicValues.NORMAL): string {
    return bip39.generateMnemonic(strength);
  }

  /**
   * Get all addresses in the wallet
   * @returns Array of addresses with their metadata
   */
  getAddresses(): Array<AddressInfo> {
    const infos = Array.from(this.ledger.addresses.values());

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
    const privateKey = hdWallet.getKey(this.core.CoinType.pactus, derivationPath);

    // Get public key
    const publicKey = privateKey.getPublicKeyEd25519();

    // Select the appropriate derivation based on network type
    const derivation = this.isTestnet()
      ? this.core.Derivation.pactusTestnet
      : this.core.Derivation.pactusMainnet;

    // Create the address using AnyAddress for both networks
    const address = this.core.AnyAddress.createWithPublicKeyDerivation(
      publicKey,
      this.core.CoinType.pactus,
      derivation
    ).description();

    const prefix = this.publicKeyPrefix();
    const publicKeyStr = encodeBech32WithType(prefix, publicKey.data(), SignatureType.Ed25519);

    const addressInfo: AddressInfo = {
      address,
      label,
      emoji: '🤝',
      path: derivationPath,
      publicKey: publicKeyStr,
    };

    this.ledger.addresses.set(address, addressInfo);
    this.ledger.purposes.purposeBIP44.nextEd25519Index++;

    this.saveLedger();

    return addressInfo;
  }

  /**
   * Derive an address at a specific index without adding it to the wallet
   * @param index The derivation index
   * @param password Password for wallet encryption
   * @returns Promise<AddressInfo> - The derived address information
   */
  private async deriveAddressAtIndex(index: number, password: string): Promise<AddressInfo> {
    const derivationPath = sprintf(
      "m/44'/%d'/3'/%d'",
      this.ledger.coinType.toString(),
      index.toString()
    );

    const hdWallet = await this.hdWallet(password);
    const privateKey = hdWallet.getKey(this.core.CoinType.pactus, derivationPath);

    // Get public key
    const publicKey = privateKey.getPublicKeyEd25519();

    // Select the appropriate derivation based on network type
    const derivation = this.isTestnet()
      ? this.core.Derivation.pactusTestnet
      : this.core.Derivation.pactusMainnet;

    // Create the address using AnyAddress for both networks
    const address = this.core.AnyAddress.createWithPublicKeyDerivation(
      publicKey,
      this.core.CoinType.pactus,
      derivation
    ).description();

    const prefix = this.publicKeyPrefix();
    const publicKeyStr = encodeBech32WithType(prefix, publicKey.data(), SignatureType.Ed25519);

    return {
      address,
      label: `Recovered Address ${index + 1}`,
      emoji: '🤝',
      path: derivationPath,
      publicKey: publicKeyStr,
    };
  }

  /**
   * Recover addresses according to PIP-41 specification
   * @param password Password for wallet encryption
   * @returns Promise<AddressInfo[]> - Array of recovered addresses
   */
  async recoverAddress(password: string): Promise<AddressInfo[]> {
    const recoveredAddresses: AddressInfo[] = [];
    let inactiveCount = 1;
    let currentIndex = 0;

    while (true) {
      const currentAddress = await this.deriveAddressAtIndex(currentIndex, password);

      const isIndexed = await this.isAddressActive(currentAddress.address);

      if (isIndexed === false) {
        inactiveCount++;

        if (inactiveCount > 32) {
          break;
        }

        currentIndex++;
      } else {
        inactiveCount = 1;
        recoveredAddresses.push(currentAddress);
        currentIndex++;
      }
    }

    // Add all recovered addresses to the wallet's ledger
    for (const addressInfo of recoveredAddresses) {
      this.ledger.addresses.set(addressInfo.address, addressInfo);
    }

    // Update the next index for future address creation
    this.ledger.purposes.purposeBIP44.nextEd25519Index = currentIndex;

    // Save the updated ledger
    this.saveLedger();

    return recoveredAddresses;
  }
  async isAddressActive(address: string): Promise<boolean> {
    try {
      const publicKey = await this.getValidatorPublicKey(address);

      if (publicKey !== '') {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get the wallet's recovery phrase
   * @warning This method exposes sensitive information. Handle it with caution.
   * @param password Password for decrypting the wallet
   * @returns The mnemonic phrase
   * @throws An error if the password is incorrect
   */
  async getMnemonic(password: string): Promise<string> {
    const keyStoreJSON = await this.vault.encrypter.decrypt(this.vault.keyStore, password);
    const keyStore = JSON.parse(keyStoreJSON) as KeyStore;

    return keyStore.master_node.seed;
  }

  /**
   * Get the private key for a specific address
   * @param addresPath The path to the address
   * @param password The wallet's decryption password
   * @returns The private key in hex format
   * @throws Error if the address is not found or decryption fails
   */
  async getPrivateKey(addressPath: string, password: string): Promise<string> {
    try {
      const mnemonic = await this.getMnemonic(password);
      const hdWallet = this.core.HDWallet.createWithMnemonic(mnemonic, '');

      const privateKey = hdWallet.getKey(this.core.CoinType.pactus, addressPath);
      const prefix = this.privateKeyPrefix();

      const privateKeyStr = encodeBech32WithType(prefix, privateKey.data(), SignatureType.Ed25519);

      return privateKeyStr.toUpperCase();
    } catch (error) {
      throw new Error(`Failed to get private key: ${error}`);
    }
  }

  /**
   * Check if the wallet is created for Testnet
   * @returns true if the wallet is created for Testnet, false otherwise
   */
  isTestnet(): boolean {
    return this.info.network === NetworkValues.TESTNET;
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

  updateAccountName(address: string, name: string): void {
    const account = this.ledger.addresses.get(address);

    if (account) {
      account.label = name;
    }

    this.saveLedger();
  }

  updateAccountEmoji(address: string, emoji: string): void {
    const account = this.ledger.addresses.get(address);

    if (account) {
      account.emoji = emoji;
    }

    this.saveLedger();
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
      case NetworkValues.MAINNET:
        return 'public';
      case NetworkValues.TESTNET:
        return 'tpublic';
      default:
        throw new Error(`Unknown network type: ${this.info.network}`);
    }
  }

  private privateKeyPrefix(): string {
    switch (this.info.network) {
      case NetworkValues.MAINNET:
        return 'SECRET';
      case NetworkValues.TESTNET:
        return 'TSECRET';
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
   * Fetches account information for a given address
   * @param address The wallet address
   * @returns Promise with the account balance as Amount
   */
  private async fetchAccount(address: string): Promise<Amount> {
    const client = this.getClient();

    try {
      const result = await client.pactusBlockchainGetAccount(address);

      if (!result?.account?.balance) {
        return Amount.zero();
      }

      return new Amount(result.account.balance);
    } catch (error) {
      // If the account is not found, it means the balance is zero
      if (error instanceof NetworkError && error.message.includes('Not Found')) {
        return Amount.zero();
      }

      throw error;
    }
  }

  /**
   * Send transfer transaction with comprehensive error handling
   */
  async getSignTransferTransaction(
    fromAddress: string,
    toAddress: string,
    amount: Amount,
    fee?: Amount,
    memo?: string,
    password?: string
  ): Promise<{ signedRawTxHex: string }> {
    // Validate sender address
    const addressInfo = await this.getAddressInfo(fromAddress);

    if (!addressInfo) {
      throw new Error(`Sender address ${fromAddress} not found in wallet`);
    }

    // Check balance
    const balance = await this.getAddressBalance(fromAddress);

    const fixedFee = Amount.fromPac(WALLET_CONFIG.DEFAULT_FEE);
    const calculatedFee = fee ?? fixedFee;
    const totalAmount = amount.add(calculatedFee);

    if (balance.lessThan(totalAmount)) {
      throw new Error(
        `Insufficient balance: ${balance.formatIncludeUnit()} (needed: ${totalAmount.formatIncludeUnit()})`
      );
    }

    // Build raw transaction
    const tx: TransferTransaction = {
      sender: fromAddress,
      receiver: toAddress,
      amount,
      fee: calculatedFee,
      memo: memo ?? '', // Ensure memo is always a string
    };
    const rawTxHex = await this.getRawTransferTransaction(tx);

    // Sign transaction
    const { signedRawTxHex } = await this.signTransaction(
      rawTxHex.raw_transaction,
      addressInfo.path,
      password ?? ''
    );

    // Broadcast transaction
    return { signedRawTxHex };
  }

  /**
   * Send bond transaction with comprehensive error handling
   */
  async getSignBondTransaction(
    fromAddress: string,
    toAddress: string,
    amount: Amount,
    fee?: Amount,
    memo?: string,
    password?: string,
    publicKey?: string
  ): Promise<{ signedRawTxHex: string }> {
    // Validate sender address
    const addressInfo = await this.getAddressInfo(fromAddress);

    if (!addressInfo) {
      throw new Error(`Sender address ${fromAddress} not found in wallet`);
    }

    // Check balance
    const balance = await this.getAddressBalance(fromAddress);

    const fixedFee = Amount.fromPac(WALLET_CONFIG.DEFAULT_FEE);
    const calculatedFee = fee ?? fixedFee;
    const totalAmount = amount.add(calculatedFee);

    if (balance.lessThan(totalAmount)) {
      throw new Error(
        `Insufficient balance: ${balance.formatIncludeUnit()} (needed: ${totalAmount.formatIncludeUnit()})`
      );
    }

    // Build raw transaction
    const tx: BondTransaction = {
      sender: fromAddress,
      receiver: toAddress,
      stake: amount,
      fee: calculatedFee,
      memo: memo ?? '', // Ensure memo is always a string
      // eslint-disable-next-line @typescript-eslint/naming-convention
      public_key: publicKey ?? '',
    };
    const rawTxHex = await this.getRawBondTransaction(tx);

    // Sign transaction
    const { signedRawTxHex } = await this.signTransaction(
      rawTxHex.raw_transaction,
      addressInfo.path,
      password ?? ''
    );

    // Broadcast transaction
    return { signedRawTxHex };
  }

  /**
   * Get raw transfer transaction hex
   */
  private async getRawTransferTransaction(
    tx: TransferTransaction
  ): Promise<RawTransferTransaction> {
    const client = this.getClient();
    const txParams = {
      sender: tx.sender,
      receiver: tx.receiver,
      amount: Number(tx.amount.toString()), // Convert to number
      fee: Number(tx.fee.toString()), // Convert to number
      memo: tx.memo || '',
    };

    try {
      const result = await client.pactusTransactionGetRawTransferTransaction(
        undefined,
        txParams.sender,
        txParams.receiver,
        txParams.amount,
        txParams.fee,
        txParams.memo
      );

      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        raw_transaction: result.raw_transaction ?? '',
        id: result.id ?? '',
      };
    } catch (error) {
      throw new NetworkError(`Failed to get raw transfer transaction: ${error}`);
    }
  }

  /**
   * Get public key of validator
   */
  async getValidatorPublicKey(address: string): Promise<string> {
    const client = this.getClient();

    try {
      const txParams = {
        address,
      };

      const result = await client.pactusBlockchainGetPublicKey(txParams.address);

      return result.public_key ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Get raw bond transaction hex
   */
  private async getRawBondTransaction(tx: BondTransaction): Promise<RawTransferTransaction> {
    const client = this.getClient();

    const txParams = {
      sender: tx.sender,
      receiver: tx.receiver,
      stake: Number(tx.stake.toString()), // Convert to number
      fee: Number(tx.fee.toString()), // Convert to number
      memo: tx.memo || '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      public_key: tx.public_key,
    };

    try {
      const result = await client.pactusTransactionGetRawBondTransaction(
        undefined,
        txParams.sender,
        txParams.receiver,
        txParams.stake,
        txParams.public_key,
        txParams.fee,
        txParams.memo
      );

      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        raw_transaction: result.raw_transaction ?? '',
        id: result.id ?? '',
      };
    } catch (error) {
      throw new NetworkError(`Failed to get raw bond transaction: ${error}`);
    }
  }

  /**
   * Sign the raw transaction
   */
  async signTransaction(
    rawTxHex: string,
    addressPath: string = '',
    password: string = ''
  ): Promise<{ signedRawTxHex: string }> {
    const rawTxBytes = Buffer.from(rawTxHex, 'hex');

    if (rawTxBytes.length === 0) {
      throw new Error('Empty transaction buffer');
    }

    const hdWallet = await this.hdWallet(password);
    const derivationPath = addressPath;
    const privateKey = hdWallet.getKey(this.core.CoinType.pactus, derivationPath);

    // First byte of rawTxBytes should be the flags byte (0x00 for unsigned, 0x02 for signed)
    // Make sure we're working with an unsigned transaction
    if (rawTxBytes[0] !== 0x02) {
      console.warn('Warning: Raw transaction does not have the expected flag byte');
    }

    // Get the bytes to sign (remove the first byte which is the flags)
    const bytesToSign = rawTxBytes.subarray(1);

    // Sign the transaction
    const signatureBytes = privateKey.sign(Uint8Array.from(bytesToSign), this.core.Curve.ed25519);

    // Get the public key bytes
    const publicKeyBytes = privateKey.getPublicKeyEd25519().data();

    // Create a new buffer with flags byte set to 0x00 (signed)
    const signedTxHeader = Buffer.from([0x00]);

    // Concatenate: [flags=0x00] + original tx without flags + signature + public key
    const signedTxBytes = Buffer.concat([
      signedTxHeader,
      bytesToSign,
      Buffer.from(signatureBytes),
      Buffer.from(publicKeyBytes),
    ]);

    return { signedRawTxHex: signedTxBytes.toString('hex') };
  }

  /**
   * Broadcast the signed transaction to the network
   */
  async broadcastTransaction(signedRawTxHex: string): Promise<string> {
    const client = this.getClient();
    const params = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      signed_raw_transaction: signedRawTxHex,
    };

    try {
      const result = await client.pactusTransactionBroadcastTransaction(
        params.signed_raw_transaction
      );

      return result.id ?? '';
    } catch (error) {
      throw new NetworkError(`Failed to broadcast transaction: ${error}`);
    }
  }

  async getTransaction(txHash: string): Promise<string> {
    const client = this.getClient();
    const params = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      tx_hash: txHash,
      verbosity: TransactionDetailsType.TRANSACTION_DATA,
    };

    try {
      const result = await client.pactusTransactionGetTransaction(params.tx_hash, params.verbosity);

      return result.id ?? '';
    } catch (error) {
      throw new NetworkError(`Failed to get transaction: ${error}`);
    }
  }

  /**
   * Get a random RPC client endpoint based on network type
   * @private
   */
  private getRandomClient(): string {
    const endpoints = RPC_ENDPOINTS[this.info.network];

    if (!endpoints || endpoints.length === 0) {
      throw new NetworkError('No RPC endpoints available for the current network');
    }

    return endpoints[Math.floor(Math.random() * endpoints.length)];
  }

  private getClient(): InstanceType<typeof PactusOpenRPC> {
    return new PactusOpenRPC({
      transport: {
        type: 'https',
        host: this.getRandomClient(),
        port: 80,
      },
    });
  }

  /**
   * change wallet password
   */
  async changeWalletPassword(
    oldPassword: string,
    newPassword: string,
    storage: IStorage
  ): Promise<string> {
    const vaultKey = StorageKey.walletVaultKey(this.getID());
    const vaultVal = storage.get(vaultKey);

    if (!vaultVal) {
      throw new Error('Wallet vault not found!');
    }

    const oldVault = Vault.deserialize(vaultVal);

    const encrypter = oldVault.encrypter;

    try {
      const decryptedKeyStore = await encrypter.decrypt(oldVault.keyStore, oldPassword);
      const newEncrypter = Encrypter.defaultEncrypter();
      const newKeyStore = await newEncrypter.encrypt(decryptedKeyStore, newPassword);

      const vault = new Vault(encrypter, newKeyStore);

      storage.set(vaultKey, vault.serialize());

      return newKeyStore;
    } catch (err) {
      throw new Error(`cannot change wallet password: ${(err as Error).message}`);
    }
  }
}
