# Pactus Wallet SDK

## Overview

Pactus Wallet SDK is a powerful, type-safe TypeScript library for creating, managing, and
interacting with Pactus blockchain wallets. Designed with flexibility and security in mind, this SDK
provides comprehensive wallet management capabilities.

## Features

-   🔐 Secure Wallet Creation
-   🔑 Mnemonic Phrase Management
-   📦 Multiple Network Support (Mainnet/Testnet)
-   🔢 Address Generation
-   💾 Memory Storage Options
-   🛡️ Robust Error Handling

## Installation

Install the SDK using npm or yarn:

```bash
npm install @pactus/wallet-sdk
# or
yarn add @pactus/wallet-sdk
```

## Prerequisites

-   Node.js 16+
-   TypeScript 4.5+
-   @trustwallet/wallet-core

## Quick Start

### Initializing the Wallet SDK

```typescript
import { initWalletSDK, NetworkType, MnemonicStrength } from '@pactus/wallet-sdk';
import { MemoryStorage } from '@pactus/wallet-sdk/storage';

async function createWallet() {
    // Initialize with memory storage (replace with your preferred storage)
    const storage = new MemoryStorage();

    try {
        // Initialize the SDK
        const walletManager = await initWalletSDK(storage);

        // Create a new wallet
        const wallet = await walletManager.createWallet(
            'your-secure-password',
            MnemonicStrength.Normal,
            NetworkType.Mainnet,
            'My First Wallet'
        );

        // Create an address
        const newAddress = wallet.createAddress('Personal Address');
        console.log('New Address:', newAddress);
    } catch (error) {
        console.error('Wallet creation failed:', error);
    }
}
```

### Restoring a Wallet

```
async function restoreWallet() {
    const storage = new MemoryStorage();
    const walletManager = await initWalletSDK(storage);

    try {
        const restoredWallet = await walletManager.restoreWallet(
            'your-mnemonic-phrase',
            'your-secure-password'
        );

        console.log('Wallet Restored:', restoredWallet.getWalletInfo());
    } catch (error) {
        console.error('Wallet restoration failed:', error);
    }
}
```

### Export a Wallet

```
async function exportWallet() {
    const storage = new MemoryStorage(); // or browser storage
    const walletManager = await initWalletSDK(storage);

    try {
         const wallet = walletManager.getCurrentWallet();
        if (!wallet) {
            console.error('No wallet loaded to export');
            return;
        }
        // Export wallet data
        const walletData = wallet.export();

        console.log('Wallet Restored:', restoredWallet.getWalletInfo());
    } catch (error) {
        console.error('Wallet export failed:', error);
    }
}
```

## API Reference

### Wallet Creation Options

-   `password`: Encryption password (required)
-   `strength`: Mnemonic strength (default: `MnemonicStrength.Normal`)
    -   `Normal`: 12-word mnemonic
    -   `High`: 24-word mnemonic
-   `network`: Network type (default: `NetworkType.Mainnet`)
-   `name`: Wallet name (default: 'My Wallet')

### Supported Networks

-   `NetworkType.Mainnet`: Primary Pactus network
-   `NetworkType.Testnet`: Development and testing network

## Security Recommendations

1. Never share your mnemonic phrase
2. Use strong, unique passwords
3. Store mnemonics offline and securely
4. Use hardware wallets for large amounts

## Error Handling

The SDK provides specific error types:

-   `WalletRestoreError`: Errors during wallet restoration
-   `StorageError`: Issues with wallet storage
-   `WalletCreationError`: Problems creating a wallet

```typescript
try {
    // Wallet operations
} catch (error) {
    if (error instanceof WalletRestoreError) {
        // Handle specific restoration errors
    }
}
```

## Performance Considerations

-   Wallet operations are optimized for efficiency
-   Address generation is fast and secure
-   Minimal memory footprint

## Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on
submitting pull requests.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on our GitHub repository or contact our developer community.

## Disclaimer

This SDK is provided "as is" without warranty. Always review and test thoroughly before production
use.

```

```
