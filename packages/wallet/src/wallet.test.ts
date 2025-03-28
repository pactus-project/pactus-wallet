import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { Wallet } from './wallet';
import * as bip39 from 'bip39';
import { MnemonicError } from './error';
import {
  AddressInfo,
  Ledger,
  MnemonicStrength,
  NetworkType,
  Vault,
  WalletInfo,
} from './types';
import { MemoryStorage } from './storage/memory-storage';
import { IStorage } from './storage/storage';
import { getWordCount } from './utils';
import { StorageKey } from './storage-key';
import { Console } from 'console';
import { Params } from './encrypter/params';

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
  function parseStoredObject(key: string, walletAddress: string): AddressInfo {
    const ledger = storage.get(key);

    if (!ledger || typeof ledger !== 'object') {
      throw new Error('Ledger not found or invalid format');
    }

    if (!('addresses' in ledger) || !(ledger.addresses instanceof Map)) {
      throw new Error(
        'Invalid ledger structure: missing or invalid addresses Map'
      );
    }
    const storedAddress = ledger.addresses.get(walletAddress);
    return storedAddress;
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
          core,
          storage,
          password,
          strength,
          NetworkType.Mainnet
        );

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
      const wallet = Wallet.create(
        core,
        storage,
        password,
        MnemonicStrength.Normal,
        network,
        name
      );

      const info = wallet.getWalletInfo();
      expect(info.uuid).toBeTruthy();
      expect(info.name).toBe(name);
      expect(info.network).toBe(network);
      expect(info.type).toBe(1);
      expect(info.creationTime).toBeLessThanOrEqual(Date.now());

      const infoKey = StorageKey.walletInfoKey(info.uuid);
      expectStoredValue(infoKey, info.name);
      expectStoredValue(infoKey, info.uuid);
      expectStoredValue(infoKey, info.network);
    });

    it('should update wallet name', () => {
      const wallet = Wallet.create(
        core,
        storage,
        'test-password',
        MnemonicStrength.Normal,
        NetworkType.Mainnet,
        'Initial Name'
      );

      const newName = 'Updated Name';
      wallet.updateName(newName);
      expect(wallet.getWalletInfo().name).toBe(newName);

      const infoKey = StorageKey.walletInfoKey(wallet.getID());
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

      const ledgerKey = StorageKey.walletLedgerKey(wallet.getID());
      const storedAddress1 = parseStoredObject(ledgerKey, addrInfo1.address);
      const storedAddress2 = parseStoredObject(ledgerKey, addrInfo2.address);
      expect(storedAddress1.address).toEqual(addrInfo1.address);
      expect(storedAddress1.label).toEqual(addrInfo1.label);
      expect(storedAddress1.path).toEqual(addrInfo1.path);
      expect(storedAddress2.address).toEqual(addrInfo2.address);
      expect(storedAddress2.label).toEqual(addrInfo2.label);
      expect(storedAddress2.path).toEqual(addrInfo2.path);
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

      expect(() =>
        Wallet.restore(core, storage, invalidMnemonic, password)
      ).toThrow(MnemonicError);
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
      expect(wallet.isTestnet()).toBeFalsy();
    });

    it('should create unique Testnet addresses in correct format', () => {
      // const password = '';
      // const wallet = Wallet.create(core, password, MnemonicStrength.Normal, NetworkType.Testnet, 'Test Wallet');
      // const addrInfo1 = wallet.createAddress('Address 1', password);
      // const addrInfo2 = wallet.createAddress('Address 2', password);
      // expect(addrInfo1.address.startsWith('tpc1')).toBe(true);
      // expect(addrInfo2.address.startsWith('tpc1')).toBe(true);
      // expect(addrInfo1.address).not.toBe(addrInfo2.address);
      // expect(wallet.isTestnet).toBeTruthy();
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
    it('should correctly load an existing wallet from storage', () => {
      const password = '';
      const wallet = Wallet.create(core, storage, password);
      wallet.createAddress('Address 1', password);

      const loadedWallet = Wallet.load(core, storage, wallet.getID());

      expect(loadedWallet.getAddresses()).toStrictEqual(wallet.getAddresses());
      expect(loadedWallet.getWalletInfo()).toStrictEqual(
        wallet.getWalletInfo()
      );
    });

    it('should correctly load the wallet from test data', () => {
      const password = 'password';
      const walletID = '1234';
      const walletName = 'Test Wallet';
      const walletInfo: WalletInfo = {
        type: 1,
        name: walletName,
        uuid: walletID,
        creationTime: Date.now(),
        network: NetworkType.Mainnet,
      };
      storage.set(StorageKey.walletInfoKey(walletID), walletInfo);

      const ledger: Ledger = {
        coinType: 21888,
        purposes: {
          purposeBIP44: {
            nextEd25519Index: 0,
          },
        },
        addresses: new Map(),
      };
      storage.set(StorageKey.walletLedgerKey(walletID), ledger);

      let params = new Params();
      params.setNumber('iterations', 1);
      params.setNumber('memory', 8);
      params.setNumber('parallelism', 1);
      params.setNumber('keylen', 48);

      const vault: Vault = {
        encrypter: {
          method: 'ARGON2ID-AES_256_CTR-MACV1',
          params: params,
        },
        keyStore:
          'aLEdVCpZOJmZZz067JTxWivw/41sWooR+E2iM46WYjskjFTE3VviPzc9SQ6gba5g+8CWWcw1q1YT9x1XAg/QAt2Rd7zR2FKL+ACwCbmZ/H+lLPDBt3nlvOkD2qkxi2rjjLpbAtf2UjKrW2b3+/KxSJGuG5GPIqPvPonqHhSWrF1j0nnKqm+btD1gaeJ5IRLchi27BNorMR4qvETMeV7YjkvZlrEFdNffqpWee+o4+bnr33MwysXm4hZU1c4/zzMIODAyxsMRgbrfTDfdQ19c0yjYmDGAPDpAqNAvMmDL07nGKR2f',
      };
      storage.set(StorageKey.walletVaultKey(walletID), vault);

      const wallet = Wallet.load(core, storage, walletID);

      expect(wallet.getID()).toBe(walletID);
      expect(wallet.getName()).toBe(walletName);
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet);

      const expectedMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      expect(wallet.getMnemonic(password)).toBe(expectedMnemonic);

      const addrInfo = wallet.createAddress('Address 1', password);
      expect(addrInfo.address).toBe(
        'pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3'
      );
    });
  });
});
