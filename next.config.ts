import CopyPlugin from 'copy-webpack-plugin';
import { NextConfig } from 'next';

// Resolve the path to the wallet-core.wasm file from the @trustwallet/wallet-core package
const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');

// Resolve the path to the argon2.wasm file from the argon2-browser package
const argon2WasmPath = require.resolve('argon2-browser/dist/argon2.wasm');

// Expose the package version to the app (shown on the About page).
const { version } = require('./package.json');

// Resolve the current git commit (shown on the About page). Falls back to
// 'unknown' if git is unavailable at build time.
let gitCommit = 'unknown';
let gitCommitDate = '';
try {
  const { execSync } = require('child_process');
  gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
  gitCommitDate = execSync('git log -1 --format=%cd --date=short').toString().trim();
} catch {
  // keep defaults
}

const nextConfig: NextConfig = {
  // Configure the output to be static export
  output: 'export',

  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_GIT_COMMIT: gitCommit,
    NEXT_PUBLIC_GIT_COMMIT_DATE: gitCommitDate,
  },

  images: {
    unoptimized: true, // <-- Add this line to fix the error
  },

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

      // Copy argon2.wasm to the static/wasm directory
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: argon2WasmPath,
              to: 'static/wasm/',
            },
          ],
        })
      );

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
