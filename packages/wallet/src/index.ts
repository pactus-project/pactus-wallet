/**
 * Pactus Wallet SDK
 * A TypeScript SDK for Pactus blockchain wallet operations
 */

// Core wallet functionality
export * from './types/wallet_info';
export * from './wallet';
export * from './storage/storage';
export * from './manager';
export * from './error';

import { initWasm } from '@trustwallet/wallet-core';
import { IStorage } from './storage/storage';
import { WalletManager } from './manager';

/**
 * Initialize the wallet SDK with a custom storage implementation
 * @param storage Storage implementation to use
 * @returns Promise that resolves with a WalletManager instance or throws an error
 */
export async function initWalletSDK(storage: IStorage): Promise<WalletManager> {
  // Initialize the wallet core library
  const core = await initWasm();
  const walletManager = new WalletManager(core, storage);
  return walletManager;
}
