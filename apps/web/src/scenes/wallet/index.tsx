'use client';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import './style.css';
import Image from 'next/image';
import { copyIcon, showPasswordIcon, simpleLogo, successIcon } from '@/assets';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
import QRCode from 'react-qr-code';
import { useAccount, AddressInfo } from '@/wallet/hooks/use-account';
import { useSearchParams } from 'next/navigation';
import { useBalance } from '@/wallet/hooks/use-balance';
import ShowPrivateKeyModal from '@/components/password-modal';
import PrivateKeyDisplayModal from '@/components/address-infom-modal';
import { WalletContext } from '@/wallet';

const Wallet = () => {
  const { setHeaderTitle } = useContext(WalletContext);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState<(AddressInfo & { privateKeyHex: string }) | null>(
    null
  );
  const { getAccountByAddress } = useAccount();
  const searchParams = useSearchParams();
  const address = searchParams?.get('address') ?? '';
  const addressData = address ? getAccountByAddress(address) : null;
  const { balance } = useBalance(addressData?.address);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressData?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPrivateKey = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = (result: {
    privateKeyHex: string;
    address?: string;
    publicKey?: string;
    label?: string;
    path?: string;
  }) => {
    const addressInfo = {
      ...result,
      address: result.address ?? '',
      publicKey: result.publicKey ?? '',
      path: result.path ?? '',
      label: result.label ?? '',
    } as AddressInfo & { privateKeyHex: string };
    setAddressInfo(addressInfo);
    setShowPrivateKeyModal(true);
  };

  useEffect(() => {
    setHeaderTitle(`🤝 ${addressData?.label ?? ''}`);
  });

  return (
    <Suspense fallback={<div className="wallet__loading">Loading...</div>}>
      <div className='pt-4 px-7'>
        <section className="wallet__balance-card">
          <div className="wallet__balance-container">
            <div className="wallet__account-info">
              <div className="wallet__qr-code">
                <QRCode
                  value={addressData?.address ?? ''}
                  size={214}
                  level="H"
                  aria-label="QR code for wallet address"
                />
              </div>

              <div className="wallet__details">
                <div className="balance-container">
                  <h2 className="wallet__balance-heading">Balance</h2>
                  <button className="wallet__show-private-key" onClick={handleShowPrivateKey}>
                    <Image src={showPasswordIcon} alt="" width={24} height={24} />
                  </button>
                </div>

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
                      {addressData?.address ?? ''}
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
      <ShowPrivateKeyModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordVerified={handlePasswordVerified}
        address={addressData?.address ?? ''}
      />

      {addressInfo && (
        <PrivateKeyDisplayModal
          isOpen={showPrivateKeyModal}
          onClose={() => setShowPrivateKeyModal(false)}
          addressInfo={addressInfo}
          privateKeyHex={addressInfo.privateKeyHex ?? ''}
        />
      )}
    </Suspense>
  );
};

export default Wallet;
