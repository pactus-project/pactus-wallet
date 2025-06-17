'use client';
import { BrowserStorage, type Wallet } from '@pactus-wallet/wallet';
import { useCallback, useState } from 'react';
import { useWallet } from '@/wallet';
export interface AddressInfo {
  address: string;
  publicKey: string;
  label: string;
  emoji: string;
  path: string;
  privateKeyHex: string;
}

export function useAccount() {
  const { wallet, accountList, setAccountList } = useWallet();
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
        setAccountList([
          ...accountList,
          {
            name: result.label,
            balance: 0,
            address: result.address,
            emoji: '🤝',
          },
        ]);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create address';
        setError(errorMessage);
        throw err;
      }
    },
    [wallet, accountList]
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
        emoji: address.emoji || '🤝',
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
        if (!addressInfo?.path) throw new Error('Address information not found');
        const privateKeyHex = await targetWallet.getPrivateKey(addressInfo.path, password);
        return { ...addressInfo, privateKeyHex } as AddressInfo;
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

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string, walletOverride?: Wallet) => {
      setError(null);

      if (!oldPassword || oldPassword.trim() === '') {
        setError('oldPassword is required');
        throw new Error('oldPassword is required');
      }

      if (!newPassword || newPassword.trim() === '') {
        setError('newPassword is required');
        throw new Error('newPassword is required');
      }

      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }

      const storage = new BrowserStorage();

      return targetWallet.changeWalletPassword(oldPassword, newPassword, storage);
    },
    [wallet]
  );

  const updateAccountName = useCallback(
    (address: string, name: string, walletOverride?: Wallet | null) => {
      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }
      targetWallet.updateAccountName(address, name);
      setAccountList(accountList.map(account => account.address === address ? { ...account, name } : account));
    },
    [wallet]
  );

  const updateAccountEmoji = useCallback(
    (address: string, emoji: string, walletOverride?: Wallet | null) => {
      const targetWallet = walletOverride ?? wallet;
      if (!targetWallet) {
        setError('Wallet is not available');
        throw new Error('Wallet is not available');
      }
      targetWallet.updateAccountEmoji(address, emoji);
      setAccountList(accountList.map(account => account.address === address ? { ...account, emoji } : account));
    },
    [wallet, accountList, setAccountList]
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
    accountList,
    changePassword,
    updateAccountName,
    updateAccountEmoji,
  };
}
