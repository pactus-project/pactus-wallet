import { Amount } from './amount';

export interface TransferTransaction {
  sender: string;
  receiver: string;
  amount: Amount;
  fee: Amount;
  memo?: string;
}

export const TransactionType = {
  UNKNOWN: 0,
  TRANSFER_PAYLOAD: 1,
  BOND_PAYLOAD: 2,
  SORTITION_PAYLOAD: 3,
  UNBOND_PAYLOAD: 4,
  WITHDRAW_PAYLOAD: 5,
};
export const TransactionDetailsType = {
  TRANSACTION_DATA: 0,
  TRANSACTION_INFO: 1,
};
