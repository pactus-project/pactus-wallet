import { receiveIcon, copyIcon, pactusLogo, successIcon } from '@/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import './style.css';
import Button from '../Button';
import { useI18n } from '@/utils/i18n';
import Modal from '../modal';
import Typography from '../common/Typography';
import { useAccount } from '@/wallet';
import QRCode from 'react-qr-code';
import FormSelectInput from '../common/FormSelectInput';
import { Form, useForm, useWatch } from '../common/Form';
import { formatPactusAddress } from '@/utils/common';

const ReceivePac: React.FC = () => {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const [form] = useForm();
  const selectedAccount = useWatch('account', form) ?? accounts[0]?.address ?? '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accountOptions = accounts.map(account => ({
    label: account.name,
    value: account.address,
  }));

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={() => setIsModalOpen(true)}
        aria-label={t('receive')}
        startIcon={<Image src={receiveIcon} alt="" width={20} height={20} aria-hidden="true" />}
        className="w-[119px] h-[38px]"
        fullWidth
      >
        {t('receive')}
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('receive')}>
        <div className="flex flex-col gap-4 p-4">
          <Form
            form={form}
            initialValues={{
              account: accounts[0]?.address ?? '',
            }}
          >
            <div className="modal-input-container">
              <FormSelectInput
                id="account"
                name="account"
                label={t('Account')}
                options={accountOptions}
              />
            </div>
          </Form>

          <div className="flex justify-center">
            {/* <div className="bg-white rounded-md p-4 w-fit">
              <QRCode
                value={formatPactusAddress(selectedAccount)}
                size={200}
                level="H"
                className="rounded-md"
              />
            </div> */}
            <div className="relative h-fit">
              <div className="flex flex-col justify-center bg-white rounded-md p-4 w-[214px] h-[214px] min-w-[214px] min-h-[214px]">
                <QRCode
                  value={formatPactusAddress(selectedAccount)}
                  level="H"
                  size={200}
                  aria-label="QR code for wallet address"
                  className="rounded-md w-full h-full"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 w-[48px] h-[48px] rounded-full overflow-hidden bg-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                <Image unoptimized src={pactusLogo} alt="" width={40} height={40} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <Typography variant="body2" color="text-quaternary">
              {accounts.find(acc => acc.address === selectedAccount)?.name}
            </Typography>

            <div className="flex items-center justify-center gap-2">
              <Typography variant="caption1" className="break-all text-center text-gradient">
                {selectedAccount}
              </Typography>
              <button
                onClick={() => handleCopy(selectedAccount)}
                aria-label="Copy address to clipboard"
                title="Copy address to clipboard"
                className="flex-shrink-0"
              >
                <Image
                  src={copied ? successIcon : copyIcon}
                  alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceivePac;
