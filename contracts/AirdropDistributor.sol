// SPDX-License-Identifier: MIT
// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirdropDistributor {
    bytes32 public merkleRoot;
    IERC20 public token;
    address public admin;
    mapping(address => bool) public claimed;
    mapping(address => uint256) public contributorScore;

    event Claimed(address indexed user, uint256 amount);
    event ScoreSet(address indexed user, uint256 score);

    modifier onlyAdmin() {
        require(msg.sender == admin, "AD: not admin");
        _;
    }

    constructor(address _token, bytes32 _root) {
        admin = msg.sender;
        token = IERC20(_token);
        merkleRoot = _root;
    }

    function setContributorScore(address user, uint256 score) external onlyAdmin {
        contributorScore[user] = score;
        emit ScoreSet(user, score);
    }

    function claim(bytes32[] calldata proof, uint256 amount) external {
        require(!claimed[msg.sender], "AD: already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "AD: invalid proof");
        require(contributorScore[msg.sender] >= 1, "AD: not qualified");

        claimed[msg.sender] = true;
        token.transfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }
}
