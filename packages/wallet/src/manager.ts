import { StorageError } from './error';
import { StorageKey } from './storage-key';
import { MnemonicStrength, MnemonicValues } from './types/vault';
import { NetworkType, NetworkValues, WalletID } from './types/wallet_info';
import { Wallet } from './wallet';
import { IStorage } from './storage/storage';
import { WalletCore } from '@trustwallet/wallet-core';

/**
 * WalletManager
 * Manages wallet instances and their persistence using storage
 */
export class WalletManager {
  private core: WalletCore;

  private storage: IStorage;

  private walletIDs: WalletID[];

  /**
   * Create a new WalletManager
   * @param core WalletCore instance
   * @param storage Optional storage implementation
   */
  constructor(core: WalletCore, storage: IStorage) {
    const walletListVal = storage.get(StorageKey.walletListKey());
    const walletIDs = walletListVal ? (JSON.parse(walletListVal) as WalletID[]) : [];

    this.core = core;
    this.storage = storage;
    this.walletIDs = walletIDs;
  }

  /**
   * Get the list of wallets
   * @returns An array of wallet IDs
   */
  getWalletIDs(): WalletID[] {
    return this.walletIDs;
  }

  /**
   * Check if the wallet list is empty
   * @returns True if the wallet list is empty
   */
  empty(): boolean {
    return this.walletIDs.length === 0;
  }

  /**
   * Create a new wallet
   * @param password Password for wallet encryption
   * @param name User-defined wallet name
   * @param strength Mnemonic strength (security level)
   * @param network Network type (mainnet/testnet)
   * @returns The created wallet instance
   */
  async createWallet(
    password: string,
    name: string = 'My Wallet',
    strength: MnemonicStrength = MnemonicValues.NORMAL,
    network: NetworkType = NetworkValues.MAINNET
  ): Promise<Wallet> {
    const wallet = await Wallet.create(this.core, this.storage, password, strength, network, name);

    this.updateList(wallet);

    return wallet;
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
    network: NetworkType = NetworkValues.MAINNET,
    name: string = 'My Wallet'
  ): Promise<Wallet> {
    const wallet = await Wallet.restore(this.core, this.storage, mnemonic, password, network, name);

    this.updateList(wallet);

    return wallet;
  }

  /**
   * Load the first wallet from storage
   * Right now we only support one wallet. This may change in future.
   * We can remove his function in future.
   * @returns The loaded wallet or null if no wallet exists in storage
   */
  loadFirstWallet(): Wallet | null {
    if (this.empty()) {
      return null;
    }

    return this.loadWallet(this.walletIDs[0]);
  }

  /**
   * Load wallet from storage
   * @param password Password to decrypt wallet data
   * @returns The loaded wallet or null if no wallet exists in storage
   */
  loadWallet(id: WalletID): Wallet {
    return Wallet.load(this.core, this.storage, id);
  }

  /**
   * Save the current wallet to storage
   * @param password Password to encrypt wallet data
   * @returns The saved wallet data
   */
  public updateList(wallet: Wallet): void {
    const id = wallet.getID();

    if (!this.hasWallet(id)) {
      this.walletIDs.push(id);

      try {
        this.storage.set(StorageKey.walletListKey(), JSON.stringify(this.walletIDs));
      } catch (error) {
        throw new StorageError(`Failed to update wallet list: ${error}`);
      }
    }
  }

  /**
   * Delete wallet from storage
   * @returns True if wallet was deleted
   */
  deleteWallet(id: WalletID): boolean {
    if (this.hasWallet(id)) {
      this.walletIDs = this.walletIDs.filter(walletID => walletID !== id);

      try {
        this.storage.set(StorageKey.walletListKey(), JSON.stringify(this.walletIDs));
        this.storage.delete(StorageKey.walletInfoKey(id));
        this.storage.delete(StorageKey.walletLedgerKey(id));
        this.storage.delete(StorageKey.walletVaultKey(id));

        return true;
      } catch (error) {
        throw new StorageError(`Failed to delete wallet: ${error}`);
      }
    }

    return false;
  }

  /**
   * Check if a wallet exists in storage
   * @returns True if a wallet exists in storage
   */
  hasWallet(id: WalletID): boolean {
    return this.walletIDs.some(walletID => walletID === id);
  }
}
