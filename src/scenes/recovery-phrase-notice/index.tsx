'use client';

import React, { Suspense } from 'react';
import { useI18n } from '@/utils/i18n';
import MarkdownRenderer from '@/components/markdown-renderer';

interface RecoveryPhraseTermContentProps {
  content: string;
}

const RecoveryPhraseTermContent: React.FC<RecoveryPhraseTermContentProps> = ({ content }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <MarkdownRenderer content={content} />
    </div>
  );
};

const RecoveryPhraseTerm: React.FC<{ content: string }> = ({ content }) => {
  const { t } = useI18n();

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <div className="flex flex-col min-h-[100dvh] w-full px-4 py-8 items-center">
        <RecoveryPhraseTermContent content={content} />
      </div>
    </Suspense>
  );
};

export default RecoveryPhraseTerm;
