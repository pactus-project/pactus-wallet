'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { configureWallet, createWallet as createPactusWallet, Wallet } from '@pactus-wallet/wallet';

// Define the context type
interface WalletContextType {
    wallet: Wallet | null;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    createWallet: (password: string) => Promise<Wallet | null>;
    restoreWallet: (mnemonic: string, password: string) => Promise<Wallet | null>;
    validateMnemonic: (mnemonic: string) => { isValid: boolean; error?: string };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Initialize the wallet package
                // You can add wallet initialization logic here if needed
                setIsInitialized(true);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize wallet');
                setIsLoading(false);
            }
        };

        initialize();
    }, []);

    const createWallet = async (password: string): Promise<Wallet | null> => {
        try {
            setIsLoading(true);
            console.log('Creating wallet...');
            const config = configureWallet()
                .withNetwork('https://mainnet-rpc.pactus.org')
                .withChainId('mainnet');
            console.log('Config:', config);
            const newWallet = await createPactusWallet(password, config);
            console.log('New wallet:', newWallet);
            setWallet(newWallet);
            console.log('Wallet set:', wallet);
            setIsLoading(false);
            console.log('Wallet created successfully');
            return newWallet;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create wallet');
            setIsLoading(false);
            return null;
        }
    };

    const restoreWallet = async (mnemonic: string, password: string): Promise<Wallet | null> => {
        try {
            setIsLoading(true);
            // Implement wallet restoration from mnemonic
            // This is a placeholder - you'll need to implement the actual restoration logic
            const config = configureWallet()
                .withNetwork('https://mainnet-rpc.pactus.org')
                .withChainId('mainnet');

            // Note: Replace this with the actual method to restore from mnemonic when available
            // For now, this is just a placeholder
            const restoredWallet = await createPactusWallet(password, config);
            setWallet(restoredWallet);
            setIsLoading(false);
            return restoredWallet;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to restore wallet');
            setIsLoading(false);
            return null;
        }
    };

    const validateMnemonic = (mnemonic: string) => {
        // Implement mnemonic validation
        // This is a placeholder - implement proper validation logic
        try {
            if (!mnemonic || mnemonic.trim() === '') {
                return { isValid: false, error: 'Mnemonic cannot be empty' };
            }

            const words = mnemonic.trim().split(' ');
            if (words.length !== 12 && words.length !== 24) {
                return { isValid: false, error: 'Mnemonic must be 12 or 24 words' };
            }

            return { isValid: true };
        } catch {
            return { isValid: false, error: 'Invalid mnemonic format' };
        }
    };

    const contextValue: WalletContextType = {
        wallet,
        isInitialized,
        isLoading,
        error,
        createWallet,
        restoreWallet,
        validateMnemonic
    };

    return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};
