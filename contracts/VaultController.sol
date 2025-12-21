// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

contract VaultController {
    address public admin;
    mapping(address => bool) public registeredVaults;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function registerVault(address vault) external onlyAdmin {
        registeredVaults[vault] = true;
    }

    function withdrawFromVault(address payable vault, uint256 amount) external onlyAdmin {
        require(registeredVaults[vault], "Not registered");
        vault.transfer(amount);
    }

    receive() external payable {}
}
