'use client';
import React, { Suspense, useState } from 'react';
import './style.css';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Image from 'next/image';
import { copyIcon, simpleLogo, successIcon } from '@/assets';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
import QRCode from 'react-qr-code';
import { useAccount } from '@/wallet/hooks/use-account';
import { useSearchParams } from 'next/navigation';
import { useBalance } from '@/wallet/hooks/use-balance';

const Wallet = () => {
  const [copied, setCopied] = useState(false);
  const { getAccountByAddress } = useAccount();
  const { balance } = useBalance();
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const addressInfo = address ? getAccountByAddress(address) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(addressInfo?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container-wallet">
        <Sidebar />
        <div className="content-wallet">
          <Header title={`🤝 ${addressInfo?.label ?? ''}`} />
          <div className="section1-wallet">
            <div>
              <div className="address-row">
                <div className="qr-code-container">
                  <QRCode value={addressInfo?.address ?? ''} size={214} level="H" />
                </div>
                <div className="amountSection-wallet">
                  <h1>Balance</h1>
                  <div className="amount-row">
                    <Image src={simpleLogo} alt="simple-logo" />
                    <p>{balance}</p>
                    <span>PAC</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '15px' }}>≈ {balance}USD</span>
                  </div>

                  <div className="address-wallet">
                    <div className="address-label">Account Address:</div>
                  </div>

                  <div className="address-row">
                    <div className="address-value">{addressInfo?.address ?? ''}</div>
                    <button title="copy address" onClick={() => handleCopy()}>
                      <Image
                        src={copied ? successIcon : copyIcon}
                        alt="copy-icon"
                        width={25}
                        height={25}
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
