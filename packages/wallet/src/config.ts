/**
 * Wallet Configuration
 * Handles all configuration options for the wallet
 */
export interface WalletConfig {
    network: string;
    chainId: string;
    debug: boolean;
    storage?: any; // Replace with your storage interface
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: WalletConfig = {
    network: 'https://mainnet-rpc.pactus.org',
    chainId: 'mainnet',
    debug: false
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
     * Set the network endpoint
     * @param network The RPC endpoint URL
     */
    withNetwork(network: string): WalletConfigBuilder {
        this.config.network = network;
        return this;
    }

    /**
     * Set the chain ID
     * @param chainId The blockchain chain ID
     */
    withChainId(chainId: string): WalletConfigBuilder {
        this.config.chainId = chainId;
        return this;
    }

    /**
     * Enable debug mode
     */
    withDebugMode(): WalletConfigBuilder {
        this.config.debug = true;
        return this;
    }

    /**
     * Set a custom storage provider
     * @param storage Storage implementation
     */
    withStorage(storage: any): WalletConfigBuilder {
        this.config.storage = storage;
        return this;
    }

    /**
     * Build the final configuration
     */
    build(): WalletConfig {
        return { ...this.config };
    }
}

/**
 * Create a new wallet configuration builder
 */
export function configureWallet(): WalletConfigBuilder {
    return new WalletConfigBuilder();
}
