"use client";
import React, { Suspense } from 'react'
import './style.css'
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Image from 'next/image';
import {  simpleLogo } from '@/assets';
import RefetchBalance from '@/components/refetch';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
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
                </div>
            </div>
        </Suspense>
    )
}

export default Wallet