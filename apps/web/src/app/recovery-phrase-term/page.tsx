import { Metadata } from 'next';
import RecoveryPhraseTermScene from '@/scenes/recovery_phrase_term';
import { getMarkdownContent } from '@/utils/markdown';

export const metadata: Metadata = {
  title: 'Recovery Phrase Term | Pactus Wallet',
  description: 'Recovery Phrase Term for using the Pactus Web Wallet application.',
};

export default function RecoveryPhraseTermPage() {
  const { content } = getMarkdownContent('recovery_phrase_term');
  return <RecoveryPhraseTermScene content={content} />;
}
