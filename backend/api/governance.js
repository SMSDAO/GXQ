/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const proposals = [
    { id: 1, title: 'Mint Badge Tier 2', votes: 214 },
    { id: 2, title: 'Enable DAO Vaults', votes: 151 }
  ];
  res.json({ success: true, data: proposals });
});

module.exports = router;
