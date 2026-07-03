import { Metadata } from 'next';
import RecoveryPhraseTermScene from '@/scenes/recovery-phrase-notice';
import { getMarkdownContent } from '@/utils/markdown';

export const metadata: Metadata = {
  title: 'Recovery Phrase Notice | Pactus Wallet',
  description: 'Recovery Phrase Notice for using the Pactus Web Wallet application.',
};

export default function RecoveryPhraseTermPage() {
  const { content } = getMarkdownContent('recovery-phrase-notice');
  return <RecoveryPhraseTermScene content={content} />;
}
