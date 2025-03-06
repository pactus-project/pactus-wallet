'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export const GuardContext = createContext({
    hasWallet: false,
    setHasWallet: (value: boolean) => {
        console.log('🚀 ~ value:', value);
    }
});

export default function GuardProvider({ children }: { children: ReactNode }) {
    const [hasWallet, setHasWallet] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const walletExists = localStorage.getItem('hasWallet') === 'true';
        setHasWallet(walletExists);

        if (!walletExists && window.location.pathname !== '/get-started') {
            router.replace('/get-started');
        }
        if (walletExists && window.location.pathname === '/get-started') {
            router.replace('/');
        }
    }, [router]);

    return (
        <GuardContext.Provider value={{ hasWallet, setHasWallet }}>
            {children}
        </GuardContext.Provider>
    );
}
