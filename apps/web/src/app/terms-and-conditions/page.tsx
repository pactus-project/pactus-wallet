import TermsAndConditionsScene from '@/scenes/terms-and-conditions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Pactus Wallet',
  description: 'Terms and Conditions for using the Pactus Web Wallet application.',
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsScene />;
}
