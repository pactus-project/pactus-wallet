'use client';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { copyIcon, showPasswordIcon, simpleLogo, successIcon } from '@/assets';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
import { useAccount } from '@/wallet/hooks/use-account';
import { useSearchParams } from 'next/navigation';
import { useBalance } from '@/wallet/hooks/use-balance';
import ShowPrivateKeyModal from '@/components/password-modal';
import { WalletContext } from '@/wallet';
import { useI18n } from '@/utils/i18n';
import Typography from '../../components/common/Typography';
import QRCode from 'react-qr-code';
import Button from '@/components/Button';
import AddressInfoModal from '@/components/address-infom-modal';
import Skeleton from '@/components/common/skeleton/Skeleton';
import pacviewIcon from '@/assets/images/icons/pacview-icon.svg';
import linkIcon from '@/assets/images/icons/link-icon.svg';
const Wallet = () => {
  const { wallet, setHeaderTitle } = useContext(WalletContext);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);

  const { getAccountByAddress } = useAccount();
  const searchParams = useSearchParams();
  const address = searchParams?.get('address') ?? '';
  const addressData = address ? getAccountByAddress(address) : null;
  const { balance, isLoading } = useBalance(addressData?.address);
  const { t } = useI18n();
  const handleCopy = () => {
    navigator.clipboard.writeText(addressData?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPrivateKey = () => {
    setShowPasswordModal(true);
  };

  useEffect(() => {
    setHeaderTitle(`🤝 ${addressData?.label ?? ''}`);
  });

  const handleViewOnPacviewer = () => {
    if (wallet?.isTestnet()) {
      window.open(`https://phoenix.pacviewer.com/address/${address}`, '_blank');
    } else {
      window.open(`https://pacviewer.com/address/${address}`, '_blank');
    }
  };

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <div className="pt-4 px-4 md:px-7">
        <section className="w-full ml-auto bg-surface-medium rounded-md shadow-inset">
          <div className="flex gap-4 md:gap-6 p-4 md:p-6 w-full">
            <div className="flex flex-col justify-center bg-white rounded-md p-4 w-[214px] h-[214px] min-w-[214px] min-h-[214px]">
              <QRCode
                value={addressData?.address ?? ''}
                level="H"
                size={214}
                aria-label="QR code for wallet address"
                className="rounded-md w-full h-full"
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="flex items-center">
                <Typography variant="body1" color="text-quaternary" className="font-medium">
                  {t('balance')}
                </Typography>
                <button
                  className="ml-auto"
                  onClick={handleShowPrivateKey}
                  title={t('showPrivateKey')}
                >
                  <Image src={showPasswordIcon} alt="" width={24} height={24} />
                </button>
              </div>

              {isLoading ? (
                <Skeleton radius="6px" width="400px" height="45px" />
              ) : (
                <div className="flex items-center gap-2">
                  <Image src={simpleLogo} alt="Pactus logo" />
                  <Typography
                    variant="h1"
                    color="text-quaternary"
                    className="font-medium text-[24px] md:text-[30px]"
                  >
                    {balance}
                  </Typography>
                  <Typography variant="h2" color="text-disabled" className="font-medium mt-1">
                    PAC
                  </Typography>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4">
                <Typography variant="caption1" color="text-quaternary">
                  {t('accountAddress')}:
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant="caption1" className="break-all">
                    {addressData?.address ?? ''}
                  </Typography>
                  <button
                    onClick={handleCopy}
                    aria-label="Copy address to clipboard"
                    title="Copy address to clipboard"
                    className="flex-shrink-0 w-fit"
                  >
                    <Image
                      src={copied ? successIcon : copyIcon}
                      alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                      width={25}
                      height={25}
                    />
                  </button>
                  <button onClick={() => setShowPublicKeyModal(true)} title={t('showPublicKey')}>
                    <Image src={linkIcon} alt="" width={24} height={24} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <SendPac address={addressData?.address ?? ''} />
                <BridgePac />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleViewOnPacviewer}
                  aria-label={t('bridge')}
                  className="w-fit h-[38px]"
                  fullWidth
                  startIcon={
                    <Image src={pacviewIcon} alt="" width={20} height={20} aria-hidden="true" />
                  }
                >
                  {t('checkOnExplorer')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ShowPrivateKeyModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        address={addressData?.address ?? ''}
      />
      <AddressInfoModal
        isOpen={showPublicKeyModal}
        onClose={() => setShowPublicKeyModal(false)}
        privateKeyHex={wallet?.getAddressInfo(address)?.publicKey ?? ''}
        title={t('showPublicKey')}
        label={t('publicKey')}
        copyTitle={t('copyPublicKey')}
        extraInfo={wallet?.getAddressInfo(address)?.path}
        extraInfoTitle={t('hdPath')}
        extraInfoCopyTitle={t('copyHDPath')}
      />
    </Suspense>
  );
};

export default Wallet;
