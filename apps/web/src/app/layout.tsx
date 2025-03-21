import type { Metadata } from "next";
import "./globals.css";
import GuardProvider from "@/providers/guard";
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
      <GuardProvider>{children}</GuardProvider>
      </body>
    </html>
  );
}
