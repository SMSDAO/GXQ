/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿const { ethers } = require("hardhat");

async function main() {
  const feePayer = "0x7b861609f4f5977997a6478b09d81a7256d6c748"; // Admin wallet

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ AdminControl
  const AdminControl = await ethers.getContractFactory("AdminControl");
  const adminControl = await AdminControl.deploy();
  await adminControl.waitForDeployment();
  console.log("✅ AdminControl:", await adminControl.getAddress());

  // 2️⃣ VaultController
  const VaultController = await ethers.getContractFactory("VaultController");
  const vaultController = await VaultController.deploy();
  await vaultController.waitForDeployment();
  console.log("✅ VaultController:", await vaultController.getAddress());

  // 3️⃣ LPController
  const LPController = await ethers.getContractFactory("LPController");
  const lpController = await LPController.deploy();
  await lpController.waitForDeployment();
  console.log("✅ LPController:", await lpController.getAddress());

  // 4️⃣ ProfitSplitter
  const ProfitSplitter = await ethers.getContractFactory("ProfitSplitter");
  const profitSplitter = await ProfitSplitter.deploy();
  await profitSplitter.waitForDeployment();
  console.log("✅ ProfitSplitter:", await profitSplitter.getAddress());

  // 5️⃣ TradeOSAccess
  const TradeOSAccess = await ethers.getContractFactory("TradeOSAccess");
  const access = await TradeOSAccess.deploy();
  await access.waitForDeployment();
  console.log("✅ TradeOSAccess:", await access.getAddress());

  // 6️⃣ TradeOSBadges
  const TradeOSBadges = await ethers.getContractFactory("TradeOSBadges");
  const badges = await TradeOSBadges.deploy();
  await badges.waitForDeployment();
  console.log("✅ TradeOSBadges:", await badges.getAddress());

  // 7️⃣ FeeRouter (set feePct = 4 for 0.004 ETH)
  const FeeRouter = await ethers.getContractFactory("FeeRouter");
  const feeRouter = await FeeRouter.deploy(4);
  await feeRouter.waitForDeployment();
  console.log("✅ FeeRouter:", await feeRouter.getAddress());

  // 8️⃣ TradeOSGovernance
  const Governance = await ethers.getContractFactory("TradeOSGovernance");
  const gov = await Governance.deploy();
  await gov.waitForDeployment();
  console.log("✅ TradeOSGovernance:", await gov.getAddress());

  console.log("🚀 All contracts deployed. Fee payer:", feePayer);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
