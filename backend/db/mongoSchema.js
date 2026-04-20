/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: Number,
  owner: String,
  mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
