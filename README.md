# 🚀 TradeOS V1.1 - Full Stack Trading Platform

TradeOS is a quantum-grade automation platform for cross-chain trading across Ethereum, Solana, Monad, and more — featuring gamified airdrops, real-time launchpad integration, sniper bots, flash loans, and a Solana-style dark UI.

> 🌐 **Live at**: [https://jup-nine.vercel.app/](https://jup-nine.vercel.app/)

## 📋 Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Development](#development)

## 🖼️ Screenshots

### 🏠 Landing Page
> Solana-style dark UI with neon gradients, KPI stats, feature showcase, and live launchpad feed.

![TradeOS Landing Page](https://github.com/user-attachments/assets/f462c856-800c-4978-9979-723ba219e47e)

---

### 🔒 Admin Dashboard
> Full-featured control panel — KPI cards, execution volume chart, job distribution donut, live MXM jobs table, MQM queue utilization bars, and the fee manager panel with wallet address display.

![TradeOS Admin Dashboard](https://github.com/user-attachments/assets/2a6b661b-ea00-4146-a9d5-911a21192b75)

---

### 🎰 Launchpad & Airdrop Spin Game
> Gamified airdrop spins every 12 hours with strike-streak bonuses, active campaign pools from token launchers, and live snipeable token launches from Raydium, Pumpkin, and Jupiter.

![TradeOS Launchpad & Airdrop Game](https://github.com/user-attachments/assets/21a0de27-977b-4d3d-a1f7-a13daec82e88)

---

## ✨ Features

- **Cross-Chain Support**: Ethereum, Solana, Polygon, Base, and more
- **Flash Loan Integration**: DyDx-style multi-token flash loans for arbitrage
- **Automated Trading Bots**: Front-running, arbitrage, and MEV strategies with dynamic slippage
- **🎰 Gamified Airdrop Spin Game**: 12-hour cycles with exponential strike-streak wait reduction
- **🚀 Launchpad Integration**: Jupiter, Raydium, and Pumpkin — real-time new launch monitoring + sniper
- **🤝 Affiliate Program**: Tier-based commissions (Bronze 3% → Platinum 7%), auto-upgrade, leaderboard
- **🌅 GM Token Rewards**: Daily check-ins, 30-day streak multipliers, weekend bonuses
- **🧠 MXM (Model eXecution Manager)**: Dynamic execution engine for 5+ strategy types
- **📋 MQM (Model Queue Manager)**: 7-priority enterprise job queuing with start/stop/pause/resume
- **💰 Admin Fee Control**: Configurable dev (2%) and launcher (1%) fee splits
- **🎨 Dark / Light Mode**: Solana-style neon glows (blue, purple, green) with smooth theme transitions
- **Governance System**: DAO-based decision making
- **NFT Badges**: Sovereign contributor badges with aura FX
- **LP Scoring**: Liquidity provider reputation system
- **Admin Dashboard**: Complete control panel for system management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- PowerShell 7+ (for deployment scripts on any OS)

### One-Command Installation

```bash
# Clone the repository
git clone https://github.com/SMSDAO/GXQ.git
cd GXQ

# Run automated installation (Linux/macOS)
./install-deploy.sh
```

Or on Windows / cross-platform:
```powershell
# Full one-click deployment (DEV/TEST/PROD)
pwsh one-click-deploy.ps1 -Environment DEV -AutoStart

# Or just initialize the folder structure and dependencies
.\init-core.ps1
```

## 📦 Installation

### Manual Installation

1. **Clone the repository**
2. **Create required directories**: `.\init-core.ps1` or `./install-deploy.sh`
3. **Install dependencies**: `npm install`
4. **Setup environment**: Copy `.env.example` to `.env` and fill in your keys
5. **Link contracts**: Symlinks created automatically

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
NEXT_PUBLIC_API_URL=https://jup-nine.vercel.app/api
SOLANA_RPC=https://api.mainnet-beta.solana.com
JUPITER_API=https://quote-api.jup.ag/v6
```

## 📡 API Reference

Full docs: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **MXM** | `/api/mxm/jobs` | POST | Create execution job |
| **MXM** | `/api/mxm/jobs/:id/execute` | POST | Execute job |
| **MXM** | `/api/mxm/jobs/:id` | GET | Get job status |
| **MQM** | `/api/mqm/enqueue` | POST | Enqueue job to named queue |
| **MQM** | `/api/mqm/queues/status/all` | GET | All queue statuses |
| **MQM** | `/api/mqm/processor/start` | POST | Start queue processor |
| **Airdrop** | `/api/airdrop/spin` | POST | Execute airdrop spin |
| **Airdrop** | `/api/airdrop/campaigns` | GET | List active campaigns |
| **Launchpad** | `/api/launchpad/jupiter/quote` | GET | Get swap quote |
| **Launchpad** | `/api/launchpad/jupiter/swap` | POST | Execute swap |
| **Launchpad** | `/api/launchpad/launches/new` | GET | New token launches |
| **Launchpad** | `/api/launchpad/calculate-slippage` | POST | Dynamic slippage |
| **Affiliate** | `/api/affiliate/register` | POST | Register affiliate |
| **Affiliate** | `/api/affiliate/leaderboard` | GET | Affiliate leaderboard |
| **GM** | `/api/gm/checkin` | POST | Daily GM check-in |
| **GM** | `/api/gm/balance/:wallet` | GET | GM token balance |
| **GM** | `/api/gm/leaderboard` | GET | GM leaderboard |

## 🚢 Deployment

### One-Click Automated Deployment

```powershell
# Deploy to development (auto-starts server)
pwsh one-click-deploy.ps1 -Environment DEV -AutoStart

# Deploy to production
pwsh one-click-deploy.ps1 -Environment PROD

# Quick mode (skip confirmations)
pwsh one-click-deploy.ps1 -Environment TEST -Quick
```

### Vercel Deployment

```bash
vercel --prod
```

Configure the following environment variables in Vercel dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## 🏗️ Architecture

```
GXQ/
├── contracts/
│   └── AirdropSpinGame.sol        # Gamified airdrop contract (commit-reveal secure)
├── backend/
│   ├── models/
│   │   ├── MXM.js                 # Model eXecution Manager
│   │   └── MQM.js                 # Model Queue Manager (7 queues)
│   ├── api/
│   │   ├── mxm.js                 # MXM REST endpoints
│   │   ├── mqm.js                 # MQM REST endpoints
│   │   ├── airdropSpin.js         # Airdrop game API
│   │   ├── launchpad.js           # Jupiter/Raydium/Pumpkin API
│   │   ├── affiliate.js           # Affiliate program API
│   │   └── gm.js                  # GM token daily check-in API
│   └── services/
│       └── launchpadIntegration.js # Live launchpad data service
├── frontend/
│   ├── components/
│   │   ├── AirdropSpinGame.tsx    # Spin game UI component
│   │   ├── ThemeSwitcher.tsx      # Dark/light mode toggle
│   │   └── botWidgets/            # Auto-generated widgets
│   └── utils/
│       └── auraMap.ts             # Role-based aura FX mapping
├── assets/css/
│   └── theme-modes.css            # Neon glow + dark/light theme vars
├── tests/
│   ├── unit/                      # Unit tests (MXM, MQM)
│   ├── integration/               # Integration tests
│   └── utils/dynamicPatcher.js    # Auto test stub generator
├── docs/
│   ├── API_DOCUMENTATION.md       # Full API reference (42+ endpoints)
│   └── UI_DOCUMENTATION.md        # UI/UX guide + SEO keywords
├── init-core.ps1                  # Folder/dependency verification
├── deploy-runner.ps1              # Environment deployment script
├── one-click-deploy.ps1           # One-click DEV/TEST/PROD deployment
└── vercel.json                    # Vercel deployment configuration
```

## 🛠️ Development

### Running Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Running Tests

```bash
npm test                   # All 18 tests
npm run test:unit          # Unit tests only (MXM + MQM)
npm run test:integration   # Integration tests only
```

### Generate Widgets

```bash
npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge
```

### Airdrop Spin Example

```js
// POST /api/airdrop/spin
{
  "campaignId": "0x...",
  "address": "0xYourWallet..."
}
```

### Jupiter Swap Quote

```
GET /api/launchpad/jupiter/quote
  ?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
  &outputMint=So11111111111111111111111111111111111111112
  &amount=1000000
  &slippage=50
```

## 🔐 Security

- All admin functions protected with `onlyAdmin` modifier
- Airdrop rewards use commit-reveal scheme (no miner-biasable randomness)
- Flash loan safety checks implemented
- See [`SECURITY.md`](SECURITY.md) and [`auditReport.md`](auditReport.md) for full audit

## 🧪 Test Results

```
Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
```

## 👥 Team

**Reserve Address**: `0x7b861609f4f5977997a6478b09d81a7256d6c748`  
**Solana Wallet**: `J7bNrvf26uiWWg8sM43eQMwunaPgmvi7pdRC55CnebPE`

---

Built with ⚡ by the TradeOS Team
