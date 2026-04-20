/**
 * ============================================================================
 * TradeOS TypeScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿import * as anchor from "@coral-xyz/anchor";

export async function deploySPLVaultRouter() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SplVaultRouter as anchor.Program<any>;

  try {
    const reserveWallet = new anchor.web3.PublicKey(
      "J7bNrvf26uiWWg8sM43eQMwunaPgmvi7pdRC55CnebPE"
    );

    const tx = await program.methods
      .reroute(new anchor.BN(1000000)) // 0.01 SOL
      .accounts({
        user: provider.wallet.publicKey,
        reserveWallet
      })
      .rpc();

    console.log("✅ SPLVaultRouter deployed and reroute tx sent:", tx);
  } catch (err) {
    console.error("❌ Deployment failed:", err);
  }
}

deploySPLVaultRouter();
