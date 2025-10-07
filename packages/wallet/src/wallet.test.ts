import { initWasm } from '@trustwallet/wallet-core';
import * as bip39 from 'bip39';
import { MnemonicError } from './error';
import { MemoryStorage } from './storage/memory-storage';
import { StorageKey } from './storage-key';
import { MnemonicValues } from './types/vault';
import { NetworkValues } from './types/wallet_info';
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
      [MnemonicValues.NORMAL, 12],
      [MnemonicValues.HIGH, 24],
    ])(
      'should create wallet with %s entropy giving %i words',
      async (strength, expectedWordCount) => {
        const wallet = await Wallet.create(
          core,
          storage,
          password,
          strength,
          NetworkValues.MAINNET
        );

        const mnemonic = await wallet.getMnemonic(password);
        expect(getWordCount(mnemonic)).toBe(expectedWordCount);
      }
    );
  });

  describe('Wallet Info', () => {
    it.each([
      [NetworkValues.MAINNET, 'Wallet-1'],
      [NetworkValues.TESTNET, 'Wallet-2'],
    ])('should return correct wallet info', async (network, name) => {
      const wallet = await Wallet.create(
        core,
        storage,
        password,
        MnemonicValues.NORMAL,
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
        MnemonicValues.NORMAL,
        NetworkValues.MAINNET,
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
        password,
        NetworkValues.MAINNET
      );
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      const privateKey1 = await wallet.getPrivateKey(addrInfo1.path, password);
      expect(addrInfo1.address).toBe('pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3');
      expect(addrInfo1.publicKey).toBe(
        'public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");
      expect(privateKey1).toBe(
        'SECRET1R3K02X58V70X9RFVWN5QUN0CKHKYXWD7R40G3HX47L8W9HXJQHMASKGEPH2'
      );

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      const privateKey2 = await wallet.getPrivateKey(addrInfo2.path, password);
      expect(addrInfo2.address).toBe('pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94');
      expect(addrInfo2.publicKey).toBe(
        'public1r8jud8m6mfuyhwq6lupmuz0pq6uzhm9a6hkqfmc89jk7k6fr30e2sns7ghs'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");
      expect(privateKey2).toBe(
        'SECRET1RHCHV0XJMKXDLVG47MHU3PREN0RP6QFEM4C5YSV6LKF4NTF9PCR3S860T80'
      );
    });

    it('should restore a testnet wallet with deterministic addresses from standard 12-word mnemonic', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        password,
        NetworkValues.TESTNET
      );
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);
      expect(wallet.isTestnet()).toBeTruthy();

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBeTruthy();
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21777'/3'/0'");

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBeTruthy();
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21777'/3'/1'");

      // Make sure addresses are different
      expect(addrInfo1.address).not.toBe(addrInfo2.address);
    });

    it('should restore a testnet wallet with deterministic addresses from standard 24-word mnemonic', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        password,
        NetworkValues.TESTNET
      );
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);
      expect(wallet.isTestnet()).toBeTruthy();

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBeTruthy();
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21777'/3'/0'");

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBeTruthy();
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21777'/3'/1'");

      // Make sure addresses are different
      expect(addrInfo1.address).not.toBe(addrInfo2.address);
    });

    it('should restore a wallet with deterministic addresses from standard 24-word mnemonic', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = await Wallet.restore(core, storage, testMnemonic, password);
      expect(wallet.getMnemonic(password)).resolves.toBe(testMnemonic);

      const addrInfo1 = await wallet.createAddress('Address 1', password);
      expect(addrInfo1.address).toBe('pc1r8rel7ctk0p4cs49wlhdccvkk27rpllwhrv3g6z');
      expect(addrInfo1.publicKey).toBe(
        'public1rs6yq6kf9hyll78qsfk338k06j96sv69j6dpn9rqats0urnqaj4fsfhxgza'
      );
      expect(addrInfo1.label).toBe('Address 1');
      expect(addrInfo1.path).toBe("m/44'/21888'/3'/0'");

      const addrInfo2 = await wallet.createAddress('Address 2', password);
      expect(addrInfo2.address).toBe('pc1rssed2c3h6l9fm6gu4v7nmj5s33a388e8ygtgc4');
      expect(addrInfo2.publicKey).toBe(
        'public1r503wn3q8hlf9hsq6f7v2vmke5mgphx3kvatasqtlzyfaadvuhy0s2tzq84'
      );
      expect(addrInfo2.label).toBe('Address 2');
      expect(addrInfo2.path).toBe("m/44'/21888'/3'/1'");
    });

    it('should throw an error when restoring with an invalid mnemonic', () => {
      const invalidMnemonic = 'invalid mnemonic phrase that will not work for restoration';

      expect(() => Wallet.restore(core, storage, invalidMnemonic, password)).rejects.toThrow(
        MnemonicError
      );
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

    it('should create unique Testnet addresses in correct format', async () => {
      const wallet = await Wallet.create(
        core,
        storage,
        password,
        MnemonicValues.NORMAL,
        NetworkValues.TESTNET,
        'Test Wallet'
      );
      const addrInfo1 = await wallet.createAddress('Address 1', password);
      const addrInfo2 = await wallet.createAddress('Address 2', password);

      expect(addrInfo1.address.startsWith('tpc1')).toBe(true);
      expect(addrInfo2.address.startsWith('tpc1')).toBe(true);
      expect(addrInfo1.address).not.toBe(addrInfo2.address);
      expect(wallet.isTestnet()).toBeTruthy();

      expect(addrInfo1.path).toContain('21777');
      expect(addrInfo2.path).toContain('21777');
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
      expect(loadedWallet.getWalletInfo()).toStrictEqual(wallet.getWalletInfo());
    });

    it('should correctly load the wallet from test data', async () => {
      const walletID = '1234';
      const walletName = 'Test Wallet';
      const testPassword = 'password';

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
      expect(wallet.getNetworkType()).toBe(NetworkValues.MAINNET);
      expect(wallet.isEncrypted()).toBeTruthy();
      expect(wallet.getMnemonic(testPassword)).resolves.toBe(expectedMnemonic);

      const addrInfo1 = wallet.getAddressInfo('pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3');
      expect(addrInfo1).toBeTruthy();
      expect(addrInfo1?.path).toBe("m/44'/21888'/3'/0'");
      expect(addrInfo1?.label).toBe('Account 1');
      expect(addrInfo1?.publicKey).toBe(
        'public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5'
      );

      const addrInfo2 = await wallet.createAddress('Address 2', testPassword);
      expect(addrInfo2.address).toBe('pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94');
    });

    it('should correctly load a testnet wallet from test data', async () => {
      const walletID = '5678';
      const walletName = 'Test Testnet Wallet';
      const testPassword = 'password';

      const walletInfoJSON = `{"name":"${walletName}","type":1,"uuid":"${walletID}","creationTime":1743405082209,"network":"testnet"}`;
      // For testnet, coinType is 21777 instead of 21888
      const ledgerJSON =
        '{"addresses":{"tpc1r35xwz99uw2qrhz9wmdanaqcsge2nzsfegvv555":{"address":"tpc1r35xwz99uw2qrhz9wmdanaqcsge2nzsfegvv555","label":"Account 1","path":"m/44\'/21777\'/3\'/0\'","publicKey":"tpublic1rpduuzct4tdvmtgmreknjx86zv6sdvk4udf47whc3nqxcq0phuf7sycm6l9"}},"coinType":21777,"purposes":{"purposeBIP44":{"nextEd25519Index":1}}}';
      const vaultJSON =
        '{"encrypter":{"method":"ARGON2ID-AES_256_CTR-MACV1","params":{"iterations":"1","memory":"8","parallelism":"1"}},"keyStore":"aLEdVCpZOJmZZz067JTxWivw/41sWooR+E2iM46WYjskjFTE3VviPzc9SQ6gba5g+8CWWcw1q1YT9x1XAg/QAt2Rd7zR2FKL+ACwCbmZ/H+lLPDBt3nlvOkD2qkxi2rjjLpbAtf2UjKrW2b3+/KxSJGuG5GPIqPvPonqHhSWrF1j0nnKqm+btD1gaeJ5IRLchi27BNorMR4qvETMeV7YjkvZlrEFdNffqpWee+o4+bnr33MwysXm4hZU1c4/zzMIODAyxsMRgbrfTDfdQ19c0yjYmDGAPDpAqNAvMmDL07nGKR2f"}';

      storage.set(StorageKey.walletInfoKey(walletID), walletInfoJSON);
      storage.set(StorageKey.walletLedgerKey(walletID), ledgerJSON);
      storage.set(StorageKey.walletVaultKey(walletID), vaultJSON);

      // Verify the keys were set correctly
      expect(storage.get(StorageKey.walletInfoKey(walletID))).not.toBeNull();
      expect(storage.get(StorageKey.walletLedgerKey(walletID))).not.toBeNull();
      expect(storage.get(StorageKey.walletVaultKey(walletID))).not.toBeNull();

      const wallet = Wallet.load(core, storage, walletID);

      const expectedMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      expect(wallet.getID()).toBe(walletID);
      expect(wallet.getName()).toBe(walletName);
      expect(wallet.getNetworkType()).toBe(NetworkValues.TESTNET);
      expect(wallet.isTestnet()).toBeTruthy();
      expect(wallet.isEncrypted()).toBeTruthy();
      expect(wallet.getMnemonic(testPassword)).resolves.toBe(expectedMnemonic);

      const addrInfo1 = wallet.getAddressInfo('tpc1r35xwz99uw2qrhz9wmdanaqcsge2nzsfegvv555');
      expect(addrInfo1).toBeTruthy();
      expect(addrInfo1?.path).toBe("m/44'/21777'/3'/0'");
      expect(addrInfo1?.label).toBe('Account 1');
      expect(addrInfo1?.publicKey).toBe(
        'tpublic1rpduuzct4tdvmtgmreknjx86zv6sdvk4udf47whc3nqxcq0phuf7sycm6l9'
      );

      // New address should use testnet coin type
      const addrInfo2 = await wallet.createAddress('Address 2', testPassword);
      expect(addrInfo2.address).toBeTruthy();
      expect(addrInfo2.path).toBe("m/44'/21777'/3'/1'");
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
        NetworkValues.MAINNET,
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
        '{"coinType":21888,"purposes":{"purposeBIP44":{"nextEd25519Index":1}},"addresses":{"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3":{"address":"pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3","label":"Account 1","emoji":"🤝","path":"m/44\'/21888\'/3\'/0\'","publicKey":"public1rd5p573yq3j5wkvnasslqa7ne5vw87qcj5a0wlwxcj2t2xlaca9lstzm8u5"}}}';
      const expectedVaultJSON =
        '{"encrypter":{"method":"","params":{}},"keyStore":"{\\\"master_node\\\":{\\\"seed\\\":\\\"abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus\\\"},\\\"imported_keys\\\":[]}"}';

      expect(walletInfoJSON).toEqual(expectedWalletInfoJSON);
      expect(ledgerJSON).toEqual(expectedLedgerJSON);
      expect(vaultJSON).toEqual(expectedVaultJSON);
    });

    it('should correctly save testnet wallet data in JSON format', async () => {
      const noPassword = '';
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      const wallet = await Wallet.restore(
        core,
        storage,
        mnemonic,
        noPassword,
        NetworkValues.TESTNET,
        'My Testnet Wallet'
      );

      await wallet.createAddress('Account 1', password);

      const walletID = wallet.getID();
      const walletTime = wallet.getWalletInfo().creationTime;
      const walletInfoJSON = storage.get(StorageKey.walletInfoKey(walletID));
      const ledgerJSON = storage.get(StorageKey.walletLedgerKey(walletID));
      const vaultJSON = storage.get(StorageKey.walletVaultKey(walletID));

      expect(walletInfoJSON).not.toBeNull();
      expect(ledgerJSON).not.toBeNull();
      expect(vaultJSON).not.toBeNull();

      if (!walletInfoJSON || !ledgerJSON || !vaultJSON) {
        fail('Storage values should not be null');
        return;
      }

      // Network should be "testnet"
      const expectedWalletInfoJSON = `{"type":1,"name":"My Testnet Wallet","uuid":"${walletID}","creationTime":${walletTime},"network":"testnet"}`;

      expect(walletInfoJSON).toEqual(expectedWalletInfoJSON);
      expect(JSON.parse(ledgerJSON).coinType).toBe(21777);

      // Verify address format
      const addresses = Object.keys(JSON.parse(ledgerJSON).addresses);
      expect(addresses.length).toBe(1);
      expect(addresses[0]).toBeTruthy();

      // Check that derivation path uses the correct coin type
      const addressInfo = JSON.parse(ledgerJSON).addresses[addresses[0]];
      expect(addressInfo.path).toContain('21777');

      // Vault should be the same format as mainnet
      expect(JSON.parse(vaultJSON).encrypter.method).toBe('');
      expect(JSON.parse(vaultJSON).keyStore).toContain(mnemonic);
    });
  });

  describe('Testnet Address Generation', () => {
    it('should generate testnet addresses with the correct prefix and format', async () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      const passphrase = '';

      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        passphrase,
        NetworkValues.TESTNET
      );

      const addrInfo1 = await wallet.createAddress('Address 1', passphrase);
      const addrInfo2 = await wallet.createAddress('Address 2', passphrase);
      const privateKey1 = await wallet.getPrivateKey(addrInfo1.path, password);
      const privateKey2 = await wallet.getPrivateKey(addrInfo2.path, password);

      expect(addrInfo1.address).toBe('tpc1r35xwz99uw2qrhz9wmdanaqcsge2nzsfegvv555');
      expect(addrInfo2.address).toBe('tpc1r34xj32k004j8v35fx6uqw4yaka54g6jdr58tvk');

      expect(addrInfo1.publicKey).toBe(
        'tpublic1rpduuzct4tdvmtgmreknjx86zv6sdvk4udf47whc3nqxcq0phuf7sycm6l9'
      );
      expect(addrInfo2.publicKey).toBe(
        'tpublic1rhpzmczhn0382yekcvkdsjtf4l5nxu0gxqekgenxfhxlmxdyygztq7zydz8'
      );

      expect(privateKey1).toBe(
        'TSECRET1R4VMP0A2U3G74Z2XUHFRSDV3GJVVSPN22P9DFL3GK3SLP2D4H2SKQ5HJKKV'
      );
      expect(privateKey2).toBe(
        'TSECRET1R25L9JLEVH7SMYMDA5VM8G5SFWLDUYMGXJ8TWS30S0N0ZWRYK7QCQ80XZYQ'
      );

      expect(addrInfo1.path).toBe("m/44'/21777'/3'/0'");
      expect(addrInfo2.path).toBe("m/44'/21777'/3'/1'");

      expect(wallet.isTestnet()).toBeTruthy();
    });
  });

  describe('Wallet Transaction Signing', () => {
    it('should sign a transaction correctly', async () => {
      // Create wallet with a known mnemonic
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      const wallet = await Wallet.restore(
        core,
        storage,
        testMnemonic,
        password,
        NetworkValues.TESTNET
      );

      // Create an address to get its path
      const addrInfo = await wallet.createAddress('Test Address', password);

      // Test transaction raw hex with correct flag byte (0x02 for unsigned)
      const rawTxHex = '020000000000000001000000000000000100000000000000';

      // Sign the transaction
      const { signedRawTxHex } = await wallet.signTransaction(rawTxHex, addrInfo.path, password);

      // Verify the result is not empty and has expected format
      expect(signedRawTxHex).toBeTruthy();
      expect(signedRawTxHex.length).toBeGreaterThan(rawTxHex.length);

      // The signed transaction should start with 0x00 (signed flag) followed by the transaction data without the flag byte
      expect(signedRawTxHex.startsWith('00')).toBe(true);
      expect(signedRawTxHex.substring(2, rawTxHex.length)).toBe(rawTxHex.substring(2));
    });

    it('should throw an error for empty raw transaction', async () => {
      const wallet = await Wallet.create(core, storage, password);
      const addrInfo = await wallet.createAddress('Test Address', password);

      await expect(wallet.signTransaction('', addrInfo.path, password)).rejects.toThrow(
        'Empty transaction buffer'
      );
    });
  });
});

