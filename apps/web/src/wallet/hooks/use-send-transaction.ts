'use client';
import { useState, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { Amount } from '@pactus-wallet/wallet';

interface SendTransactionParams {
  fromAddress: string;
  toAddress: string;
  amount: string;
  fee: string;
  memo?: string;
  password: string;
}

interface SendTransactionResult {
  txHash: string;
}

export function useSendTransaction() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const sendTransaction = useCallback(
    async ({
      fromAddress,
      toAddress,
      amount,
      fee,
      memo = '',
      password,
    }: SendTransactionParams): Promise<SendTransactionResult> => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        if (!wallet) {
          throw new Error('Wallet is not available');
        }

        if (!fromAddress || !toAddress || !amount || !fee || !password) {
          throw new Error('Missing required transaction parameters');
        }

        // Convert string amounts to Amount objects
        const amountValue = Amount.fromString(amount);
        const feeValue = Amount.fromString(fee);

        console.log('amountValue', amountValue);
        console.log('feeValue', feeValue);
        console.log('fromAddress', fromAddress);
        console.log('toAddress', toAddress);
        console.log('memo', memo);
        console.log('password', password);
        // Call wallet.sendTransfer with the Amount objects
        const result = await wallet.sendTransfer(
          fromAddress,
          toAddress,
          amountValue,
          feeValue,
          memo,
          password
        );
        console.log('result', result);

        setTxHash(result.txHash);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send transaction';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet]
  );

  return {
    sendTransaction,
    isLoading,
    error,
    txHash,
  };
}
