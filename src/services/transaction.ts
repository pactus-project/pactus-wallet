import { PACTUSSCAN_API_URL } from '@/config/pactusscan';

export interface Transaction {
  hash: string;
  blockHeight: number;
  blockTime: number; // unix timestamp in seconds
  payloadType: number;
  direction: number;
  amount: number; // in nanoPAC
  fee: number; // in nanoPAC
  sender: string;
  receiver: string;
  memo: string;
}

export interface AccountTransactions {
  transactions: Transaction[];
  total: number;
}

interface RawTransaction {
  hash: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  block_height: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  block_time: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  payload_type: number;
  direction: number;
  amount: number;
  fee: number;
  sender: string;
  receiver: string;
  memo: string;
}

interface AccountTxsResponse {
  txs: RawTransaction[] | null;
  total: number;
  pages: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  per_page: number;
}

export const fetchAccountTransactions = async (
  address: string,
  page: number = 1,
  limit: number = 20,
  isTestnet: boolean = false
): Promise<AccountTransactions> => {
  const baseUrl = isTestnet ? PACTUSSCAN_API_URL.TESTNET : PACTUSSCAN_API_URL.MAINNET;

  const response = await fetch(
    `${baseUrl}/api/v1/account/${address}/txs?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const result: AccountTxsResponse = await response.json();

  return {
    transactions: (result.txs ?? []).map(tx => ({
      hash: tx.hash,
      blockHeight: tx.block_height,
      blockTime: tx.block_time,
      payloadType: tx.payload_type,
      direction: tx.direction,
      amount: tx.amount,
      fee: tx.fee,
      sender: tx.sender,
      receiver: tx.receiver,
      memo: tx.memo,
    })),
    total: result.total,
  };
};
