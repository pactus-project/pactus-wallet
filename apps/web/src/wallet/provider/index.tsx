// WalletProvider.tsx
'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, NetworkType } from '@pactus-wallet/wallet';
import { WalletContextType, WalletStatus } from '../types';

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => { },
  walletStatus: WalletStatus.NO_WALLET,
  setWalletStatus: () => { },
  password: '',
  setPassword: () => { },
  mnemonic: '',
  setMnemonic: () => { },
  networkType: NetworkType.Mainnet,
  setNetworkType: () => { },
  walletName: '',
  setWalletName: () => { },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStatus, setWalletStatusState] = useState<WalletStatus>(WalletStatus.NO_WALLET);
  const [password, setPasswordState] = useState<string>('');
  const [mnemonic, setMnemonicState] = useState<string>('');
  const [networkType, setNetworkTypeState] = useState<NetworkType>(NetworkType.Mainnet);
  const [walletName, setWalletNameState] = useState<string>('');
  const router = useRouter();

  // Handle wallet status on component mount or router change
  useEffect(() => {
    const storedWalletStatus = localStorage.getItem('walletStatus');

    // If wallet is locked, load data and redirect to unlock page if not already there
    if (storedWalletStatus === WalletStatus.WALLET_LOCKED) {
      const walletDataStr = localStorage.getItem('pactus_wallet_data');
      if (walletDataStr) {
        try {
          const walletData = JSON.parse(walletDataStr);
          setMnemonicState(walletData.mnemonic);
          setNetworkTypeState(walletData.network as NetworkType);
          setWalletNameState(walletData.name);
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
          if (window.location.pathname !== '/unlock') {
            router.replace('/unlock');
          }
        } catch (error) {
          console.error('Failed to parse wallet data:', error);
          setWalletStatusState(WalletStatus.NO_WALLET);
          router.replace('/get-started');
        }
      } else {
        setWalletStatusState(WalletStatus.NO_WALLET);
        router.replace('/get-started');
      }
    }
    // If wallet is unlocked, update state and stay on current page or redirect to dashboard
    else if (storedWalletStatus === WalletStatus.WALLET_UNLOCKED) {
      setWalletStatusState(WalletStatus.WALLET_UNLOCKED);
      if (window.location.pathname !== '/') {
        router.replace('/');
      }
    }
    // If no wallet exists, redirect to get-started page
    else {
      setWalletStatusState(WalletStatus.NO_WALLET);
      if (window.location.pathname !== '/get-started') {
        router.replace('/get-started');
      }
    }
  }, [router]);

  // Update wallet status and handle navigation
  const setWalletStatus = (value: WalletStatus) => {
    localStorage.setItem('walletStatus', value);
    setWalletStatusState(value);
    if (value === WalletStatus.NO_WALLET) {
      setWallet(null);
      router.replace('/get-started');
    } else if (value === WalletStatus.WALLET_UNLOCKED && window.location.pathname !== '/') {
      router.replace('/'); // Redirect to dashboard when wallet is unlocked
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        walletStatus,
        setWalletStatus,
        password,
        setPassword: setPasswordState,
        mnemonic,
        setMnemonic: setMnemonicState,
        networkType,
        setNetworkType: setNetworkTypeState,
        walletName,
        setWalletName: setWalletNameState,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
