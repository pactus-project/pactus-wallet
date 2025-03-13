/**
 * Pactus Wallet SDK
 * A TypeScript SDK for Pactus blockchain wallet operations
 */

// Core wallet functionality
export * from './wallet';
export * from './storage/storage';
export * from './wallet-manager'; // This will now include the WalletList interface
export * from './error'; // Import as a type to show intent
import { initWasm } from '@trustwallet/wallet-core';
import { IStorage } from './storage/storage';
import { WalletManager } from './wallet-manager';
// Configuration
export * from './config';
export * from './params';

// Re-export version for easier access
export const VERSION = '1.0.0';

/**
 * Initialize the wallet SDK with a custom storage implementation
 * @param storage Storage implementation to use
 * @returns Promise that resolves with a WalletManager instance or throws an error
 */
export async function initWalletSDK(storage: IStorage): Promise<WalletManager> {
    try {
        // Initialize the wallet core library
        const core = await initWasm();
        const walletManager = new WalletManager(core, storage);
        return walletManager;
    } catch (error) {
        console.error('Failed to initialize wallet SDK with custom storage:', error);
        throw error; // Rethrow error instead of returning false
    }
}
