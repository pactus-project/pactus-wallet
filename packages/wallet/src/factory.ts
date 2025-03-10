import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { Wallet, MnemonicStrength, WalletData, NetworkType } from './wallet';
import { WalletConfig } from './config';
import { WalletError, InitializationError } from './errors';

/**
 * Interface for Pactus Wallet
 * Defines the public API for wallet operations
 */
export interface IPactusWallet {
    getAddresses(): Array<{ address: string; label: string }>;
    getWalletInfo(): {
        mnemonicWordCount: number;
        addressCount: number;
        network: NetworkType;
        name: string;
    };
    createAddress(label: string): string;
    getMnemonic(): string;
    getMnemonicWordCount(): number;
    getNetworkType(): NetworkType;
    isTestnet(): boolean;
    getName(): string;
    setName(name: string): void;
    export(): WalletData;
    import(data: WalletData): void;
}

/**
 * Wallet Core Factory
 * Responsible for initializing the wallet core and creating wallet instances
 */
export class WalletCoreFactory {
    private static instance: WalletCore | null = null;
    private static isInitializing = false;
    private static initPromise: Promise<WalletCore> | null = null;

    /**
     * Initialize the wallet core
     * @returns Promise resolving to WalletCore instance
     */
    static async initialize(): Promise<WalletCore> {
        // If we already have an instance, return it
        if (this.instance) {
            return this.instance;
        }

        // If initialization is in progress, return the existing promise
        if (this.isInitializing && this.initPromise) {
            return this.initPromise;
        }

        // Start initialization process
        this.isInitializing = true;
        this.initPromise = new Promise<WalletCore>(async (resolve, reject) => {
            try {
                const core = await initWasm();
                this.instance = core;
                this.isInitializing = false;
                resolve(core);
            } catch (error) {
                this.isInitializing = false;
                reject(
                    new InitializationError(
                        `Failed to initialize wallet core: ${
                            error instanceof Error ? error.message : 'Unknown error'
                        }`
                    )
                );
            }
        });

        return this.initPromise;
    }

    /**
     * Get the wallet core instance
     * @returns The wallet core instance or null if not initialized
     */
    static getInstance(): WalletCore | null {
        return this.instance;
    }

    /**
     * Reset the wallet core instance (useful for testing)
     */
    static reset(): void {
        this.instance = null;
        this.isInitializing = false;
        this.initPromise = null;
    }
}

/**
 * Factory for creating Pactus wallets
 */
export class PactusWalletFactory {
    /**
     * Create a new wallet with the given options
     * @param password The password to encrypt the wallet
     * @param options Optional configuration options
     * @param options.strength The mnemonic strength (security level)
     * @param options.network The blockchain network type (mainnet/testnet)
     * @param options.name A user-friendly name for the wallet
     * @param options.config Advanced wallet configuration (storage, etc.)
     * @returns Promise resolving to a new wallet instance
     */
    static async create(
        password: string,
        options?: {
            strength?: MnemonicStrength;
            network?: NetworkType;
            name?: string;
            config?: WalletConfig;
        }
    ): Promise<IPactusWallet> {
        try {
            const core = await WalletCoreFactory.initialize();

            // Extract options with defaults
            const {
                strength = MnemonicStrength.Normal,
                network = NetworkType.Mainnet,
                name = 'My Pactus Wallet',
                config
            } = options || {};

            // Apply config if provided
            if (config) {
                // TODO: Implement configuration handling
                // This will handle storage configuration and other advanced options
            }

            const wallet = Wallet.create(core, strength, password, network, name);
            return this.createWalletInterface(wallet);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new WalletCreationError(`Failed to create wallet: ${errorMessage}`);
        }
    }

    /**
     * Restore a wallet from mnemonic phrase
     * @param mnemonic The mnemonic recovery phrase
     * @param password The password to encrypt the wallet
     * @param options Optional configuration options
     * @param options.network The blockchain network type (mainnet/testnet)
     * @param options.name A user-friendly name for the wallet
     * @param options.config Advanced wallet configuration (storage, etc.)
     * @returns Promise resolving to a restored wallet instance
     */
    static async restore(
        mnemonic: string,
        password: string,
        options?: {
            network?: NetworkType;
            name?: string;
            config?: WalletConfig;
        }
    ): Promise<IPactusWallet> {
        try {
            const core = await WalletCoreFactory.initialize();

            // Extract options with defaults
            const {
                network = NetworkType.Mainnet,
                name = 'My Pactus Wallet',
                config
            } = options || {};

            // Apply config if provided
            if (config) {
                // TODO: Implement configuration handling
                // This will handle storage configuration and other advanced options
            }

            const wallet = Wallet.restore(core, mnemonic, password, network, name);
            return this.createWalletInterface(wallet);
        } catch (error: unknown) {
            if (error instanceof InvalidMnemonicError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new WalletRestoreError(`Failed to restore wallet: ${errorMessage}`);
        }
    }

    /**
     * Helper method to create a consistent wallet interface
     * @param wallet The underlying wallet implementation
     * @returns A standardized IPactusWallet interface
     */
    private static createWalletInterface(wallet: Wallet): IPactusWallet {
        return {
            getAddresses: () =>
                wallet.getAddresses().map(({ address, label }) => ({ address, label })),
            getWalletInfo: () => ({
                mnemonicWordCount: wallet.getMnemonicWordCount(),
                addressCount: wallet.getAddresses().length,
                network: wallet.getNetworkType(),
                name: wallet.getName()
            }),
            createAddress: (label: string) => wallet.createAddress(label),
            getMnemonic: () => wallet.getMnemonic(),
            getMnemonicWordCount: () => wallet.getMnemonicWordCount(),
            getNetworkType: () => wallet.getNetworkType(),
            isTestnet: () => wallet.isTestnet(),
            getName: () => wallet.getName(),
            setName: (name: string) => wallet.setName(name),
            export: () => wallet.export(),
            import: (data: WalletData) => wallet.import(data)
        };
    }
}

// Define the new error classes needed for our refactoring
export class WalletCreationError extends WalletError {
    constructor(message: string = 'Failed to create wallet') {
        super(message);
        this.name = 'WalletCreationError';
    }
}

export class WalletRestoreError extends WalletError {
    constructor(message: string = 'Failed to restore wallet') {
        super(message);
        this.name = 'WalletRestoreError';
    }
}

export class InvalidMnemonicError extends WalletError {
    constructor(message: string = 'Invalid mnemonic phrase') {
        super(message);
        this.name = 'InvalidMnemonicError';
    }
}
