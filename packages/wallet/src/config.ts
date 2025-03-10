/**
 * Wallet Configuration
 * Handles all configuration options for the wallet
 */
import { IStorage, MemoryStorage } from './storage';

export interface WalletConfig {
    /** Storage implementation for persistence */
    storage?: IStorage;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: WalletConfig = {
    storage: new MemoryStorage()
};

/**
 * Wallet Configuration Builder
 * Uses the builder pattern to create wallet configurations
 */
export class WalletConfigBuilder {
    private config: WalletConfig;

    constructor() {
        this.config = { ...DEFAULT_CONFIG };
    }
    /**
     * Set custom storage implementation
     * @param storage The storage implementation
     * @returns This builder instance for chaining
     */
    withStorage(storage: IStorage): WalletConfigBuilder {
        this.config.storage = storage;
        return this;
    }

    /**
     * Build the final configuration
     * @returns The complete wallet configuration
     */
    build(): WalletConfig {
        return { ...this.config };
    }
}

/**
 * Create a new wallet configuration builder
 * @returns A new WalletConfigBuilder instance
 */
export function configureWallet(): WalletConfigBuilder {
    return new WalletConfigBuilder();
}
