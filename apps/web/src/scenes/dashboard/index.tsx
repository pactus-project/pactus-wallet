'use client';
import React, { useEffect, useContext, useState } from 'react';
import './style.css';
import RefetchBalance from '@/components/refetch';
import Image from 'next/image';
import { simpleLogo } from '@/assets';
import SendPac from '@/components/send';
import ReceivePac from '@/components/receive';
import BridgePac from '@/components/bridge';
import { useBalance } from '@/wallet/hooks/use-balance';
import { useAccount } from '@/wallet/hooks/use-account';
import { WalletContext } from '@/wallet';
import Typography from '../../components/common/Typography';
import { useI18n } from '@/utils/i18n';
import Skeleton from '@/components/common/skeleton/Skeleton';
const Dashboard = () => {
  const [ isLoadingFull, setIsLoadingFull ] = useState(true);
  const { balance, fetchBalance, isLoading } = useBalance();
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const { t } = useI18n();
  useEffect(() => {
    // Fetch balance initially
    fetchBalance().finally(() => setIsLoadingFull(false));
  }, [fetchBalance]);

  const handleRefresh = () => {
    fetchBalance();
  };

  const { setHeaderTitle, setEmoji } = useContext(WalletContext);

  useEffect(() => {
    setHeaderTitle('Overview');
    setEmoji('');
  }, []);

  return (
    <div className="pt-4 px-7">
      <section className="dashboard__summary rounded-md pt-4">
        <div className="dashboard__balance-container">
          {isLoadingFull ? <div className="flex flex-col gap-4">
            <Skeleton height="24px" width="150px" />
            <Skeleton height="45px" width="200px" />
            <div className='flex gap-4'>
              <Skeleton width="120px" height="38px" />
              <Skeleton width="120px" height="38px" />
              <Skeleton width="120px" height="38px" />
            </div>
          </div> : <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Typography variant="body1" color="text-quaternary" className="font-medium">
                {t('totalBalance')}
              </Typography>
              <RefetchBalance onRefresh={handleRefresh} isLoading={isLoading} />
            </div>

            {isLoading ? <Skeleton height="45px" width="200px" /> : <div className="flex items-center gap-2">
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
            </div>}

            <div className="dashboard__actions">
              <SendPac address={''} />
              <ReceivePac />
              <BridgePac />
            </div>
          </div>}
        </div>

        <hr className="dashboard__divider" />

        <div className="dashboard__stats">
          <div className="dashboard__stat-item">
            <div className="dashboard__stat-header">
              <hr className="dashboard__stat-indicator" />
              <p className="dashboard__stat-title">Total Accounts</p>
            </div>
            <span className="dashboard__stat-value">{accounts.length}</span>
          </div>

          <div className="dashboard__stat-item">
            <div className="dashboard__stat-header">
              <hr className="dashboard__stat-indicator" />
              <p className="dashboard__stat-title">Total Transactions</p>
            </div>
            <span className="dashboard__stat-value">0</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
