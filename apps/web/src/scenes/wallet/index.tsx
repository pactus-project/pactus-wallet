'use client';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { copyIcon, showPasswordIcon, simpleLogo, successIcon, searchIcon } from '@/assets';
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
import TransactionsHistory from '@/components/transactions-history';
import { transactions } from '@/assets/images/dashboard';
import type { Transaction } from '@/components/transactions-history';

const Wallet = () => {
  const { wallet, setHeaderTitle } = useContext(WalletContext);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleViewOnPacviewer = () => {
    if (wallet?.isTestnet()) {
      window.open(`https://phoenix.pacviewer.com/address/${address}`, '_blank');
    } else {
      window.open(`https://pacviewer.com/address/${address}`, '_blank');
    }
  };

  const filterTransactionsByTime = (transactions: Transaction[]) => {
    const now = new Date();
    switch (activeTimeFilter) {
      case '1D': {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return transactions.filter(tx => new Date(tx.date) >= oneDayAgo);
      }
      case '7D': {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactions.filter(tx => new Date(tx.date) >= sevenDaysAgo);
      }
      default:
        return transactions;
    }
  };

  const filteredTransactions = filterTransactionsByTime(transactions).filter(tx => {
    const search = searchTerm.toLowerCase();
    return (
      tx.txHash.toLowerCase().includes(search) ||
      tx.sender.toLowerCase().includes(search) ||
      tx.receiver.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    setHeaderTitle(`🤝 ${addressData?.label ?? ''}`);
  });

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
                      width={25} height={25}
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

        <section className="w-full ml-auto bg-surface-medium rounded-md mt-4">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h2" className="text-[#F4F7F9] text-lg font-medium">
              {t('activity')}
            </Typography>

            <div className="flex-1 flex justify-center mx-8">
              <div className="relative w-[540px]">
                <Image
                  src={searchIcon}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-40"
                />
                <input
                  type="search"
                  className="h-10 w-full bg-[#111315] rounded-md border border-[#111315] pl-9 pr-3 text-sm text-[#F4F7F9] placeholder-[#6C7275] focus:outline-none focus:border-[#0FEF9E]"
                  placeholder={t('searchByTxHashOrAddress')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 bg-[#111315] rounded-md border h-10 border-[#111315]">
              <button
                type="button"
                onClick={() => setActiveTimeFilter('1D')}
                className={`px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTimeFilter === '1D'
                    ? 'text-[#F4F7F9]'
                    : 'text-[#9BA1A6] hover:text-[#F4F7F9]'
                }`}
              >
                1D
              </button>
              <button
                type="button"
                onClick={() => setActiveTimeFilter('7D')}
                className={`px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTimeFilter === '7D'
                    ? 'text-[#F4F7F9]'
                    : 'text-[#9BA1A6] hover:text-[#F4F7F9]'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setActiveTimeFilter('All')}
                className={`px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTimeFilter === 'All'
                    ? 'text-[#F4F7F9]'
                    : 'text-[#9BA1A6] hover:text-[#F4F7F9]'
                }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="p-4">
            <TransactionsHistory transactions={filteredTransactions} />
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
