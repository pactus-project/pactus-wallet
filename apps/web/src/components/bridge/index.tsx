import React from 'react';
import TransactionButton from '../transaction/TransactionButton';
import { bridgeIcon } from '../../assets';

const BridgePac: React.FC<{ address?: string }> = ({ address = '' }) => {
  return (
    <TransactionButton
      address={address}
      type="bridge"
      icon={bridgeIcon}
      variant="secondary"
      className="w-[119px] h-[38px] border-[1px] border-solid border-surface-light tablet:border-none"
    />
  );
};

export default BridgePac;
