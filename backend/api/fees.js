/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: { swapFee: 0.0025, mintFee: 0.001 }
  });
});

module.exports = router;
