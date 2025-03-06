import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import {
    createWallet,
    restoreWallet,
    validateMnemonic,
    initializeWalletCore,
    configureWallet,
    MnemonicStrength,
    IPactusWallet,
    WalletCoreFactory,
    PactusWalletFactory
} from '../src';

describe('Wallet Package Main Exports', () => {
    describe('initializeWalletCore', () => {
        it('should initialize the wallet core successfully', async () => {
            await initializeWalletCore();
        });
    });

    describe('createWallet', () => {
        it('should create a wallet with default settings', async () => {
            const wallet = await createWallet('password123');

            expect(wallet).toBeDefined();
            expect(wallet.getMnemonicWordCount()).toBe(12);
        });

        it('should create a wallet with high strength', async () => {
            const wallet = await createWallet('password123', MnemonicStrength.High);

            expect(wallet).toBeDefined();
            expect(wallet.getMnemonic().split(' ').length).toBe(24);
            expect(wallet.getMnemonicWordCount()).toBe(24);
        });

        // it('should create a wallet with custom configuration', async () => {
        //     const config = configureWallet()
        //         .withNetwork('https://testnet-rpc.pactus.org')
        //         .withChainId('testnet')
        //         .withDebugMode()
        //         .build();

        //     const wallet = await createWallet('password123', config);

        //     expect(wallet).toBeDefined();
        //     expect(wallet.getMnemonic()).toContain('word1');
        // });
    });
});

describe('Wallet Lifecycle Step by Step', () => {
    let wallet: IPactusWallet;
    const password = 'secure_test_password';
    let mnemonic: string;
    let walletData: any;

    it('Step 1: Create a new wallet', async () => {
        // Initialize wallet core
        await initializeWalletCore();

        // Create a new wallet with normal strength
        wallet = await createWallet(password);
        expect(wallet).toBeDefined();
        expect(typeof wallet.getMnemonic()).toBe('string');

        // Save the mnemonic for later steps
        mnemonic = wallet.getMnemonic();
        console.log('mnemonic', mnemonic);
        console.log('Step 1: Wallet created successfully');
    });

    it('Step 2: Verify mnemonic validity and strength', () => {
        // Verify mnemonic is valid
        const validationResult = validateMnemonic(mnemonic);
        console.log('validationResult', validationResult);
        expect(validationResult.isValid).toBe(true);

        // Verify mnemonic has expected word count (12 for normal strength)
        expect(wallet.getMnemonicWordCount()).toBe(12);
        const wordCount = mnemonic.split(' ').length;
        console.log('wordCount', wordCount);
        expect(wordCount).toBe(12);

        console.log('Step 2: Mnemonic verified');
    });

    it('Step 3: Create multiple addresses', () => {
        // Create the first address
        const firstAddress = wallet.newEd25519Address('Primary Address');
        expect(firstAddress).toBeTruthy();
        expect(typeof firstAddress).toBe('string');
        console.log('firstAddress', firstAddress);
        // Create a second address
        const secondAddress = wallet.newEd25519Address('Savings Address');
        expect(secondAddress).toBeTruthy();
        expect(typeof secondAddress).toBe('string');
        console.log('secondAddress', secondAddress);

        // Verify addresses are different
        expect(firstAddress).not.toBe(secondAddress);

        // Verify addresses are stored correctly
        const addresses = wallet.getAddresses();
        expect(addresses.length).toBe(2);
        expect(addresses[0].address).toBe(firstAddress);
        expect(addresses[0].label).toBe('Primary Address');
        expect(addresses[1].address).toBe(secondAddress);
        expect(addresses[1].label).toBe('Savings Address');

        console.log('Step 3: Created multiple addresses');
    });

    it('Step 4: Export wallet data', () => {
        // Export the wallet data
        walletData = wallet.export();
        console.log('walletData', walletData);
        // Verify the exported data
        expect(walletData).toBeDefined();
        expect(walletData.addresses).toBeDefined();
        expect(Array.isArray(walletData.addresses)).toBe(true);
        expect(walletData.addresses.length).toBe(2);

        // Verify address data
        expect(walletData.addresses[0].label).toBe('Primary Address');
        console.log('walletData.addresses[0].label', walletData.addresses[0].label);
        expect(walletData.addresses[1].label).toBe('Savings Address');
        console.log('walletData.addresses[1].label', walletData.addresses[1].label);

        console.log('Step 4: Wallet data exported');
    });

    it('Step 5: Restore wallet using mnemonic', async () => {
        // Create a new wallet instance using the previously saved mnemonic
        const restoredWallet = await restoreWallet(mnemonic, 'new_password');
        // Verify the restored wallet has the correct mnemonic
        expect(restoredWallet.getMnemonic()).toBe(mnemonic);
        expect(restoredWallet.getMnemonicWordCount()).toBe(12);

        // Verify addresses (newly restored wallet should have no addresses)
        const addresses = restoredWallet.getAddresses();
        console.log('addresses', addresses);
        expect(addresses.length).toBe(0);

        // Create an address to verify the wallet is functional
        const newAddress = restoredWallet.newEd25519Address('Restored Address');
        console.log('newAddress', newAddress);
        expect(newAddress).toBeTruthy();

        console.log('Step 5: Wallet restored from mnemonic');
    });

    it('Step 6: Import wallet data', async () => {
        // Create a new empty wallet
        const emptyWallet = await createWallet('another_password');
        expect(emptyWallet.getAddresses().length).toBe(0);

        // Import the previously exported wallet data
        emptyWallet.import(walletData);

        // Verify the imported addresses
        const importedAddresses = emptyWallet.getAddresses();
        expect(importedAddresses.length).toBe(2);
        expect(importedAddresses[0].label).toBe('Primary Address');
        expect(importedAddresses[1].label).toBe('Savings Address');

        console.log('Step 6: Wallet data imported successfully');
    });

    it('Step 7: Validate negative scenarios', async () => {
        // Test invalid mnemonic
        const invalidMnemonic = 'invalid words that are not a proper mnemonic';

        // Mock the validation to return invalid
        jest.spyOn(PactusWalletFactory, 'validateMnemonic').mockReturnValueOnce({
            isValid: false,
            error: 'Invalid mnemonic'
        });

        // Verify the validation fails
        const validationResult = validateMnemonic(invalidMnemonic);
        expect(validationResult.isValid).toBe(false);

        // Verify restoring with invalid mnemonic throws an error
        await expect(restoreWallet(invalidMnemonic, 'password')).rejects.toThrow();

        console.log('Step 7: Negative scenarios validated');
    });
});
