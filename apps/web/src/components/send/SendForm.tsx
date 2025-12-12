import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from '@/wallet/hooks/use-account';
import FormMemoInput from '@/components/common/FormMemoInput';
import FormTextInput from '@/components/common/FormTextInput';
import TextInput from '@/components/common/TextInput';
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
  bridgeChain?: string;
  transactionType?: 'TRANSFER' | 'BOND';
}

interface SendFormProps {
  initialValues?: SendFormValues;
  onSubmit?: (values: SendFormValues, signedRawTxHex: string) => void;
  onPreviewTransaction?: (values: SendFormValues, signedRawTxHex: string) => void;
  submitButtonText?: string;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  isOpen?: boolean;
  forceReset?: number;
  isBridgeMode?: boolean;
}

// Transaction type configurations
const TRANSACTION_CONFIGS = {
  BRIDGE: {
    type: 'TRANSFER',
    showTransactionTypeSelector: false,
    showBridgeChainSelector: true,
    showPublicKeyField: false,
    receiverLabel: 'evmAddress',
    receiverPlaceholder: 'enterEvmAddress',
    fromLabel: 'from',
  },
  TRANSFER: {
    type: 'TRANSFER',
    showTransactionTypeSelector: true,
    showBridgeChainSelector: false,
    showPublicKeyField: false,
    receiverLabel: 'receiver',
    receiverPlaceholder: 'selectOrEnterAddress',
    fromLabel: 'from',
  },
  BOND: {
    type: 'BOND',
    showTransactionTypeSelector: true,
    showBridgeChainSelector: false,
    showPublicKeyField: true,
    receiverLabel: 'validatorAddress',
    receiverPlaceholder: 'selectOrEnterAddress',
    fromLabel: 'accountAddress',
  },
} as const;

