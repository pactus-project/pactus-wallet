'use client';
import { useWallet } from '@/wallet/hooks/use-wallet';

export default function WalletLock() {
    const { walletName, setPassword } = useWallet();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Unlock Wallet</h1>
            <p className="mb-4">Enter your password to unlock {walletName}</p>

            <div className="w-full max-w-md">
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full p-3 bg-blue-600 text-white rounded"

                >
                    Unlock
                </button>
            </div>
        </div>
    );
}