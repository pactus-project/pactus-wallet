'use client';
import type { Wallet } from '@pactus-wallet/wallet';
import { useCallback, useState } from 'react';
import { useWallet } from '@/wallet';

export function useAccount() {
  const { wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const createAddress = useCallback(
    async (label: string, password: string, walletOverride?: Wallet | null) => {
      // Reset error
      setError(null);

      // Validate inputs - set first error encountered
      if (!label || label.trim() === '') {
        setError('Account name is required');
        throw new Error('Account name is required');
      }

      if (!password || password.trim() === '') {
        setError('Password is required');
        throw new Error('Password is required');
      }

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }

      try {
        const result = await targetWallet.createAddress(label, password);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create address';
        setError(errorMessage);
        throw err;
      }
    },
    [wallet]
  );

  const getAccountList = useCallback(
    (walletOverride?: Wallet | null) => {
      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        return []; // Return empty array instead of undefined when wallet is not available
      }

      return targetWallet.getAddresses().map(address => ({
        name: address.label,
        balance: 0,
        address: address.address,
        emoji: '🤝',
      }));
    },
    [wallet]
  );

  const getAccountByAddress = useCallback(
    (address: string, walletOverride?: Wallet | null) => {
      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        return null; // Return null when wallet is not available
      }
      return targetWallet.getAddresses().find(element => element.address === address);
    },
    [wallet]
  );

  const getAddressInfo = useCallback(
    async (password: string, address: string, walletOverride?: Wallet | null) => {
      setError(null);

      if (!password || password.trim() === '') {
        setError('Password is required');
        throw new Error('Password is required');
      }

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }
      try {
        await targetWallet.getMnemonic(password);
        const addressInfo = targetWallet.getAddressInfo(address);
        const privateKeyHex = await targetWallet.getPrivateKey(address, password);
        return { ...addressInfo, privateKeyHex };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get address info';
        setError(errorMessage);
        throw err;
      }
    },
    [wallet]
  );

  const getMnemonic = useCallback(
    async (password: string, walletOverride?: Wallet | null) => {
      setError(null);

      if (!password || password.trim() === '') {
        setError('Password is required');
        throw new Error('Password is required');
      }

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }

      try {
        return await targetWallet.getMnemonic(password);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get mnemonic';
        setError(errorMessage);
        throw err;
      }
    },
    [wallet]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createAddress,
    getAccountList,
    getAccountByAddress,
    getAddressInfo,
    getMnemonic,
    error,
    clearError,
  };
}
