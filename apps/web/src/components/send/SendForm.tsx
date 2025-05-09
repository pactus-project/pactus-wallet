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
import { validatePassword } from '@/utils/password-validator';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';

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
  onSubmit?: (values: SendFormValues) => void;
  onPreviewTransaction?: (values: SendFormValues, signedRawTxHex: string) => void;
  submitButtonText?: string;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

const SendForm: React.FC<SendFormProps> = ({
  initialValues = {},
  onSubmit,
  onPreviewTransaction,
  submitButtonText = 'Next',
  isLoading = false,
  setIsLoading,
}) => {
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const { t } = useI18n();
  const { getSignTransferTransaction } = useSendTransaction();

  // Form state
  const [fromAccount, setFromAccount] = useState(
    initialValues.fromAccount || accounts[0]?.address || ''
  );
  const [receiver, setReceiver] = useState(initialValues.receiver || '');
  const [amount, setAmount] = useState(initialValues.amount || '');
  const [fee, setFee] = useState(initialValues.fee || '0.01');
  const [memo, setMemo] = useState(initialValues.memo || '');
  const [password, setPassword] = useState(initialValues.password || '');
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { balance, fetchBalance, isLoading: isBalanceLoading } = useBalance(fromAccount);
  const [error, setError] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  // Combined loading state from external and internal sources
  const isSubmitting = isLoading || internalLoading;

  useEffect(() => {
    if (fromAccount) {
      fetchBalance(null, fromAccount);
    }
  }, [fromAccount, fetchBalance]);

  const handleMaxAmount = () => {
    if (balance && !isBalanceLoading) {
      const feeValue = parseFloat(fee) || 0.01;
      const maxAmount = Math.max(0, balance - feeValue);
      setAmount(maxAmount.toFixed(5));
    }
  };

  // Handle auto fee
  const handleAutoFee = () => {
    setFee('0.01');
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordTouched(true);

    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError(t('passwordRequirements'));
    } else {
      setPasswordError('');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setError(null);

      // Set loading state
      if (setIsLoading) {
        setIsLoading(true);
      } else {
        setInternalLoading(true);
      }

      // Get signed transaction
      const result = await getSignTransferTransaction({
        fromAddress: fromAccount,
        toAddress: receiver,
        amount,
        fee,
        memo,
        password,
      });

      const values = {
        fromAccount,
        receiver,
        amount,
        fee,
        memo,
        password,
      };

      // If onPreviewTransaction is provided, call it with the signed transaction
      if (onPreviewTransaction) {
        onPreviewTransaction(values, result.signedRawTxHex);
      }
      // Otherwise, call the legacy onSubmit
      else if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error('Error signing transaction:', error.message);
      setError(error.message);
    } finally {
      // Reset loading state
      if (setIsLoading) {
        setIsLoading(false);
      } else {
        setInternalLoading(false);
      }
    }
  };

  // Prepare account options for selects
  const accountOptions = accounts.map(account => ({
    value: account.address,
    label: `🤝 ${account.name}`,
  }));

  // Check if form is valid
  const isFormValid =
    fromAccount &&
    receiver &&
    amount &&
    fee &&
    password &&
    fromAccount !== receiver &&
    validatePassword(password);

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
        label={`${t('amount')}`}
        showLogo={true}
        rightElement={
          <Button
            variant="text"
            size="small"
            onClick={handleMaxAmount}
            disabled={isBalanceLoading || !balance}
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
        label={`${t('fee')}`}
        showLogo={true}
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
        onChange={handlePasswordChange}
        placeholder={t('enterYourPassword')}
        label={t('password')}
        touched={passwordTouched}
        error={passwordError}
      />

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Submit Button */}
      <div className="flex justify-end mt-3">
        <Button
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          type="button"
          className="w-[86px] h-[38px]"
          isLoading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SendForm;
