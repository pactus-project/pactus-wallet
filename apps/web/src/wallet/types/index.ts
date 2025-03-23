// types.ts
import { Wallet, NetworkType } from '@pactus-wallet/wallet';

export enum WalletStatus {
  NO_WALLET = 'NO_WALLET',
  WALLET_LOCKED = 'WALLET_LOCKED',
  WALLET_UNLOCKED = 'WALLET_UNLOCKED',
}

export interface WalletContextType {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  walletStatus: WalletStatus;
  setWalletStatus: (value: WalletStatus) => void;
  password: string;
  setPassword: (value: string) => void;
  mnemonic: string;
  setMnemonic: (value: string) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  walletName: string;
  setWalletName: (value: string) => void;
}