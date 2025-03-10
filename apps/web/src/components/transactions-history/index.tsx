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
        <div className="container-TransactionsHistory" style={{ height: height }}>
            <div className="grid-header">
                {headings.map((item, i) => (
                    <div key={i} className="grid-header-cell">{item}</div>
                ))}
            </div>
            <div className="grid-body" style={{ maxHeight: `calc(${height} - 40px)` }}>
                {transactions.map((transaction, i) => (
                    <div key={i} className="grid-row">
                        <div className="grid-cell">{transaction.date}</div>
                        <div className="grid-cell gradientTxHash-TransactionsHistory">{transaction.txHash}</div>
                        <div className="grid-cell">{transaction.sender}</div>
                        <div className="grid-cell">{transaction.receiver}</div>
                        <div className="grid-cell">{transaction.amount}</div>
                        <div className="grid-cell">{transaction.fee}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionsHistory;