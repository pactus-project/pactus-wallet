'use client';
import { useCallback, useState, useEffect } from 'react';
import { useWallet } from './use-wallet';
import type { Wallet } from '@pactus-wallet/wallet';

export function useBalance() {
  const { wallet } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(
    async (walletOverride?: Wallet | null) => {
      setIsLoading(true);
      setError(null);

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet not available');
        setIsLoading(false);
        return 0;
      }

      try {
        // Get all addresses from wallet
        const addresses = targetWallet.getAddresses();

        // Sum up balances from all addresses
        let totalBalance = 0;
        for (const address of addresses) {
          const balance = await targetWallet.getAddressBalance(address.address);
          totalBalance += balance.toPac();
        }

        setBalance(totalBalance);
        return totalBalance;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        setError(errorMessage);
        return 0;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet]
  );

  // Auto-fetch balance when wallet changes
  useEffect(() => {
    if (wallet) {
      fetchBalance();
    }
  }, [wallet, fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    fetchBalance,
  };
}
