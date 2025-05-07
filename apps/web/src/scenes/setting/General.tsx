'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect } from 'react';

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = () => {
  const { setHeaderTitle } = useContext(WalletContext);

  useEffect(() => {
    setHeaderTitle('Settings / General');
  }, []);

  return (
    <div className="flex-1 pt-4 pl-[52px] pr-[60px]">
      <label className='block text-sm text-[#D2D3E0] font-medium mb-3'>Language</label>
      <select
        id="word-count"
        className="block w-full bg-transparent border-[1px] !outline-none border-surface-medium rounded-md h-[42px] text-xs text-text-tertiary font-medium pl-2"
        value={1}
        onChange={e => console.log({ value: e.target.value })}
      >
        <option value={1}>English (US)</option>
      </select>
    </div>
  );
};

export default General;
