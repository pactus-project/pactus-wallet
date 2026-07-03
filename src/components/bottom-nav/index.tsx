'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { overviewIcon, sendIcon, receiveIcon, settingsIcon } from '@/assets';
import { PATHS } from '@/constants/paths';
import { useI18n } from '@/utils/i18n';
import SendPac from '../send';
import ReceivePac from '../receive';
import './style.css';

const SETTINGS_PATHS: string[] = [
  PATHS.SETTING_GENERAL,
  PATHS.WALLET_MANAGER,
  PATHS.NODE_MANAGER,
  PATHS.SETTING_ABOUT,
];

interface TabProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
    className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-opacity ${
      isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
    }`}
  >
    <Image src={icon} alt="" width={22} height={22} aria-hidden="true" />
    <span className="text-[10px] font-medium text-quaternary">{label}</span>
  </button>
);

// Bottom navigation shown only on mobile (hidden at >=769px, matching the
// header hamburger breakpoint). Overview/Settings navigate; Send/Receive reuse
// the existing transaction modals via their custom-trigger prop.
const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { t } = useI18n();

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40 items-stretch border-t border-surface-light bg-surface-medium"
      aria-label={t('overview')}
    >
      <Tab
        icon={overviewIcon}
        label={t('overview')}
        isActive={pathname === PATHS.HOME}
        onClick={() => push(PATHS.HOME)}
      />
      <SendPac
        address={''}
        renderTrigger={open => <Tab icon={sendIcon} label={t('send')} onClick={open} />}
      />
      <ReceivePac
        renderTrigger={open => <Tab icon={receiveIcon} label={t('receive')} onClick={open} />}
      />
      <Tab
        icon={settingsIcon}
        label={t('settings')}
        isActive={SETTINGS_PATHS.includes(pathname)}
        onClick={() => push(PATHS.SETTING_GENERAL)}
      />
    </nav>
  );
};

export default BottomNav;
