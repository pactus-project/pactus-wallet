'use client';
import React, { Suspense } from 'react'
import './style.css'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import RefetchBalance from '@/components/refetch';
import Image from 'next/image';
import { simpleLogo } from '@/assets';
import SendPac from '@/components/send';
import ReceivePac from '@/components/receive';
import BridgePac from '@/components/bridge';
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
                <div><Image src={simpleLogo} alt='simple-logo' /><p>0</p><span>PAC</span></div>
                <div><span style={{ fontSize: '15px' }} >≈ 0 USD</span></div>
                <div className='amountCtas-dashboard' ><SendPac /><ReceivePac /><BridgePac /></div>
              </div>
            </div>
            <hr />
            <div className='totalNumbers-dashboard' >
              <div>
                <div><hr /><p>Total Accounts</p></div>
                <span>0</span>
              </div>
              <div>
                <div><hr /><p>Total Transactions</p></div>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Dashboard