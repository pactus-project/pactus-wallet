import { logoutIcon, settingGeneralIcon, walletManagerIcon } from '@/assets';
import { PATHS } from '@/constants/paths';
import cn from '@/utils/cn';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '../modal';
import Button from '../Button';
import { useWallet } from '@/wallet';
import { useI18n } from '@/utils/i18n';
import { WalletStatus } from '@/wallet/types';

interface SidebarItem {
  iconUrl: string;
  title: string;
  path: string;
}

const sidebarData: SidebarItem[] = [
  {
    iconUrl: settingGeneralIcon,
    title: 'General',
    path: PATHS.SETTING_GENERAL,
  },
  {
    iconUrl: walletManagerIcon,
    title: 'Wallet Manager',
    path: PATHS.WALLET_MANAGER,
  },
];

interface ItemProps {
  iconUrl: string;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Item: React.FC<ItemProps> = ({ iconUrl, title, isActive = false, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      'flex gap-3 w-[170px] rounded-[6px] hover:bg-surface-medium py-1 px-2 cursor-pointer',
      { 'bg-surface-medium': isActive }
    )}
  >
    <Image src={iconUrl} width={16} height={16} alt="setting-icon" />
    <div className="text-tertiary text-sm font-medium">{title}</div>
  </div>
);

const SettingSidebar: React.FC = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { setWallet, setWalletStatus } = useWallet();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { t } = useI18n();

  const handleLogout = () => {
    // Clear wallet data
    setWallet(null);
    setWalletStatus(WalletStatus.WALLET_LOCKED);
    // Redirect to get started
    push(PATHS.GET_START);
  };

  return (
    <>
      <div className="flex flex-col gap-2 px-6 py-3 w-[219px] border-r-[1px] border-surface-medium min-h-[calc(100vh-57px)]">
        {sidebarData.map(({ iconUrl, title, path }) => (
          <Item
            onClick={() => push(path)}
            key={path}
            iconUrl={iconUrl}
            title={title}
            isActive={pathname === path}
          />
        ))}
        <div className="mt-auto pb-[12px]">
          <Item
            onClick={() => setShowLogoutModal(true)}
            iconUrl={logoutIcon}
            title={t('logout')}
          />
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('confirmLogout')}
      >
        <div className="flex flex-col gap-4 p-4">
          <p className="text-quaternary">{t('logoutWarning')}</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowLogoutModal(false)}
              className="w-[86px] h-[38px]"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleLogout}
              className="w-[86px] h-[38px]"
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingSidebar;
