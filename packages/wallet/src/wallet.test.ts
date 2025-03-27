import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { Wallet } from './wallet';
import * as bip39 from 'bip39';
import { MnemonicError } from './error';
import { MnemonicStrength, NetworkType } from './types';
import { MemoryStorage } from './storage/memory-storage';
import { IStorage } from './storage/storage';
import { getWordCount } from './utils';
import { StorageKey } from './storage-key';

// Jest typings setup
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInstanceOf(expected: any): R;
    }
  }
}

describe('Pactus Wallet Tests', () => {
  let core: WalletCore;
  let storage: IStorage;

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
  });

  function expectStoredValue(key: string, someValue: string) {
    const value = JSON.stringify(storage.get(key));
    expect(value).toContain(someValue);
  }

  describe('Wallet Seed', () => {
    it.each([
      [MnemonicStrength.Normal, 12],
      [MnemonicStrength.High, 24],
    ])(
      'should create wallet with %s entropy giving %i words',
      (strength, expectedWordCount) => {
        const password = '';
        const wallet = Wallet.create(
          core, storage, password, strength, NetworkType.Mainnet);

        const mnemonic = wallet.getMnemonic(password);
        expect(getWordCount(mnemonic)).toBe(expectedWordCount);
      }
    );
  });

  describe('Wallet Info', () => {
    it.each([
      [NetworkType.Mainnet, 'Wallet-1'],
      [NetworkType.Testnet, 'Wallet-2'],
    ])('should return correct wallet info', (network, name) => {
      const password = '';
      const wallet = Wallet.create(core, storage, password,
        MnemonicStrength.Normal, network, name);

      const info = wallet.getWalletInfo();
      expect(info.uuid).toBeTruthy();
      expect(info.name).toBe(name);
      expect(info.network).toBe(network);
      expect(info.version).toBe(1);
      expect(info.type).toBe(1);
      expect(info.creationTime).toBeLessThanOrEqual(Date.now());

      const infoKey = StorageKey.walletInfoKey(info.uuid)
      expectStoredValue(infoKey, info.name);
      expectStoredValue(infoKey, info.uuid);
      expectStoredValue(infoKey, info.network);
    });

    it('should update wallet name', () => {
      const wallet = Wallet.create(core, storage, 'test-password',
        MnemonicStrength.Normal, NetworkType.Mainnet, 'Initial Name');

      const newName = 'Updated Name';
      wallet.updateName(newName);
      expect(wallet.getWalletInfo().name).toBe(newName);

      const infoKey = StorageKey.walletInfoKey(wallet.getID())
      expectStoredValue(infoKey, newName);
    });
  });

  describe('Wallet Restoration', () => {
    it('should restore a wallet with deterministic addresses from standard 12-word mnemonic', () => {
      const password = '';
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = Wallet.restore(core, storage, testMnemonic, password);
      expect(wallet.getMnemonic(password)).toBe(testMnemonic);

      const addrInfo1 = wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBe(
        'pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");

      const addrInfo2 = wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe(
        'pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");

      const ledgerKey = StorageKey.walletLedgerKey(wallet.getID())
      expectStoredValue(ledgerKey, addrInfo1.address);
      expectStoredValue(ledgerKey, addrInfo1.path);
      expectStoredValue(ledgerKey, addrInfo1.label);
      expectStoredValue(ledgerKey, addrInfo2.address);
      expectStoredValue(ledgerKey, addrInfo2.path);
      expectStoredValue(ledgerKey, addrInfo2.label);
    });

    it('should restore a wallet with deterministic addresses from standard 24-word mnemonic', () => {
      const password = '';
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = Wallet.restore(core, storage, testMnemonic, password);
      expect(wallet.getMnemonic(password)).toBe(testMnemonic);

      const addrInfo1 = wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBe(
        'pc1r8rel7ctk0p4cs49wlhdccvkk27rpllwhrv3g6z'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");

      const addrInfo2 = wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe(
        'pc1rssed2c3h6l9fm6gu4v7nmj5s33a388e8ygtgc4'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");
    });

    it('should throw an error when restoring with an invalid mnemonic', () => {
      const password = '';
      const invalidMnemonic =
        'invalid mnemonic phrase that will not work for restoration';

      expect(() => Wallet.restore(core, storage, invalidMnemonic, password)).toThrow(
        MnemonicError
      );
    });
  });

  describe('Address Management', () => {
    it('should create unique Mainnet addresses in correct format', () => {
      const password = '';
      const wallet = Wallet.create(core, storage, password);

      const addrInfo1 = wallet.createAddress('Address 1', password);
      const addrInfo2 = wallet.createAddress('Address 2', password);

      expect(addrInfo1.address.startsWith('pc1')).toBe(true);
      expect(addrInfo2.address.startsWith('pc1')).toBe(true);
      expect(addrInfo1.address).not.toBe(addrInfo2.address);
    });

    it('should create unique Testnet addresses in correct format', () => {
      // const password = '';
      // const wallet = Wallet.create(core, password, MnemonicStrength.Normal, NetworkType.Testnet, 'Test Wallet');
      // const addrInfo1 = wallet.createAddress('Address 1', password);
      // const addrInfo2 = wallet.createAddress('Address 2', password);
      // expect(addrInfo1.address.startsWith('tpc1')).toBe(true);
      // expect(addrInfo2.address.startsWith('tpc1')).toBe(true);
      // expect(addrInfo1.address).not.toBe(addrInfo2.address);
    });

    it('should store address with label, path, and public key', () => {
      const password = 'test-password';
      const wallet = Wallet.create(core, storage, password);
      const addrInfo = wallet.createAddress('First Address', password);

      expect(addrInfo.label).toBe('First Address');
      expect(addrInfo.path).toBe("m/44'/21888'/3'/0'");
      expect(addrInfo.publicKey).toBeTruthy();
    });

    it('should store public keys in hex format', () => {
      const password = 'test-password';
      const wallet = Wallet.create(core, storage, password);
      const addrInfo1 = wallet.createAddress('Test Address 1', password);
      const addrInfo2 = wallet.createAddress('Test Address 2', password);

      const addrInfos = wallet.getAddresses();

      expect(addrInfos).toHaveLength(2);
      expect(addrInfos).toContainEqual(addrInfo1);
      expect(addrInfos).toContainEqual(addrInfo2);
    });
  });

  describe('Load Wallet', () => {
    it('should load wallet Storage by Wallet ID', () => {
      const password = '';
      const wallet = Wallet.create(core, storage, password);
      wallet.createAddress('Address 1', password);

      const loadedWallet = Wallet.load(core, storage, wallet.getID());

      expect(loadedWallet.getAddresses()).toBe(wallet.getAddresses());
      expect(loadedWallet.getWalletInfo()).toBe(wallet.getWalletInfo());
    });

    // TODO: Add test for Vault??
  });
});
