import CopyPlugin from 'copy-webpack-plugin';
import type { NextConfig } from 'next';
import path from 'path';
import fs from 'fs';

// Resolve the path to the wallet-core.wasm file from the @trustwallet/wallet-core package
const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');
const argon2WasmPath = path.resolve(__dirname, '../../node_modules/argon2-browser/dist/argon2.wasm');

// Search for any WASM files in the monorepo packages that might need to be included
const findWasmFiles = (dir: string, fileList: string[] = []): string[] => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes('node_modules')) {
      findWasmFiles(filePath, fileList);
    } else if (file.endsWith('.wasm')) {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// Find all WASM files in the packages directory
const packagesDir = path.resolve(__dirname, '../../packages');
const wasmFiles = findWasmFiles(packagesDir);

const nextConfig: NextConfig = {
    // Configure the output to be static export
    output: 'export',
    // Transpile packages from the monorepo
    transpilePackages: ['@pactus-wallet/wallet'],
    webpack: (config, { isServer, dev }) => {
        // Enable WebAssembly support
        config.experiments = {
            asyncWebAssembly: true,
            ...config.experiments
        };

        // Use webpack 5's Asset Modules instead of file-loader
        config.module.rules.unshift({
            test: /\.wasm$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/wasm/[name].[hash][ext]'
            }
        });

        // Configure the publicPath to correctly load WASM files
        config.output.publicPath = dev ? '/_next/' : './';

        if (!isServer) {
            // Add the CopyPlugin to copy the wallet-core.wasm file to the original paths
            config.plugins.push(
                new CopyPlugin({
                    patterns: [
                        {
                            // Copy the wallet-core.wasm file to the same paths as before
                            // to 'static/chunks/app/' in development mode and to 'static/chunks/' in production
                            from: walletCoreWasmPath,
                            to: dev ? 'static/chunks/app/' : 'static/chunks/'
                        }
                    ]
                })
            );
            
            // Additional copy plugin for argon2.wasm and other package WASM files
            const additionalPatterns = [
                {
                    from: argon2WasmPath,
                    to: 'static/wasm/'
                }
            ];
            
            // Add any additional WASM files found in packages
            wasmFiles.forEach(wasmFile => {
                additionalPatterns.push({
                    from: wasmFile,
                    to: 'static/wasm/'
                });
            });
            
            // Add a separate CopyPlugin for the additional WASM files
            if (additionalPatterns.length > 0) {
                config.plugins.push(
                    new CopyPlugin({
                        patterns: additionalPatterns
                    })
                );
            }

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
