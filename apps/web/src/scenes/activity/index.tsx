"use client";
import React, { Suspense } from 'react'
import './style.css'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import Image from 'next/image';
import TransactionsHistory from '@/components/transactions-history';
import { searchIcon, transactions } from '@/assets';

const Activity = () => {
  return (
    <Suspense fallback={<div className="loading-container" aria-label="Loading">Loading...</div>}>
      <main className="activity">
        <Sidebar />
        <div className="activity__content">
          <Header title="Activity" />
          <section className="activity__transactions">
            <div className="activity__filters">
              <div className="activity__search">
                <label htmlFor="search-transactions" className="visually-hidden">
                  Search transactions
                </label>
                <Image 
                  src={searchIcon} 
                  alt="" 
                  aria-hidden="true" 
                  width={16} 
                  height={16}
                  className="activity__search-icon"
                />
                <input 
                  id="search-transactions"
                  className="activity__search-input"
                  type="search"
                  placeholder="Search by tx hash or address"
                />
              </div>
              
              <div className="activity__time-filter">
                <button 
                  type="button" 
                  className="activity__filter-button"
                  aria-pressed="false"
                >
                  1D
                </button>
                <button 
                  type="button" 
                  className="activity__filter-button"
                  aria-pressed="false"
                >
                  7D
                </button>
                <button 
                  type="button" 
                  className="activity__filter-button activity__filter-button--active"
                  aria-pressed="true"
                >
                  All
                </button>
              </div>
            </div>
            
            <hr className="activity__divider" />
            
            <div className="activity__transactions-list">
              <TransactionsHistory transactions={transactions} height={'90%'} />
            </div>
          </section>
        </div>
      </main>
    </Suspense>
  )
}

export default Activity