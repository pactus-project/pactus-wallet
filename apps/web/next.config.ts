import CopyPlugin from 'copy-webpack-plugin';
import type { NextConfig } from 'next';
import path from 'path';

// Resolve the path to the wallet-core.wasm file from the @trustwallet/wallet-core package
const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');

const nextConfig: NextConfig = {
    // Configure the output to be static export
    output: 'export',
    // Transpile packages from the monorepo
    transpilePackages: ['@pactus-wallet/wallet'],
    webpack: (config, { isServer, dev }) => {
        // Enable WebAssembly support globally (must be outside server check)
        config.experiments = {
            syncWebAssembly: true,  // Like webpack 4
            asyncWebAssembly: true, // Modern approach
            layers: true,           // Enable module layer rules
            ...config.experiments
        };

        // CRITICAL: Add loader for WebAssembly files BEFORE other rules
        const wasmRule = {
            test: /\.wasm$/,
            type: 'javascript/auto',
            loader: 'file-loader',
            options: {
                name: 'static/wasm/[name].[hash].[ext]',
            },
        };
        
        // Insert our rule at the beginning
        config.module.rules.unshift(wasmRule);

        // Ensure argon2 is handled correctly
        config.resolve.alias = {
            ...config.resolve.alias,
            'argon2-browser': path.resolve(__dirname, '../../node_modules/argon2-browser'),
        };

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
                        },
                        {
                            // Also copy argon2.wasm
                            from: path.resolve(__dirname, '../../node_modules/argon2-browser/dist/argon2.wasm'),
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
