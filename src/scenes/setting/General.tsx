'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect, useState } from 'react';
import FormSelectInput from '../../components/common/FormSelectInput';
import { useI18n } from '../../utils/i18n';
import { Form, useForm } from '@/components/common/Form';
import Button from '@/components/Button';
import ChangePasswordModal from '@/components/change-password-modal';

interface GeneralProps {
  title?: string;
}

const General: React.FC<GeneralProps> = () => {
  const [form] = useForm();
  const { setHeaderTitle, setEmoji } = useContext(WalletContext);
  const { t } = useI18n();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    setHeaderTitle(t('settingsGeneral'));
    setEmoji('');
  }, []);

  const defaultLanguage = t('englishUs');

  // Prepare account options for selects
  const accountOptions = [
    {
      value: defaultLanguage,
      label: defaultLanguage,
    },
  ];

  return (
    <div className="flex flex-col flex-1 px-4 tablet:pl-[52px] tablet:pr-[60px] gap-6 pt-4">
      {/* Language */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{t('language')}</h3>
        <Form form={form}>
          <FormSelectInput
            id="language"
            name="language"
            options={accountOptions}
            label={t('language')}
            hideLabel={true}
            className="w-full text-sm text-quaternary"
          />
        </Form>
      </section>

      <hr className="border-surface-medium" />

      {/* Security */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-text-primary">{t('security')}</h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-text-primary">{t('password')}</span>
            <span className="text-xs text-text-tertiary tracking-[0.2em]">••••••••</span>
          </div>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsChangePasswordOpen(true)}
            className="h-[38px]"
            labelClassName="text-sm"
          >
            {t('changePassword')}
          </Button>
        </div>
      </section>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default General;
