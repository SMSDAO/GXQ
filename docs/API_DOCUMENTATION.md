# 🚀 TradeOS GXQ Studio API Documentation

**Base URL**: `https://jup-nine.vercel.app/api`

## 📋 Table of Contents
- [Airdrop Spin Game](#airdrop-spin-game)
- [Launchpad Integration](#launchpad-integration)
- [Jupiter Aggregator](#jupiter-aggregator)
- [Raydium Integration](#raydium-integration)
- [Sniper Bot](#sniper-bot)
- [MXM - Model Execution Manager](#mxm)
- [MQM - Model Queue Manager](#mqm)
- [Affiliate System](#affiliate-system)

---

## 🎰 Airdrop Spin Game

### Get Active Campaigns
```http
GET /api/airdrop/campaigns
```

**Response:**
```json
{
  "success": true,
  "campaigns": [{
    "id": "0x...",
    "token": "0x...",
    "tokenName": "TOKEN",
    "remaining": "10000",
    "minReward": "10",
    "maxReward": "1000",
    "active": true
  }]
}
```

### Get User Data
```http
GET /api/airdrop/user-data/:campaignId?address=0x...
```

**Response:**
```json
{
  "lastSpin": 1234567890,
  "strikes": 3,
  "totalWon": "542.5",
  "spinsCount": 15,
  "nextSpinTime": 1234567890,
  "canSpin": true
}
```

### Execute Spin
```http
POST /api/airdrop/spin
Content-Type: application/json

{
  "campaignId": "0x...",
  "address": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "reward": "125.5 TOKENS",
  "txHash": "0x..."
}
```

### Create Campaign (Launcher Only)
```http
POST /api/airdrop/create-campaign
Content-Type: application/json

{
  "token": "0x...",
  "amount": "10000",
  "minReward": "10",
  "maxReward": "1000",
  "address": "0x..."
}
```

---

## 🚀 Launchpad Integration

### Get New Token Launches
```http
GET /api/launchpad/launches/new
```

**Response:**
```json
{
  "success": true,
  "launches": [{
    "platform": "Raydium",
    "token": "mint_address",
    "symbol": "TKN",
    "name": "Token Name",
    "liquidity": "50000",
    "launchTime": "2025-01-01T00:00:00Z"
  }],
  "count": 5
}
```

### Get Token Prices
```http
POST /api/launchpad/prices
Content-Type: application/json

{
  "mints": ["mint1", "mint2", "mint3"]
}
```

**Response:**
```json
{
  "success": true,
  "prices": {
    "mint1": 1.25,
    "mint2": 0.50,
    "mint3": 10.00
  }
}
```

---

## 🔄 Jupiter Aggregator

### Get Swap Quote
```http
GET /api/launchpad/jupiter/quote
  ?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
  &outputMint=So11111111111111111111111111111111111111112
  &amount=1000000
  &slippage=50
```

**Parameters:**
- `inputMint`: Token mint address to swap from
- `outputMint`: Token mint address to swap to
- `amount`: Amount in smallest unit (e.g., lamports for SOL)
- `slippage`: Slippage tolerance in basis points (50 = 0.5%)

**Response:**
```json
{
  "success": true,
  "data": {...},
  "route": [...],
  "outputAmount": "985000",
  "priceImpact": "0.5"
}
```

### Execute Swap
```http
POST /api/launchpad/jupiter/swap
Content-Type: application/json

{
  "quoteResponse": {...},
  "userPublicKey": "wallet_address"
}
```

**Response:**
```json
{
  "success": true,
  "swapTransaction": "base64_encoded_transaction"
}
```

---

## 💧 Raydium Integration

### Get Pool Information
```http
GET /api/launchpad/raydium/pool/:poolId
```

**Response:**
```json
{
  "success": true,
  "pool": {...},
  "liquidity": "500000",
  "volume24h": "100000",
  "apy": "125.5"
}
```

### Get All Pools
```http
GET /api/launchpad/raydium/pools
```

**Response:**
```json
{
  "success": true,
  "pools": [...]
}
```

---

## 🎯 Sniper Bot

### Get Trading Opportunities
```http
POST /api/launchpad/sniper/opportunities
Content-Type: application/json

{
  "targetLiquidity": 50000,
  "maxBuyAmount": 1000,
  "stopLossPercent": 10,
  "takeProfitPercent": 50,
  "dynamicSlippage": true
}
```

**Response:**
```json
{
  "success": true,
  "opportunities": [{
    "token": "mint_address",
    "symbol": "TKN",
    "platform": "Raydium",
    "liquidity": "75000",
    "recommendedSlippage": "1.5%",
    "buyAmount": 750
  }],
  "count": 3
}
```

### Calculate Dynamic Slippage
```http
POST /api/launchpad/calculate-slippage
Content-Type: application/json

{
  "liquidity": 100000,
  "volume24h": 50000,
  "volatility": 0.05
}
```

**Response:**
```json
{
  "success": true,
  "slippageBps": 100,
  "slippagePercent": "1.00%"
}
```

---

## 🧠 MXM - Model Execution Manager

### Create Execution Job
```http
POST /api/mxm/jobs
Content-Type: application/json

{
  "modelType": "arbitrage",
  "input": {
    "tokenIn": "ETH",
    "tokenOut": "USDC",
    "amountIn": "1.0",
    "dexes": ["Uniswap", "Sushiswap"]
  },
  "priority": 8
}
```

### Execute Job
```http
POST /api/mxm/jobs/:jobId/execute
```

### Get Job Status
```http
GET /api/mxm/jobs/:jobId
```

### Get Pending Jobs
```http
GET /api/mxm/jobs/pending/list
```

---

## 📋 MQM - Model Queue Manager

### Enqueue Job
```http
POST /api/mqm/enqueue
Content-Type: application/json

{
  "queueName": "arbitrage",
  "modelType": "arbitrage",
  "input": {...},
  "priority": 8
}
```

### Get Queue Status
```http
GET /api/mqm/queues/:queueName/status
```

### Start/Stop Queue Processor
```http
POST /api/mqm/processor/start
POST /api/mqm/processor/stop
```

---

## 🤝 Affiliate System

### Register Affiliate
```http
POST /api/affiliate/register
Content-Type: application/json

{
  "wallet": "0x...",
  "referralCode": "CUSTOM_CODE"
}
```

### Get Affiliate Stats
```http
GET /api/affiliate/stats/:wallet
```

**Response:**
```json
{
  "success": true,
  "referralCode": "ABC123",
  "totalReferrals": 50,
  "totalEarned": "1250.00",
  "tier": "gold",
  "commission": "5%"
}
```

### Track Referral
```http
POST /api/affiliate/track
Content-Type: application/json

{
  "referralCode": "ABC123",
  "action": "swap",
  "amount": "100",
  "wallet": "0x..."
}
```

---

## 🎮 Earn GM System

### Check-in for GM Token
```http
POST /api/gm/checkin
Content-Type: application/json

{
  "wallet": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "gmTokens": 10,
  "streak": 5,
  "nextCheckIn": "2025-01-02T00:00:00Z"
}
```

### Get GM Balance
```http
GET /api/gm/balance/:wallet
```

**Response:**
```json
{
  "success": true,
  "balance": 150,
  "totalEarned": 500,
  "rank": 42
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Missing or invalid parameters |
| 401  | Unauthorized - Invalid API key or wallet signature |
| 404  | Not Found |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

---

## 🔐 Authentication

Most endpoints require wallet authentication via signed message:

```http
X-Wallet-Address: 0x...
X-Signature: 0x...
X-Message: timestamp_message
```

---

## ⚡ Rate Limits

- **Standard**: 100 requests per minute
- **Premium**: 1000 requests per minute
- **Dev Tier**: 10000 requests per minute

---

## 🌐 WebSocket Events

Subscribe to real-time updates:

```javascript
const ws = new WebSocket('wss://jup-nine.vercel.app/ws');

ws.on('newLaunch', (data) => {
  console.log('New token launch:', data);
});

ws.on('priceUpdate', (data) => {
  console.log('Price update:', data);
});
```

---

## 📝 Meta Tags for SEO

**Primary Keywords:**
- Solana DEX aggregator
- Token launchpad
- Airdrop spin game
- Crypto sniper bot
- Jupiter swap integration
- Raydium liquidity pools
- Flash loan arbitrage
- Solana trading bot

**Description:**
GXQ Studio TradeOS - Advanced Solana trading platform with Jupiter aggregation, Raydium pools, automated sniper bot, gamified airdrops, and comprehensive launchpad integration. Earn GM tokens, track affiliates, and execute flash loan arbitrage with dynamic slippage optimization.

---

**Last Updated**: 2025-10-30
**Version**: 2.0.0
**Support**: support@gxqstudio.com
