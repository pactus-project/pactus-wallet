'use client';
import React, { Suspense, useState } from 'react';
import './style.css';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Image from 'next/image';
import { simpleLogo } from '@/assets';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
import { documentCopyIcon, successIcon } from '@/assets';
import QRCode from 'react-qr-code';

const Wallet = () => {
    const [copied, setCopied] = useState(false);
    const accountAddress = 'pc1rek8n7m9hra4w0zlwsmufndrxftemkever9lsdy';

    const handleCopy = () => {
        navigator.clipboard.writeText('pc1rek8n7m9hra4w0zlwsmufndrxftemkever9lsdy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="container-wallet">
                <Sidebar />
                <div className="content-wallet">
                    <Header title="🤝 Account 1" />
                    <div className="section1-wallet">
                        <div>
                            <div className="address-row">
                                <div className="qr-code-container">
                                    <QRCode
                                        value={accountAddress}
                                        size={214}
                                        level="H"
                                    />
                                </div>
                                <div className="amountSection-wallet">
                                    <h1>Balance</h1>
                                    <div className="amount-row">
                                        <Image src={simpleLogo} alt="simple-logo" />
                                        <p>45778</p>
                                        <span>PAC</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '15px' }}>≈ 2343.56 USD</span>
                                    </div>

                                    <div className="address-wallet">
                                        <div className="address-label">Account Address:</div>
                                    </div>

                                    <div className="address-row">
                                        <div className="address-value">
                                            {accountAddress}
                                        </div>
                                        <button title="copy seed" onClick={() => handleCopy()}>
                                            <Image
                                                src={copied ? successIcon : documentCopyIcon}
                                                alt="copy-icon"
                                                width={16}
                                                height={16}
                                            />
                                        </button>
                                    </div>

                                    <div className="amountCtas-wallet">
                                        <SendPac />
                                        <BridgePac />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default Wallet;
