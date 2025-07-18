// import idl from "../idl/anchor_vault.json";
// import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";


// /* Constants for RPC Connection the Solana Blockchain */
// export const commitmentLevel = "processed";
// export const endpoint =
//   process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
// export const connection = new Connection(endpoint, commitmentLevel);


// /* Constants for the Deployed "Hello World" Program */
// export const helloWorldprogramId = new PublicKey(idl.metadata.address);
// export const helloWorldprogramInterface = JSON.parse(JSON.stringify(idl));
// src/constants.ts
"use client"
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/anchor_vault.json";

export const PROGRAM_ID = new PublicKey(idl.address);
export const IDL = idl;

export const VAULT_SEED = "vault";
export const STATE_SEED = "state";
