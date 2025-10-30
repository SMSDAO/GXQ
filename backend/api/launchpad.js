// File: backend/api/launchpad.js
const express = require('express');
const router = express.Router();
const { launchpadService } = require('../services/launchpadIntegration');

// Get Jupiter swap quote
router.get('/jupiter/quote', async (req, res) => {
  try {
    const { inputMint, outputMint, amount, slippage } = req.query;
    
    if (!inputMint || !outputMint || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    const quote = await launchpadService.getJupiterQuote(
      inputMint,
      outputMint,
      parseInt(amount),
      parseInt(slippage) || 50
    );
    
    res.json(quote);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Execute Jupiter swap
router.post('/jupiter/swap', async (req, res) => {
  try {
    const { quoteResponse, userPublicKey } = req.body;
    
    if (!quoteResponse || !userPublicKey) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    const swap = await launchpadService.executeJupiterSwap(quoteResponse, userPublicKey);
    res.json(swap);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Raydium pool info
router.get('/raydium/pool/:poolId', async (req, res) => {
  try {
    const { poolId } = req.params;
    const poolInfo = await launchpadService.getRaydiumPoolInfo(poolId);
    res.json(poolInfo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all Raydium pools
router.get('/raydium/pools', async (req, res) => {
  try {
    const pools = await launchpadService.getRaydiumPools();
    res.json(pools);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get new token launches
router.get('/launches/new', async (req, res) => {
  try {
    const launches = await launchpadService.getNewLaunches();
    res.json(launches);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get token prices
router.post('/prices', async (req, res) => {
  try {
    const { mints } = req.body;
    
    if (!mints || !Array.isArray(mints)) {
      return res.status(400).json({
        success: false,
        message: 'Mints array required'
      });
    }
    
    const prices = await launchpadService.getTokenPrices(mints);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sniper bot - get opportunities
router.post('/sniper/opportunities', async (req, res) => {
  try {
    const config = req.body;
    const opportunities = await launchpadService.sniperBot(config);
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate dynamic slippage
router.post('/calculate-slippage', async (req, res) => {
  try {
    const { liquidity, volume24h, volatility } = req.body;
    
    const slippage = launchpadService.calculateDynamicSlippage(
      liquidity || 100000,
      volume24h || 10000,
      volatility || 0.05
    );
    
    res.json({
      success: true,
      slippageBps: slippage,
      slippagePercent: (slippage / 100).toFixed(2) + '%'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
