import React, { useEffect, useRef } from 'react';
import { Transaction } from '@/services/transaction';
import { Amount } from '@pactus-wallet/wallet';
import Image from 'next/image';
import './style.css';

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
    hasError = false
}) => {
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
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="transactions-history" style={{ height }}>
            <div className="transactions-history__wrapper">
                <table className="transactions-history__table">
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
                                    Failed to fetch transactions. Please try again later.
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction, rowIndex) => (
                                <tr
                                    key={transaction.id}
                                    className="transactions-history__row"
                                    ref={rowIndex === transactions.length - 1 ? lastElementRef : null}
                                >
                                    <td className="transactions-history__cell">
                                        {formatDate(transaction.createdAt)}
                                    </td>
                                    <td className="transactions-history__cell transactions-history__cell--hash">
                                        <a href={`https://pacviewer.com/transaction/${transaction.hash}`} target='_blank'>{transaction.hash}</a>
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
                                        <span className='text-truncate'>{transaction.from_address_alias?.title ?? transaction.from}</span>
                                    </td>
                                    <td className="transactions-history__cell" title={transaction.to}>
                                        <div className='flex'>
                                        {transaction.to_address_alias?.icon && (
                                            <Image
                                                src={transaction.to_address_alias.icon}
                                                alt=""
                                                width={16}
                                                height={16}
                                                className="mr-1"
                                            />
                                        )}
                                        <span className='text-truncate'>{transaction.to_address_alias?.title ?? transaction.to}</span>
                                        </div>
                                    </td>
                                    <td className="transactions-history__cell">
                                        {formatAmount(transaction.value)}
                                    </td>
                                    <td className="transactions-history__cell">
                                        {formatAmount(transaction.fee)}
                                    </td>
                                </tr>
                            ))
                        ) : !isLoading ? (
                            <tr>
                                <td colSpan={6} className="transactions-history__empty">
                                    No transactions found
                                </td>
                            </tr>
                        ) : null}
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="transactions-history__loading">
                                    Loading more transactions...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsHistory;
