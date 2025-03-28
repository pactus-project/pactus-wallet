import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { WalletManager } from './manager';
import { StorageError } from './error';
import { MemoryStorage } from './storage/memory-storage';
import * as bip39 from 'bip39';
import { generateUUID } from './utils';
import { MnemonicStrength, NetworkType } from './types';

describe('WalletManager Tests', () => {
  let core: WalletCore;
  let storage: MemoryStorage;
  let walletManager: WalletManager;
  const testPassword = 'test-password';
  const testMnemonic = bip39.generateMnemonic(128);

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
    walletManager = new WalletManager(core, storage);
  });

  describe('Wallet Creation', () => {
    it('should create a new wallet with default settings', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      expect(wallet).toBeTruthy();
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet);
      expect(wallet.getName()).toBe('My Wallet');
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should create a wallet with custom settings', async () => {
      const customName = 'Custom Wallet';
      const wallet = await walletManager.createWallet(
        testPassword,
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
      const wallet = await walletManager.restoreWallet(
        testMnemonic,
        testPassword
      );

      expect(wallet).toBeTruthy();
      expect(wallet.getMnemonic(testPassword)).toBe(testMnemonic);
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet); // Default network is Mainnet
      expect(wallet.getName()).toBe('My Wallet'); // Default name
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should restore a wallet with custom settings', async () => {
      const customName = 'Restored Wallet';
      const wallet = await walletManager.restoreWallet(
        testMnemonic,
        testPassword,
        NetworkType.Testnet,
        customName
      );

      expect(wallet).toBeTruthy();
      expect(wallet.getMnemonic(testPassword)).toBe(testMnemonic);
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
      const wallet = await walletManager.createWallet(testPassword);
      const walletIDs = walletManager.getWalletIDs();

      expect(walletIDs.length).toBe(1);
      expect(walletIDs).toContain(wallet.getID());
      expect(walletManager.hasWallet(wallet.getID())).toBeTruthy();
    });

    it('should remove a wallet from the wallet list after deletion', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      const result = walletManager.deleteWallet(wallet.getID());
      expect(result).toBe(true);

      const walletIDs = walletManager.getWalletIDs();
      expect(walletIDs.length).toBe(0);
      expect(walletManager.hasWallet(wallet.getID())).toBeFalsy();
    });

    it('should not add duplicate wallets to the wallet list', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      // Save the wallet again
      walletManager.updateList(wallet);

      const walletIDs = walletManager.getWalletIDs();
      expect(walletIDs.length).toBe(1);
      expect(walletIDs).toContain(wallet.getID());
    });

    it('should correctly detect if a wallet exists in the wallet list', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      expect(walletManager.hasWallet(wallet.getID())).toBe(true);
      expect(walletManager.hasWallet(generateUUID())).toBe(false);
    });
  });

  describe('Wallet Saving', () => {
    it('should save the current wallet to storage', async () => {
      const wallet1 = await walletManager.createWallet(testPassword);
      wallet1.createAddress('Address 1', testPassword);
      wallet1.createAddress('Address 2', testPassword);
      walletManager.updateList(wallet1);

      const wallet2 = walletManager.loadWallet(wallet1.getID());

      expect(wallet2.getAddresses()).toHaveLength(2);
      expect(wallet2.getAddresses()).toBe(wallet1.getAddresses());
    });
  });

  describe('Wallet Deletion', () => {
    it('should delete wallet from storage', async () => {
      const wallet = await walletManager.createWallet(testPassword);
      const walletID = wallet.getID();
      expect(walletManager.hasWallet(walletID)).toBeTruthy();

      // Delete wallet
      const result = walletManager.deleteWallet(walletID);
      expect(result).toBe(true);

      // Verify wallet no longer exists
      expect(walletManager.hasWallet(walletID)).toBe(false);
      expect(walletManager.getWalletIDs()).toHaveLength(0);
      expect(walletManager.loadWallet(walletID)).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors when saving', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      // Mock storage.set to throw an error
      jest.spyOn(storage, 'set').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Attempt to save should throw StorageError
      await expect(walletManager.updateList(wallet)).rejects.toThrow(
        StorageError
      );
    });

    it('should handle storage errors when loading', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      // Mock storage.delete to throw an error
      jest.spyOn(storage, 'delete').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Attempt to delete should throw StorageError
      await expect(walletManager.loadWallet(wallet.getID())).rejects.toThrow(
        StorageError
      );
    });

    it('should handle storage errors when deleting', async () => {
      const wallet = await walletManager.createWallet(testPassword);

      // Mock storage.delete to throw an error
      jest.spyOn(storage, 'delete').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Attempt to delete should throw StorageError
      await expect(walletManager.deleteWallet(wallet.getID())).rejects.toThrow(
        StorageError
      );
    });
  });
});
