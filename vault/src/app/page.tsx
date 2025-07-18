"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import useIsMounted from "./api/utils/useIsMounted";
import { useAnchorProvider } from "./api/hooks/useAnchorVault";
// import styles from "../../styles/Home.module.css";
import { initializeVault,  withdrawFromVault, getVaultProgram, deposit,  } from "./api/utils/vault_helper";
import { PublicKey } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
export default function Home() {
  const mounted = useIsMounted();
  const { publicKey } = useWallet();
  // const { program } = useAnchorProvider();
  const provider = useAnchorProvider();

  const [amount, setAmount] = useState(0);
  const [log, setLog] = useState("");

  const handleInitialize = async () => {
    try {
      // if (!program || !publicKey) throw new Error("Wallet or Program not ready");
      const program = getVaultProgram(provider);
      await initializeVault(program, new PublicKey(publicKey!));
      setLog("✅ Vault initialized successfully");
    } catch (err: any) {
      setLog(`❌ Init Error: ${err.message}`);
    }
  };
const amountInSol = amount * LAMPORTS_PER_SOL;
  const handleDeposit = async () => {
    try {
      const program = getVaultProgram(provider);
      if (!program || !publicKey) throw new Error("Wallet or Program not ready");
      if (!amount || isNaN(Number(amount))) throw new Error("Invalid amount");
      await deposit(amountInSol, program);
      setLog(`✅ Deposited ${amount} lamports`);
    } catch (err: any) {
      setLog(`❌ Deposit Error: ${err.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const program = getVaultProgram(provider);
      if ( !publicKey) throw new Error("Wallet or Program not ready");
      if (!amount || isNaN(Number(amount))) throw new Error("Invalid amount");
      await withdrawFromVault( amountInSol, program);
      setLog(`✅ Withdrew ${amount} lamports`);
    } catch (err: any) {
      setLog(`❌ Withdraw Error: ${err.message}`);
    }
  };

  return (
    <div >
      <div >{mounted && <WalletMultiButton />}</div>

      <div >
        <h1 >Vault dApp with Anchor</h1>

        {!publicKey  ? (
          <p>Please connect your wallet to get started.</p>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              <button onClick={handleInitialize}>Initialize Vault</button>
            </div>

            <div>
              <input
                type="number"
                placeholder="Amount in lamports"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
              />
              <div style={{ marginTop: "10px" }}>
                <button onClick={handleDeposit}>Deposit</button>
                <button onClick={handleWithdraw} style={{ marginLeft: "10px" }}>
                  Withdraw
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: "20px", color: "green" }}>{log}</div>
      </div>
    </div>
  );
}
