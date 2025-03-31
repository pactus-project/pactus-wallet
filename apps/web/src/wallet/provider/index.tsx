// WalletProvider.tsx
'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, NetworkType, WalletManager, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';
import { WalletContextType, WalletStatus } from '../types';
import Loading from '@/components/loading';
import WalletLock from '@/components/wallet-lock';


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

  // Initialize wallet manager and handle stored wallet status
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Initialize the wallet manager
        const manager = await setupWallet();
        setWalletManager(manager);
        setManagerError(null);
        const walletData = await manager.loadFirstWallet();
        // Get wallet status from storage
        const storedWalletStatus = localStorage.getItem('walletStatus');

        if (!walletData) {
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
          router.replace('/get-started');
          return;
        }
        if (window.location.pathname == '/get-started' && walletData) {
          router.replace('/');
        }

        // Load wallet data
        if (storedWalletStatus === WalletStatus.WALLET_LOCKED ||
          storedWalletStatus === WalletStatus.WALLET_UNLOCKED) {
          try {

            if (walletData) {
              const walletName = walletData.getName();
              setWalletNameState(walletName);
              setWallet(walletData);
              setWalletStatusState(storedWalletStatus as WalletStatus);

              // If wallet is unlocked, ensure we have the wallet object available
              if (storedWalletStatus === WalletStatus.WALLET_UNLOCKED) {
                // You might need additional steps here to fully restore an unlocked wallet
                // For example, if you need to reapply a saved password
              }
            } else {
              setWalletStatusState(WalletStatus.WALLET_LOCKED);
              router.replace('/get-started');
            }
          } catch (error) {
            setManagerError((error as Error).message || 'Failed to load wallet data');
            setWalletStatusState(WalletStatus.WALLET_LOCKED);
            router.replace('/get-started');
          }
        }
      } catch (err) {
        setManagerError(err instanceof Error ? err.message : 'Failed to initialize wallet manager');
      } finally {
        setIsInitializingManager(false);
      }
    };

    initializeWallet();
  }, [router]); // Only depend on router to prevent unnecessary re-runs

  // Update wallet status and handle navigation
  const setWalletStatus = (value: WalletStatus) => {
    localStorage.setItem('walletStatus', value);
    setWalletStatusState(value);
    if (value === WalletStatus.WALLET_LOCKED) {
      setWallet(null);
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
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {walletStatus === WalletStatus.WALLET_LOCKED
            && wallet
            && window.location.pathname !== '/get-started' ? (
            <WalletLock />
          ) : (
            children
          )}
        </>
      )}
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
