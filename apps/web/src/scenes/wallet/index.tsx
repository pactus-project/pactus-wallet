"use client";

import React, { Suspense } from 'react'
import './style.css'
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Image from 'next/image';
import TransactionsHistory from '@/components/transactions-history';
import { searchIcon, simpleLogo, transactions } from '@/assets';
import RefetchBalance from '@/components/refetch-balance';
import SendPac from '@/components/send-pac';
import BridgePac from '@/components/bridge-pac';
const Wallet = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className='container-wallet' >
                <Sidebar />
                <div className='content-wallet'>
                    <Header title='🤝 Account 1' />
                    <div className='section1-wallet'>
                        <div>
                            <div className='amountSection-wallet' >
                                <h1>Balance<RefetchBalance /></h1>
                                <div><Image src={simpleLogo} alt='simple-logo' /><p>45778</p><span>PAC</span></div>
                                <div><span style={{ fontSize: '15px' }} >≈ 2343.56 USD</span></div>
                                <div className='amountCtas-wallet' ><SendPac /><BridgePac /></div>
                            </div>
                        </div>
                    </div>
                    <div className='transactionsContainer-wallet'>
                        <div className='headerTransaction-wallet' >
                            <h3>Activity</h3>
                            <div className='searchTransactions-wallet' >
                                <Image src={searchIcon} alt='search-icon' /><input placeholder='Search by tx hash or address' />
                            </div>
                            <div className='filterTransactions-wallet'><button>1D</button><button>7D</button><button style={{ color: '#FFF' }} >All</button></div></div>
                        <hr />
                        <div className='transactions-wallet' >
                            <TransactionsHistory transactions={transactions} height={'474px'} />
                        </div>

                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default Wallet