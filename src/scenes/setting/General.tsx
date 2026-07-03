'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect } from 'react';
import FormSelectInput from '../../components/common/FormSelectInput';
import { useI18n } from '../../utils/i18n';
import { Form, useForm } from '@/components/common/Form';
import ChangePasswordModal from '@/components/change-password-modal';

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = () => {
  const [form] = useForm();
  const { setHeaderTitle, setEmoji } = useContext(WalletContext);

  useEffect(() => {
    setHeaderTitle(t('settingsGeneral'));
    setEmoji('');
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
    <div className="flex flex-col flex-1 pl-[52px] pr-[60px] gap-4">
      <Form className="pt-4" form={form}>
        <FormSelectInput
          id="language"
          name="language"
          options={accountOptions}
          label={t('language')}
          className="w-full text-sm text-quaternary"
        />
      </Form>
      <ChangePasswordModal />
    </div>
  );
};

export default General;
