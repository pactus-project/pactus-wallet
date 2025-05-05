'use client';
import React, { Suspense, useEffect } from 'react';
import './style.css';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import RefetchBalance from '@/components/refetch';
import Image from 'next/image';
import { simpleLogo } from '@/assets';
import SendPac from '@/components/send';
import ReceivePac from '@/components/receive';
import BridgePac from '@/components/bridge';
import { useBalance } from '@/wallet/hooks/use-balance';
import { useAccount } from '@/wallet/hooks/use-account';

const Dashboard = () => {
  const { balance, fetchBalance, isLoading } = useBalance();
  const { getAccountList } = useAccount();
  const accounts = getAccountList();

  useEffect(() => {
    // Fetch balance initially
    fetchBalance();
  }, [fetchBalance]);

  const handleRefresh = () => {
    fetchBalance();
  };

  return (
    <Suspense
      fallback={
        <div className="dashboard__loading" aria-label="Loading dashboard">
          <span className="visually-hidden">Loading dashboard content</span>
          Loading...
        </div>
      }
    >
      <main className="dashboard">
        <Sidebar />
        <div className="dashboard__content">
          <Header title="Overview" />

          <section className="dashboard__summary">
            <div className="dashboard__balance-container">
              <div className="dashboard__balance-section">
                <div className="dashboard__balance-header">
                  <h2 className="dashboard__balance-title">Total Balance</h2>
                  <RefetchBalance onRefresh={handleRefresh} isLoading={isLoading} />
                </div>

                <div className="dashboard__balance-amount">
                  <Image src={simpleLogo} alt="Pactus logo" className="wallet__currency-icon" />

                  <p className="dashboard__balance-value">{balance}</p>
                  <span className="dashboard__balance-currency">PAC</span>
                </div>

                <div className="dashboard__balance-fiat">
                  <span className="dashboard__fiat-value">≈ 0 USD</span>
                </div>

                <div className="dashboard__actions">
                  <SendPac />
                  <ReceivePac />
                  <BridgePac />
                </div>
              </div>
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
      </main>
    </Suspense>
  );
};

export default Dashboard;
