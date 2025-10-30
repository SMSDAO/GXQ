// File: backend/api/gm.js
// GM Token System - Daily check-in rewards
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GM Balance Schema
const GMBalanceSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastCheckIn: { type: Date, default: null },
  checkIns: [{ 
    date: Date,
    amount: Number,
    bonus: Boolean
  }],
  rank: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const GMBalance = mongoose.model('GMBalance', GMBalanceSchema);

// Daily check-in for GM tokens
router.post('/checkin', async (req, res) => {
  try {
    const { wallet } = req.body;
    
    if (!wallet) {
      return res.status(400).json({ success: false, message: 'Wallet required' });
    }
    
    let user = await GMBalance.findOne({ wallet });
    if (!user) {
      user = new GMBalance({ wallet });
    }
    
    const now = new Date();
    const lastCheckIn = user.lastCheckIn;
    
    // Check if already checked in today
    if (lastCheckIn) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastDay = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
      
      if (today.getTime() === lastDay.getTime()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Already checked in today',
          nextCheckIn: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        });
      }
      
      // Check if consecutive day
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      if (lastDay.getTime() === yesterday.getTime()) {
        user.streak += 1;
      } else {
        user.streak = 1; // Reset streak
      }
    } else {
      user.streak = 1;
    }
    
    // Calculate GM tokens to award
    let baseGM = 10;
    let bonus = 0;
    let hasBonus = false;
    
    // Streak bonuses
    if (user.streak >= 30) {
      bonus += 50; // 30-day streak bonus
      hasBonus = true;
    } else if (user.streak >= 7) {
      bonus += 20; // 7-day streak bonus
      hasBonus = true;
    } else if (user.streak >= 3) {
      bonus += 5; // 3-day streak bonus
      hasBonus = true;
    }
    
    // Weekend bonus
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      bonus += 5;
      hasBonus = true;
    }
    
    const totalGM = baseGM + bonus;
    
    // Update user
    user.balance += totalGM;
    user.totalEarned += totalGM;
    user.lastCheckIn = now;
    user.checkIns.push({
      date: now,
      amount: totalGM,
      bonus: hasBonus
    });
    
    await user.save();
    
    // Update rank
    await updateRanks();
    
    res.json({
      success: true,
      gmTokens: totalGM,
      streak: user.streak,
      balance: user.balance,
      nextCheckIn: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      bonus: hasBonus ? bonus : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get GM balance
router.get('/balance/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const user = await GMBalance.findOne({ wallet });
    if (!user) {
      return res.json({
        success: true,
        balance: 0,
        totalEarned: 0,
        streak: 0,
        rank: 0
      });
    }
    
    res.json({
      success: true,
      balance: user.balance,
      totalEarned: user.totalEarned,
      streak: user.streak,
      rank: user.rank,
      lastCheckIn: user.lastCheckIn
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const leaders = await GMBalance
      .find()
      .sort({ totalEarned: -1 })
      .limit(limit)
      .select('wallet balance totalEarned streak rank');
    
    res.json({
      success: true,
      leaderboard: leaders.map((l, index) => ({
        rank: index + 1,
        wallet: l.wallet.slice(0, 6) + '...' + l.wallet.slice(-4),
        balance: l.balance,
        totalEarned: l.totalEarned,
        streak: l.streak
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Spend GM tokens
router.post('/spend', async (req, res) => {
  try {
    const { wallet, amount, description } = req.body;
    
    if (!wallet || !amount) {
      return res.status(400).json({ success: false, message: 'Wallet and amount required' });
    }
    
    const user = await GMBalance.findOne({ wallet });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    user.balance -= amount;
    await user.save();
    
    res.json({
      success: true,
      spent: amount,
      remainingBalance: user.balance,
      description
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to update all user ranks
async function updateRanks() {
  try {
    const users = await GMBalance.find().sort({ totalEarned: -1 });
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }
  } catch (error) {
    console.error('Error updating ranks:', error);
  }
}

module.exports = router;
