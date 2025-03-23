// walletUtils.ts
import { WalletManager, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';

export async function setupWallet(): Promise<WalletManager> {
  try {
    console.log('Initializing wallet SDK...');
    const storage = new BrowserStorage();
    const walletManager = await initWalletSDK(storage);
    console.log('Wallet SDK initialized successfully');
    return walletManager;
  } catch (error) {
    console.error('Failed to initialize wallet SDK:', error);
    throw error;
  }
}