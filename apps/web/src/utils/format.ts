import { Amount } from '@pactus-wallet/wallet';

export const formatAmount = (value: number): string => {
  return Amount.fromString((value / 1000000000).toString()).format() + ' PAC';
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
