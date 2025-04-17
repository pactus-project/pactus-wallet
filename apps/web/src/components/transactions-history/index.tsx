import React from 'react';
import './style.css';

interface Transaction {
    date: string;
    txHash: string;
    sender: string;
    receiver: string;
    amount: string;
    fee: string;
}

interface TransactionsHistoryProps {
    transactions: Transaction[];
    height?: string | number;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({ transactions, height = '100%' }) => {
    const headings = ['Date', 'TX Hash', 'Sender', 'Receiver', 'Amount', 'Fee'];

    return (
        <div className="transactions-history" style={{ height }}>
            <div className="transactions-history__table" role="table" aria-label="Transaction History">
                <div className="transactions-history__header" role="rowgroup">
                    <div className="transactions-history__row" role="row">
                        {headings.map((heading, index) => (
                            <div 
                                key={`heading-${index}`} 
                                className="transactions-history__cell transactions-history__cell--header" 
                                role="columnheader"
                            >
                                {heading}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div 
                    className="transactions-history__body" 
                    role="rowgroup"
                    style={{ maxHeight: `calc(${height} - 40px)` }}
                >
                    {transactions.length > 0 ? (
                        transactions.map((transaction, rowIndex) => (
                            <div 
                                key={`transaction-${rowIndex}`} 
                                className="transactions-history__row" 
                                role="row"
                            >
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.date}
                                </div>
                                <div className="transactions-history__cell transactions-history__cell--hash" role="cell">
                                    {transaction.txHash}
                                </div>
                                <div className="transactions-history__cell text-truncate" role="cell" title={transaction.sender}>
                                    {transaction.sender}
                                </div>
                                <div className="transactions-history__cell text-truncate" role="cell" title={transaction.receiver}>
                                    {transaction.receiver}
                                </div>
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.amount}
                                </div>
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.fee}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="transactions-history__empty">
                            No transactions found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionsHistory;