# 🚀 TradeOS - Quantum-Grade DeFi Automation Platform

TradeOS is a comprehensive decentralized finance automation platform with quantum-grade execution capabilities across multiple blockchains including Ethereum, Polygon, Optimism, Base, and Solana.

## ✨ Features

- **🧠 MXM (Model eXecution Manager)**: Dynamic function execution system for automated trading strategies
- **📋 MQM (Model Queue Manager)**: Advanced job queue and scheduling system with priority management
- **⚡ Flash Loan Integration**: Execute complex arbitrage strategies with flash loan support
- **🔄 Multi-Chain Support**: Deploy and trade across EVM chains and Solana
- **🎨 Dynamic Widget Generation**: Auto-generate UI components for wallet connect, swap, bridge, and more
- **🏅 Sovereign Badge System**: NFT-based achievement and reputation tracking
- **🌟 Aura Mapping**: Visual effects system based on user roles and achievements
- **🔐 Role-Based Access Control**: Admin, contributor, investor, and user tiers

## 🚀 One-Click Deployment

### Prerequisites

- Node.js 18+ and npm
- Git
- PowerShell 7+ (for deployment scripts)
- MongoDB (optional, for backend features)

### Quick Start

**Deploy Development Environment:**
```bash
pwsh one-click-deploy.ps1 -Environment DEV -AutoStart
```

**Deploy Production Environment:**
```bash
pwsh one-click-deploy.ps1 -Environment PROD
```

**Deploy with Quick Mode (skip tests):**
```bash
pwsh one-click-deploy.ps1 -Environment DEV -Quick
```

### Manual Deployment

```bash
# 1. Install dependencies
npm install

# 2. Run core initialization
pwsh init-core.ps1

# 3. Generate widgets
npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge

# 4. Build frontend
npm run build

# 5. Start development server
npm run dev
```

## 📁 Project Structure

```
GXQ/
├── backend/              # Backend API server
│   ├── api/             # API endpoints
│   │   ├── mxm.js       # MXM API routes
│   │   ├── mqm.js       # MQM API routes
│   │   └── ...
│   ├── models/          # Data models
│   │   ├── MXM.js       # Model eXecution Manager
│   │   └── MQM.js       # Model Queue Manager
│   ├── db/              # Database configuration
│   └── server.js        # Express server
├── frontend/            # Next.js frontend
│   ├── components/      # React components
│   │   ├── botWidgets/  # Auto-generated widgets
│   │   └── services/    # Service integrations
│   ├── pages/           # Next.js pages
│   └── utils/           # Utility functions
├── contracts/           # Solidity smart contracts
├── scripts/             # Deployment scripts
│   ├── auraMap.ts       # Aura mapping generator
│   └── ...
├── tests/               # Test suite
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── utils/           # Test utilities
├── init-core.ps1        # Core initialization script
├── deploy-runner.ps1    # Deployment runner
└── one-click-deploy.ps1 # One-click deployment
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Unit Tests
```bash
npm run test:unit
```

### Run Integration Tests
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm test` | Run test suite |
| `npm run deploy:dev` | Deploy to DEV environment |
| `npm run deploy:test` | Deploy to TEST environment |
| `npm run deploy:prod` | Deploy to PROD environment |

## 🎨 Widget Generation

Generate UI widgets dynamically:

```bash
npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge
```

Available widget flags:
- `--walletConnect`: WalletConnect integration widget
- `--init-swap`: Token swap widget
- `--bridge`: Cross-chain bridge widget
- `--fxGlow`: Visual FX glow effects
- `--sovereignBadge`: Badge display widget

## 🧠 MXM (Model eXecution Manager)

Execute automated trading strategies:

### Create Job
```javascript
POST /api/mxm/jobs
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
```javascript
POST /api/mxm/jobs/:jobId/execute
```

## 📋 MQM (Model Queue Manager)

Manage job queues and scheduling:

### Enqueue Job
```javascript
POST /api/mqm/enqueue
{
  "queueName": "arbitrage",
  "modelType": "arbitrage",
  "input": { /* ... */ },
  "priority": 8
}
```

### Get Queue Status
```javascript
GET /api/mqm/queues/:queueName/status
```

### Start Queue Processor
```javascript
POST /api/mqm/processor/start
{
  "intervalMs": 10000
}
```

## 🌐 API Endpoints

### Backend API
- Base URL: `http://localhost:3001/api`
- MXM: `/api/mxm/*`
- MQM: `/api/mqm/*`
- Fees: `/api/fees`
- Auth: `/api/auth`
- Governance: `/api/governance`

### Frontend
- Dev: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/adminDashboard`

## 🔐 Environment Variables

Create a `.env.DEV`, `.env.TEST`, or `.env.PROD` file:

```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/tradeos_dev

# API Keys
INFURA_KEY=your_infura_key
ALCHEMY_KEY=your_alchemy_key
ETHERSCAN_KEY=your_etherscan_key

# Admin
ADMIN_ADDRESS=0x7b861609f4f5977997a6478b09d81a7256d6c748

# Features
ENABLE_MXM=true
ENABLE_MQM=true
ENABLE_FLASHLOAN=true
ENABLE_ARBITRAGE=true
```

## 🛠️ Troubleshooting

### PowerShell Execution Policy
If scripts fail to run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js Version
Ensure you're using Node.js 18+:
```bash
node --version
```

### MongoDB Connection
If MongoDB errors occur, ensure MongoDB is running:
```bash
# macOS/Linux
sudo systemctl start mongodb

# Windows
net start MongoDB
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Commit and push
6. Create a pull request

## 📄 License

Copyright © 2025 TradeOS / SMSDAO

## 🔗 Links

- Repository: https://github.com/SMSDAO/GXQ
- Documentation: Coming soon
- Discord: Coming soon

## 🎯 Roadmap

- [ ] Multi-chain deployment automation
- [ ] Advanced MEV protection
- [ ] DAO governance integration
- [ ] Mobile app (iOS/Android)
- [ ] Desktop app (Electron)
- [ ] Advanced analytics dashboard
- [ ] Machine learning price prediction

---

**Made with ❤️ by the TradeOS team**
