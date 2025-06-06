import CopyPlugin from 'copy-webpack-plugin';
import { NextConfig } from 'next';
import path from 'path';
import fs from 'fs';

// Resolve the path to the wallet-core.wasm file from the @trustwallet/wallet-core package
const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');

// Resolve the path to the argon2.wasm file from the argon2-browser package
const argon2WasmPath = require.resolve('argon2-browser/dist/argon2.wasm');

// Function to search for any WASM files in the monorepo packages
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

  images: {
    unoptimized: true, // <-- Add this line to fix the error
  },

  // Transpile packages from the monorepo
  transpilePackages: ['@pactus-wallet/wallet'],

  webpack: (config, { isServer, dev }) => {
    // Enable WebAssembly support in Webpack
    config.experiments = {
      asyncWebAssembly: true,
      ...config.experiments,
    };

    // Use base64-loader for argon2.wasm
    config.module.rules.push({
      test: /\.wasm$/,
      loader: 'base64-loader',
      type: 'javascript/auto',
    });

    // Prevent parsing of WASM files
    config.module.noParse = /\.wasm$/;

    // Exclude WASM files from file-loader
    config.module.rules.forEach(rule => {
      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(oneOf => {
          if (
            oneOf.loader &&
            typeof oneOf.loader === 'string' &&
            oneOf.loader.includes('file-loader')
          ) {
            if (!Array.isArray(oneOf.exclude)) {
              oneOf.exclude = [oneOf.exclude || /^\s*$/];
            }
            oneOf.exclude.push(/\.wasm$/);
          }
        });
      }
    });

    // Set the publicPath to ensure correct loading of WASM files
    config.output.publicPath = '/_next/';


    if (!isServer) {
      // Add CopyPlugin to copy wallet-core.wasm to the output directory
      const walletCorePatterns = dev
        ? [
            {
              // In development, only copy to 'static/chunks/app/'
              from: walletCoreWasmPath,
              to: 'static/chunks/app/',
            },
          ]
        : [
            // In production, copy to both directories
            {
              from: walletCoreWasmPath,
              to: 'static/chunks/',
            },
            {
              from: walletCoreWasmPath,
              to: 'static/chunks/app/',
            },
          ];

      config.plugins.push(
        new CopyPlugin({
          patterns: walletCorePatterns,
        })
      );

      // Additional patterns for argon2.wasm and other WASM files from packages
      const additionalPatterns = [
        {
          // Copy argon2.wasm to the static/wasm directory
          from: argon2WasmPath,
          to: 'static/wasm/',
        },
      ];

      // Add any additional WASM files found in the monorepo packages
      wasmFiles.forEach(wasmFile => {
        additionalPatterns.push({
          from: wasmFile,
          to: dev ? 'static/chunks/app/' : 'static/wasm/',
        });
      });

      // Add a separate CopyPlugin instance for additional WASM files if any exist
      if (additionalPatterns.length > 0) {
        config.plugins.push(
          new CopyPlugin({
            patterns: additionalPatterns,
          })
        );
      }

      // Set fallback for 'fs' module to avoid issues in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
