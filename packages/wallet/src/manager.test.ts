import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { WalletManager } from './manager';
import { StorageError } from './error';
import { MemoryStorage } from './storage/memory-storage';
import * as bip39 from 'bip39';
import { generateUUID } from './utils';
import { NetworkType } from './types/wallet_info';
import { MnemonicStrength } from './types/vault';

describe('WalletManager Tests', () => {
  let core: WalletCore;
  let storage: MemoryStorage;
  let walletManager: WalletManager;
  const password = ''; // Use an empty password to speed up tests

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
    walletManager = new WalletManager(core, storage);
  });

  describe('Wallet Creation', () => {
    it('should create a new wallet with default settings', async () => {
      const wallet = await walletManager.createWallet(password);

      expect(wallet).toBeTruthy();
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet);
      expect(wallet.getName()).toBe('My Wallet');
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should create a wallet with custom settings', async () => {
      const customName = 'Custom Wallet';
      const wallet = await walletManager.createWallet(
        password,
        MnemonicStrength.High,
        NetworkType.Testnet,
        customName
      );

      expect(wallet).toBeTruthy();
      expect(wallet.getNetworkType()).toBe(NetworkType.Testnet);
      expect(wallet.getName()).toBe(customName);
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });
  });

  describe('Wallet Restoration', () => {
    it('should restore a wallet from mnemonic with default settings', async () => {
      const testMnemonic = bip39.generateMnemonic(128);
      const wallet = await walletManager.restoreWallet(testMnemonic, password);

      expect(wallet).toBeTruthy();
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet); // Default network is Mainnet
      expect(wallet.getName()).toBe('My Wallet'); // Default name
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should restore a wallet with custom settings', async () => {
      const testMnemonic = bip39.generateMnemonic(128);
      const customName = 'Restored Wallet';
      const wallet = await walletManager.restoreWallet(
        testMnemonic,
        password,
        NetworkType.Testnet,
        customName
      );

      expect(wallet).toBeTruthy();
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);
      expect(wallet.getNetworkType()).toBe(NetworkType.Testnet);
      expect(wallet.getName()).toBe(customName);
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });
  });

  describe('Wallet List Management', () => {
    it('should return an empty wallet list initially', () => {
      const walletIDs = walletManager.getWalletIDs();
      expect(walletIDs).toEqual([]);
    });

    it('should add a wallet to the wallet list after creation', async () => {
      const wallet = await walletManager.createWallet(password);
      const walletIDs = walletManager.getWalletIDs();

      expect(walletIDs.length).toBe(1);
      expect(walletIDs).toContain(wallet.getID());
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should remove a wallet from the wallet list after deletion', async () => {
      const wallet = await walletManager.createWallet(password);

      const result = walletManager.deleteWallet(wallet.getID());
      expect(result).toBe(true);

      const walletIDs = walletManager.getWalletIDs();
      expect(walletIDs.length).toBe(0);
      expect(walletManager.hasWallet(wallet.getID())).toBeFalsy();
    });

    it('should not add duplicate wallets to the wallet list', async () => {
      const wallet = await walletManager.createWallet(password);

      // Save the wallet again
      walletManager.updateList(wallet);

      const walletIDs = walletManager.getWalletIDs();
      expect(walletIDs.length).toBe(1);
      expect(walletIDs).toContain(wallet.getID());
    });

    it('should correctly detect if a wallet exists in the wallet list', async () => {
      const wallet = await walletManager.createWallet(password);

      expect(walletManager.hasWallet(wallet.getID())).toBe(true);
      expect(walletManager.hasWallet(generateUUID())).toBe(false);
    });
  });

  describe('Wallet Saving', () => {
    it('should save the current wallet to storage', async () => {
      const wallet1 = await walletManager.createWallet(password);
      await wallet1.createAddress('Address 1', password);
      await wallet1.createAddress('Address 2', password);
      walletManager.updateList(wallet1);

      const wallet2 = walletManager.loadWallet(wallet1.getID());

      expect(wallet2.getAddresses()).toHaveLength(2);
      expect(wallet2.getAddresses()).toStrictEqual(wallet1.getAddresses());
    });
  });

  describe('Wallet Deletion', () => {
    it('should delete wallet from storage', async () => {
      const wallet = await walletManager.createWallet(password);
      const walletID = wallet.getID();
      expect(walletManager.hasWallet(walletID)).toBeTruthy();

      // Delete wallet
      const result = walletManager.deleteWallet(walletID);
      expect(result).toBe(true);

      // Verify wallet no longer exists
      expect(walletManager.hasWallet(walletID)).toBe(false);
      expect(walletManager.getWalletIDs()).toHaveLength(0);
      expect(walletManager.loadWallet(walletID).getWalletInfo()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors when saving', async () => {
      const wallet = await walletManager.createWallet(password);

      // Force empty wallet list
      walletManager['walletIDs'] = [];

      jest.spyOn(storage, 'set').mockImplementation(() => {
        throw new StorageError('Storage error');
      });

      expect(() => walletManager.updateList(wallet)).toThrow(StorageError);
    });

    it('should handle storage errors when loading', async () => {
      const wallet = await walletManager.createWallet(password);

      // Reset previous mocks
      jest.spyOn(storage, 'set').mockRestore();

      // Mock storage.get to throw an error
      jest.spyOn(storage, 'get').mockImplementation(() => {
        throw new StorageError('Storage error');
      });

      // Attempt to load should throw StorageError
      expect(() => walletManager.loadWallet(wallet.getID())).toThrow(
        StorageError
      );
    });

    it('should handle storage errors when deleting', async () => {
      const wallet = await walletManager.createWallet(password);

      // Reset previous mocks
      jest.spyOn(storage, 'get').mockRestore();

      // Mock storage.delete to throw an error
      jest.spyOn(storage, 'delete').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Attempt to delete should throw StorageError
      expect(() => walletManager.deleteWallet(wallet.getID())).toThrow(
        StorageError
      );
    });
  });
});
