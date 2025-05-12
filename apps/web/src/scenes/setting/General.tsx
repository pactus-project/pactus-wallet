'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect } from 'react';
import FormSelectInput from '../../components/common/FormSelectInput';
import { useI18n } from '../../utils/i18n';
import { Form, useForm } from '@/components/common/Form';

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = () => {
  const [ form ] = useForm();
  const { setHeaderTitle } = useContext(WalletContext);

  useEffect(() => {
    setHeaderTitle(t('settingsGeneral'));
  }, []);
  const { t } = useI18n();
  const defaultLanguage = t('englishUs');

  // Prepare account options for selects
  const accountOptions = [
    {
      value: defaultLanguage,
      label: defaultLanguage,
    },
  ];
  return (
    <Form className="flex-1 pt-4 pl-[52px] pr-[60px]" form={form}>
      <FormSelectInput
        id="language"
        name="language"
        options={accountOptions}
        label={t('language')}
        className="w-full text-sm text-quaternary"
      />
    </Form>
  );
};

export default General;
