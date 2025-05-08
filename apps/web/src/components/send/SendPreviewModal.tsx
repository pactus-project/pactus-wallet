import React, { useMemo, useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Button from '@/components/Button';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { simpleLogo } from '../../assets/images/branding';
import Image from 'next/image';

export interface SendPreviewModalProps {
  isOpen: boolean;
  fromAccount: string;
  receiver: string;
  amount: string;
  fee: string;
  memo?: string;
  signature?: string;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  isSending?: boolean;
  countdown?: number;
}

interface TransactionDetail {
  field: string;
  value: string;
}

const SendPreviewModal: React.FC<SendPreviewModalProps> = ({
  isOpen,
  fromAccount,
  receiver,
  amount,
  fee,
  memo,
  signature,
  onConfirm,
  onClose,
  title = 'Sending',
  isSending = false,
  countdown = 0,
}) => {
  // Circle animation properties
  const circleRadius = 12;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const [circleProgress, setCircleProgress] = useState(0);

  // Update circle progress when countdown changes
  useEffect(() => {
    if (countdown > 0) {
      // Calculate progress percentage (from 0 to 100)
      // Assuming initial countdown is 10
      const progress = ((10 - countdown) / 10) * 100;
      setCircleProgress(progress);
    }
  }, [countdown]);

  // Calculate stroke-dashoffset based on progress
  const strokeDashoffset = circleCircumference - (circleProgress / 100) * circleCircumference;

  // Create column helper
  const columnHelper = createColumnHelper<TransactionDetail>();

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('field', {
        header: 'Field',
        cell: info => (
          <span className="font-medium text-quaternary text-[14px]">{info.getValue()}</span>
        ),
        size: 120,
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: info => {
          const value = info.getValue();
          if (info.row.original.field === 'Signature') {
            return (
              <div className="break-all text-xs bg-background-secondary p-1 rounded text-tertiary font-medium">
                {value}
              </div>
            );
          } else if (
            info.row.original.field === 'Amount' ||
            info.row.original.field === 'Network fee'
          ) {
            return (
              <div className="flex items-center gap-2">
                <span className="break-all text-tertiary text-[12px] font-medium">{value}</span>
                <Image src={simpleLogo} alt="Pactus logo" className="w-3 h-3 inline-block" />
              </div>
            );
          }
          return <span className="break-all text-tertiary text-[12px] font-medium">{value}</span>;
        },
      }),
    ],
    []
  );

  // Create data array
  const data = useMemo(() => {
    const result: TransactionDetail[] = [
      { field: 'From', value: fromAccount },
      { field: 'Receiver', value: receiver },
      { field: 'Amount', value: amount },
      { field: 'Network fee', value: fee },
    ];

    if (memo) {
      result.push({ field: 'Memo', value: memo });
    }

    if (signature) {
      result.push({ field: 'Signature', value: signature });
    }

    return result;
  }, [fromAccount, receiver, amount, fee, memo, signature]);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={!isSending}>
      <div className="flex flex-col gap-4 p-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`py-3 ${cell.column.id === 'field' ? 'w-1/3 pr-4' : 'w-2/3'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {isSending ? (
            <div className="flex items-center justify-end w-full gap-2">
              <div className="flex items-center gap-2 text-primary">
                <div className="relative">
                  {/* SVG Countdown Circle */}
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    {/* Background circle */}
                    <circle
                      cx="15"
                      cy="15"
                      r={circleRadius}
                      fill="transparent"
                      stroke="#2D3748"
                      strokeWidth="2"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="15"
                      cy="15"
                      r={circleRadius}
                      fill="transparent"
                      stroke="#0FA870"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 15 15)"
                      className="transition-all duration-300 ease-linear"
                    />
                    {/* Countdown text */}
                    <text
                      x="15"
                      y="16"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {countdown}
                    </text>
                  </svg>
                </div>
              </div>
              <Button
                variant="secondary"
                size="small"
                className="w-[86px] h-[38px] bg-gradient-to-r from-[#EF0F0F] to-[#890909] text-white border-0"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="primary"
                size="small"
                className="w-[86px] h-[38px]"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SendPreviewModal;
