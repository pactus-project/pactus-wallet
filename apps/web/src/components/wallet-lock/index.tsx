'use client';
import { useWallet } from '@/wallet/hooks/use-wallet';

export default function WalletLock() {
    const { walletName, setPassword } = useWallet();

    //   const handleUnlock = async () => {
    //     try {
    //       setError(null);
    //       if (!walletManager) {
    //         throw new Error('Wallet manager not initialized');
    //       }

    //       const wallet = await walletManager.unlockWallet(password);

    //       if (wallet) {
    //         setContextPassword(password);
    //         setWallet(wallet);
    //         setWalletStatus(WalletStatus.WALLET_UNLOCKED);
    //       } else {
    //         throw new Error('Failed to unlock wallet');
    //       }
    //     } catch (error) {
    //       setError(error.message || 'Invalid password');
    //     }
    //   };

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
                //   onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                />

                {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

                <button
                    //   onClick={handleUnlock}
                    className="w-full p-3 bg-blue-600 text-white rounded"

                >
                    Unlock
                </button>
            </div>
        </div>
    );
}