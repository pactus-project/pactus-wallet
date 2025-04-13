import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/wallet';
import { I18nProvider } from '@/utils/i18n';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/utils/google-analytics';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Pactus Wallet',
  description:
    'Pactus Wallet is an open-source, client-based wallet for securely managing digital assets on the Pactus blockchain. Non-custodial, fast, and user-friendly.',
  icons: {
    icon: ['/favicon.ico?v=4'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics scripts */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <I18nProvider>
          <WalletProvider>
            {children}
            {/* Page Tracker Component */}
            {GA_MEASUREMENT_ID && <PageTracker />}
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
