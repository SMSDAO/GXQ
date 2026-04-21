// File: backend/api/affiliate.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Affiliate Schema
const AffiliateSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  referralCode: { type: String, required: true, unique: true },
  totalReferrals: { type: Number, default: 0 },
  totalEarned: { type: String, default: '0' },
  tier: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  commission: { type: Number, default: 3 }, // Percentage
  referrals: [{ 
    wallet: String,
    timestamp: Date,
    earned: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Affiliate = mongoose.model('Affiliate', AffiliateSchema);

// Register as affiliate
router.post('/register', async (req, res) => {
  try {
    const { wallet, referralCode } = req.body;
    
    if (!wallet) {
      return res.status(400).json({ success: false, message: 'Wallet required' });
    }
    
    // Check if already registered
    let affiliate = await Affiliate.findOne({ wallet });
    if (affiliate) {
      return res.json({ 
        success: true, 
        message: 'Already registered',
        referralCode: affiliate.referralCode
      });
    }
    
    // Generate unique code if not provided
    let code = referralCode || generateReferralCode();
    
    // Check if code already exists
    while (await Affiliate.findOne({ referralCode: code })) {
      code = generateReferralCode();
    }
    
    affiliate = new Affiliate({
      wallet,
      referralCode: code
    });
    
    await affiliate.save();
    
    res.json({
      success: true,
      referralCode: code,
      message: 'Affiliate registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get affiliate stats
router.get('/stats/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const affiliate = await Affiliate.findOne({ wallet });
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }
    
    res.json({
      success: true,
      referralCode: affiliate.referralCode,
      totalReferrals: affiliate.totalReferrals,
      totalEarned: affiliate.totalEarned,
      tier: affiliate.tier,
      commission: `${affiliate.commission}%`,
      referrals: affiliate.referrals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Track referral action
router.post('/track', async (req, res) => {
  try {
    const { referralCode, amount, wallet } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ success: false, message: 'Referral code required' });
    }
    
    const affiliate = await Affiliate.findOne({ referralCode });
    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Invalid referral code' });
    }
    
    // Calculate commission
    const transactionAmount = parseFloat(amount) || 0;
    const commission = (transactionAmount * affiliate.commission) / 100;
    
    // Update affiliate stats
    affiliate.totalReferrals += 1;
    affiliate.totalEarned = (parseFloat(affiliate.totalEarned) + commission).toString();
    
    affiliate.referrals.push({
      wallet,
      timestamp: new Date(),
      earned: commission.toString()
    });
    
    // Update tier based on total earned
    const totalEarned = parseFloat(affiliate.totalEarned);
    if (totalEarned >= 10000) {
      affiliate.tier = 'platinum';
      affiliate.commission = 7;
    } else if (totalEarned >= 5000) {
      affiliate.tier = 'gold';
      affiliate.commission = 5;
    } else if (totalEarned >= 1000) {
      affiliate.tier = 'silver';
      affiliate.commission = 4;
    }
    
    await affiliate.save();
    
    res.json({
      success: true,
      commission: commission.toString(),
      newTier: affiliate.tier,
      totalEarned: affiliate.totalEarned
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const leaders = await Affiliate
      .find()
      .sort({ totalEarned: -1 })
      .limit(limit)
      .select('wallet referralCode totalReferrals totalEarned tier');
    
    res.json({
      success: true,
      leaderboard: leaders.map((l, index) => ({
        rank: index + 1,
        wallet: l.wallet.slice(0, 6) + '...' + l.wallet.slice(-4),
        referralCode: l.referralCode,
        totalReferrals: l.totalReferrals,
        totalEarned: l.totalEarned,
        tier: l.tier
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to generate referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