const SendForm: React.FC<SendFormProps> = ({
  onSubmit,
  onPreviewTransaction,
  submitButtonText = 'Next',
  isLoading = false,
  setIsLoading,
  isOpen = true,
  forceReset = 0,
  isBridgeMode = false,
  initialValues,
}) => {
  const [form] = useForm();

  // Get bridge wallet address from environment variable
  const bridgeWalletAddress = process.env.NEXT_PUBLIC_WRAPTO_WALLET_ADDRESS || '';

  // Form field watchers
  const fromAccount = useWatch('fromAccount', form);
  const fee = useWatch('fee', form);
  const receiver = useWatch('receiver', form);
  const amount = useWatch('amount', form);
  const password = useWatch('password', form);
  const transactionType = useWatch('transactionType', form);
  const bridgeChain = useWatch('bridgeChain', form);

  // Determine current transaction mode
  const getCurrentMode = () => {
    if (isBridgeMode) return 'BRIDGE';
    return transactionType || 'TRANSFER';
  };

  const currentMode = getCurrentMode();
  const config = TRANSACTION_CONFIGS[currentMode];
  const isBond = currentMode === 'BOND';

  // Hooks and context
  const { showLoadingDialog, hideLoadingDialog } = useContext(WalletContext);
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const { t } = useI18n();
  const { getSignTransferTransaction, getSignBondTransaction } = useSendTransaction();
  const { balance, fetchBalance, isLoading: isBalanceLoading } = useBalance(fromAccount);
  const [internalLoading, setInternalLoading] = useState(false);

  const isSubmitting = isLoading || internalLoading;
  const defaultChain = 'BASE';
  // Bridge chain options
  const bridgeChainOptions = [
    { value: 'BASE', label: 'Base' },
    { value: 'BSC', label: 'BNB Chain' },
    { value: 'POLYGON', label: 'Polygon' },
  ];

  const transactionTypeOptions = [
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'BOND', label: 'Bond' },
  ];

  const accountOptions = accounts.map(account => ({
    value: account.address,
    label: `🤝 ${account.name}`,
  }));

  // Form reset effects
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, accounts]);

  useEffect(() => {
    if (forceReset > 0) {
      form.resetFields();
    }
  }, [forceReset]);

  // Balance fetching
  useEffect(() => {
    if (fromAccount) {
      fetchBalance(null, fromAccount);
    }
  }, [fromAccount, fetchBalance]);

  // Auto-generate memo for bridge mode
  useEffect(() => {
    if (isBridgeMode && receiver && bridgeChain) {
      const suffix = `@${bridgeChain}`;
      const autoMemo = `${receiver}${suffix}`;
      form.setFieldValue('memo', autoMemo);
    }
  }, [receiver, bridgeChain, isBridgeMode, form]);

  // Event handlers
  const handleMaxAmount = () => {
    if (balance && !isBalanceLoading) {
      const feeValue = parseFloat(fee) || 0.01;
      const maxAmount = Math.max(0, balance - feeValue);
      form.setFieldValue('amount', maxAmount.toFixed(5));
    }
  };

  const handleAutoFee = () => {
    form.setFieldValue('fee', '0.01');
  };

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

      // Get signed transaction based on type
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
          toAddress: isBridgeMode && bridgeWalletAddress ? bridgeWalletAddress : receiver || '',
          amount: amount || '',
          fee: fee || '',
          memo: memo || '',
          password: password || '',
        });

      // Reset form BEFORE callbacks
      form.resetFields();

      // Call appropriate callback
      if (onPreviewTransaction) {
        onPreviewTransaction(values, result.signedRawTxHex);
      } else if (onSubmit) {
        onSubmit(values, result.signedRawTxHex);
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

  // Form validation
  const isFormValid =
    fromAccount && receiver && amount && fee && password && fromAccount !== receiver;

  // Render form fields based on configuration
  const renderTransactionTypeSelector = () => {
    if (!config.showTransactionTypeSelector) return null;

    return (
      <FormSelectInput
        id="transactionType"
        name="transactionType"
        options={transactionTypeOptions}
        label={t('transactionType')}
      />
    );
  };

  const renderBridgeChainSelector = () => {
    if (!config.showBridgeChainSelector) return null;

    return (
      <FormSelectInput
        id="bridgeChain"
        name="bridgeChain"
        options={bridgeChainOptions}
        label={t('selectBridgeChain')}
      />
    );
  };

  const renderPublicKeyField = () => {
    if (!config.showPublicKeyField) return null;

    return (
      <FormTextInput
        id="publicKey"
        name="publicKey"
        placeholder={t('enterPublickey')}
        label={t('validatorPublicKey')}
      />
    );
  };

  return (
    <Form
      className="flex flex-col gap-5 w-full px-2"
      form={form}
      initialValues={{
        transactionType: config.type,
        fromAccount: initialValues?.fromAccount || accounts[0]?.address || '',
        receiver: '',
        amount: '',
        fee: '0.01',
        memo: '',
        password: '',
        bridgeChain: initialValues?.bridgeChain || (isBridgeMode ? defaultChain : undefined),
      }}
      onFinish={handleSubmit}
    >
      {/* Transaction Type / Bridge Chain Selector */}
      {renderTransactionTypeSelector()}

      {/* From Account */}
      <FormSelectInput
        id="from-account"
        name="fromAccount"
        options={accountOptions}
        label={t(config.fromLabel)}
      />
      {isBridgeMode && (
        <TextInput
          id="depositAddress"
          label={t('receiver')}
          value={bridgeWalletAddress}
          disabled
        />
      )}
      {renderBridgeChainSelector()}

      {/* Receiver */}
      <FormTextInput
        id="receiver"
        name="receiver"
        validateTrigger="onBlur"
        placeholder={t(config.receiverPlaceholder)}
        label={
          config.receiverLabel === 'evmAddress' && bridgeChain
            ? `${t('addressOn')} ${bridgeChainOptions.find((c) => c.value === bridgeChain)?.label || bridgeChain}`
            : t(config.receiverLabel)
        }
        rules={
          config.receiverLabel === 'evmAddress'
            ? [
              {
                pattern: /^0x[a-fA-F0-9]{40}$/i,
                message: t('invalidEvmAddress'),
              },
            ]
            : undefined
        }
      />

      {/* Public Key (Bond only) */}
      {renderPublicKeyField()}

      {/* Amount */}
      <FormTextInput
        id="amount"
        name="amount"
        placeholder="0.00"
        label={t('amount')}
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
        label={t('fee')}
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
      <div className={isBridgeMode ? 'hidden' : 'block'}>
        <FormMemoInput />
      </div>


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
