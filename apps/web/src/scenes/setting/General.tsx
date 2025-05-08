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
    setHeaderTitle(t('settingsGeneral'));
  }, []);
  const { t } = useI18n();
  const defaultLanguage = t('englishUs');

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
      <FormSelectInput
        id="language"
        name="language"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        options={accountOptions}
        label={t('language')}
        className="w-full text-sm text-quaternary"
      />
    </div>
  );
};

export default General;
