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
interface BondTransactionParams extends SendTransactionParams {
  publicKey?: string;
}

interface GetSignTransferTransaction {
  signedRawTxHex: string;
}

interface GetSignBondTransaction {
  signedRawTxHex: string;
}

export function useSendTransaction() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const getSignTransferTransaction = useCallback(
    async ({
      fromAddress,
      toAddress,
      amount,
      fee,
      memo = '',
      password,
    }: SendTransactionParams): Promise<GetSignTransferTransaction> => {
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

        const amountValue = Amount.fromString(amount);
        const feeValue = Amount.fromString(fee);

        const result = await wallet.getSignTransferTransaction(
          fromAddress,
          toAddress,
          amountValue,
          feeValue,
          memo,
          password
        );

        setTxHash(result.signedRawTxHex);
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

  const getSignBondTransaction = useCallback(
    async ({
      fromAddress,
      toAddress,
      amount,
      fee,
      memo = '',
      password,
      publicKey = '',
    }: BondTransactionParams): Promise<GetSignBondTransaction> => {
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

        const amountValue = Amount.fromString(amount);
        const feeValue = Amount.fromString(fee);

        const result = await wallet.getSignBondTransaction(
          fromAddress,
          toAddress,
          amountValue,
          feeValue,
          memo,
          password,
          publicKey
        );

        setTxHash(result.signedRawTxHex);
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

  const broadcastTransaction = useCallback(
    async (signedRawTxHex: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!wallet) {
          throw new Error('Wallet is not available');
        }

        if (!signedRawTxHex) {
          throw new Error('Missing signed transaction data');
        }
        const broadcastTxHash = await wallet.broadcastTransaction(signedRawTxHex);
        setTxHash(broadcastTxHash);
        return broadcastTxHash;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to broadcast transaction';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet]
  );

  return {
    getSignTransferTransaction,
    getSignBondTransaction,
    broadcastTransaction,
    isLoading,
    error,
    txHash,
  };
}