describe('Address Recovery', () => {
  let core: WalletCore;
  let storage: IStorage;
  let wallet: Wallet;
  const password = '';

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
    const testMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
    wallet = await Wallet.restore(
      core,
      storage,
      testMnemonic,
      password,
      NetworkValues.MAINNET
    );
  });

  it('recover addresses from a fresh wallet without any active addresses', async () => {
    wallet.isAddressActive = jest.fn().mockImplementation(async (_address: string) => false);

    await wallet.recoverAddress(password);

    expect(wallet.getAddresses()).toHaveLength(1);
    expect(wallet.getAddresses()[0].path).toBe("m/44'/21888'/3'/0'");
  });

  it('recover addresses with one gap at the beginning', async () => {
    let callCount = 0;
    wallet.isAddressActive = jest.fn().mockImplementation(async (_address: string) => {
      callCount++;
      return callCount === 2;
    });

    await wallet.recoverAddress(password);

    expect(wallet.getAddresses()).toHaveLength(2);
    expect(wallet.getAddresses()[0].path).toBe("m/44'/21888'/3'/0'");
    expect(wallet.getAddresses()[1].path).toBe("m/44'/21888'/3'/1'");
  });

  it('recover addresses with gaps in the middle of the address list', async () => {
    let callCount = 0;
    wallet.isAddressActive = jest.fn().mockImplementation(async (_address: string) => {
      callCount++;
      // Return true for addresses 1, 2, and 5 (creating gaps)
      return callCount === 1 || callCount === 2 || callCount === 5;
    });

    await wallet.recoverAddress(password);

    expect(wallet.getAddresses()).toHaveLength(5);
    expect(wallet.getAddresses()[0].path).toBe("m/44'/21888'/3'/0'");
    expect(wallet.getAddresses()[1].path).toBe("m/44'/21888'/3'/1'");
    expect(wallet.getAddresses()[2].path).toBe("m/44'/21888'/3'/2'");
    expect(wallet.getAddresses()[3].path).toBe("m/44'/21888'/3'/3'");
    expect(wallet.getAddresses()[4].path).toBe("m/44'/21888'/3'/4'");
  });
});

