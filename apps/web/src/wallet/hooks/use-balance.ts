'use client';
import { useCallback, useState, useEffect } from 'react';
import { useWallet } from './use-wallet';
import type { Wallet } from '@pactus-wallet/wallet';

export function useBalance(address?: string) {
  const { wallet } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(
    async (walletOverride?: Wallet | null, specificAddress?: string) => {
      setIsLoading(true);
      setError(null);

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet not available');
        setIsLoading(false);
        return 0;
      }

      try {
        // If no address is provided, get the first address from the wallet
        const addressToCheck = specificAddress || address;
        let totalBalance = 0;
        if (!addressToCheck) {
          const addresses = targetWallet.getAddresses();
          if (addresses.length === 0) {
            setBalance(0);
            setIsLoading(false);
            return 0;
          }
          const balancePromises = addresses.map(async addr => {
            try {
              const balance = await targetWallet.getAddressBalance(addr.address);
              return balance.toPac();
            } catch (addrError) {
              console.warn(`Failed to fetch balance for address ${addr.address}:`, addrError);
              return 0;
            }
          });

          const balances = await Promise.all(balancePromises);
          totalBalance = balances.reduce((sum, balance) => sum + balance, 0);
          setBalance(totalBalance);
        } else {
          const balance = await targetWallet.getAddressBalance(addressToCheck);
          const balanceValue = balance.toPac();
          totalBalance = balanceValue;
          setBalance(totalBalance);
        }

        return totalBalance;
      } catch (err) {
        setBalance(0);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        setError(errorMessage);
        return 0;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, address]
  );

  // Auto-fetch balance when wallet or address changes
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
