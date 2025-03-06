import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    output: 'export',
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Browser builds - mock Node.js modules that are used by trustwallet
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                'fs/promises': false,
                path: false,
                os: false,
                crypto: false
            };
        }
        return config;
    }
};

export default nextConfig;
