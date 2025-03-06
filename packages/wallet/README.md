# Pactus Wallet Package

A clean, easy-to-use wallet management library for Pactus blockchain.

## Features

-   🔒 Secure wallet creation and management
-   📚 Simple, intuitive API
-   🔄 Flexible storage options
-   🛡️ Comprehensive error handling
-   📱 Works in browser and Node.js environments

## Installation

```bash
npm install @pactus-wallet/wallet
```

## Quick Start

```typescript
import { configureWallet, createWallet, MnemonicStrength } from '@pactus-wallet/wallet';

async function main() {
    try {
        // Configure the wallet with builder pattern
        const config = configureWallet()
            .withNetwork('https://mainnet-rpc.pactus.org')
            .withChainId('mainnet')
            .withDebugMode()
            .build();

        // Create a new wallet with a secure password
        const wallet = await createWallet('SecurePassword123!', config);

        // Generate a new address with label
        const address = wallet.newEd25519Address('My Primary Address');

        console.log('Wallet created successfully!');
        console.log('Address:', address);
        console.log('Mnemonic:', wallet.getMnemonic());
    } catch (error) {
        console.error('Error creating wallet:', error);
    }
}

main();
```

## API Documentation

### Configuration

The wallet can be configured using the builder pattern:

```typescript
const config = configureWallet()
    .withNetwork('https://testnet-rpc.pactus.org')
    .withChainId('testnet')
    .withDebugMode()
    .withStorage(new CustomStorage())
    .build();
```

### Creating a New Wallet

```typescript
// Simple creation with default settings
const wallet = await createWallet('SecurePassword123!');

// Advanced creation with configuration
const wallet = await createWallet('SecurePassword123!', config);

// Creating with specific mnemonic strength
const wallet = await createWallet('SecurePassword123!', MnemonicStrength.High);
```

### Restoring a Wallet

```typescript
// Restore from mnemonic phrase
const wallet = await restoreWallet('mnemonic phrase here...', 'password123');
```

### Managing Addresses

```typescript
// Generate a new address
const address = wallet.newEd25519Address('Primary Account');

// Get all addresses
const addresses = wallet.getAddresses();
```

### Wallet Information

```typescript
// Get wallet info
const info = wallet.getWalletInfo();
console.log(`Word count: ${info.mnemonicWordCount}, Address count: ${info.addressCount}`);

// Get mnemonic (handle with extreme caution!)
const mnemonic = wallet.getMnemonic();
```

### Export/Import

```typescript
// Export wallet data for storage
const walletData = wallet.export();
localStorage.setItem('pactus-wallet', JSON.stringify(walletData));

// Import wallet data from storage
const savedData = JSON.parse(localStorage.getItem('pactus-wallet'));
wallet.import(savedData);
```

### Initializing Early

For better performance, you can initialize the wallet core early in your application:

```typescript
import { initializeWalletCore } from '@pactus-wallet/wallet';

// In your app initialization:
async function initializeApp() {
    // Initialize the wallet core early to avoid delay when creating wallets
    await initializeWalletCore();

    // Continue with app initialization
}
```

## Browser Compatibility

When using this package in a browser environment, you may need to add the following to your webpack
config:

```javascript
// webpack.config.js or next.config.js
module.exports = {
    // ... other config
    resolve: {
        fallback: {
            fs: false,
            'fs/promises': false,
            path: false,
            os: false,
            crypto: require.resolve('crypto-browserify')
        }
    }
};
```

## Security Best Practices

-   Always store encrypted wallets
-   Never log or expose mnemonic phrases
-   Use strong passwords with `validatePassword` helper
-   Implement proper access controls in your application
-   Consider hardware wallet integration for high-value wallets

## License

[MIT](LICENSE)
