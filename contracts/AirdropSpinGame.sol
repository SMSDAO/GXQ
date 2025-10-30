// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AirdropSpinGame
 * @dev Gamified airdrop system where launchers can deposit tokens for users to claim
 * Users can spin every 12 hours, with strike system reducing wait time
 */
contract AirdropSpinGame is ReentrancyGuard {
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
    mapping(address => mapping(bytes32 => UserData)) public userData;
    mapping(address => bool) public approvedLaunchers;
    
    uint256 public constant BASE_WAIT_TIME = 12 hours;
    uint256 public constant STRIKE_BONUS_DAYS = 3;
    uint256 public devFeePercent = 2; // 2% dev fee
    uint256 public launcherFeePercent = 1; // 1% launcher fee
    
    address public devWallet;
    address public gxqStudio;
    
    event CampaignCreated(bytes32 indexed campaignId, address indexed launcher, address token, uint256 amount);
    event SpinExecuted(address indexed user, bytes32 indexed campaignId, uint256 reward);
    event StrikeAchieved(address indexed user, uint256 strikes);
    
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
        
        bytes32 campaignId = keccak256(abi.encodePacked(msg.sender, token, block.timestamp));
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
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
     * @dev Calculate wait time based on strikes
     */
    function getWaitTime(address user) public view returns (uint256) {
        uint256 totalStrikes = 0;
        // Sum strikes from all campaigns
        // This is simplified - in production, track globally
        
        if (totalStrikes == 0) return BASE_WAIT_TIME;
        if (totalStrikes < STRIKE_BONUS_DAYS) return BASE_WAIT_TIME;
        
        // After 3 days of strikes, reduce wait time
        uint256 reduction = (totalStrikes - STRIKE_BONUS_DAYS + 1) * 1 hours;
        if (reduction >= BASE_WAIT_TIME - 2 hours) {
            return 2 hours; // Minimum 2 hours wait
        }
        
        return BASE_WAIT_TIME - reduction;
    }
    
    /**
     * @dev Execute spin - randomized reward within range
     */
    function spin(bytes32 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.active, "Campaign not active");
        require(campaign.remainingAmount > 0, "Campaign depleted");
        
        UserData storage user = userData[msg.sender][campaignId];
        uint256 waitTime = getWaitTime(msg.sender);
        
        require(
            user.lastSpin == 0 || block.timestamp >= user.lastSpin + waitTime,
            "Must wait before next spin"
        );
        
        // Calculate reward (pseudo-random)
        uint256 reward = _calculateReward(campaign.minReward, campaign.maxReward, msg.sender, campaign.remainingAmount);
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
        IERC20(campaign.token).transfer(msg.sender, userReward);
        IERC20(campaign.token).transfer(devWallet, devFee);
        IERC20(campaign.token).transfer(gxqStudio, launcherFee);
        
        emit SpinExecuted(msg.sender, campaignId, userReward);
    }
    
    /**
     * @dev Pseudo-random reward calculation
     */
    function _calculateReward(
        uint256 min,
        uint256 max,
        address user,
        uint256 remaining
    ) private view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, user, remaining))
        );
        uint256 range = max - min;
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
        
        IERC20(campaign.token).transfer(campaign.launcher, amount);
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
        uint256 waitTime = getWaitTime(user);
        uint256 nextSpin = data.lastSpin > 0 ? data.lastSpin + waitTime : 0;
        
        return (data.lastSpin, data.strikes, data.totalWon, data.spinsCount, nextSpin);
    }
    
    function canSpin(address user, bytes32 campaignId) external view returns (bool) {
        Campaign memory campaign = campaigns[campaignId];
        if (!campaign.active || campaign.remainingAmount == 0) return false;
        
        UserData memory data = userData[user][campaignId];
        if (data.lastSpin == 0) return true;
        
        uint256 waitTime = getWaitTime(user);
        return block.timestamp >= data.lastSpin + waitTime;
    }
}
