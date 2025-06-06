import { pacviwerConfig } from '@/config/pacviewer';

export interface Transaction {
  id: string;
  hash: string;
  blockHeight: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lock_time: number;
  version: number;
  type: number;
  from: string;
  to: string;
  value: number;
  fee: number;
  memo: string;
  signature: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  from_address_alias: AddressAlias | null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  to_address_alias: AddressAlias | null;
}

interface AddressAlias {
  id: string;
  title: string;
  description: string;
  website: string;
  email: string;
  type: number;
  icon: string;
  addresses: string[] | null;
}

interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    page_no: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    page_size: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    total_items: number;
    data: T[];
  };
}

export const fetchAccountTransactions = async (
  address: string,
  pageNo: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Transaction>> => {
    console.log("address", pacviwerConfig.url);
  const response = await fetch(
    `${pacviwerConfig.url}/v1/accounts/${address}/txs?page_no=${pageNo}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
};
