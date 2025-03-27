import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { MnemonicStrength, Address, Wallet, NetworkType } from '../src/wallet';
import * as bip39 from 'bip39';

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

  beforeEach(async () => {
    core = await initWasm();
  });

  describe('Wallet Creation', () => {
    it.each([
      [MnemonicStrength.Normal, 12],
      [MnemonicStrength.High, 24],
    ])(
      'should create wallet with %s entropy giving %i words',
      (strength, expectedWordCount) => {
        const wallet = Wallet.create(core, strength, 'test-password');

        expect(wallet.getMnemonicWordCount()).toBe(expectedWordCount);

        const info = wallet.getWalletInfo();
        expect(info.mnemonicWordCount).toBe(expectedWordCount);
        expect(info.addressCount).toBe(0);
        expect(info.createdAt).toBeInstanceOf(Date);
      }
    );
  });

  describe('Wallet Restoration', () => {
    it('should restore a wallet from mnemonic preserving the original seed', () => {
      const originalWallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password'
      );
      const mnemonic = originalWallet.getMnemonic();

      const restoredWallet = Wallet.restore(core, mnemonic, 'new-password');

      expect(restoredWallet.getMnemonic()).toBe(mnemonic);
      expect(restoredWallet.getMnemonicWordCount()).toBe(12);
    });

    it('should restore a wallet with deterministic addresses from standard 12-word mnemonic', () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = Wallet.restore(core, testMnemonic, 'test-password');
      expect(wallet.getMnemonicWordCount()).toBe(12);

      const address1 = wallet.createAddress('Address 1');
      expect(address1).toBe('pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3');

      const address2 = wallet.createAddress('Address 2');
      expect(address2).toBe('pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94');
    });

    it('should restore a wallet with deterministic addresses from standard 24-word mnemonic', () => {
      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';
      expect(bip39.validateMnemonic(testMnemonic)).toBe(true);

      const wallet = Wallet.restore(core, testMnemonic, 'test-password');
      expect(wallet.getMnemonicWordCount()).toBe(24);

      const address1 = wallet.createAddress('Address 1');
      expect(address1).toBe('pc1r8rel7ctk0p4cs49wlhdccvkk27rpllwhrv3g6z');

      const address2 = wallet.createAddress('Address 2');
      expect(address2).toBe('pc1rssed2c3h6l9fm6gu4v7nmj5s33a388e8ygtgc4');
    });

    it('should throw error when restoring with invalid mnemonic', async () => {
      const invalidMnemonic =
        'invalid mnemonic phrase that will not work for restoration';

      await expect(() =>
        Wallet.restore(core, invalidMnemonic, 'test-password')
      ).toThrow(/Failed to restore wallet/);
    });
  });

  describe('BIP39 Passphrase Effects', () => {
    it('should generate different seeds when using different BIP39 passphrases', () => {
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';

      const seed1 = bip39.mnemonicToSeedSync(mnemonic, '');
      const customPassphrase = 'my custom passphrase';
      const seed2 = bip39.mnemonicToSeedSync(mnemonic, customPassphrase);

      expect(seed1.toString('hex')).not.toBe(seed2.toString('hex'));

      const wallet = Wallet.restore(core, mnemonic, 'wallet-password');
      expect(wallet.getMnemonic()).toBe(mnemonic);
      expect(wallet.getMnemonicWordCount()).toBe(12);
    });
  });

  describe('Address Management', () => {
    it('should create unique addresses with correct format', () => {
      const wallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password'
      );

      const address1 = wallet.createAddress('Address 1');
      const address2 = wallet.createAddress('Address 2');

      expect(address1.startsWith('pc1')).toBe(true);
      expect(address2.startsWith('pc1')).toBe(true);
      expect(address1).not.toBe(address2);
    });

    it('should store addresses with labels and public keys', () => {
      const wallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password'
      );

      wallet.createAddress('First Address');
      wallet.createAddress('Second Address');

      const addresses = wallet.getAddresses();
      expect(addresses.length).toBe(2);
      expect(addresses[0].label).toBe('First Address');
      expect(addresses[1].label).toBe('Second Address');

      expect(addresses[0].publicKey).toBeTruthy();
      expect(addresses[1].publicKey).toBeTruthy();

      expect(wallet.getWalletInfo().addressCount).toBe(2);
    });

    it('should store public keys in hex format', () => {
      const wallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password'
      );
      const address = wallet.createAddress('Test Address');

      const addresses = wallet.getAddresses();
      const addressObj = addresses.find(a => a.address === address);

      expect(addressObj).toBeTruthy();
      expect(typeof addressObj?.publicKey).toBe('string');

      const hexRegex = /^[0-9a-f]+$/i;
      expect(hexRegex.test(addressObj?.publicKey || '')).toBe(true);
    });
  });

  describe('Wallet Naming', () => {
    it('should set and get wallet name', () => {
      const wallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password',
        NetworkType.Mainnet,
        'Initial Name'
      );

      expect(wallet.getName()).toBe('Initial Name');

      wallet.setName('Updated Name');
      expect(wallet.getName()).toBe('Updated Name');
      expect(wallet.getWalletInfo().name).toBe('Updated Name');
    });

    it('should include wallet name in exported data', () => {
      const wallet = Wallet.create(
        core,
        MnemonicStrength.Normal,
        'test-password',
        NetworkType.Mainnet,
        'Export Test'
      );

      const exportedData = wallet.export();
      expect(exportedData.name).toBe('Export Test');

      wallet.setName('Modified Name');
      const updatedExport = wallet.export();
      expect(updatedExport.name).toBe('Modified Name');
    });
  });
});
