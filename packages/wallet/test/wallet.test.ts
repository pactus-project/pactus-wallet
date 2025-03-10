import { initWasm } from '@trustwallet/wallet-core';
import { WalletCore } from '@trustwallet/wallet-core';
import {
    Wallet,
    MnemonicStrength,
    Address,
    WalletInfo,
    createWalletInstance,
    restoreWalletInstance,
    createAddress,
    getAddresses,
    getWalletInfo,
    getMnemonic,
    getMnemonicWordCount
} from '../src';

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

    describe('Basic Wallet Creation and Restoration', () => {
        it('should create a wallet with 12-word mnemonic correctly', async () => {
            // Create wallet with 12-word mnemonic
            const wallet = createWalletInstance(core, MnemonicStrength.Normal, 'test-password');

            // Get and validate the mnemonic
            const mnemonic = getMnemonic(wallet);
            expect(mnemonic).toBeTruthy();
            expect(getMnemonicWordCount(wallet)).toBe(12);

            // Verify wallet info
            const info = getWalletInfo(wallet);
            expect(info.mnemonicWordCount).toBe(12);
            expect(info.addressCount).toBe(0);
            expect(info.createdAt).toBeInstanceOf(Date);
        });

        it('should create a wallet with 24-word mnemonic correctly', async () => {
            // Create wallet with 24-word mnemonic
            const wallet = createWalletInstance(core, MnemonicStrength.High, 'test-password');

            // Get and validate the mnemonic
            const mnemonic = getMnemonic(wallet);
            expect(mnemonic).toBeTruthy();
            expect(getMnemonicWordCount(wallet)).toBe(24);

            // Verify wallet info
            const info = getWalletInfo(wallet);
            expect(info.mnemonicWordCount).toBe(24);
            expect(info.addressCount).toBe(0);
        });

        it('should restore a wallet from mnemonic correctly', async () => {
            // First create a wallet to get a valid mnemonic
            const originalWallet = createWalletInstance(
                core,
                MnemonicStrength.Normal,
                'test-password'
            );
            const mnemonic = getMnemonic(originalWallet);

            // Restore wallet using the mnemonic
            const restoredWallet = restoreWalletInstance(core, mnemonic, 'new-password');

            // Verify the restored wallet has the correct mnemonic
            expect(getMnemonic(restoredWallet)).toBe(mnemonic);
            expect(getMnemonicWordCount(restoredWallet)).toBe(12);
        });

        it('should throw error when restoring with invalid mnemonic', async () => {
            // Invalid mnemonic (random words)
            const invalidMnemonic = 'invalid mnemonic phrase that will not work for restoration';

            // Attempt to restore with invalid mnemonic should throw
            expect(() => {
                restoreWalletInstance(core, invalidMnemonic, 'test-password');
            }).toThrow();
        });
    });

    describe('Address Management', () => {
        it('should create addresses correctly', () => {
            const wallet = createWalletInstance(core, MnemonicStrength.Normal, 'test-password');

            // Create two addresses
            const address1 = createAddress(wallet, 'Address 1');
            const address2 = createAddress(wallet, 'Address 2');

            // Verify addresses were created with correct format
            expect(address1).toBeTruthy();
            expect(address2).toBeTruthy();
            expect(address1.startsWith('pc1')).toBe(true);
            expect(address2.startsWith('pc1')).toBe(true);
            expect(address1).not.toBe(address2); // Addresses should be different

            // Verify address info is stored correctly
            const addresses = getAddresses(wallet);
            expect(addresses.length).toBe(2);
            expect(addresses[0].address).toBe(address1);
            expect(addresses[0].label).toBe('Address 1');
            expect(addresses[0].publicKey).toBeTruthy();
            expect(addresses[1].address).toBe(address2);
            expect(addresses[1].label).toBe('Address 2');
            expect(addresses[1].publicKey).toBeTruthy();

            // Wallet info should reflect address count
            const info = getWalletInfo(wallet);
            expect(info.addressCount).toBe(2);
        });

        it('should work with both direct and class methods', () => {
            const wallet = createWalletInstance(core, MnemonicStrength.Normal, 'test-password');

            // Use direct method
            const address1 = createAddress(wallet, 'Direct Method');

            // Use class method
            const address2 = wallet.createAddress('Class Method');

            // Verify both addresses were created correctly
            expect(address1).toBeTruthy();
            expect(address2).toBeTruthy();
            expect(address1.startsWith('pc1')).toBe(true);
            expect(address2.startsWith('pc1')).toBe(true);

            // Verify address info is stored correctly
            const addresses = getAddresses(wallet);
            expect(addresses.length).toBe(2);
            expect(addresses[0].address).toBe(address1);
            expect(addresses[0].label).toBe('Direct Method');
            expect(addresses[1].address).toBe(address2);
            expect(addresses[1].label).toBe('Class Method');
        });
    });

    describe('Public Key Management', () => {
        it('should store public keys with addresses', () => {
            const wallet = createWalletInstance(core, MnemonicStrength.Normal, 'test-password');
            const address = createAddress(wallet, 'Test Address');

            // Get the addresses
            const addresses = getAddresses(wallet);
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
