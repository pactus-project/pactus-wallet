// WalletProvider.tsx
'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, NetworkType, WalletManager, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';
import { WalletContextType, WalletStatus } from '../types';
import Loading from '@/components/loading';


export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => { },
  walletStatus: WalletStatus.WALLET_LOCKED,
  setWalletStatus: () => { },
  password: '',
  setPassword: () => { },
  mnemonic: '',
  setMnemonic: () => { },
  networkType: NetworkType.Mainnet,
  setNetworkType: () => { },
  walletName: '',
  setWalletName: () => { },
  walletManager: null,
  isInitializingManager: true,
  managerError: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStatus, setWalletStatusState] = useState<WalletStatus>(WalletStatus.WALLET_LOCKED);
  const [password, setPasswordState] = useState<string>('');
  const [mnemonic, setMnemonicState] = useState<string>('');
  const [networkType, setNetworkTypeState] = useState<NetworkType>(NetworkType.Mainnet);
  const [walletName, setWalletNameState] = useState<string>('');
  const [walletManager, setWalletManager] = useState<WalletManager | null>(null);
  const [isInitializingManager, setIsInitializingManager] = useState<boolean>(true);
  const [managerError, setManagerError] = useState<string | null>(null);
  const router = useRouter();

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Initialize wallet manager on component mount
  useEffect(() => {
    const initWalletManager = async () => {
      try {
        const manager = await setupWallet();
        setWalletManager(manager);
        setManagerError(null);
      } catch (err) {
        setManagerError(err instanceof Error ? err.message : 'Failed to initialize wallet manager');
      } finally {
        setIsInitializingManager(false);
      }
    };

    initWalletManager();
  }, []);

  // Handle wallet status on component mount or router change
  useEffect(() => {
    const storedWalletStatus = localStorage.getItem('walletStatus');

    // If wallet is locked, load data and redirect to unlock page if not already there
    if (storedWalletStatus === WalletStatus.WALLET_LOCKED) {
      const loadWalletData = async () => {
        try {
          const walletData = await walletManager?.loadFirstWallet();
          if (walletData) {
            const walletName = walletData.getName();
            setWalletNameState(walletName);
            setWalletStatusState(WalletStatus.WALLET_LOCKED);
            if (window.location.pathname !== '/unlock') {
              router.replace('/unlock');
            }
          } else {
            setWalletStatusState(WalletStatus.WALLET_LOCKED);
            router.replace('/get-started');
          }
        } catch (error) {
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
          router.replace('/get-started');
        }
      };

      loadWalletData();
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
      setWalletStatusState(WalletStatus.WALLET_LOCKED);
      if (window.location.pathname !== '/get-started') {
        router.replace('/get-started');
      }
    }
  }, [router]);

  // Update wallet status and handle navigation
  const setWalletStatus = (value: WalletStatus) => {
    localStorage.setItem('walletStatus', value);
    setWalletStatusState(value);
    if (value === WalletStatus.WALLET_LOCKED) {
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
        walletManager,
        isInitializingManager,
        managerError,
      }}
    >
      {isLoading && (
        <Loading />)}
      {children}
    </WalletContext.Provider>
  );
}
async function setupWallet(): Promise<WalletManager> {
  try {
    const storage = new BrowserStorage();
    const walletManager = await initWalletSDK(storage);
    return walletManager;
  } catch (error) {
    throw error;
  }
}
