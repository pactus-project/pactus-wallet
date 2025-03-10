import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import {
    createWallet,
    restoreWallet,
    initializeWalletCore,
    configureWallet,
    MnemonicStrength,
    IPactusWallet,
    WalletCoreFactory,
    PactusWalletFactory,
    Wallet,
    createWalletInstance,
    restoreWalletInstance,
    createAddress,
    getAddresses,
    getWalletInfo,
    getMnemonic,
    getMnemonicWordCount,
    exportWalletData,
    importWalletData,
    NetworkType,
    WalletCreationError,
    WalletRestoreError,
    InvalidMnemonicError
} from '../src';

// Jest typings setup
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInstanceOf(expected: any): R;
        }
    }
}

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
            const wallet = await createWallet('password123', {
                strength: MnemonicStrength.High
            });

            expect(wallet).toBeDefined();
            expect(wallet.getMnemonic().split(' ').length).toBe(24);
            expect(wallet.getMnemonicWordCount()).toBe(24);
        });

        it('should create a wallet with custom configuration', async () => {
            const config = configureWallet().build();

            const wallet = await createWallet('password123', {
                config: config,
                network: NetworkType.Testnet,
                name: 'Test Wallet'
            });

            expect(wallet).toBeDefined();
            expect(wallet.getNetworkType()).toBe(NetworkType.Testnet);
            expect(wallet.getName()).toBe('Test Wallet');
        });
    });

    describe('Direct Wallet class usage', () => {
        it('should create a wallet instance directly', async () => {
            const core = await WalletCoreFactory.initialize();
            const wallet = createWalletInstance(core, MnemonicStrength.Normal, 'password123');

            expect(wallet).toBeDefined();
            expect(wallet).toBeInstanceOf(Wallet);
            expect(getMnemonicWordCount(wallet)).toBe(12);
        });

        it('should restore a wallet instance directly', async () => {
            const core = await WalletCoreFactory.initialize();
            // Create a wallet first to get a valid mnemonic
            const originalWallet = createWalletInstance(
                core,
                MnemonicStrength.Normal,
                'password123'
            );
            const mnemonic = getMnemonic(originalWallet);

            // Restore the wallet using the mnemonic
            const restoredWallet = restoreWalletInstance(core, mnemonic, 'newpassword');

            expect(restoredWallet).toBeDefined();
            expect(restoredWallet).toBeInstanceOf(Wallet);
            expect(getMnemonic(restoredWallet)).toBe(mnemonic);
        });
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
        wallet = await createWallet(password, {
            strength: MnemonicStrength.Normal,
            network: NetworkType.Mainnet,
            name: 'Primary Wallet'
        });
        expect(wallet).toBeDefined();
        expect(typeof wallet.getMnemonic()).toBe('string');

        // Save the mnemonic for later steps
        mnemonic = wallet.getMnemonic();
        console.log('mnemonic', mnemonic);
        console.log('Step 1: Wallet created successfully');
    });

    it('Step 2: Create multiple addresses', () => {
        // Create the first address
        const firstAddress = wallet.createAddress('Primary Address');
        expect(firstAddress).toBeTruthy();
        expect(typeof firstAddress).toBe('string');
        console.log('firstAddress', firstAddress);
        // Create a second address
        const secondAddress = wallet.createAddress('Savings Address');
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

        console.log('Step 2: Created multiple addresses');
    });

    it('Step 3: Export wallet data', () => {
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

        console.log('Step 3: Wallet data exported');
    });

    it('Step 4: Restore wallet using mnemonic', async () => {
        // Create a new wallet instance using the previously saved mnemonic
        const restoredWallet = await restoreWallet(mnemonic, 'new_password', {
            network: NetworkType.Testnet,
            name: 'Backup Wallet'
        });

        // Verify the restored wallet has the correct mnemonic
        expect(restoredWallet.getMnemonic()).toBe(mnemonic);
        expect(restoredWallet.getMnemonicWordCount()).toBe(12);

        // Verify addresses (newly restored wallet should have no addresses)
        const addresses = restoredWallet.getAddresses();
        console.log('addresses', addresses);
        expect(addresses.length).toBe(0);

        // Create an address to verify the wallet is functional
        const newAddress = restoredWallet.createAddress('Restored Address');
        console.log('newAddress', newAddress);
        expect(newAddress).toBeTruthy();

        // The name is included in wallet info
        const info = restoredWallet.getWalletInfo();
        console.log(info.name); // 'Backup Wallet'

        console.log('Step 4: Wallet restored from mnemonic');
    });

    it('Step 55 Import wallet data', async () => {
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

        console.log('Step 5: Wallet data imported successfully');
    });

    it('Step 6: Test wallet creation with custom config', async () => {
        const customConfig = configureWallet().build();

        const customWallet = await createWallet('password', {
            config: customConfig,
            name: 'Custom Wallet'
        });

        expect(customWallet).toBeDefined();
        expect(customWallet.getName()).toBe('Custom Wallet');

        console.log('Step 6: Custom configuration wallet created successfully');
    });

    it('Step 7: Test error handling for wallet creation', async () => {
        // Mock the factory to throw an error
        jest.spyOn(PactusWalletFactory, 'create').mockImplementationOnce(() => {
            throw new WalletCreationError('Simulated error');
        });

        // Verify creating a wallet throws the correct error type
        await expect(createWallet('password')).rejects.toThrow(WalletCreationError);

        console.log('Step 7: Error handling verified');
    });
});

