// types.ts
import { Wallet, NetworkType, WalletManager } from '@pactus-wallet/wallet';

export enum WalletStatus {
  WALLET_LOCKED = 'WALLET_LOCKED',
  WALLET_UNLOCKED = 'WALLET_UNLOCKED',
}

export interface WalletContextType {
  wallet: Wallet | null;
  setWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
  walletStatus: WalletStatus;
  setWalletStatus: (status: WalletStatus) => void;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  mnemonic: string;
  setMnemonic: React.Dispatch<React.SetStateAction<string>>;
  networkType: NetworkType;
  setNetworkType: React.Dispatch<React.SetStateAction<NetworkType>>;
  walletName: string;
  setWalletName: React.Dispatch<React.SetStateAction<string>>;
  walletManager: WalletManager | null;
  isInitializingManager: boolean;
  managerError: string | null;
  headerTitle: string;
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
  showLoadingDialog: (message?: string) => void;
  hideLoadingDialog: () => void;
}
