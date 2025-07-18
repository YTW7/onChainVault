"use client"
import {
  AnchorProvider,
  Program,
  web3,
  BN,
  Idl,
} from "@coral-xyz/anchor";
import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";
// import { PROGRAM_ID } from "../constants";
import idl from "../idl/anchor_vault.json";
import { AnchorVault } from "../types/anchor_vault";
// PDA seeds
const STATE_SEED = "state";
const VAULT_SEED = "vault";

export function getVaultProgram(
  provider: AnchorProvider
): Program<AnchorVault> {
  return new Program(idl as AnchorVault, provider);
}

// vault state pda
export const getVaultStatePDA = (
  userPubkey: PublicKey,
  programId: PublicKey
) => {
  const [vaultState] = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), userPubkey.toBuffer()],
    programId
  );
  return vaultState;
};

// vault pda
export const getVaultPDA = (
  vaultStatePubkey: PublicKey,
  programId: PublicKey
) => {
  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePubkey.toBuffer()],
    programId
  );
  return vault;
};


export const initializeVault = async (
  program: Program<AnchorVault>,
  userPubkey: PublicKey
) => {

  const wallet = program.provider.wallet;
  if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet or wallet publicKey is undefined");
    }
  // Derive PDA for vault_state
  const vaultState = getVaultStatePDA(wallet.publicKey, program.programId);
    const vault = getVaultPDA(vaultState, program.programId);

  const tx = await program.methods
    .initialize()
    .accountsPartial({
      user: userPubkey,
      vaultState,
      vault,
      systemProgram: PublicKey.default,
    })
    .rpc();

  return tx;
};

// --- deposit sol to vault
export const deposit = async (
  amount: number,
  program: Program<AnchorVault>
) => {
  //   const program = getVaultProgram();
  try {
    const wallet = program.provider.wallet;

    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet or wallet publicKey is undefined");
    }

    const user = wallet.publicKey;
    const vaultState = getVaultStatePDA(user, program.programId);
    const vault = getVaultPDA(vaultState, program.programId);

    const tx = await program.methods
      .deposit(new BN(amount))
      .accountsPartial({
        user,
        vault,
        vaultState,
        systemProgram: PublicKey.default,
      })
      .rpc();
    console.log("tx : ", tx);
  } catch (e) {
    console.error("error depositing SOL : ", e);
  }
};

export const withdrawFromVault = async (
  amount: number,
  program: Program<AnchorVault>
) => {

  const wallet = program.provider.wallet;
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet or wallet publicKey is undefined");
  }
  const user = wallet.publicKey;
  const vaultState = getVaultStatePDA(user, program.programId);
  const vault = getVaultPDA(vaultState, program.programId);

  const tx = await program.methods
    .withdraw(new BN(amount))
    .accountsPartial({
      user,
      vaultState,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
    console.log("tx : ", tx);

  return tx;
};
