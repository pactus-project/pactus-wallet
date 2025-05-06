import React, { useState, useEffect } from 'react';
import { useAccount } from '@/wallet/hooks/use-account';
import FormMemoInput from '@/components/common/FormMemoInput';
import FormTextInput from '@/components/common/FormTextInput';
import FormSelectInput from '@/components/common/FormSelectInput';
import FormPasswordInput from '@/components/common/FormPasswordInput';
import { useI18n } from '@/utils/i18n';
import { useBalance } from '@/wallet/hooks/use-balance';
import Button from '@/components/Button';
import GradientText from '@/components/common/GradientText';

export interface SendFormValues {
  fromAccount?: string;
  receiver?: string;
  amount?: string;
  fee?: string;
  memo?: string;
  password?: string;
}

interface SendFormProps {
  initialValues?: SendFormValues;
  onSubmit: (values: SendFormValues) => void;
  submitButtonText?: string;
}

const SendForm: React.FC<SendFormProps> = ({
  initialValues = {},
  onSubmit,
  submitButtonText = 'Next',
}) => {
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const { t } = useI18n();

  // Form state
  const [fromAccount, setFromAccount] = useState(
    initialValues.fromAccount || accounts[0]?.address || ''
  );
  const [receiver, setReceiver] = useState(initialValues.receiver || '');
  const [amount, setAmount] = useState(initialValues.amount || '');
  const [fee, setFee] = useState(initialValues.fee || '0.01');
  const [memo, setMemo] = useState(initialValues.memo || '');
  const [password, setPassword] = useState(initialValues.password || '');

  // Initialize balance hook with the selected account
  const { balance, fetchBalance, isLoading } = useBalance(fromAccount);

  // Fetch balance when account changes
  useEffect(() => {
    if (fromAccount) {
      fetchBalance(null, fromAccount);
    }
  }, [fromAccount, fetchBalance]);

  const handleMaxAmount = () => {
    // Check if we have a balance and a valid fee
    if (balance && !isLoading) {
      // Ensure fee is a valid number
      const feeValue = parseFloat(fee) || 0.01;

      // Calculate max amount (balance - fee)
      const maxAmount = Math.max(0, balance - feeValue);

      // Format to 5 decimal places and set amount
      setAmount(maxAmount.toFixed(5));
    }
  };

  // Handle auto fee
  const handleAutoFee = () => {
    setFee('0.01');
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit({
      fromAccount,
      receiver,
      amount,
      fee,
      memo,
      password,
    });
  };

  // Prepare account options for selects
  const accountOptions = accounts.map(account => ({
    value: account.address,
    label: (
      <span>
        <span className="mr-2">👨</span> {t('account1')}
      </span>
    ),
  }));

  return (
    <div className="flex flex-col gap-5 w-full px-2">
      {/* From Account */}
      <FormSelectInput
        id="from-account"
        name="fromAccount"
        value={fromAccount}
        onChange={e => setFromAccount(e.target.value)}
        options={accountOptions}
        label={t('from')}
      />

      {/* Receiver */}
      <FormTextInput
        id="receiver"
        name="receiver"
        value={receiver}
        onChange={e => setReceiver(e.target.value)}
        placeholder={t('selectOrEnterAddress')}
        label={t('receiver')}
      />

      {/* Amount */}
      <FormTextInput
        id="amount"
        name="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="0.00"
        label={`${t('amount')} (℗)`}
        rightElement={
          <Button
            variant="text"
            size="small"
            onClick={handleMaxAmount}
            disabled={isLoading || !balance}
            className="px-2 py-1 min-w-[40px] bg-transparent hover:bg-transparent"
          >
            <GradientText>{t('max')}</GradientText>
          </Button>
        }
      />

      {/* Network Fee */}
      <FormTextInput
        id="fee"
        name="fee"
        value={fee}
        onChange={e => setFee(e.target.value)}
        placeholder="0.001"
        label={`${t('fee')} (℗)`}
        rightElement={
          <Button
            variant="text"
            size="small"
            onClick={handleAutoFee}
            className="px-2 py-1 min-w-[40px] bg-transparent hover:bg-transparent"
          >
            <GradientText>{t('auto')}</GradientText>
          </Button>
        }
      />

      {/* Memo */}
      <FormMemoInput
        value={memo}
        onChange={e => setMemo(e.target.value)}
        touched={false}
        error=""
      />

      {/* Password */}
      <FormPasswordInput
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={t('enterYourPassword')}
        label={t('password')}
        touched={false}
        error=""
      />

      {/* Submit Button */}
      <div className="flex justify-end mt-3">
        <Button
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={!fromAccount || !receiver || !amount || !password}
          type="button"
          className="w-[86px] h-[38px]"
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SendForm;