// Additional tests for new functionality
describe('Wallet Options API', () => {
    it('should create a wallet with all options specified', async () => {
        const config = configureWallet().build();

        const wallet = await createWallet('password', {
            strength: MnemonicStrength.High,
            network: NetworkType.Testnet,
            name: 'Options Test Wallet',
            config: config
        });

        expect(wallet).toBeDefined();
        expect(wallet.getName()).toBe('Options Test Wallet');
        expect(wallet.getNetworkType()).toBe(NetworkType.Testnet);
        expect(wallet.getMnemonicWordCount()).toBe(24);
    });

    it('should restore a wallet with all options specified', async () => {
        // First create a wallet to get a valid mnemonic
        const originalWallet = await createWallet('password');
        const mnemonic = originalWallet.getMnemonic();

        const config = configureWallet().build();

        const restoredWallet = await restoreWallet(mnemonic, 'newpassword', {
            network: NetworkType.Testnet,
            name: 'Restored Options Wallet',
            config: config
        });

        expect(restoredWallet).toBeDefined();
        expect(restoredWallet.getName()).toBe('Restored Options Wallet');
        expect(restoredWallet.getNetworkType()).toBe(NetworkType.Testnet);
        expect(restoredWallet.getMnemonic()).toBe(mnemonic);
    });
});

describe('Direct API usage for Wallet methods', () => {
    let core: WalletCore;
    let directWallet: Wallet;

    beforeEach(async () => {
        core = await WalletCoreFactory.initialize();
        directWallet = createWalletInstance(core, MnemonicStrength.Normal, 'password123');
    });

    it('should create addresses with the direct API', () => {
        // Create addresses using the direct API
        const firstAddress = createAddress(directWallet, 'First Direct Address');
        const secondAddress = createAddress(directWallet, 'Second Direct Address');

        expect(firstAddress).toBeTruthy();
        expect(secondAddress).toBeTruthy();
        expect(firstAddress).not.toBe(secondAddress);

        // Get addresses using the direct API
        const addresses = getAddresses(directWallet);
        expect(addresses.length).toBe(2);
        expect(addresses[0].label).toBe('First Direct Address');
        expect(addresses[1].label).toBe('Second Direct Address');
    });

    it('should get wallet info with the direct API', () => {
        // Create a couple of addresses
        createAddress(directWallet, 'Address 1');
        createAddress(directWallet, 'Address 2');

        // Get wallet info using the direct API
        const info = getWalletInfo(directWallet);
        expect(info.mnemonicWordCount).toBe(12);
        expect(info.addressCount).toBe(2);
    });

    it('should handle export and import with the direct API', () => {
        // Create addresses
        createAddress(directWallet, 'Export Address 1');
        createAddress(directWallet, 'Export Address 2');

        // Export using the direct API
        const data = exportWalletData(directWallet);
        expect(data.addresses.length).toBe(2);

        // Create a new wallet
        const newWallet = createWalletInstance(core, MnemonicStrength.Normal, 'another_password');
        expect(getAddresses(newWallet).length).toBe(0);

        // Import using the direct API
        importWalletData(newWallet, data);

        // Verify the import worked
        const importedAddresses = getAddresses(newWallet);
        expect(importedAddresses.length).toBe(2);
        expect(importedAddresses[0].label).toBe('Export Address 1');
        expect(importedAddresses[1].label).toBe('Export Address 2');
    });

    it('should work with mnemonic methods from the direct API', () => {
        // Get mnemonic using direct API
        const mnemonic = getMnemonic(directWallet);
        expect(mnemonic).toBeDefined();
        expect(typeof mnemonic).toBe('string');

        // Get word count using direct API
        const wordCount = getMnemonicWordCount(directWallet);
        expect(wordCount).toBe(12);
    });
});
