'use client';
// useRestoreWallet.ts
import { useState, useCallback } from 'react';
import type { NetworkType } from '@pactus-wallet/wallet';
import { useWallet } from './use-wallet';
import { WalletStatus } from '../types';

export function useRestoreWallet() {
  const {
    setWallet,
    setWalletStatus,
    mnemonic,
    password,
    networkType,
    walletName,
    walletManager,
    setPassword: setWalletPassword,
  } = useWallet();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationError, setRestorationError] = useState<string | null>(null);

  const restoreWallet = useCallback(
    async (
      providedMnemonic?: string,
      providedPassword?: string,
      providedNetworkType?: NetworkType,
      providedName: string = 'My Wallet'
    ) => {
      setIsRestoring(true);
      setRestorationError(null);
      try {
        const mnemonicToUse = providedMnemonic || mnemonic;
        const passwordToUse = providedPassword || password;
        const networkTypeToUse = providedNetworkType || networkType;
        const nameToUse = providedName || walletName;

        if (!mnemonicToUse || !passwordToUse || !nameToUse) {
          throw new Error('Mnemonic, password, and name are required to restore the wallet.');
        }

        if (!walletManager) {
          throw new Error('Wallet manager is not available');
        }

        if (providedPassword) {
          setWalletPassword(providedPassword);
        }

        const restoredWallet = await walletManager.restoreWallet(
          mnemonicToUse,
          passwordToUse,
          networkTypeToUse,
          nameToUse
        );
        if (!restoredWallet) {
          throw new Error('Failed to restore wallet');
        }

        setWallet(restoredWallet);
        setWalletStatus(WalletStatus.WALLET_UNLOCKED);
        return restoredWallet;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setRestorationError(`Failed to restore wallet: ${errorMessage}`);
        throw err; // Re-throw so the caller can handle it
      } finally {
        setIsRestoring(false);
      }
    },
    [
      mnemonic,
      password,
      networkType,
      walletName,
      setWallet,
      setWalletStatus,
      walletManager,
      setWalletPassword,
    ]
  );

  return { restoreWallet, isRestoring, restorationError };
}
