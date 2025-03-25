# Pactus Wallet

A modern, secure cryptocurrency wallet for the Pactus blockchain.

## Project Overview

Pactus Wallet is a cross-platform wallet solution for managing digital assets on the Pactus blockchain.
Built with security and usability in mind, it provides a seamless experience for
users to create wallets, manage accounts, and perform transactions.

## Project Structure

This project is structured as a monorepo using Yarn workspaces:

```
pactus-wallet/
├── apps/                    # User-facing applications
│   └── web/                 # Web wallet application (Next.js)
└── packages/                # Shared libraries and modules
    └── wallet/              # Core wallet functionality
```

## Key Technologies

### Core

- **[TypeScript](https://www.typescriptlang.org/)**: Statically typed JavaScript for safer code.
- **[Yarn](https://yarnpkg.com/)**: package manager with monorepo support.
- **[Turborepo](https://turbo.build/)**: High-performance build system for monorepos.
- **[Jest](https://jestjs.io/)** - For unit and integration testing

### Web Application

- **[Next.js](https://nextjs.org/)**: React framework with SSR and static generation.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS for fast UI development.
- **[next-themes](https://www.npmjs.com/package/next-themes)**: Theme and dark mode management for Next.js.

### Wallet Core

- **[Trust Wallet Core](https://github.com/trustwallet/wallet-core)**: Cryptographic library powering the Pactus Web Wallet.

## Getting Started

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/pactus-project/pactus-wallet.git
cd pactus-wallet

yarn install
```

### Running the Web Wallet

```bash
# From the root directory
yarn build
yarn dev:web
```

## Contributing

Contributions are most welcome!
Whether it's code, documentation, or ideas, every contribution makes a difference.
Please read the [Contributing](CONTRIBUTING.md) guide to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
