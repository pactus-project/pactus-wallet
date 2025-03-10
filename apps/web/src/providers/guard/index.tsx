'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Create context with `hasWallet` state and `setHasWallet` function
export const GuardContext = createContext({
  hasWallet: false,               // state to track if the wallet is enabled
  setHasWallet: (value: boolean) => { void value; } // function to enable/disable the wallet
});

export default function GuardProvider({ children }: { children: ReactNode }) {
  const [hasWallet, setHasWalletState] = useState(false); // State to store wallet status
  const router = useRouter();

  // Check localStorage for wallet status when the component mounts
  useEffect(() => {
    const walletExists = localStorage.getItem('hasWallet') === 'true'; // Get the wallet status from localStorage
    setHasWalletState(walletExists); // Set the state based on localStorage value

    // If no wallet and not on the '/get-started' page, redirect to '/get-started'
    if (!walletExists && window.location.pathname !== '/get-started') {
      router.replace('/get-started');
    }

    // If wallet exists but user is on '/get-started', redirect to home page
    if (walletExists && window.location.pathname === '/get-started') {
      router.replace('/');
    }
  }, [router]); // Add `router` as a dependency to avoid infinite loop

  // Function to enable the wallet (set wallet state to true)
  const setHasWallet = (value: boolean) => {
    localStorage.setItem('hasWallet', value ? 'true' : 'false'); // Save wallet status to localStorage
    setHasWalletState(value); // Update the state with the new value

    // If setting wallet status to false (logout), redirect to '/get-started'
    if (!value) {
      router.replace('/get-started');
    }
  };

  return (
    // Provide context to children components
    <GuardContext.Provider value={{ hasWallet, setHasWallet }}>
      {children}
    </GuardContext.Provider>
  );
}
