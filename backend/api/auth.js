/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res) => {
  const { wallet } = req.body;
  const token = jwt.sign({ wallet }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

module.exports = router;
