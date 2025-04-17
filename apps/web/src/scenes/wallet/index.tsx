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
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const addressInfo = address ? getAccountByAddress(address) : null;
  const { balance } = useBalance(addressInfo?.address);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressInfo?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Suspense fallback={<div className="wallet__loading">Loading...</div>}>
      <main className="wallet">
        <Sidebar />
        <div className="wallet__content">
          <Header title={`🤝 ${addressInfo?.label ?? ''}`} />

          <section className="wallet__balance-card">
            <div className="wallet__balance-container">
              <div className="wallet__account-info">
                <div className="wallet__qr-code">
                  <QRCode
                    value={addressInfo?.address ?? ''}
                    size={214}
                    level="H"
                    aria-label="QR code for wallet address"
                  />
                </div>

                <div className="wallet__details">
                  <h2 className="wallet__balance-heading">Balance</h2>

                  <div className="wallet__balance-amount">
                    <Image src={simpleLogo} alt="Pactus logo" className="wallet__currency-icon" />
                    <p className="wallet__balance-value">{balance}</p>
                    <span className="wallet__currency-code">PAC</span>
                  </div>

                  <p className="wallet__balance-fiat">≈ 0 USD</p>

                  <div className="wallet__address-container">
                    <h3 className="wallet__address-label">Account Address:</h3>

                    <div className="wallet__address-row">
                      <span className="wallet__address-value text-truncate" id="wallet-address">
                        {addressInfo?.address ?? ''}
                      </span>
                      <button
                        className="wallet__copy-button"
                        onClick={handleCopy}
                        aria-label="Copy address to clipboard"
                        title="Copy address to clipboard"
                      >
                        <Image
                          src={copied ? successIcon : copyIcon}
                          alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                          width={25}
                          height={25}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="wallet__actions">
                    <SendPac />
                    <BridgePac />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Suspense>
  );
};

export default Wallet;
