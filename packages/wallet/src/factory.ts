import { initWasm, WalletCore } from '@trustwallet/wallet-core';
import { Wallet, MnemonicStrength, WalletData } from './wallet';
import { WalletConfig } from './config';
import { InitializationError } from './errors';

/**
 * Interface for Pactus Wallet
 * Defines the public API for wallet operations
 */
export interface IPactusWallet {
    getAddresses(): Array<{ address: string; label: string }>;
    getWalletInfo(): { mnemonicWordCount: number; addressCount: number };
    newEd25519Address(label: string): string;
    getMnemonic(): string;
    getMnemonicWordCount(): number;
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
     * Create a new wallet
     * @param password The password to encrypt the wallet
     * @param config Configuration options or MnemonicStrength
     * @returns Promise resolving to a new wallet instance
     */
    static async create(
        password: string,
        config?: WalletConfig | MnemonicStrength
    ): Promise<IPactusWallet> {
        try {
            const core = await WalletCoreFactory.initialize();

            // Determine if config is a MnemonicStrength enum or a WalletConfig
            const strength = typeof config === 'number' ? config : MnemonicStrength.Normal;

            return Wallet.create(core, strength, password);
        } catch (error) {
            throw new InitializationError(
                `Failed to create wallet: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * Restore a wallet from mnemonic
     * @param mnemonic The mnemonic phrase
     * @param password The password to encrypt the wallet
     * @returns Promise resolving to a restored wallet instance
     */
    static async restore(mnemonic: string, password: string): Promise<IPactusWallet> {
        try {
            const core = await WalletCoreFactory.initialize();
            return Wallet.restore(core, mnemonic, password);
        } catch (error) {
            throw new InitializationError(
                `Failed to restore wallet: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * Validate a mnemonic phrase
     * @param mnemonic The mnemonic to validate
     * @returns Validation result with isValid flag and optional error message
     */
    static validateMnemonic(mnemonic: string): { isValid: boolean; error?: string } {
        return Wallet.validateMnemonic(mnemonic);
    }
}
