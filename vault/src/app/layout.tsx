"use client"
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';


const wallets = [new PhantomWalletAdapter()];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Vault",
//   description: "dapp to store and withdraw lamports!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
             {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>  
      </body>
    </html>
  );
}
