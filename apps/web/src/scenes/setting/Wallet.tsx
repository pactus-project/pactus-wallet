'use client';

import { plusIcon, trashIcon, showPasswordIcon } from '@/assets';
import ShowPrivateKeyModal from '@/components/password-modal';
import Table from '@/components/table';
import { PATHS } from '@/constants/paths';
import { useAccount } from '@/wallet';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '../../utils/i18n';
import AddAccountModal from '../../components/add-account-modal';

interface WalletManagerProps {
  title?: string;
}

interface Account {
  address: string;
  name: string;
  emoji: string;
  balance: number;
}

const WalletManager: React.FC<WalletManagerProps> = () => {
  const [privateKeyAddress, setPrivateKeyAddress] = useState<string>('');
  const { getAccountList } = useAccount();
  const { push } = useRouter();
  const { t } = useI18n();
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const closeAddAccountModal = () => {
    setIsAddAccountModalOpen(false);
  };

  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: 'name',
      header: t('title'),
      cell: info => {
        const rowValue = info.row.original;
        const name = info.getValue() as string;
        return (
          <>
            {rowValue.emoji}
            {name}
          </>
        );
      },
    },
    {
      accessorKey: 'address',
      header: t('address'),
      cell: info => {
        const address = info.getValue() as string;
        const query = new URLSearchParams({ address });

        return (
          <span
            onClick={() => push(`${PATHS.WALLET}?${query.toString()}`)}
            className="text-gradient text-xs font-medium hover:filter hover:brightness-[0.9] cursor-pointer"
          >
            {address}
          </span>
        );
      },
    },
    {
      accessorKey: 'action',
      header: () => <div className="text-center">Action</div>,
      cell: info => {
        const rowValue = info.row.original;
        return (
          <div className="flex gap-4 justify-center">
            <Image
              onClick={() => setPrivateKeyAddress(rowValue.address)}
              src={showPasswordIcon}
              width={24}
              height={24}
              alt="view-private"
              className="cursor-pointer hover:filter hover:brightness-[0.8]"
            />
            <Image
              src={trashIcon}
              width={24}
              height={24}
              alt="delete"
              className="cursor-pointer hover:filter hover:brightness-[0.8]"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="h-[52px] w-full flex justify-end border-b-[1px] border-surface-medium items-center gap-4 pr-4">
        <div className="text-xs text-[#4C4F6B]">
          <span className="text-text-tertiary">{getAccountList().length}</span>/ 200
        </div>
        <div className="w-[1px] h-6 border-l-[1px] border-[#2C2D3C]"></div>
        <div className="text-xs font-medium text-[#D2D3E0] h-6 px-3 rounded-sm bg-surface-medium flex justify-center items-center gap-2 cursor-pointer hover:bg-surface-light">
          <button
            type="button"
            onClick={() => setIsAddAccountModalOpen(true)}
            aria-label="Add new account"
            className="flex items-center gap-2"
          >
            <Image src={plusIcon} width={12} height={12} alt="plus-icon" /> {t('addAccount')}
          </button>
        </div>
      </div>

      <div>
        <Table columns={columns} data={getAccountList()} />
      </div>

      <ShowPrivateKeyModal
        isOpen={Boolean(privateKeyAddress)}
        onClose={() => setPrivateKeyAddress('')}
        address={privateKeyAddress}
      />
      <AddAccountModal isOpen={isAddAccountModalOpen} onClose={closeAddAccountModal} />
    </div>
  );
};

export default WalletManager;
