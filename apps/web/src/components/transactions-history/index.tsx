import React, { useEffect, useRef, useState } from 'react';
import { Transaction } from '@/services/transaction';
import { Amount } from '@pactus-wallet/wallet';
import Image from 'next/image';
import './style.css';
import Skeleton from '../common/skeleton/Skeleton';
import { searchIcon } from '@/assets';
import { useI18n } from '@/utils/i18n';

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
  const [searchQuery, setSearchQuery] = useState('');
  const headings = ['Date', 'TX Hash', 'From', 'To', 'Amount', 'Fee'];
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);

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

  const formatAmount = (value: number): string => {
    return Amount.fromString((value / 1000000000).toString()).format() + ' PAC';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="transactions-history shadow-inset" style={{ height }}>
      <div className="transactions-history__wrapper">
        {/* <div className='flex gap-[64px] items-center pb-3 pt-5 px-8 border-b-1 border-[#15191C] shadow-[0px_1px_2.2px_0px_#66666640]'>
          <div className='text-xl font-semibold'>{t("activity")}</div>
          <div className="relative flex-1">
            <Image
              src={searchIcon}
              alt=""
              width={16}
              height={16}
              className="absolute left-2 top-2/4 -translate-y-1/2 opacity-50"
              aria-hidden="true"
            />
            <input
              type="text"
              className="command-search__input !bg-[#15191C] !border-none !h-8"
              placeholder="Search by tx hash or address"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className='items-center flex rounded-md bg-[#15191C] text-xs font-medium text-[#858699] w-fit px-4 h-8 gap-3'>
            <div className='hover:text-white cursor-pointer'>{t("oneDay")}</div>
            <div className='hover:text-white cursor-pointer'>{t("oneWeek")}</div>
            <div className='hover:text-white cursor-pointer'>{t("all")}</div>
          </div>
        </div> */}
        <div className='px-8 py-6'>
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
                {hasError ? (
                <tr>
                    <td colSpan={6} className="transactions-history__empty">
                    {t("fetchTransactionFail")}
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
                        {formatDate(transaction.createdAt)}
                    </td>
                    <td className="transactions-history__cell transactions-history__cell--hash">
                        <a
                        href={`https://pacviewer.com/transaction/${transaction.hash}`}
                        target="_blank"
                        >
                        {transaction.hash}
                        </a>
                    </td>
                    <td className="transactions-history__cell flex" title={transaction.from}>
                        {transaction.from_address_alias?.icon && (
                        <Image
                            src={transaction.from_address_alias.icon}
                            alt=""
                            width={16}
                            height={16}
                            className="mr-1"
                        />
                        )}
                        <span className="text-truncate">
                        {transaction.from_address_alias?.title ?? transaction.from}
                        </span>
                    </td>
                    <td className="transactions-history__cell" title={transaction.to}>
                        <div className="flex">
                        {transaction.to_address_alias?.icon && (
                            <Image
                            src={transaction.to_address_alias.icon}
                            alt=""
                            width={16}
                            height={16}
                            className="mr-1"
                            />
                        )}
                        <span className="text-truncate">
                            {transaction.to_address_alias?.title ?? transaction.to}
                        </span>
                        </div>
                    </td>
                    <td className="transactions-history__cell">{formatAmount(transaction.value)}</td>
                    <td className="transactions-history__cell">{formatAmount(transaction.fee)}</td>
                    </tr>
                ))
                ) : !isLoading ? (
                <tr>
                    <td colSpan={6} className="transactions-history__empty">
                    {t("noTransactionFound")}
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
  );
};

export default TransactionsHistory;
