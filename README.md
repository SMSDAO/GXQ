# 🚀 TradeOS V1.1 - Full Stack Trading Platform

TradeOS is a quantum-grade automation platform for cross-chain trading across Ethereum, Solana, Monad, and more.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Development](#development)

## ✨ Features

- **Cross-Chain Support**: Ethereum, Solana, Polygon, Base, and more
- **Flash Loan Integration**: DyDx-style flash loans for arbitrage
- **Automated Trading Bots**: Front-running, arbitrage, and MEV strategies
- **Governance System**: DAO-based decision making
- **NFT Badges**: Sovereign contributor badges
- **LP Scoring**: Liquidity provider reputation system
- **Admin Dashboard**: Complete control panel for system management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### One-Command Installation

```bash
# Clone the repository
git clone https://github.com/SMSDAO/GXQ.git
cd GXQ

# Run automated installation
./install-deploy.sh
```

Or on Windows:
```powershell
.\init-core.ps1
```

## 📦 Installation

### Manual Installation

1. **Clone the repository**
2. **Create required directories**
3. **Install dependencies**: `npm install`
4. **Setup environment**: Edit `.env` with your configuration
5. **Link contracts**: Symlinks created automatically

## ⚙️ Configuration

Create a `.env` file in the root directory with your keys and configuration.

## 🚢 Deployment

### Automated Deployment

Use the TradeOS Orchestrator for full deployment:

```bash
# On Windows
.\TradeOS-orchestrator.bat

# On Linux/Mac
./install-deploy.sh
```

## 🏗️ Architecture

```
GXQ/
├── contracts/          # Smart contracts (Solidity)
├── src/               # Symlinked contracts for Foundry
├── backend/           # Node.js backend
├── frontend/          # Next.js frontend
├── scripts/           # Deployment & automation scripts
└── config/            # Configuration files
```

## 🛠️ Development

### Running Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Generate Widgets

```bash
npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge
```

## 🔐 Security

- All admin functions protected with `onlyAdmin` modifier
- Flash loan safety checks implemented
- See `auditReport.md` for full security audit

## 👥 Team

**Reserve Address**: `0x7b861609f4f5977997a6478b09d81a7256d6c748`  
**Solana Wallet**: `J7bNrvf26uiWWg8sM43eQMwunaPgmvi7pdRC55CnebPE`

---

Built with ⚡ by the TradeOS Team
