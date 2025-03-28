// walletUtils.ts
import { WalletManager, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';

// TODO: It is not a util function. Move it to proper place.
// TODO: we have two utils folder. We need to clean it up.
export async function setupWallet(): Promise<WalletManager> {
    try {
        const storage = new BrowserStorage();
        const walletManager = await initWalletSDK(storage);
        return walletManager;
    } catch (error) {
        throw error;
    }
}
