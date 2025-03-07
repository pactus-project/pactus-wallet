/**
 * Pactus Wallet Package
 *
 * This is the main entry point for the Pactus wallet package.
 * It exports all the components needed to work with Pactus wallets,
 * including wallet creation, restoration, and address management.
 */

// Core wallet types
export { Wallet, MnemonicStrength } from './wallet';
export type { Address, WalletData, WalletInfo } from './wallet';

// Storage types
export { MemoryStorage } from './storage';
export type { IStorage } from './storage';

// Service and events
export { WalletService, WalletEvent, WalletStatus } from './service';
export type { WalletServiceConfig } from './service';

// Import dependencies
import { initWasm } from '@trustwallet/wallet-core';
import { MnemonicStrength, Wallet } from './wallet';
import { WalletService } from './service';

/**
 * Initialize the wallet core
 *
 * This is a convenience method to initialize the Trust Wallet Core library.
 * It must be called before any wallet operations can be performed.
 *
 * @returns A promise that resolves when initialization is complete
 *
 * @example
 * ```typescript
 * // Initialize before using any wallet functionality
 * await initializeWalletCore();
 * ```
 */
export const initializeWalletCore = async () => {
    return await initWasm();
};

/**
 * Create a wallet service with memory storage
 *
 * This factory function creates a configured WalletService instance
 * with in-memory storage. All wallet data will be lost when the application
 * is closed or refreshed.
 *
 * @param config Optional configuration overrides for the wallet service
 * @returns A configured wallet service instance
 *
 * @example
 * ```typescript
 * // Create with default configuration
 * const service = createWalletService();
 *
 * // Create with custom configuration
 * const customService = createWalletService({
 *   autoInitialize: false,
 *   defaultMnemonicStrength: MnemonicStrength.High
 * });
 * ```
 */
export const createWalletService = (config = {}) => {
    return new WalletService(config);
};

/**
 * Create a new wallet
 *
 * This is a convenience function that initializes a wallet service
 * and creates a wallet with the specified password and strength.
 * It handles all the setup automatically.
 *
 * @param password Password for wallet encryption
 * @param strength Mnemonic strength (12 or 24 words)
 * @returns A Promise resolving to the created wallet
 *
 * @example
 * ```typescript
 * // Create a wallet with default strength (12 words)
 * const wallet = await createWallet("my-secure-password");
 *
 * // Create a wallet with high strength (24 words)
 * const secureWallet = await createWallet("my-secure-password", MnemonicStrength.High);
 * ```
 */
export const createWallet = async (
    password: string,
    strength: MnemonicStrength = MnemonicStrength.Normal
): Promise<Wallet> => {
    // Create a service with auto-initialization
    const service = new WalletService({
        autoInitialize: true,
        defaultMnemonicStrength: strength
    });

    // Service auto-initializes, so we can create the wallet right away
    return await service.createWallet(password, strength);
};

/**
 * Restore a wallet from mnemonic
 *
 * This is a convenience function that initializes a wallet service
 * and restores a wallet using an existing recovery phrase.
 *
 * @param mnemonic Recovery phrase (12 or 24 words)
 * @param password Password for wallet encryption
 * @returns A Promise resolving to the restored wallet
 *
 * @example
 * ```typescript
 * // Restore a wallet from existing mnemonic
 * const wallet = await restoreWallet(
 *   "word1 word2 word3 ... word12",
 *   "my-secure-password"
 * );
 * ```
 */
export const restoreWallet = async (mnemonic: string, password: string): Promise<Wallet> => {
    // Create a service with auto-initialization
    const service = new WalletService({
        autoInitialize: true
    });

    // Service auto-initializes, so we can restore the wallet right away
    return await service.restoreWallet(mnemonic, password);
};
