import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/wallet";
import { I18nProvider } from "@/utils/i18n";

export const metadata: Metadata = {
  title: "Pactus Wallet",
  description: "Pactus Wallet is an open-source, client-based wallet for securely managing digital assets on the Pactus blockchain. Non-custodial, fast, and user-friendly.",
  icons: {
    icon: ["/favicon.ico?v=4"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <WalletProvider>{children}</WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
