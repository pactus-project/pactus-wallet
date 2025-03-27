import { WalletCore } from '@trustwallet/wallet-core';
import { Wallet, WalletData, NetworkType, MnemonicStrength } from './wallet';
import { StorageError } from './error';
import { IStorage } from './storage/storage';

/**
 * WalletManager
 * Manages wallet instances and their persistence using storage
 */
export class WalletManager {
  private core: WalletCore;
  private storage: IStorage;
  private currentWallet?: Wallet;
  private readonly walletStorageKey = 'pactus_wallet_data';

  /**
   * Create a new WalletManager
   * @param core WalletCore instance
   * @param storage Optional storage implementation
   */
  constructor(core: WalletCore, storage: IStorage) {
    this.core = core;
    this.storage = storage;
  }
  /**
   * Create a new wallet
   * @param password Password for wallet encryption
   * @param strength Mnemonic strength (security level)
   * @param network Network type (mainnet/testnet)
   * @param name User-defined wallet name
   * @returns The created wallet instance
   */
  async createWallet(
    password: string,
    strength: MnemonicStrength = MnemonicStrength.Normal,
    network: NetworkType = NetworkType.Mainnet,
    name = 'My Wallet'
  ): Promise<Wallet> {
    this.currentWallet = Wallet.create(
      this.core,
      strength,
      password,
      network,
      name
    );
    await this.saveWallet(password);
    return this.currentWallet;
  }

  /**
   * Restore a wallet from mnemonic phrase
   * @param mnemonic Recovery phrase
   * @param password Password for wallet encryption
   * @param network Network type (mainnet/testnet)
   * @param name User-defined wallet name
   * @returns The restored wallet instance
   */
  async restoreWallet(
    mnemonic: string,
    password: string,
    network: NetworkType = NetworkType.Mainnet,
    name = 'My Wallet'
  ): Promise<Wallet> {
    this.currentWallet = Wallet.restore(
      this.core,
      mnemonic,
      password,
      network,
      name
    );
    await this.saveWallet(password);
    return this.currentWallet;
  }

  /**
   * Load wallet from storage
   * @param password Password to decrypt wallet data
   * @returns The loaded wallet or null if no wallet exists in storage
   */
  async loadWallet(password: string): Promise<Wallet | null> {
    // If no storage is provided, return null
    if (!this.storage) {
      return null;
    }

    try {
      const encryptedData = await this.storage.get<string>(
        this.walletStorageKey
      );

      if (!encryptedData) {
        return null;
      }

      // In a real implementation, decrypt the data with the password
      // For now, we just parse the JSON
      const walletData = JSON.parse(encryptedData) as WalletData;

      if (!walletData.mnemonic) {
        throw new StorageError('Wallet data does not contain mnemonic');
      }

      this.currentWallet = Wallet.restore(
        this.core,
        walletData.mnemonic,
        password,
        walletData.network,
        walletData.name
      );

      // Import the rest of the wallet data
      this.currentWallet.import(walletData);

      return this.currentWallet;
    } catch (error) {
      throw new StorageError(
        `Failed to load wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Save the current wallet to storage
   * @param password Password to encrypt wallet data
   * @returns The saved wallet data
   */
  async saveWallet(password: string): Promise<WalletData | null> {
    if (!this.currentWallet) {
      return null;
    }

    // If no storage is provided, simply return the wallet data without saving
    if (!this.storage) {
      return this.currentWallet.export();
    }

    try {
      const walletData = this.currentWallet.export();

      // In a future implementation, encrypt the data with the password
      // For now, we just stringify the JSON
      const encryptedData = JSON.stringify(walletData);

      await this.storage.set(this.walletStorageKey, encryptedData);
      return walletData;
    } catch (error) {
      throw new StorageError(
        `Failed to save wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete wallet from storage
   * @returns True if wallet was deleted
   */
  async deleteWallet(): Promise<boolean> {
    // If no storage is provided, simply clear the current wallet
    if (!this.storage) {
      this.currentWallet = undefined;
      return true;
    }

    try {
      await this.storage.delete(this.walletStorageKey);
      this.currentWallet = undefined;
      return true;
    } catch (error) {
      throw new StorageError(
        `Failed to delete wallet: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get the current wallet instance
   * @returns The current wallet or undefined if none is loaded
   */
  getCurrentWallet(): Wallet | undefined {
    return this.currentWallet;
  }

  /**
   * Check if a wallet exists in storage
   * @returns True if a wallet exists in storage
   */
  async hasWallet(): Promise<boolean> {
    // If no storage is provided, return false
    if (!this.storage) {
      return false;
    }

    const data = await this.storage.get(this.walletStorageKey);
    return data !== null;
  }
}
