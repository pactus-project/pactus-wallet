'use client';
import { WalletContext } from '@/wallet';
import { useContext, useEffect } from 'react';
import { useI18n } from '../../utils/i18n';
import Typography from '../../components/common/Typography';

interface AboutProps {
  title?: string;
}

const About: React.FC<AboutProps> = () => {
  const { setHeaderTitle, setEmoji } = useContext(WalletContext);
  const { t } = useI18n();

  useEffect(() => {
    setHeaderTitle(t('settingsAbout'));
    setEmoji('');
  }, []);

  // Get version from package.json
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  // Get commit hash from environment variable
  const commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown';
  const commitDate = process.env.NEXT_PUBLIC_GIT_COMMIT_DATE || '';

  return (
    <div className="flex flex-col flex-1 pl-[52px] pr-[60px] gap-4">
      <div className="pt-4 space-y-6">
        <div className="space-y-4">
          <Typography variant="body1" color="text-quaternary" className="font-medium">
            {t('about')}
          </Typography>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Typography
                variant="caption1"
                color="text-quaternary"
                className="font-medium min-w-[80px]"
              >
                {t('version')}:
              </Typography>
              <Typography variant="caption1" color="text-quaternary">
                {version}
              </Typography>
            </div>

            <div className="flex items-center gap-3">
              <Typography
                variant="caption1"
                color="text-quaternary"
                className="font-medium min-w-[80px]"
              >
                {t('commit')}:
              </Typography>
              <Typography variant="caption1" color="text-quaternary">
                {commitHash}
                {commitDate && <span className="text-quaternary ml-2">({commitDate})</span>}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
