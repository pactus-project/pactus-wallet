'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect, useState } from 'react';
import FormSelectInput from '../../components/common/FormSelectInput';
import { useI18n } from '../../utils/i18n';

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = () => {
  const { setHeaderTitle } = useContext(WalletContext);

  useEffect(() => {
    setHeaderTitle('Settings / General');
  }, []);
  const { t } = useI18n();
  const defaultLanguage = 'English (US)';

  const [language, setLanguage] = useState(defaultLanguage);
  // Prepare account options for selects
  const accountOptions = [
    {
      value: defaultLanguage,
      label: defaultLanguage,
    },
  ];
  return (
    <div className="flex-1 pt-4 pl-[52px] pr-[60px]">
      {/* <label className='block text-sm text-[#D2D3E0] font-medium mb-3'>Language</label>
      <select
        id="word-count"
        className="block w-full bg-transparent border-[1px] !outline-none border-surface-medium rounded-md h-[42px] text-xs text-text-tertiary font-medium pl-2"
        value={1}
        onChange={e => console.log({ value: e.target.value })}
      >
        <option value={1}>English (US)</option>
      </select> */}
      <FormSelectInput
        id="language"
        name="language"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        options={accountOptions}
        label={t('Language')}
        className="w-full text-sm text-quaternary"
      />
    </div>
  );
};

export default General;
