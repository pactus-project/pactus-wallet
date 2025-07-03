// WalletProvider.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Wallet, WalletManager } from '@pactus-wallet/wallet';
import { NetworkType, NetworkValues, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';
import type { WalletContextType } from '../types';
import { WalletStatus } from '../types';
import Loading from '@/components/loading';
import WalletLock from '@/components/wallet-lock';
import LoadingDialog from '@/components/common/LoadingDialog';
import { Account } from '@/scenes/setting/Wallet';
import { PATHS } from '../../constants/paths';

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {
    /* Will be implemented in provider */
  },
  walletStatus: WalletStatus.WALLET_LOCKED,
  setWalletStatus: () => {
    /* Will be implemented in provider */
  },
  password: '',
  setPassword: () => {
    /* Will be implemented in provider */
  },
  mnemonic: '',
  setMnemonic: () => {
    /* Will be implemented in provider */
  },
  networkType: NetworkValues.MAINNET,
  setNetworkType: () => {
    /* Will be implemented in provider */
  },
  walletName: '',
  setWalletName: () => {
    /* Will be implemented in provider */
  },
  walletManager: null,
  isInitializingManager: true,
  managerError: null,
  headerTitle: '',
  setHeaderTitle: () => {
    /* Will be implemented in provider */
  },
  emoji: '',
  setEmoji: () => {
    /* Will be implemented in provider */
  },
  showLoadingDialog: () => {
    /* Will be implemented in provider */
  },
  hideLoadingDialog: () => {
    /* Will be implemented in provider */
  },
  accountList: [],
  setAccountList: () => {
    /* Will be implemented in provider */
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [isLoadingFullscreen, setIsLoadingFullscreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStatus, setWalletStatusState] = useState<WalletStatus>(WalletStatus.WALLET_LOCKED);
  const [password, setPasswordState] = useState<string>('');
  const [mnemonic, setMnemonicState] = useState<string>('');
  const [networkType, setNetworkTypeState] = useState<NetworkType>(NetworkValues.MAINNET);
  const [walletName, setWalletNameState] = useState<string>('');
  const [walletManager, setWalletManager] = useState<WalletManager | null>(null);
  const [isInitializingManager, setIsInitializingManager] = useState<boolean>(true);
  const [managerError, setManagerError] = useState<string | null>(null);
  const [headerTitle, setHeaderTitleState] = useState<string>('');
  const [emoji, setEmojiState] = useState<string>('');
  const [accountList, setAccountListState] = useState<Account[]>([]);
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

        if (
          !walletData &&
          window.location.pathname != PATHS.TERMS_AND_CONDITIONS &&
          window.location.pathname != PATHS.RECOVERY_PHRASE_NOTICE
        ) {
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
          router.replace(PATHS.GET_START);
          return;
        }
        if (window.location.pathname == PATHS.GET_START && walletData) {
          router.replace(PATHS.HOME);
        }

        // Load wallet data
        if (
          storedWalletStatus === WalletStatus.WALLET_LOCKED ||
          storedWalletStatus === WalletStatus.WALLET_UNLOCKED
        ) {
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

  const showLoadingDialog = (message: string = '') => {
    setLoadingMessage(message);
    setIsLoadingFullscreen(true);
  };

  const hideLoadingDialog = () => {
    setLoadingMessage('');
    setIsLoadingFullscreen(false);
  };

  useEffect(() => {
    if (!wallet) {
      setAccountListState([]);
      return;
    }

    setAccountListState(
      wallet.getAddresses().map(address => ({
        name: address.label,
        balance: 0,
        address: address.address,
        emoji: address.emoji || '🤝',
      }))
    );
  }, [wallet]);

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
        headerTitle,
        setHeaderTitle: setHeaderTitleState,
        emoji,
        setEmoji: setEmojiState,
        showLoadingDialog,
        hideLoadingDialog,
        accountList,
        setAccountList: setAccountListState,
      }}
    >
      {isLoadingFullscreen && <LoadingDialog message={loadingMessage} />}
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {walletStatus === WalletStatus.WALLET_LOCKED &&
          wallet &&
          window.location.pathname !== '/get-started' ? (
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
  const storage = new BrowserStorage();
  const walletManager = await initWalletSDK(storage);
  return walletManager;
}
