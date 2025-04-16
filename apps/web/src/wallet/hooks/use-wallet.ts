// hooks.ts
import { useContext } from 'react';
import type { WalletContextType } from '../types';
import { WalletContext } from '../provider';

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
