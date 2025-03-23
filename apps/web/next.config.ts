import CopyPlugin from 'copy-webpack-plugin';
import type { NextConfig } from 'next';

const walletCoreWasmPath = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');

const nextConfig: NextConfig = {
    output: 'export',
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.plugins.push(
                new CopyPlugin({
                    patterns: [{ from: walletCoreWasmPath, to: 'static/chunks/app/' }]
                })
            );
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false
            };
        }
        return config;
    }
};

export default nextConfig;
