// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract AdminControl {
    address public admin = 0x7b861609f4f5977997a6478b09d81a7256d6c748;
    bool public paused;

    mapping(address => bool) public frozen;
    mapping(address => string) public role;

    event RoleAssigned(address indexed user, string roleName);
    event Frozen(address indexed user, bool isFrozen);
    event Paused(bool paused);
    event Rescued(address indexed token, address indexed to, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "AdminControl: not admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "AdminControl: paused");
        _;
    }

    // Role management
    function assignRole(address user, string calldata roleName) external onlyAdmin {
        role[user] = roleName;
        emit RoleAssigned(user, roleName);
    }

    // Freeze/unfreeze user
    function setFrozen(address user, bool isFrozen) external onlyAdmin {
        frozen[user] = isFrozen;
        emit Frozen(user, isFrozen);
    }

    // Global pause/unpause
    function pause() external onlyAdmin {
        paused = true;
        emit Paused(true);
    }

    function unpause() external onlyAdmin {
        paused = false;
        emit Paused(false);
    }

    // Rescue stuck ETH/ERC20
    function rescue(
        address token,
        address payable to,
        uint256 amount
    ) external onlyAdmin {
        if (token == address(0)) {
            to.transfer(amount);
        } else {
            IERC20(token).transfer(to, amount);
        }
        emit Rescued(token, to, amount);
    }

    // Fallback to receive ETH
    receive() external payable {}
}
