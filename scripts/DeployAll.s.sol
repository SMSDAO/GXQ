// SPDX-License-Identifier: UNLICENSED
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.17;

import "forge-std/Script.sol";

// import your contracts
import { AdminControl }      from "src/AdminControl.sol";
import { VaultController }   from "src/VaultController.sol";
import { LPController }      from "src/LPController.sol";
import { ProfitSplitter }    from "src/ProfitSplitter.sol";
import { TradeOSAccess }     from "src/TradeOSAccess.sol";
import { TradeOSBadges }     from "src/TradeOSBadges.sol";
import { FeeRouter }         from "src/FeeRouter.sol";
import { TradeOSGovernance } from "src/TradeOSGovernance.sol";

contract DeployAll is Script {
    function run() external {
        // Load deployer key from env: PRIVATE_KEY
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        AdminControl      adminControl      = new AdminControl();
        VaultController   vaultController   = new VaultController();
        LPController      lpController      = new LPController();
        ProfitSplitter    profitSplitter    = new ProfitSplitter();
        TradeOSAccess     access            = new TradeOSAccess();
        TradeOSBadges     badges            = new TradeOSBadges();
        FeeRouter         feeRouter         = new FeeRouter(4); // feePct = 4
        TradeOSGovernance governance         = new TradeOSGovernance();

        // Log out addresses
        console.log("AdminControl:      ", address(adminControl));
        console.log("VaultController:   ", address(vaultController));
        console.log("LPController:      ", address(lpController));
        console.log("ProfitSplitter:    ", address(profitSplitter));
        console.log("TradeOSAccess:     ", address(access));
        console.log("TradeOSBadges:     ", address(badges));
        console.log("FeeRouter:         ", address(feeRouter));
        console.log("TradeOSGovernance: ", address(governance));

        vm.stopBroadcast();
    }
}
