/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Mount APIs
app.use('/api/fees', require('./api/fees'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/badgeMint', require('./api/badgeMint'));
app.use('/api/sniper', require('./api/sniper'));
app.use('/api/deployToken', require('./api/deployToken'));
app.use('/api/governance', require('./api/governance'));
app.use('/api/lpScore', require('./api/lpScore'));
app.use('/api/mxm', require('./api/mxm'));
app.use('/api/mqm', require('./api/mqm'));
app.use('/api/airdrop', require('./api/airdropSpin'));
app.use('/api/launchpad', require('./api/launchpad'));
app.use('/api/affiliate', require('./api/affiliate'));
app.use('/api/gm', require('./api/gm'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(async () => {
  // Initialize MQM queues before accepting requests (constructor is sync;
  // init() performs the async DB setup that must complete first).
  const { mqmInstance } = require('./models/MQM');
  await mqmInstance.init();

  app.listen(process.env.PORT || 3001, () => {
    console.log(`🚀 TradeOS backend live on port ${process.env.PORT || 3001}`);
  });
}).catch(err => console.error('MongoDB error:', err));
