'use client';
import React, { useEffect, useState } from 'react';
import './style.css';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  documentationIcon,
  FAQsIcon,
  gradientArrowToRightIcon,
  gradientCopyIcon,
  lockIcon,
  overviewIcon,
  plusIcon,
  ReportIcon,
  searchIcon,
  settingsIcon,
} from '@/assets';
import BorderBeam from '../border-beam';
import { useWallet } from '@/wallet';
import { useAccount } from '@/wallet/hooks/use-account';
import AddAccountModal from '../add-account-modal';
import { PATHS } from '@/constants/paths';
import { useI18n } from '../../utils/i18n';

// External links
const REPOSITORY_URL = 'https://github.com/pactus-project/pactus-wallet/issues/new/choose';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

// Function to prevent linter errors with empty arrow functions
const noop = () => {
  /* Intentionally empty */
};

const Sidebar = ({ isOpen = true, onClose = noop, isMobile = false }: SidebarProps) => {
  const { wallet } = useWallet();
  const { getAccountList } = useAccount();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const navigate = useRouter().push;

  const { t } = useI18n();
  const openAddAccountModal = () => {
    setIsAddAccountModalOpen(true);
  };

  const closeAddAccountModal = () => {
    setIsAddAccountModalOpen(false);
  };

  const parseRoute = (route: string) => {
    const [path, queryString] = route.split('?');
    const queryParams = new URLSearchParams(queryString);
    return { path, queryParams };
  };

  const isActiveRoute = (route: string) => {
    const { path, queryParams } = parseRoute(route);
    if (pathname !== path) return false;
    for (const [key, value] of queryParams) {
      if (searchParams?.get(key) !== value) return false;
    }
    return true;
  };

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.sidebar') && isOpen) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile, onClose]);

  return (
    <aside className={`sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : 'closed'}`}>
      {isMobile && (
        <button
          type="button"
          className="sidebar__close-button"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <div className={`sidebar__header ${isMobile ? 'mt-4' : ''}`}>
        <div className={`sidebar__wallet-info ${isMobile ? 'mt-4' : ''}`}>
          <span className="sidebar__wallet-emoji">😀</span>
          <h2 className="sidebar__wallet-name">{wallet?.getName()}</h2>
          <Image src={lockIcon} alt="Wallet is locked" className="sidebar__lock-icon" />
        </div>

        <div className="sidebar__actions">
          <button
            type="button"
            className="sidebar__action-button sidebar__add-button"
            onClick={openAddAccountModal}
            aria-label="Add new account"
          >
            <Image src={plusIcon} alt="" aria-hidden="true" width={15} height={15} />
            <span>{t('addAccount')}</span>
          </button>

          <button
            type="button"
            className="sidebar__action-button sidebar__search-button"
            aria-label="Search accounts"
          >
            <Image src={searchIcon} alt="" aria-hidden="true" width={16} height={16} />
          </button>
        </div>
      </div>

      <nav className="sidebar__nav">
        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute(PATHS.HOME) ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => navigate(PATHS.HOME)}
          aria-current={isActiveRoute(PATHS.HOME) ? 'page' : undefined}
        >
          <Image src={overviewIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Overview</span>
        </button>

        <div className="sidebar__accounts">
          <div className="sidebar__accounts-divider">
            <hr />
            <div className="sidebar__account-list">
              {getAccountList()?.map((item, i) => (
                <button
                  type="button"
                  className={`sidebar__account-item ${isActiveRoute(`/wallet?address=${item?.address}`) ? 'sidebar__account-item--active' : ''}`}
                  onClick={() => navigate(`/wallet?address=${item?.address}`)}
                  key={`${i}-account`}
                  aria-current={
                    isActiveRoute(`/wallet?address=${item?.address}`) ? 'page' : undefined
                  }
                >
                  <span className="sidebar__account-emoji">{item.emoji}</span>
                  <span className="sidebar__account-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          onClick={() => navigate(PATHS.SETTING_GENERAL)}
          className={`sidebar__nav-item ${[PATHS.SETTING_GENERAL, PATHS.WALLET_MANAGER, PATHS.NODE_MANAGER].includes(pathname) ? 'sidebar__nav-item--active' : ''}`}
          aria-current={isActiveRoute(PATHS.SETTING_GENERAL) ? 'page' : undefined}
        >
          <Image src={settingsIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Settings</span>
        </button>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/documentation') ? 'sidebar__nav-item--active' : ''}`}
          aria-current={isActiveRoute('/documentation') ? 'page' : undefined}
        >
          <Image src={documentationIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Documentation</span>
        </button>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/frequently-asked-questions') ? 'sidebar__nav-item--active' : ''}`}
          aria-current={isActiveRoute('/frequently-asked-questions') ? 'page' : undefined}
        >
          <Image src={FAQsIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">FAQs</span>
        </button>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/report-bug') ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => window.open(REPOSITORY_URL, '_blank')}
          aria-current={isActiveRoute('/report-bug') ? 'page' : undefined}
        >
          <Image src={ReportIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Report Bug</span>
        </button>

        <div id="contributing-parent" className="sidebar__contributing">
          <div className="sidebar__contributing-icon w-[32px] h-[32px]">
            <Image src={gradientCopyIcon} alt="" aria-hidden="true" />
          </div>
          <div className="sidebar__contributing-content">
            <h4 className="sidebar__contributing-title">Contributing</h4>
            <p className="sidebar__contributing-description">
              You can contribute to the Pactus wallet project at any time.``
            </p>
            <a
              href="https://github.com/pactus-project/pactus-wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar__contributing-link"
            >
              Join <Image src={gradientArrowToRightIcon} alt="" aria-hidden="true" />
            </a>
          </div>
          <BorderBeam duration={4} size={100} parentId="contributing-parent" />
        </div>
      </div>

      <AddAccountModal isOpen={isAddAccountModalOpen} onClose={closeAddAccountModal} />
    </aside>
  );
};

export default Sidebar;
