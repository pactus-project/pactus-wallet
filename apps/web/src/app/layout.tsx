import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../assets/styles/globals.css';
import { WalletProvider } from '@/wallet';
import { I18nProvider } from '@/utils/i18n';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/utils/google-analytics';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Suspense } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Don't load analytics in development
const isDev = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
  title: 'Pactus Wallet',
  description:
    'Pactus Wallet is an open-source, client-based wallet for securely managing digital assets on the Pactus blockchain. Non-custodial, fast, and user-friendly.',
  icons: {
    icon: ['/favicon.ico?v=4'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Google Analytics - only load in non-development environments */}
        {!isDev && GA_MEASUREMENT_ID && (
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
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <I18nProvider>
          <WalletProvider>
            {!isDev && GA_MEASUREMENT_ID && <GoogleAnalytics />}
            <Suspense
              fallback={
                <div className="flex justify-center items-center w-full h-screen text-lg" aria-label="Loading dashboard">
                  <span className="visually-hidden">Loading dashboard content</span>
                  Loading...
                </div>
              }
            >
              <main className="flex w-full min-h-[100dvh]">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-[219px]">
                  <Header />
                  {children}
                </div>
              </main>
            </Suspense>
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
