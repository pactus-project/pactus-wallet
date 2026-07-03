import React, { useEffect, useRef } from 'react';
import { Transaction } from '@/services/transaction';
import './style.css';
import Skeleton from '../common/skeleton/Skeleton';
import { useI18n } from '@/utils/i18n';
import { formatAmount, formatDate } from '@/utils/format';
import { Mobile, Tablet } from '../responsive';
import { PACTUSSCAN_URL } from '@/utils/constants';
import { useWallet } from '@/wallet';

interface TransactionsHistoryProps {
  transactions: Transaction[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  height?: string | number;
  hasError?: boolean;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  transactions,
  onLoadMore,
  isLoading,
  hasMore,
  height = '100%',
  hasError = false,
}) => {
  const { t } = useI18n();
  const { wallet } = useWallet();
  const explorerUrl = wallet?.isTestnet() ? PACTUSSCAN_URL.TESTNET : PACTUSSCAN_URL.MAINNET;
  const headings = ['Date', 'TX Hash', 'From', 'To', 'Amount', 'Fee'];
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);
  const lastMobileElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <>
      <Tablet>
        <div className="transactions-history shadow-inset" style={{ height }}>
          <div className="transactions-history__wrapper">
            <div className="px-8 py-6">
              <table className="transactions-history__table bg-[#15191C] rounded-md">
                <thead className="transactions-history__header">
                  <tr className="transactions-history__row">
                    {headings.map(heading => (
                      <th
                        key={heading}
                        className="transactions-history__cell transactions-history__cell--header"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="transactions-history__body">
                  {hasError && transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="transactions-history__empty">
                        {t('fetchTransactionFail')}
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="transactions-history__row"
                        ref={rowIndex === transactions.length - 1 ? lastElementRef : null}
                      >
                        <td className="transactions-history__cell">
                          {formatDate(transaction.blockTime)}
                        </td>
                        <td className="transactions-history__cell transactions-history__cell--hash">
                          <a
                            href={`${explorerUrl}/transaction/${transaction.hash}`}
                            target="_blank"
                          >
                            {transaction.hash}
                          </a>
                        </td>
                        <td className="transactions-history__cell flex" title={transaction.sender}>
                          <span className="text-truncate">{transaction.sender}</span>
                        </td>
                        <td className="transactions-history__cell" title={transaction.receiver}>
                          <div className="flex">
                            <span className="text-truncate">{transaction.receiver}</span>
                          </div>
                        </td>
                        <td className="transactions-history__cell">
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className="transactions-history__cell">
                          {formatAmount(transaction.fee)}
                        </td>
                      </tr>
                    ))
                  ) : !isLoading ? (
                    <tr>
                      <td colSpan={6} className="transactions-history__empty">
                        {t('noTransactionFound')}
                      </td>
                    </tr>
                  ) : null}
                  {isLoading && (
                    <>
                      <tr>
                        <td colSpan={6}>
                          <Skeleton width="100%" height="34px" />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6}>
                          <Skeleton width="100%" height="34px" />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6}>
                          <Skeleton width="100%" height="34px" />
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Tablet>
      <Mobile>
        <div className="w-full flex flex-col gap-2">
          {hasError && transactions.length === 0 ? (
            <div className="transactions-history__empty">
              {t('fetchTransactionFail')}
            </div>
          ) : transactions.length > 0 ? transactions.map((transaction, index) => (
            <div key={index} className="w-full flex flex-col gap-2" ref={index === transactions.length - 1 ? lastMobileElementRef : null}>
              <div>
                <div className="flex justify-between items-center text-xs font-medium">
                  <div>{formatDate(transaction.blockTime)}</div>
                  <div>{formatAmount(transaction.amount)}</div>
                </div>
                <div className="text-sm font-medium text-gradient">
                  <div>{transaction.sender}</div>
                </div>
              </div>
              {index !== transactions.length - 1 && <div className="h-[1px] bg-gray-200 w-full" />}
            </div>
          )) : !isLoading ? (
            <div className="transactions-history__empty">
              {t('noTransactionFound')}
            </div>
          ) : null}
          {isLoading && (
            <>
              <div>
                <Skeleton width="100%" height="48px" />
              </div>
              <div>
                <Skeleton width="100%" height="48px" />
              </div>
              <div>
                <Skeleton width="100%" height="48px" />
              </div>
            </>
          )}
        </div>
      </Mobile>
    </>
  );
};

export default TransactionsHistory;
