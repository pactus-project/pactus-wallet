'use client';
import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { copyIcon, pactusLogo, showPasswordIcon, simpleLogo, successIcon } from '@/assets';
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
import { fetchAccountTransactions, Transaction } from '@/services/transaction';
import { Mobile, Tablet } from '@/components/responsive';
import { formatPactusAddress } from '../../utils/common';
import { PACVIEWER_URL } from '../../utils/constants';

const Wallet = () => {
  const { wallet, setHeaderTitle, setEmoji } = useContext(WalletContext);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);
  const { getAccountByAddress } = useAccount();
  const searchParams = useSearchParams();
  const address = searchParams?.get('address') ?? '';
  const addressData = address ? getAccountByAddress(address) : null;
  const { balance, isLoading } = useBalance(addressData?.address);
  const { t } = useI18n();

  // Transaction loading state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [hasTransactionError, setHasTransactionError] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressData?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPrivateKey = () => {
    setShowPasswordModal(true);
  };

  const handleViewOnExplorer = () => {
    if (wallet?.isTestnet()) {
      window.open(`${PACVIEWER_URL.TESTNET}/address/${address}`, '_blank');
    } else {
      window.open(`${PACVIEWER_URL.MAINNET}/address/${address}`, '_blank');
    }
  };

  const loadTransactions = useCallback(async () => {
    if (!addressData?.address || isLoadingTransactions || !hasMore) return;

    setIsLoadingTransactions(true);
    setHasTransactionError(false);
    try {
      const response = await fetchAccountTransactions(addressData.address, pageNo);
      const {
        data: { data: newTransactions, total_items: totalItems },
      } = response;

      setTransactions(prev => [...prev, ...newTransactions]);
      setHasMore(transactions.length + newTransactions.length < totalItems);
      setPageNo(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setHasTransactionError(true);
      setHasMore(false);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [addressData?.address, pageNo, hasMore, isLoadingTransactions, transactions.length]);

  // Reset transactions when address changes
  useEffect(() => {
    setTransactions([]);
    setPageNo(1);
    setHasMore(true);
    setHasTransactionError(false);
    loadTransactions();
  }, [addressData?.address]);

  useEffect(() => {
    setHeaderTitle(addressData?.label ?? '');
    setEmoji(addressData?.emoji ?? '🤝');
  }, [addressData?.label, addressData?.emoji, setHeaderTitle, setEmoji]);

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <Tablet>
        <div className="pt-4 px-4 md:px-7 pb-7">
          <section className="w-full ml-auto bg-surface-medium rounded-md shadow-inset">
            <div className="flex gap-4 md:gap-6 p-4 md:p-6 w-full">
              <div className="relative h-fit">
                <div className="flex flex-col justify-center bg-white rounded-md p-4 w-[214px] h-[214px] min-w-[214px] min-h-[214px]">
                  <QRCode
                    value={formatPactusAddress(addressData?.address ?? '')}
                    level="H"
                    size={214}
                    aria-label="QR code for wallet address"
                    className="rounded-md w-full h-full"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 w-[48px] h-[48px] rounded-full overflow-hidden bg-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                  <Image unoptimized src={pactusLogo} alt="" width={40} height={40} />
                </div>
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
                  <Skeleton width="100px" height="30px" />
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
                    <button
                      onClick={() => setShowPublicKeyModal(true)}
                      title={t('showPublicKey')}
                      className="flex-shrink-0 w-fit"
                    >
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
                    onClick={handleViewOnExplorer}
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
            <div>
              <TransactionsHistory
                transactions={transactions}
                onLoadMore={loadTransactions}
                isLoading={isLoadingTransactions}
                hasMore={hasMore}
                hasError={hasTransactionError}
              />
            </div>
          </section>
        </div>
      </Tablet>
      <Mobile>
        <div className="flex flex-col gap-4 items-center py-4">
          <div className="flex items-center justify-between pr-4 pl-7 w-full">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-md bg-surface-light flex justify-center items-center">
                <Image src={simpleLogo} alt="Pactus logo" />
              </div>
              <div>
                <div className="text-lg text-white font-bold">Pactus</div>
                <div className="text-tertiary">PAC</div>
              </div>
            </div>
            <div>
              <div>{balance} PAC</div>
            </div>
          </div>
          <div>
            <div className="relative h-fit w-fit">
              <div className="flex flex-col justify-center bg-white rounded-md p-4 w-[214px] h-[214px] min-w-[214px] min-h-[214px]">
                <QRCode
                  value={formatPactusAddress(addressData?.address ?? '')}
                  level="H"
                  size={214}
                  aria-label="QR code for wallet address"
                  className="rounded-md w-full h-full"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 w-[48px] h-[48px] rounded-full overflow-hidden bg-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                <Image unoptimized src={pactusLogo} alt="" width={40} height={40} />
              </div>
            </div>
          </div>
          <div className="w-full pl-7 pr-4">
            <div className="flex flex-col gap-2 pt-4">
              <Typography variant="caption1" color="text-quaternary text-sm">
                {t('accountAddress')}:
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="caption1" className="break-all text-sm">
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
                <button
                  onClick={() => setShowPublicKeyModal(true)}
                  title={t('showPublicKey')}
                  className="flex-shrink-0 w-fit"
                >
                  <Image src={linkIcon} alt="" width={24} height={24} />
                </button>
              </div>
            </div>
            <div className='w-full flex justify-center mt-2 gap-4'>
              <SendPac address={addressData?.address ?? ''} />
              <BridgePac />
            </div>
          </div>
          <div className="w-full pl-7 pr-4 mt-12">
            <div className="flex justify-between items-center w-full mb-4">
              <div className='text-xl font-semibold'>Activity</div>
              {/* <div className='text-sm font-medium underline'>See all</div> */}
            </div>
            <TransactionsHistory
              transactions={transactions}
              onLoadMore={loadTransactions}
              isLoading={isLoadingTransactions}
              hasMore={hasMore}
              hasError={hasTransactionError}
            />
          </div>
        </div>
      </Mobile>
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