describe('Address Activity Check', () => {
  let core: WalletCore;
  let storage: IStorage;
  const password = '';

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
  });

  it('should return false for inactive address', async () => {
    const wallet = await Wallet.create(
      core,
      storage,
      password,
      MnemonicValues.NORMAL,
      NetworkValues.TESTNET
    );

    // Mock getValidatorPublicKey to return empty string (inactive)
    wallet.getIndexedPublicKey = jest.fn().mockResolvedValue('');

    const isActive = await wallet.isAddressActive('tpc1test123');
    expect(isActive).toBe(false);
  });

  it('should return true for active address', async () => {
    const wallet = await Wallet.create(
      core,
      storage,
      password,
      MnemonicValues.NORMAL,
      NetworkValues.TESTNET
    );

    // Mock getIndexedPublicKey to return a public key (active)
    wallet.getIndexedPublicKey = jest.fn().mockResolvedValue('public1test123');

    const isActive = await wallet.isAddressActive('tpc1test123');
    expect(isActive).toBe(true);
  });

  it('should return false when getValidatorPublicKey throws error', async () => {
    const wallet = await Wallet.create(
      core,
      storage,
      password,
      MnemonicValues.NORMAL,
      NetworkValues.TESTNET
    );

    // Mock getIndexedPublicKey to throw error
    wallet.getIndexedPublicKey = jest.fn().mockRejectedValue(new Error('Network error'));

    const isActive = await wallet.isAddressActive('tpc1test123');
    expect(isActive).toBe(false);
  });
});

