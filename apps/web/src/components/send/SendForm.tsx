import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from '@/wallet/hooks/use-account';
import FormMemoInput from '@/components/common/FormMemoInput';
import FormTextInput from '@/components/common/FormTextInput';
import FormSelectInput from '@/components/common/FormSelectInput';
import FormPasswordInput from '@/components/common/FormPasswordInput';
import { useI18n } from '@/utils/i18n';
import { useBalance } from '@/wallet/hooks/use-balance';
import Button from '@/components/Button';
import GradientText from '@/components/common/GradientText';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';
import { WalletContext } from '@/wallet';
import { Form, useForm, useWatch } from '../common/Form';
import { toast } from 'sonner';
export interface SendFormValues {
  fromAccount?: string;
  receiver?: string;
  amount?: string;
  fee?: string;
  memo?: string;
  password?: string;
  publicKey?: string;
}

interface SendFormProps {
  initialValues?: SendFormValues;
  onSubmit?: (values: SendFormValues) => void;
  onPreviewTransaction?: (values: SendFormValues, signedRawTxHex: string) => void;
  submitButtonText?: string;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  isOpen?: boolean;
  forceReset?: number;
}

const SendForm: React.FC<SendFormProps> = ({
  onSubmit,
  onPreviewTransaction,
  submitButtonText = 'Next',
  isLoading = false,
  setIsLoading,
  isOpen = true,
  forceReset = 0,
}) => {
  const [form] = useForm();

  const fromAccount = useWatch('fromAccount', form);
  const fee = useWatch('fee', form);
  const receiver = useWatch('receiver', form);
  const amount = useWatch('amount', form);
  const password = useWatch('password', form);
  const transactionType = useWatch('transactionType', form);
  const isBond = transactionType === 'BOND';

  const { showLoadingDialog, hideLoadingDialog } = useContext(WalletContext);
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const { t } = useI18n();
  const { getSignTransferTransaction, getSignBondTransaction } = useSendTransaction();
  const { balance, fetchBalance, isLoading: isBalanceLoading } = useBalance(fromAccount);
  const [internalLoading, setInternalLoading] = useState(false);

  // Combined loading state from external and internal sources
  const isSubmitting = isLoading || internalLoading;

  // Reset form when isOpen changes to false
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, accounts]);

  // Reset form when forceReset counter changes
  useEffect(() => {
    if (forceReset > 0) {
      form.resetFields();
    }
  }, [forceReset]);

  useEffect(() => {
    if (fromAccount) {
      fetchBalance(null, fromAccount);
    }
  }, [fromAccount, fetchBalance]);

  const handleMaxAmount = () => {
    if (balance && !isBalanceLoading) {
      const feeValue = parseFloat(fee) || 0.01;
      const maxAmount = Math.max(0, balance - feeValue);
      form.setFieldValue('amount', maxAmount.toFixed(5));
    }
  };

  // Handle auto fee
  const handleAutoFee = () => {
    form.setFieldValue('fe', '0.01');
  };

  // Handle form submission
  const handleSubmit = async (values: SendFormValues) => {
    try {
      const { fromAccount, receiver, amount, fee, memo, password, publicKey } = values;

      // Set loading state
      if (setIsLoading) {
        setIsLoading(true);
        showLoadingDialog(t('transactionLoading'));
      } else {
        setInternalLoading(true);
      }

      // Get signed transaction
      const result = isBond
        ? await getSignBondTransaction({
            fromAddress: fromAccount || '',
            toAddress: receiver || '',
            amount: amount || '',
            fee: fee || '',
            memo: memo || '',
            password: password || '',
            publicKey: publicKey || '',
          })
        : await getSignTransferTransaction({
            fromAddress: fromAccount || '',
            toAddress: receiver || '',
            amount: amount || '',
            fee: fee || '',
            memo: memo || '',
            password: password || '',
          });

      // Reset form BEFORE callbacks to ensure it happens
      form.resetFields();

      // If onPreviewTransaction is provided, call it with the signed transaction
      if (onPreviewTransaction) {
        onPreviewTransaction(values, result.signedRawTxHex);
      }
      // Otherwise, call the legacy onSubmit
      else if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      // Reset loading state
      if (setIsLoading) {
        setIsLoading(false);
        hideLoadingDialog();
      } else {
        setInternalLoading(false);
      }
    }
  };

  const accountOptions = accounts.map(account => ({
    value: account.address,
    label: `🤝 ${account.name}`,
  }));

  // Check if form is valid
  const isFormValid =
    fromAccount && receiver && amount && fee && password && fromAccount !== receiver;
  return (
    <Form
      className="flex flex-col gap-5 w-full px-2"
      form={form}
      initialValues={{
        transactionType: 'TRANSFER',
        fromAccount: accounts[0]?.address || '',
        receiver: '',
        amount: '',
        fee: '0.01',
        memo: '',
        password: '',
      }}
      onFinish={handleSubmit}
    >
      {/* Transfer or Bond */}
      <FormSelectInput
        id="transactionType"
        name="transactionType"
        options={[
          {
            value: 'TRANSFER',
            label: 'Transfer',
          },
          {
            value: 'BOND',
            label: 'Bond',
          },
        ]}
        label={t('transactionType')}
      />

      {/* From Account */}
      <FormSelectInput
        id="from-account"
        name="fromAccount"
        options={accountOptions}
        label={isBond ? t('accountAddress') : t('from')}
      />

      {/* Receiver */}
      <FormTextInput
        id="receiver"
        name="receiver"
        placeholder={t('selectOrEnterAddress')}
        label={isBond ? t('validatorAddress') : t('receiver')}
      />
      {/* Public Key */}
      {isBond ? (
        <>
          <FormTextInput
            id="publicKey"
            name="publicKey"
            placeholder={t('enterPublickey')}
            label={t('validatorPublicKey')}
          />
        </>
      ) : (
        <></>
      )}
      {/* Amount */}
      <FormTextInput
        id="amount"
        name="amount"
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
      <FormMemoInput />

      {/* Password */}
      <FormPasswordInput id="password" placeholder={t('enterYourPassword')} label={t('password')} />

      {/* Submit Button */}
      <div className="flex justify-end mt-3">
        <Button
          variant="primary"
          size="small"
          type="submit"
          className="w-[86px] h-[38px]"
          isLoading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </Form>
  );
};

export default SendForm;
