import CopyPlugin from 'copy-webpack-plugin';
import type { NextConfig } from 'next';

// Resolve the path to the wallet-core.wasm file from the @trustwallet/wallet-core package
const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');

const nextConfig: NextConfig = {
    // Configure the output to be static export
    output: 'export',
    // Transpile packages from the monorepo
    transpilePackages: ['@pactus-wallet/wallet'],
    webpack: (config, { isServer, dev }) => {
        if (!isServer) {
            // Add the CopyPlugin to copy the wallet-core.wasm file to the appropriate directory
            config.plugins.push(
                new CopyPlugin({
                    patterns: [
                        {
                            // Copy the file to 'static/chunks/app/' in development mode
                            // and to 'static/chunks/' in production mode
                            from: walletCoreWasmPath,
                            to: dev ? 'static/chunks/app/' : 'static/chunks/'
                        }
                    ]
                })
            );

            // Set fallback for the 'fs' module to false to avoid issues in the browser
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false
            };
        }
        return config;
    }
};

export default nextConfig;
