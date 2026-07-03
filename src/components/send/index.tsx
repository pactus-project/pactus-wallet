import { sendIcon } from '@/assets';
import React from 'react';

import TransactionButton from '../transaction/TransactionButton';

const SendPac: React.FC<{
  address: string;
  renderTrigger?: (open: () => void) => React.ReactNode;
}> = ({ address, renderTrigger }) => {
  return (
    <TransactionButton
      address={address}
      type="send"
      icon={sendIcon}
      variant="primary"
      renderTrigger={renderTrigger}
    />
  );
};

export default SendPac;
