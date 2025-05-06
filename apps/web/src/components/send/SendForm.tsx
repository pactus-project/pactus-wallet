import React, { useState } from 'react';
import { useAccount } from '@/wallet/hooks/use-account';
import FormMemoInput from '@/components/common/FormMemoInput';
import FormTextInput from '@/components/common/FormTextInput';
import TextButton from '@/components/common/TextButton';
import FormSelectInput from '@/components/common/FormSelectInput';
import SubmitButton from '@/components/common/SubmitButton';
import FormPasswordInput from '@/components/common/FormPasswordInput';

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

  // Form state
  const [fromAccount, setFromAccount] = useState(
    initialValues.fromAccount || accounts[0]?.address || ''
  );
  const [receiver, setReceiver] = useState(initialValues.receiver || '');
  const [amount, setAmount] = useState(initialValues.amount || '');
  const [fee, setFee] = useState(initialValues.fee || '0.001');
  const [memo, setMemo] = useState(initialValues.memo || '');
  const [password, setPassword] = useState(initialValues.password || '');

  // Handle max amount click
  const handleMaxAmount = () => {
    // In a real implementation, you would calculate the maximum available amount
    // For now, just set a sample value
    setAmount('1.02445');
  };

  // Handle auto fee
  const handleAutoFee = () => {
    // In a real implementation, you would calculate the recommended fee
    // For now, just set the default value
    setFee('0.001');
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
        <span className="mr-2">👨</span> Account 1
      </span>
    ),
  }));

  // Prepare receiver options
  const receiverOptions = [
    ...accounts.map(account => ({
      value: account.address,
      label: (
        <span>
          {account.address.substring(0, 10)}...
          {account.address.substring(account.address.length - 10)}
        </span>
      ),
    })),
  ];

  return (
    <div className="flex flex-col gap-5 w-full px-2">
      {/* From Account */}
      <FormSelectInput
        id="from-account"
        name="fromAccount"
        value={fromAccount}
        onChange={e => setFromAccount(e.target.value)}
        options={accountOptions}
        label="From"
      />

      {/* Receiver */}
      <FormSelectInput
        id="receiver"
        name="receiver"
        value={receiver}
        onChange={e => setReceiver(e.target.value)}
        options={receiverOptions}
        placeholder="Select or enter an address"
        label="Receiver"
      />

      {/* Amount */}
      <FormTextInput
        id="amount"
        name="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="0.00"
        label="Amount (℗)"
        rightElement={<TextButton onClick={handleMaxAmount}>Max</TextButton>}
      />

      {/* Network Fee */}
      <FormTextInput
        id="fee"
        name="fee"
        value={fee}
        onChange={e => setFee(e.target.value)}
        placeholder="0.001"
        label="Network fee (℗)"
        rightElement={<TextButton onClick={handleAutoFee}>Auto</TextButton>}
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
        placeholder="Enter your password"
        label="Password"
        touched={false}
        error=""
      />

      {/* Submit Button */}
      <div className="flex justify-end mt-3">
        <SubmitButton
          onClick={handleSubmit}
          disabled={!fromAccount || !receiver || !amount || !password}
        >
          {submitButtonText}
        </SubmitButton>
      </div>
    </div>
  );
};

export default SendForm;
