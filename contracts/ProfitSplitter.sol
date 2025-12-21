// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

/**
 * @title ProfitSplitter
 * @notice Splits profits between reserve wallet and transaction initiator
 * @dev 80% to reserve, 20% to initiating wallet
 */
contract ProfitSplitter {
    address public admin = 0x7b861609f4f5977997a6478b09d81a7256d6c748;
    address public reserveWallet = 0x7b861609f4f5977997a6478b09d81a7256d6c748;
    
    uint256 public constant RESERVE_PERCENT = 80;
    uint256 public constant INITIATOR_PERCENT = 20;
    
    event ProfitSplit(address indexed initiator, uint256 initiatorAmount, uint256 reserveAmount);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "PS: not admin");
        _;
    }
    
    /**
     * @notice Split profits from a transaction
     * @param initiator The address that initiated the profitable transaction
     */
    function splitProfit(address payable initiator) external payable {
        require(msg.value > 0, "PS: no profit to split");
        
        uint256 total = msg.value;
        uint256 reserveAmount = (total * RESERVE_PERCENT) / 100;
        uint256 initiatorAmount = (total * INITIATOR_PERCENT) / 100;
        
        // Send to reserve wallet
        (bool sentReserve, ) = payable(reserveWallet).call{value: reserveAmount}("");
        require(sentReserve, "PS: reserve transfer failed");
        
        // Send to initiator
        (bool sentInitiator, ) = initiator.call{value: initiatorAmount}("");
        require(sentInitiator, "PS: initiator transfer failed");
        
        emit ProfitSplit(initiator, initiatorAmount, reserveAmount);
    }
    
    /**
     * @notice Update reserve wallet address
     * @param newReserve New reserve wallet address
     */
    function setReserveWallet(address newReserve) external onlyAdmin {
        require(newReserve != address(0), "PS: zero address");
        reserveWallet = newReserve;
    }
    
    /**
     * @notice Emergency rescue function
     */
    function rescue(address payable to, uint256 amount) external onlyAdmin {
        require(to != address(0), "PS: zero address");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "PS: rescue failed");
    }
    
    receive() external payable {}
}
