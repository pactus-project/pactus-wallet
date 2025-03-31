import { Wallet } from '@pactus-wallet/wallet';
import { useCallback } from 'react';

export function useAddress() {
    const createAddress = useCallback(
        (label: string, wallet: Wallet, password: string) => {
            return wallet?.createAddress(label, password);
        },
        []
    );

    return { createAddress };
}
