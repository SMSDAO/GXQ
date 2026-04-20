// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TradeOSAccess is Ownable {
    mapping(address => bool) public admins;

    function addAdmin(address user) external onlyOwner {
        admins