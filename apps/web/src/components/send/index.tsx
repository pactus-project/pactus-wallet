import { sendIcon } from '@/assets';
import React from 'react';

import TransactionButton from '../transaction/TransactionButton';

const SendPac: React.FC<{ address: string }> = ({ address }) => {
  return <TransactionButton address={address} type="send" icon={sendIcon} variant="primary" />;
};

export default SendPac;
