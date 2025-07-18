"use client";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export function useAnchorProvider(): AnchorProvider {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}