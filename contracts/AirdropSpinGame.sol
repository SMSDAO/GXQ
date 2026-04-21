// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AirdropSpinGame
 * @dev Gamified airdrop system where launchers can deposit tokens for users to claim
 * Users can spin every 12 hours, with strike system reducing wait time
 */
contract AirdropSpinGame is ReentrancyGuard {
    using SafeERC20 for IERC20;
    address public admin;
    
    struct Campaign {
        address token;
        address launcher;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 minReward;
        uint256 maxReward;
        bool active;
    }
    
    struct UserData {
        uint256 lastSpin;
        uint256 strikes; // Consecutive days played
        uint256 totalWon;
        uint256 spinsCount;
    }
    
    mapping(bytes32 => Campaign) public campaigns;
    mapping(address => uint256) private campaignCounter; // per-launcher nonce to avoid campaignId collisions
    mapping(address => mapping(bytes32 => UserData)) public userData;
    // Commit-reveal storage: users first commit keccak256(user,campaignId,nonce),
    // then reveal nonce in a later block to reduce reward manipulation.
    mapping(address => mapping(bytes32 => bytes32)) private spinCommitments;
    mapping(address => mapping(bytes32 => uint256)) private spinCommitBlock;
    mapping(address => bool) public approvedLaunchers;
    
    uint256 public constant BASE_WAIT_TIME = 12 hours;
    uint256 public constant STRIKE_BONUS_DAYS = 3;
    uint256 public constant COMMITMENT_EXPIRATION_BLOCKS = 256;
    uint256 public devFeePercent = 2; // 2% dev fee
    uint256 public launcherFeePercent = 1; // 1% launcher fee
    
    address public devWallet;
    address public gxqStudio;
    
    event CampaignCreated(bytes32 indexed campaignId, address indexed launcher, address token, uint256 amount);
    event SpinExecuted(address indexed user, bytes32 indexed campaignId, uint256 reward);
    event StrikeAchieved(address indexed user, uint256 strikes);
    event SpinCommitted(address indexed user, bytes32 indexed campaignId, bytes32 commitment);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    constructor(address _devWallet, address _gxqStudio) {
        admin = msg.sender;
        devWallet = _devWallet;
        gxqStudio = _gxqStudio;
    }
    
    /**
     * @dev Create airdrop campaign - launcher deposits tokens
     */
    function createCampaign(
        address token,
        uint256 amount,
        uint256 minReward,
        uint256 maxReward
    ) external nonReentrant returns (bytes32) {
        require(approvedLaunchers[msg.sender] || msg.sender == admin, "Not approved launcher");
        require(amount > 0, "Amount must be > 0");
        require(maxReward <= amount / 10, "Max reward too high");
        require(minReward < maxReward, "Invalid reward range");
        
        bytes32 campaignId = keccak256(abi.encodePacked(msg.sender, token, block.timestamp, campaignCounter[msg.sender]));
        campaignCounter[msg.sender] += 1;
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        campaigns[campaignId] = Campaign({
            token: token,
            launcher: msg.sender,
            totalAmount: amount,
            remainingAmount: amount,
            minReward: minReward,
            maxReward: maxReward,
            active: true
        });
        
        emit CampaignCreated(campaignId, msg.sender, token, amount);
        return campaignId;
    }
    
    /**
     * @dev Calculate wait time for a user in a given campaign.
     * Reduces by 10% per STRIKE_BONUS_DAYS consecutive strikes, capped at 50% reduction.
     * @param user The address of the user
     * @param campaignId The campaign identifier
     */
    function getWaitTime(address user, bytes32 campaignId) public view returns (uint256) {
        uint256 strikes = userData[user][campaignId].strikes;
        if (strikes < STRIKE_BONUS_DAYS) {
            return BASE_WAIT_TIME;
        }
        // Each full group of STRIKE_BONUS_DAYS reduces wait by 10%, cap at 5 groups (50%)
        uint256 reductionGroups = strikes / STRIKE_BONUS_DAYS;
        if (reductionGroups > 5) reductionGroups = 5;
        uint256 reduction = (BASE_WAIT_TIME * reductionGroups * 10) / 100;
        return BASE_WAIT_TIME - reduction;
    }
    
    /**
     * @dev Execute spin - randomized reward within range
     */
    function spin(bytes32 campaignId, bytes32 nonce) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.active, "Campaign not active");
        require(campaign.remainingAmount > 0, "Campaign depleted");
        
        UserData storage user = userData[msg.sender][campaignId];
        uint256 waitTime = getWaitTime(msg.sender, campaignId);
        
        require(
            user.lastSpin == 0 || block.timestamp >= user.lastSpin + waitTime,
            "Must wait before next spin"
        );

        bytes32 storedCommitment = spinCommitments[msg.sender][campaignId];
        uint256 committedAtBlock = spinCommitBlock[msg.sender][campaignId];
        require(storedCommitment != bytes32(0), "Commitment required");
        require(block.number > committedAtBlock, "Wait one block after commit");
        require(
            block.number - committedAtBlock <= COMMITMENT_EXPIRATION_BLOCKS,
            "Commitment expired"
        );
        require(
            keccak256(abi.encodePacked(msg.sender, campaignId, nonce)) == storedCommitment,
            "Invalid commitment reveal"
        );
        delete spinCommitments[msg.sender][campaignId];
        delete spinCommitBlock[msg.sender][campaignId];
        
        uint256 reward = _calculateReward(
            campaign.minReward,
            campaign.maxReward,
            msg.sender,
            campaign.remainingAmount,
            campaignId,
            nonce,
            committedAtBlock
        );
        require(reward <= campaign.remainingAmount, "Insufficient campaign funds");
        
        // Update strikes
        if (user.lastSpin > 0 && block.timestamp <= user.lastSpin + 25 hours) {
            // Within 24h + 1h grace period
            user.strikes++;
            if (user.strikes % STRIKE_BONUS_DAYS == 0) {
                emit StrikeAchieved(msg.sender, user.strikes);
            }
        } else if (user.lastSpin > 0) {
            // Reset strikes if missed a day
            user.strikes = 1;
        } else {
            user.strikes = 1;
        }
        
        user.lastSpin = block.timestamp;
        user.spinsCount++;
        user.totalWon += reward;
        
        // Calculate fees
        uint256 devFee = (reward * devFeePercent) / 100;
        uint256 launcherFee = (reward * launcherFeePercent) / 100;
        uint256 userReward = reward - devFee - launcherFee;
        
        campaign.remainingAmount -= reward;
        
        // Transfer rewards
        IERC20(campaign.token).safeTransfer(msg.sender, userReward);
        IERC20(campaign.token).safeTransfer(devWallet, devFee);
        IERC20(campaign.token).safeTransfer(gxqStudio, launcherFee);
        
        emit SpinExecuted(msg.sender, campaignId, userReward);
    }
    
    /**
     * @dev Commit a spin nonce hash before calling spin().
     * commitment must be keccak256(abi.encodePacked(user, campaignId, nonce)).
     */
    function commitSpin(bytes32 campaignId, bytes32 commitment) external {
        require(commitment != bytes32(0), "Invalid commitment");
        spinCommitments[msg.sender][campaignId] = commitment;
        spinCommitBlock[msg.sender][campaignId] = block.number;
        emit SpinCommitted(msg.sender, campaignId, commitment);
    }

    /**
     * @dev Commit-reveal based reward calculation using a prior-block hash and user nonce reveal.
     */
    function _calculateReward(
        uint256 min,
        uint256 max,
        address user,
        uint256 remaining,
        bytes32 campaignId,
        bytes32 nonce,
        uint256 committedAtBlock
    ) private view returns (uint256) {
        require(max > min, "Invalid reward range");
        bytes32 commitBlockHash = blockhash(committedAtBlock);
        require(commitBlockHash != bytes32(0), "Commit block too old (>256 blocks)");

        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    commitBlockHash,
                    user,
                    campaignId,
                    nonce,
                    remaining
                )
            )
        );
        uint256 range = max - min + 1;
        uint256 reward = min + (randomHash % range);
        
        // Ensure we don't exceed remaining
        if (reward > remaining) {
            reward = remaining;
        }
        
        return reward;
    }
    
    /**
     * @dev Admin functions
     */
    function approveLauncher(address launcher, bool approved) external onlyAdmin {
        approvedLaunchers[launcher] = approved;
    }
    
    function setFees(uint256 _devFee, uint256 _launcherFee) external onlyAdmin {
        require(_devFee + _launcherFee <= 10, "Fees too high");
        devFeePercent = _devFee;
        launcherFeePercent = _launcherFee;
    }
    
    function pauseCampaign(bytes32 campaignId, bool paused) external {
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.launcher || msg.sender == admin, "Not authorized");
        campaign.active = !paused;
    }
    
    function emergencyWithdraw(bytes32 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.launcher || msg.sender == admin, "Not authorized");
        require(campaign.remainingAmount > 0, "Nothing to withdraw");
        
        uint256 amount = campaign.remainingAmount;
        campaign.remainingAmount = 0;
        campaign.active = false;
        
        IERC20(campaign.token).safeTransfer(campaign.launcher, amount);
    }
    
    /**
     * @dev View functions
     */
    function getUserData(address user, bytes32 campaignId) external view returns (
        uint256 lastSpin,
        uint256 strikes,
        uint256 totalWon,
        uint256 spinsCount,
        uint256 nextSpinTime
    ) {
        UserData memory data = userData[user][campaignId];
        uint256 waitTime = getWaitTime(user, campaignId);
        uint256 nextSpin = data.lastSpin > 0 ? data.lastSpin + waitTime : 0;
        
        return (data.lastSpin, data.strikes, data.totalWon, data.spinsCount, nextSpin);
    }
    
    function canSpin(address user, bytes32 campaignId) external view returns (bool) {
        Campaign memory campaign = campaigns[campaignId];
        if (!campaign.active || campaign.remainingAmount == 0) return false;
        
        UserData memory data = userData[user][campaignId];
        if (data.lastSpin == 0) return true;
        
        uint256 waitTime = getWaitTime(user, campaignId);
        return block.timestamp >= data.lastSpin + waitTime;
    }
}
