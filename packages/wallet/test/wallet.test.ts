import { initWasm } from '@trustwallet/wallet-core';
import { Wallet, MnemonicStrength, Address } from '../src/wallet';
import { WalletCore } from '@trustwallet/wallet-core';

describe('Pactus Wallet Tests', () => {
    let core: WalletCore;

    beforeEach(async () => {
        core = await initWasm();
    });

    describe('Basic Wallet Creation and Restoration', () => {
        it('should create a wallet with 12-word mnemonic correctly', async () => {
            // Create wallet with 12-word mnemonic
            const wallet = Wallet.create(core, MnemonicStrength.Normal, 'test-password');

            // Get and validate the mnemonic
            const mnemonic = wallet.getMnemonic();
            expect(mnemonic).toBeTruthy();
            expect(wallet.getMnemonicWordCount()).toBe(12);

            // Verify wallet info
            const info = wallet.getWalletInfo();
            expect(info.mnemonicWordCount).toBe(12);
            expect(info.addressCount).toBe(0);
            expect(info.createdAt).toBeInstanceOf(Date);
        });

        it('should create a wallet with 24-word mnemonic correctly', async () => {
            // Create wallet with 24-word mnemonic
            const wallet = Wallet.create(core, MnemonicStrength.High, 'test-password');

            // Get and validate the mnemonic
            const mnemonic = wallet.getMnemonic();
            expect(mnemonic).toBeTruthy();
            expect(wallet.getMnemonicWordCount()).toBe(24);

            // Verify wallet info
            const info = wallet.getWalletInfo();
            expect(info.mnemonicWordCount).toBe(24);
            expect(info.addressCount).toBe(0);
        });

        it('should restore a wallet from mnemonic correctly', async () => {
            // First create a wallet to get a valid mnemonic
            const originalWallet = Wallet.create(core, MnemonicStrength.Normal, 'test-password');
            const mnemonic = originalWallet.getMnemonic();
            // Restore wallet using the mnemonic
            const restoredWallet = Wallet.restore(core, mnemonic, 'new-password');
            // Verify the restored wallet has the correct mnemonic
            expect(restoredWallet.getMnemonic()).toBe(mnemonic);
            expect(restoredWallet.getMnemonicWordCount()).toBe(12);
        });

        it('should throw error when restoring with invalid mnemonic', async () => {
            // Invalid mnemonic (random words)
            const invalidMnemonic = 'invalid mnemonic phrase that will not work for restoration';
            // Attempt to restore with invalid mnemonic should throw
            expect(() => {
                Wallet.restore(core, invalidMnemonic, 'test-password');
            }).toThrow();
        });
    });

    describe('Address Management', () => {
        it('should create addresses correctly', () => {
            const wallet = Wallet.create(core, MnemonicStrength.Normal, 'test-password');

            // Create two addresses
            const address1 = wallet.createAddress('Address 1');
            const address2 = wallet.createAddress('Address 2');

            // Verify addresses were created with correct format
            expect(address1).toBeTruthy();
            expect(address2).toBeTruthy();
            expect(address1.startsWith('pc1')).toBe(true);
            expect(address2.startsWith('pc1')).toBe(true);
            expect(address1).not.toBe(address2); // Addresses should be different

            // Verify address info is stored correctly
            const addresses = wallet.getAddresses();
            expect(addresses.length).toBe(2);
            expect(addresses[0].address).toBe(address1);
            expect(addresses[0].label).toBe('Address 1');
            expect(addresses[0].publicKey).toBeTruthy();
            expect(addresses[1].address).toBe(address2);
            expect(addresses[1].label).toBe('Address 2');
            expect(addresses[1].publicKey).toBeTruthy();

            // Wallet info should reflect address count
            const info = wallet.getWalletInfo();
            expect(info.addressCount).toBe(2);
        });

        it('should work with legacy newEd25519Address method', () => {
            const wallet = Wallet.create(core, MnemonicStrength.Normal, 'test-password');

            // Use legacy method
            const address = wallet.createAddress('Legacy Method');
            // Verify address was created correctly
            expect(address).toBeTruthy();
            expect(address.startsWith('pc1')).toBe(true);

            // Verify address info is stored correctly
            const addresses = wallet.getAddresses();
            expect(addresses.length).toBe(1);
            expect(addresses[0].address).toBe(address);
            expect(addresses[0].label).toBe('Legacy Method');
        });
    });

    describe('Public Key Management', () => {
        it('should store public keys with addresses', () => {
            const wallet = Wallet.create(core, MnemonicStrength.Normal, 'test-password');
            const address = wallet.createAddress('Test Address');
            // Get the addresses
            const addresses = wallet.getAddresses();
            const addressObj = addresses.find(a => a.address === address);
            // Verify public key is present and in hex format
            expect(addressObj).toBeTruthy();
            expect(addressObj?.publicKey).toBeTruthy();
            expect(typeof addressObj?.publicKey).toBe('string');
            expect(addressObj?.publicKey.length).toBeGreaterThan(0);

            // Simple regex to check for hex format
            const hexRegex = /^[0-9a-f]+$/i;
            expect(hexRegex.test(addressObj?.publicKey || '')).toBe(true);
        });
    });
});
