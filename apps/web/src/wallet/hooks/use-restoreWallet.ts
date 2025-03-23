// useRestoreWallet.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WalletManager, Wallet, NetworkType } from '@pactus-wallet/wallet';
import { setupWallet } from '../utils';
import { useWallet } from '.';
import { WalletStatus } from '../types';

export function useRestoreWallet() {
    const { setWallet, setWalletStatus, mnemonic, password, networkType, walletName } = useWallet();
    const [isRestoring, setIsRestoring] = useState(false);
    const [restorationError, setRestorationError] = useState<string | null>(null);
    const router = useRouter();

    const restoreWallet = useCallback(
        async (
            providedMnemonic?: string,
            providedPassword?: string,
            providedNetworkType?: NetworkType,
            providedName?: string
        ) => {
            setIsRestoring(true);
            setRestorationError(null);
            try {
                const walletManager: WalletManager = await setupWallet();
                const mnemonicToUse = providedMnemonic || mnemonic;
                const passwordToUse = providedPassword || password;
                const networkTypeToUse = providedNetworkType || networkType;
                const nameToUse = providedName || walletName;
                if (!mnemonicToUse || !passwordToUse || !nameToUse) {
                    throw new Error(
                        'Mnemonic, password, and name are required to restore the wallet.'
                    );
                }
                const newWallet: Wallet = await walletManager.restoreWallet(
                    mnemonicToUse,
                    passwordToUse,
                    networkTypeToUse,
                    nameToUse
                );
                setWallet(newWallet);
                setWalletStatus(WalletStatus.WALLET_UNLOCKED);
                router.replace('/');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setRestorationError(`Failed to restore wallet: ${errorMessage}`);
            } finally {
                setIsRestoring(false);
            }
        },
        [mnemonic, password, networkType, walletName, setWallet, setWalletStatus, router]
    );

    return { restoreWallet, isRestoring, restorationError };
}
