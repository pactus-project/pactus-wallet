import { settingGeneralIcon, walletManagerIcon } from '@/assets';
import { PATHS } from '@/constants/paths';
import cn from '@/utils/cn';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

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
  // {
  //   iconUrl: nodeManagerIcon,
  //   title: 'Node Manager',
  //   path: PATHS.NODE_MANAGER,
  // },
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

  return (
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
    </div>
  );
};

export default SettingSidebar;
