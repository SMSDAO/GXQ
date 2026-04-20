/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { recipient, badgeId } = req.body;
  res.json({ success: true, txHash: '0xMockMintHash' });
});

module.exports = router;