describe('Validator Public Key', () => {
  let core: WalletCore;
  let storage: IStorage;
  const password = '';

  beforeEach(async () => {
    core = await initWasm();
    storage = new MemoryStorage();
  });

  it('should return empty string when public key not found', async () => {
    // ARRANGE
    const wallet = await Wallet.create(
      core,
      storage,
      password,
      MnemonicValues.NORMAL,
      NetworkValues.TESTNET
    );

    // Mock the network call to simulate "not found"
    const mockClient = {
      pactusBlockchainGetPublicKey: jest.fn().mockRejectedValue(new Error('Not Found')),
    };
    jest.spyOn(wallet as any, 'getClient').mockReturnValue(mockClient);

    // ACT
    const publicKey = await wallet.getIndexedPublicKey('invalid-address');

    // ASSERT
    expect(publicKey).toBe(''); // Should return empty string on error
  });

  it('should return public key when found', async () => {
    // ARRANGE
    const wallet = await Wallet.create(
      core,
      storage,
      password,
      MnemonicValues.NORMAL,
      NetworkValues.TESTNET
    );

    // Mock successful response
    const mockClient = {
      pactusBlockchainGetPublicKey: jest.fn().mockResolvedValue({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        public_key: 'public1test123abc',
      }),
    };
    jest.spyOn(wallet as any, 'getClient').mockReturnValue(mockClient);

    // ACT
    const publicKey = await wallet.getIndexedPublicKey('tpc1test123');

    // ASSERT
    expect(publicKey).toBe('public1test123abc');
  });
});
