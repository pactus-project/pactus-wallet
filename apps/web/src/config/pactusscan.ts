export const pactusscanConfig = {
  // TODO: when a separate testnet API host exists, select base per network
  // (wallet.isTestnet()) instead of using a single mainnet base.
  url: process.env.NEXT_PUBLIC_PACTUSSCAN_API_URL ?? 'https://api.pactusscan.com',
};
