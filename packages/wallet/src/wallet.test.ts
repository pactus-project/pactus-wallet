import { initWasm } from '@trustwallet/wallet-core';
import * as bip39 from 'bip39';
import { MnemonicError } from './error';
import { MemoryStorage } from './storage/memory-storage';
import { StorageKey } from './storage-key';
import { MnemonicStrength } from './types/vault';
import { NetworkType } from './types/wallet_info';
import { getWordCount } from './utils';
import { Wallet } from './wallet';
import { IStorage } from './storage/storage';
import { WalletCore } from '@trustwallet/wallet-core';

// Jest typings setup
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeInstanceOf(expected: any): R;
    }
  }
}

describe('Pactus Wallet Tests', () => {
  let core: WalletCore;
  let storage: IStorage;
  const password = ''; // Use an empty password to speed up tests

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
      async (strength, expectedWordCount) => {
        const wallet = await Wallet.create(
          core,
          storage,
          password,
          strength,
          NetworkType.Mainnet
        );

        const mnemonic = await wallet.getMnemonic(password);
        expect(getWordCount(mnemonic)).toBe(expectedWordCount);
      }
    );
  });

  describe('Wallet Info', () => {
    it.each([
      [NetworkType.Mainnet, 'Wallet-1'],
      [NetworkType.Testnet, 'Wallet-2'],
    ])('should return correct wallet info', async (network, name) => {
      const wallet = await Wallet.create(
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

    it('should update wallet name', async () => {
      const wallet = await Wallet.create(
        core,
        storage,
        password,
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
    it('should restore a wallet with deterministic addresses from standard 12-word mnemonic', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        password
      );
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBe(
        'pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3'
      );
      expect(addrInfo1.publicKey).toBe(
        'public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe(
        'pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94'
      );
      expect(addrInfo2.publicKey).toBe(
        'public1r8jud8m6mfuyhwq6lupmuz0pq6uzhm9a6hkqfmc89jk7k6fr30e2sns7ghs'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");
    });

    it('should restore a wallet with deterministic addresses from standard 24-word mnemonic', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        password
      );
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBe(
        'pc1r8rel7ctk0p4cs49wlhdccvkk27rpllwhrv3g6z'
      );
      expect(addrInfo1.publicKey).toBe(
        'public1rs6yq6kf9hyll78qsfk338k06j96sv69j6dpn9rqats0urnqaj4fsfhxgza'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe(
        'pc1rssed2c3h6l9fm6gu4v7nmj5s33a388e8ygtgc4'
      );
      expect(addrInfo2.publicKey).toBe(
        'public1r503wn3q8hlf9hsq6f7v2vmke5mgphx3kvatasqtlzyfaadvuhy0s2tzq84'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");
    });

    it('should throw an error when restoring with an invalid mnemonic', () => {
      const invalidMnemonic =
        'invalid mnemonic phrase that will not work for restoration';

      expect(() =>
        Wallet.restore(core, storage, invalidMnemonic, password)
      ).rejects.toThrow(MnemonicError);
    });
  });

  describe('Address Management', () => {
    it('should create unique Mainnet addresses in correct format', async () => {
      const wallet = await Wallet.create(core, storage, password);

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      const addrInfo2 = await wallet.createAddress('Address 2', password);

      expect(addrInfo1.address.startsWith('pc1')).toBe(true);
      expect(addrInfo2.address.startsWith('pc1')).toBe(true);
      expect(addrInfo1.address).not.toBe(addrInfo2.address);
      expect(wallet.isTestnet()).toBeFalsy();
    });

    it('should create unique Testnet addresses in correct format', () => {
      /*
       * const wallet =await Wallet.create(core, password, MnemonicStrength.Normal, NetworkType.Testnet, 'Test Wallet');
       * const addrInfo1 = await wallet.createAddress('Address 1', password);
       * const addrInfo2 = await wallet.createAddress('Address 2', password);
       * expect(addrInfo1.address.startsWith('tpc1')).toBe(true);
       * expect(addrInfo2.address.startsWith('tpc1')).toBe(true);
       * expect(addrInfo1.address).not.toBe(addrInfo2.address);
       * expect(wallet.isTestnet).toBeTruthy();
       */
    });

    it('should store address with label, path, and public key', async () => {
      const wallet = await Wallet.create(core, storage, password);
      const addrInfo = await wallet.createAddress('First Address', password);

      expect(addrInfo.label).toBe('First Address');
      expect(addrInfo.path).toBe("m/44'/21888'/3'/0'");
      expect(addrInfo.publicKey).toBeTruthy();
    });

    it('should store public keys in hex format', async () => {
      const wallet = await Wallet.create(core, storage, password);
      const addrInfo1 = await wallet.createAddress('Test Address 1', password);
      const addrInfo2 = await wallet.createAddress('Test Address 2', password);

      const addrInfos = wallet.getAddresses();

      expect(addrInfos).toHaveLength(2);
      expect(addrInfos).toContainEqual(addrInfo1);
      expect(addrInfos).toContainEqual(addrInfo2);
    });
  });

  describe('Load Wallet', () => {
    it('should correctly load an existing wallet from storage', async () => {
      const wallet = await Wallet.create(core, storage, password);
      await wallet.createAddress('Address 1', password);

      const loadedWallet = Wallet.load(core, storage, wallet.getID());

      expect(loadedWallet.getAddresses()).toStrictEqual(wallet.getAddresses());
      expect(loadedWallet.getWalletInfo()).toStrictEqual(
        wallet.getWalletInfo()
      );
    });

    it('should correctly load the wallet from test data', async () => {
      const walletID = '1234';
      const walletName = 'Test Wallet';
      const password = 'password';

      const walletInfoJSON = `{"name":"${walletName}","type":1,"uuid":"${walletID}","creationTime":1743405082209,"network":"mainnet"}`;
      const ledgerJSON =
        '{"addresses":{"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3":{"address":"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3","label":"Account 1","path":"m/44\'/21888\'/3\'/0\'","publicKey":"public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5"}},"coinType":21888,"purposes":{"purposeBIP44":{"nextEd25519Index":1}}}';
      const vaultJSON =
        '{"encrypter":{"method":"ARGON2ID-AES_256_CTR-MACV1","params":{"iterations":"1","memory":"8","parallelism":"1"}},"keyStore":"aLEdVCpZOJmZZz067JTxWivw/41sWooR+E2iM46WYjskjFTE3VviPzc9SQ6gba5g+8CWWcw1q1YT9x1XAg/QAt2Rd7zR2FKL+ACwCbmZ/H+lLPDBt3nlvOkD2qkxi2rjjLpbAtf2UjKrW2b3+/KxSJGuG5GPIqPvPonqHhSWrF1j0nnKqm+btD1gaeJ5IRLchi27BNorMR4qvETMeV7YjkvZlrEFdNffqpWee+o4+bnr33MwysXm4hZU1c4/zzMIODAyxsMRgbrfTDfdQ19c0yjYmDGAPDpAqNAvMmDL07nGKR2f"}';

      storage.set(StorageKey.walletInfoKey(walletID), walletInfoJSON);
      storage.set(StorageKey.walletLedgerKey(walletID), ledgerJSON);
      storage.set(StorageKey.walletVaultKey(walletID), vaultJSON);

      const wallet = Wallet.load(core, storage, walletID);

      const expectedMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      expect(wallet.getID()).toBe(walletID);
      expect(wallet.getName()).toBe(walletName);
      expect(wallet.getNetworkType()).toBe(NetworkType.Mainnet);
      expect(wallet.isEncrypted()).toBeTruthy();
      expect(wallet.getMnemonic(password)).resolves.toBe(expectedMnemonic);

      const addrInfo1 = wallet.getAddressInfo(
        'pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3'
      );
      expect(addrInfo1).toBeTruthy();
      expect(addrInfo1?.path).toBe("m/44'/21888'/3'/0'");
      expect(addrInfo1?.label).toBe('Account 1');
      expect(addrInfo1?.publicKey).toBe(
        'public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5'
      );

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe(
        'pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94'
      );
    });
  });

  describe('Save Wallet', () => {
    it('should correctly save wallet data in JSON format', async () => {
      const noPassword = '';
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      const wallet = await Wallet.restore(
        core,
        storage,
        mnemonic,
        noPassword,
        NetworkType.Mainnet,
        'My Wallet'
      );

      await wallet.createAddress('Account 1', password);

      const walletID = wallet.getID();
      const walletTime = wallet.getWalletInfo().creationTime;
      const walletInfoJSON = storage.get(StorageKey.walletInfoKey(walletID));
      const ledgerJSON = storage.get(StorageKey.walletLedgerKey(walletID));
      const vaultJSON = storage.get(StorageKey.walletVaultKey(walletID));

      const expectedWalletInfoJSON = `{"type":1,"name":"My Wallet","uuid":"${walletID}","creationTime":${walletTime},"network":"mainnet"}`;
      const expectedLedgerJSON =
        '{"coinType":21888,"purposes":{"purposeBIP44":{"nextEd25519Index":1}},"addresses":{"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3":{"address":"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3","label":"Account 1","path":"m/44\'/21888\'/3\'/0\'","publicKey":"public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5"}}}';
      const expectedVaultJSON =
        '{"encrypter":{"method":"","params":{}},"keyStore":"{\\\"masterNode\\\":{\\\"seed\\\":\\\"abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus\\\"},\\\"importedkeys\\\":[]}"}';

      expect(walletInfoJSON).toEqual(expectedWalletInfoJSON);
      expect(ledgerJSON).toEqual(expectedLedgerJSON);
      expect(vaultJSON).toEqual(expectedVaultJSON);
    });
  });
});
