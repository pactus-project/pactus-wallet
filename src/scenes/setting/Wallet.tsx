'use client';

import { plusIcon, trashIcon, showPasswordIcon } from '@/assets';
import ShowPrivateKeyModal from '@/components/password-modal';
import ShowRecoveryPhraseModal from '@/components/recovery-phrase-modal';
import RemoveWalletModal from '@/components/remove-wallet-modal';
import Table from '@/components/table';
import { PATHS } from '@/constants/paths';
import { useAccount, WalletContext } from '@/wallet';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useI18n } from '../../utils/i18n';
import AddAccountModal from '../../components/add-account-modal';
import { Mobile, Tablet } from '@/components/responsive';
import { truncateAddress } from '@/utils/common';

interface WalletManagerProps {
  title?: string;
}

export interface Account {
  address: string;
  name: string;
  emoji: string;
  balance: number;
}

const WalletManager: React.FC<WalletManagerProps> = () => {
  const { setHeaderTitle, setEmoji } = useContext(WalletContext);
  const [privateKeyAddress, setPrivateKeyAddress] = useState<string>('');
  const { accountList } = useAccount();
  const { push } = useRouter();
  const { t } = useI18n();
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isRecoveryPhraseModalOpen, setIsRecoveryPhraseModalOpen] = useState(false);
  const [isRemoveWalletModalOpen, setIsRemoveWalletModalOpen] = useState(false);

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
        const goToWallet = () => push(`${PATHS.WALLET}?${query.toString()}`);
        const className =
          'text-gradient text-xs font-medium hover:filter hover:brightness-[0.9] cursor-pointer';

        return (
          <>
            <Mobile>
              <span onClick={goToWallet} className={className} title={address}>
                {truncateAddress(address)}
              </span>
            </Mobile>
            <Tablet>
              <span onClick={goToWallet} className={className}>
                {address}
              </span>
            </Tablet>
          </>
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

  useEffect(() => {
    setHeaderTitle(t("settingsWalletManager"));
    setEmoji('');
  }, []);

  return (
    <div className="w-full">
      <div className="min-h-[52px] w-full flex flex-wrap justify-end border-b-[1px] border-surface-medium items-center gap-3 px-4 py-2">
        <div className="text-xs text-[#4C4F6B]">
          <span className="text-text-tertiary">{accountList.length}</span>/ 200
        </div>
        <div className="w-[1px] h-6 border-l-[1px] border-[#2C2D3C]"></div>
        <div className="text-xs font-medium text-[#D2D3E0] h-6 px-3 rounded-sm bg-surface-medium flex justify-center items-center gap-2 cursor-pointer hover:bg-surface-light">
          <button
            type="button"
            onClick={() => setIsRecoveryPhraseModalOpen(true)}
            aria-label="Show recovery phrase"
            className="flex items-center gap-2"
          >
            <Image src={showPasswordIcon} width={16} height={16} alt="show-recovery-phrase" />{' '}
            {t('showRecoveryPhrase')}
          </button>
        </div>
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
        <Table columns={columns} data={accountList} />
      </div>

      <section className="mt-8 mx-4 rounded-md border border-red-500/30 bg-red-500/5 p-4">
        <h3 className="text-sm font-semibold text-red-400 mb-1">⚠ {t('dangerZone')}</h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-text-tertiary max-w-[520px]">
            {t('removeWalletDescription')}
          </p>
          <button
            type="button"
            onClick={() => setIsRemoveWalletModalOpen(true)}
            className="text-xs font-medium text-white h-8 px-3 rounded-sm bg-red-600 hover:bg-red-700 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Image src={trashIcon} width={14} height={14} alt="" aria-hidden="true" />
            {t('removeWallet')}
          </button>
        </div>
      </section>

      <ShowPrivateKeyModal
        isOpen={Boolean(privateKeyAddress)}
        onClose={() => setPrivateKeyAddress('')}
        address={privateKeyAddress}
      />
      <AddAccountModal isOpen={isAddAccountModalOpen} onClose={closeAddAccountModal} />
      <ShowRecoveryPhraseModal
        isOpen={isRecoveryPhraseModalOpen}
        onClose={() => setIsRecoveryPhraseModalOpen(false)}
      />
      <RemoveWalletModal
        isOpen={isRemoveWalletModalOpen}
        onClose={() => setIsRemoveWalletModalOpen(false)}
      />
    </div>
  );
};

export default WalletManager;
