// Export public wallet API
import { Wallet, MnemonicStrength, WalletData, Address, WalletInfo, NetworkType } from './wallet';
import { configureWallet, WalletConfig } from './config';
import {
    PactusWalletFactory,
    IPactusWallet,
    WalletCoreFactory,
    WalletCreationError,
    WalletRestoreError,
    InvalidMnemonicError
} from './factory';
import { WalletCore } from '@trustwallet/wallet-core';

/**
 * Create a new wallet with the given options
 *
 * @param password The password to encrypt the wallet
 * @param options Optional configuration options
 * @param options.strength The mnemonic strength (security level)
 * @param options.network The blockchain network type (mainnet/testnet)
 * @param options.name A user-friendly name for the wallet
 * @param options.config Advanced wallet configuration (storage, etc.)
 * @returns Promise resolving to a new wallet instance
 */
export async function createWallet(
    password: string,
    options?: {
        strength?: MnemonicStrength;
        network?: NetworkType;
        name?: string;
        config?: WalletConfig;
    }
): Promise<IPactusWallet> {
    return PactusWalletFactory.create(password, options);
}

/**
 * Restore a wallet from a mnemonic phrase
 *
 * @param mnemonic The mnemonic recovery phrase
 * @param password The password to encrypt the wallet
 * @param options Optional wallet restoration options
 * @param options.network The blockchain network type (mainnet/testnet)
 * @param options.name A user-friendly name for the wallet
 * @param options.config Advanced wallet configuration (storage, etc.)
 * @returns Promise resolving to a restored wallet instance
 */
export async function restoreWallet(
    mnemonic: string,
    password: string,
    options?: {
        network?: NetworkType;
        name?: string;
        config?: WalletConfig;
    }
): Promise<IPactusWallet> {
    return PactusWalletFactory.restore(mnemonic, password, options);
}

/**
 * Initialize the wallet core (optional, will be called automatically by other methods)
 * This can be called early in app startup to pre-initialize the wallet core
 */
export async function initializeWalletCore(): Promise<void> {
    await WalletCoreFactory.initialize();
}

// Export types and utilities
export { MnemonicStrength, Wallet, NetworkType };
export type { WalletData, IPactusWallet, WalletConfig, Address, WalletInfo };
export { configureWallet };

// Export factory for more advanced usage
export { PactusWalletFactory, WalletCoreFactory };

// Export error types
export { WalletCreationError, WalletRestoreError, InvalidMnemonicError };

// Direct Wallet methods for convenience
/**
 * Create a new Ed25519 address
 * @param wallet Wallet instance to use
 * @param label User-friendly label for the address
 * @returns The generated address string
 */
export function createAddress(wallet: Wallet, label: string): string {
    return wallet.createAddress(label);
}

/**
 * Get all addresses in a wallet
 * @param wallet Wallet instance to use
 * @returns Array of addresses with their metadata
 */
export function getAddresses(wallet: Wallet): Array<Address> {
    return wallet.getAddresses();
}

/**
 * Get wallet information
 * @param wallet Wallet instance to use
 * @returns WalletInfo object
 */
export function getWalletInfo(wallet: Wallet): WalletInfo {
    return wallet.getWalletInfo();
}

/**
 * Export wallet data for storage
 * @param wallet Wallet instance to use
 * @returns WalletData object ready for serialization
 */
export function exportWalletData(wallet: Wallet): WalletData {
    return wallet.export();
}

/**
 * Import wallet data from storage
 * @param wallet Wallet instance to use
 * @param data WalletData object from storage
 */
export function importWalletData(wallet: Wallet, data: WalletData): void {
    wallet.import(data);
}

/**
 * Get the wallet's recovery phrase
 * @param wallet Wallet instance to use
 * @warning This should be used carefully, only for backup purposes
 * @returns The mnemonic phrase
 */
export function getMnemonic(wallet: Wallet): string {
    return wallet.getMnemonic();
}

/**
 * Get the number of words in the recovery phrase
 * @param wallet Wallet instance to use
 * @returns Word count (12 or 24)
 */
export function getMnemonicWordCount(wallet: Wallet): number {
    return wallet.getMnemonicWordCount();
}

/**
 * Get the network type the wallet is configured for
 * @param wallet Wallet instance to use
 * @returns NetworkType (mainnet or testnet)
 */
export function getNetworkType(wallet: Wallet): NetworkType {
    return wallet.getNetworkType();
}

/**
 * Check if wallet is using testnet
 * @param wallet Wallet instance to use
 * @returns true if wallet is using testnet
 */
export function isTestnet(wallet: Wallet): boolean {
    return wallet.isTestnet();
}

/**
 * Get the wallet's name
 * @param wallet Wallet instance to use
 * @returns The wallet's name
 */
export function getName(wallet: Wallet): string {
    return wallet.getName();
}

/**
 * Set the wallet's name
 * @param wallet Wallet instance to use
 * @param name The new name for the wallet
 */
export function setName(wallet: Wallet, name: string): void {
    wallet.setName(name);
}

/**
 * Create a new wallet instance directly using the Wallet class
 * @param core WalletCore instance
 * @param strength Mnemonic strength (security level)
 * @param password Password for wallet encryption
 * @param network Network type (mainnet/testnet)
 * @param name User-defined wallet name
 * @returns A new wallet instance
 */
export function createWalletInstance(
    core: WalletCore,
    strength: MnemonicStrength = MnemonicStrength.Normal,
    password: string,
    network: NetworkType = NetworkType.Mainnet,
    name: string = 'My Pactus Wallet'
): Wallet {
    return Wallet.create(core, strength, password, network, name);
}

/**
 * Restore a wallet instance directly using the Wallet class
 * @param core WalletCore instance
 * @param mnemonic Recovery phrase
 * @param password Password for wallet encryption
 * @param network Network type (mainnet/testnet)
 * @param name User-defined wallet name
 * @returns A restored wallet instance
 */
export function restoreWalletInstance(
    core: WalletCore,
    mnemonic: string,
    password: string,
    network: NetworkType = NetworkType.Mainnet,
    name: string = 'My Pactus Wallet'
): Wallet {
    return Wallet.restore(core, mnemonic, password, network, name);
}
