// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

interface IDEX {
    function getExpectedReturn(address from, address to, uint256 amount) external view returns (uint256);
    function swap(address from, address to, uint256 amount) external;
}

contract FrontRunnerBot {
    address public owner;
    IDEX public dex;

    constructor(address _dex) {
        owner = msg.sender;
        dex = IDEX(_dex);
    }

    function snipe(address from, address to, uint256 amount) external {
        uint256 expected = dex.getExpectedReturn(from, to, amount);
        require(expected > amount, "No profit");

        dex.swap(from, to, amount);
    }
}
