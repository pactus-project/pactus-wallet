"use client";
import React, { Suspense } from 'react'
import './style.css'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import RefetchBalance from '@/components/refetch';
import Image from 'next/image';
import { comingSoonChart, searchIcon, simpleLogo, transactions } from '@/assets';
import SendPac from '@/components/send';
import ReceivePac from '@/components/receive';
import BridgePac from '@/components/bridge';
import TransactionsHistory from '@/components/transactions-history';
const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='container-dashboard' >
        <Sidebar />
        <div className='content-dashboard'>
          <Header title='Overview' />
          <div className='section1-dashboard'>
            <div>
              <div className='amountSection-dashboard' >
                <h1>Total Balance<RefetchBalance /></h1>
                <div><Image src={simpleLogo} alt='simple-logo' /><p>45778</p><span>PAC</span></div>
                <div><span style={{ fontSize: '15px' }} >≈ 2343.56 USD</span></div>
                <div className='amountCtas-dashboard' ><SendPac /><ReceivePac /><BridgePac /></div>
              </div>
              <div className='chart-dashboard' >
                <Image src={comingSoonChart} fill alt='chart' />
                <label>coming soon...</label>
              </div>
            </div>
            <hr />
            <div className='totalNumbers-dashboard' >
              <div>
                <div><hr /><p>Total Accounts</p></div>
                <span>2</span>
              </div>
              <div>
                <div><hr /><p>Total Transactions</p></div>
                <span>15</span>
              </div>
            </div>
          </div>
          <div className='transactionsContainer-dashboard'>
            <div className='headerTransaction-dashboard' >
              <h3>Overall Activity</h3>
              <div className='searchTransactions-dashboard' >
                <Image src={searchIcon} alt='search-icon' /><input placeholder='Search by tx hash or address' />
              </div>
              <div className='filterTransactions-dashboard'><button>1D</button><button>7D</button><button style={{color:'#FFF'}} >All</button></div></div>
            <hr />
            <div className='transactions-dashboard' >
              <TransactionsHistory transactions={transactions} height={'400px'} />
            </div>

          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Dashboard