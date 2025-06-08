import React, { useMemo, useState, useEffect } from 'react';
import Modal from '@/components/modal';
import Button from '@/components/Button';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { simpleLogo } from '@/assets/images/branding';
import Image from 'next/image';
import { useI18n } from '@/utils/i18n';
import Typography from '../common/Typography';
import GradientText from '../common/GradientText';
import { successIcon, copyIcon } from '../../assets/images/icons';
import { useWallet } from '@/wallet';
import { PACVIEWER_URL } from '../../utils/constants';

interface SuccessTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  amount: string;
  recipient: string;
  date?: string;
  networkFee?: string;
}

interface TransactionDetail {
  field: string;
  value: string;
}

const SuccessTransferModal: React.FC<SuccessTransferModalProps> = ({
  isOpen,
  onClose,
  txHash,
  amount,
  recipient,
  date = new Date().toLocaleString(),
  networkFee = '0.001',
}) => {
  const { t } = useI18n();
  const { wallet } = useWallet();
  const columnHelper = createColumnHelper<TransactionDetail>();
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [copied]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('field', {
        header: 'Field',
        cell: info => <span className="text-quaternary text-sm">{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: info => {
          const value = info.getValue();
          const field = info.row.original.field;

          if (field === 'Tx Hash') {
            return (
              <div className="flex items-center gap-2">
                <div className="text-tertiary break-all text-sm">{value}</div>
                <button
                  className="w-10 h-10"
                  onClick={() => handleCopy(txHash)}
                  aria-label="Copy address to clipboard"
                  title="Copy address to clipboard"
                >
                  <Image
                    src={copied ? successIcon : copyIcon}
                    alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            );
          }

          if (field === 'Network Fee') {
            return (
              <div className="flex items-center gap-1 text-tertiary text-sm">
                {value}
                <Image src={simpleLogo} alt="Pactus logo" className="w-3 h-3 inline-block" />
              </div>
            );
          } else if (field === 'Status') {
            return <GradientText className="text-sm text-left">{value}</GradientText>;
          }
          return <span className="text-tertiary text-sm text-left">{value}</span>;
        },
      }),
    ],
    [copied, txHash]
  );

  // Create data array
  const data = useMemo(
    () => [
      { field: 'Tx Hash', value: txHash },
      { field: 'Status', value: 'Successful' },
      { field: 'Date', value: date },
      { field: 'Recipient', value: recipient },
      { field: 'Network Fee', value: networkFee },
    ],
    [txHash, date, networkFee, recipient]
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleViewOnPacviewer = () => {
    if (wallet?.isTestnet()) {
      window.open(`${PACVIEWER_URL.TESTNET}/transaction/${txHash}`, '_blank');
    } else {
      window.open(`${PACVIEWER_URL.MAINNET}/transaction/${txHash}`, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('transactionSent')} showCloseButton={true}>
      <div className="flex flex-col items-center p-4 gap-4">
        <div className="flex flex-col items-center gap-2 w-full">
          <Typography variant="h1" className="text-quaternary text-[32px] md:text-[38px]">
            -{amount} PAC
          </Typography>
        </div>
        <div className="bg-background-secondary rounded-md p-4 w-full">
          <table className="w-full">
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`py-2 ${cell.column.id === 'field' ? 'w-1/3 pr-4 text-left' : 'w-2/3 text-left'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="secondary" size="medium" className="flex-1 invisible" onClick={onClose}>
            {t('close')}
          </Button>
          <Button variant="primary" size="medium" onClick={handleViewOnPacviewer}>
            View on Pacviewer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessTransferModal;
