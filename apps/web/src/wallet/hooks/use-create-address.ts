import { useCallback } from 'react';
import { useWallet } from './use-wallet';

export function useAddress() {
    const { wallet, password } = useWallet();

    const createAddress = useCallback(
        (label: string) => {
            return wallet?.createAddress(label, password);
        },
        [wallet]
    );

    return { createAddress };
}
