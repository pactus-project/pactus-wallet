import { Wallet } from '@pactus-wallet/wallet';
import { useCallback } from 'react';
import { useWallet } from '@/wallet';

export function useAddress() {
    const { wallet } = useWallet();

    const createAddress = useCallback(
        (label: string, password: string, walletOverride?: Wallet | null) => {
            const targetWallet = walletOverride ?? wallet;
            if (!targetWallet) {
                throw new Error('Wallet is not available');
            }
            return targetWallet.createAddress(label, password);
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
                emoji: '🤝'
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

    return { createAddress, getAccountList, getAccountByAddress };
}
