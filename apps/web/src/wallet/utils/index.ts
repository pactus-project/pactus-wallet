// walletUtils.ts
import { WalletManager, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';

export async function setupWallet(): Promise<WalletManager> {
    try {
        const storage = new BrowserStorage();
        const walletManager = await initWalletSDK(storage);
        return walletManager;
    } catch (error) {
        throw error;
    }
}
