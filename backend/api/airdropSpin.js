// File: backend/api/airdropSpin.js
const express = require('express');
const router = express.Router();

// Airdrop Spin Game API endpoints

// Get all active campaigns
router.get('/campaigns', async (req, res) => {
  try {
    // TODO: Connect to blockchain and fetch campaigns
    // For now, return mock data
    const campaigns = [
      {
        id: '0x1234...', 
        token: '0xTokenAddress',
        tokenName: 'SAMPLE',
        remaining: '10000',
        minReward: '10',
        maxReward: '1000',
        active: true
      }
    ];
    
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user data for specific campaign
router.get('/user-data/:campaignId', async (req, res) => {
  try {
    const userAddress = req.query.address || req.headers['x-wallet-address'];
    
    if (!userAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address required' });
    }
    
    // TODO: Connect to smart contract and fetch user data
    const userData = {
      lastSpin: Date.now() / 1000 - 50000, // Mock: last spin was some time ago
      strikes: 2,
      totalWon: '542.5',
      spinsCount: 15,
      nextSpinTime: Date.now() / 1000 + 3600, // Mock: can spin in 1 hour
      canSpin: false
    };
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Execute spin
router.post('/spin', async (req, res) => {
  try {
    const userAddress = req.body.address || req.headers['x-wallet-address'];
    
    if (!userAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address required' });
    }
    
    // TODO: Connect to smart contract and execute spin
    // For now, return mock reward
    const reward = (Math.random() * 990 + 10).toFixed(2);
    
    res.json({
      success: true,
      reward: `${reward} TOKENS`,
      txHash: '0xmocktransactionhash'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new campaign (launcher only)
router.post('/create-campaign', async (req, res) => {
  try {
    const launcherAddress = req.body.address || req.headers['x-wallet-address'];
    
    if (!launcherAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address required' });
    }
    
    // TODO: Verify launcher is approved and create campaign on blockchain
    
    res.json({
      success: true,
      campaignId: '0xnewcampaignid',
      message: 'Campaign created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
