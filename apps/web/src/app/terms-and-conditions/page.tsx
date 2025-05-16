import { Metadata } from 'next';
import TermsAndConditionsScene from '@/scenes/terms-and-conditions';
import { getMarkdownContent } from '@/utils/markdown';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Pactus Wallet',
  description: 'Terms and Conditions for using the Pactus Web Wallet application.',
};

export default function TermsAndConditionsPage() {
  const { content } = getMarkdownContent('terms-and-conditions');
  return <TermsAndConditionsScene content={content} />;
}
