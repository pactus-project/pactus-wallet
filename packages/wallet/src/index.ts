// Export public wallet API
import { Wallet, MnemonicStrength, WalletData } from './wallet';
import { configureWallet, WalletConfig } from './config';
import { PactusWalletFactory, IPactusWallet, WalletCoreFactory } from './factory';

/**
 * Create a new wallet
 * @param password The password to encrypt the wallet
 * @param config Optional configuration or mnemonic strength
 * @returns Promise resolving to a new wallet instance
 */
export async function createWallet(
    password: string,
    config?: WalletConfig | MnemonicStrength
): Promise<IPactusWallet> {
    return PactusWalletFactory.create(password, config);
}

/**
 * Restore a wallet from mnemonic
 * @param mnemonic The mnemonic phrase
 * @param password The password to encrypt the wallet
 * @returns Promise resolving to a restored wallet instance
 */
export async function restoreWallet(mnemonic: string, password: string): Promise<IPactusWallet> {
    return PactusWalletFactory.restore(mnemonic, password);
}

/**
 * Validate a mnemonic phrase
 * @param mnemonic The mnemonic to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateMnemonic(mnemonic: string): { isValid: boolean; error?: string } {
    return PactusWalletFactory.validateMnemonic(mnemonic);
}

/**
 * Initialize the wallet core (optional, will be called automatically by other methods)
 * This can be called early in app startup to pre-initialize the wallet core
 */
export async function initializeWalletCore(): Promise<void> {
    await WalletCoreFactory.initialize();
}

// Export types and utilities
export { MnemonicStrength };
export type { WalletData, IPactusWallet, WalletConfig };
export { configureWallet };

// Export factory for more advanced usage
export { PactusWalletFactory, WalletCoreFactory };
