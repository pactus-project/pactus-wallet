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
-   📘 TypeScript Type Safety

## Installation

Install the SDK using yarn:

```bash
yarn add @pactus/wallet-sdk
```

## Prerequisites

-   Node.js 16+
-   TypeScript 4.5+
-   @trustwallet/wallet-core

## Quick Start

### Initializing the Wallet SDK

```typescript
import { 
  initWalletSDK, 
  NetworkValues, 
  MnemonicValues 
} from '@pactus/wallet-sdk';
import { MemoryStorage } from '@pactus/wallet-sdk/storage';

async function createWallet() {
    // Initialize with memory storage (replace with your preferred storage)
    const storage = new MemoryStorage();

    try {
        // Initialize the SDK
        const walletManager = await initWalletSDK(storage);

        // Create a new wallet
        const myWallet = await walletManager.createWallet(
            'my-secure-password',
            'My Wallet',
            MnemonicValues.NORMAL,
            NetworkValues.MAINNET
        );

        // Create an address
        const newAddress = myWallet.createAddress('Personal Address');
        console.log('New Address:', newAddress);
    } catch (error) {
        console.error('Wallet creation failed:', error);
    }
}
```

### Restoring a Wallet

```typescript
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

```typescript
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

-   `password`: Wallet encryption password
-   `name`: Wallet name (default: 'My Wallet')
-   `network`: Network type (default: `NetworkValues.MAINNET`)
-   `strength`: Mnemonic strength (default: `MnemonicValues.NORMAL`)

**Network Types**:
-   `NetworkValues.MAINNET`: Primary Pactus network
-   `NetworkValues.TESTNET`: Development and testing network

**Mnemonic Strength**:
-   `MnemonicValues.NORMAL`: 12-word phrase (128 bits entropy)
-   `MnemonicValues.HIGH`: 24-word phrase (256 bits entropy)

## Type Safety

The SDK uses TypeScript literal types for enhanced type safety:

```typescript
// Network type is a string literal
export type NetworkType = 'mainnet' | 'testnet';

// Constant values with type assertions
export const NetworkValues = {
  MAINNET: 'mainnet' as NetworkType,
  TESTNET: 'testnet' as NetworkType,
} as const;

// Mnemonic strength is a numeric literal
export type MnemonicStrength = 128 | 256;

// Constant values with type assertions
export const MnemonicValues = {
  NORMAL: 128 as MnemonicStrength, // 12 words
  HIGH: 256 as MnemonicStrength, // 24 words
} as const;
```

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
