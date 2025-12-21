# 📚 TradeOS Scripts Reference

## Quick Reference Guide for All Automation Scripts

### 🚀 Installation & Setup

#### `install-deploy.sh` (Linux/Mac)
Complete automated installation and setup.

```bash
chmod +x install-deploy.sh
./install-deploy.sh
```

**What it does:**
- ✅ Checks Node.js and npm
- ✅ Creates all required directories
- ✅ Installs dependencies
- ✅ Sets up .env file
- ✅ Creates contract symlinks
- ✅ Generates widgets
- ✅ Generates aura map
- ✅ Configures .gitignore

#### `init-core.ps1` (Windows)
PowerShell initialization script.

```powershell
.\init-core.ps1
```

**What it does:**
- ✅ Verifies Node.js and npm
- ✅ Installs dependencies
- ✅ Creates .env template
- ✅ Validates directory structure

---

### 🎨 Widget Generation

#### `create-widget-relay.ts`
Auto-generates React components.

```bash
npm run widgets
# or
npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge
```

**Generates:**
- `frontend/components/widgets/WalletConnectWidget.tsx`
- `frontend/components/widgets/SwapWidget.tsx`
- `frontend/components/widgets/BridgeWidget.tsx`
- `frontend/components/widgets/FxGlowWidget.tsx`
- `frontend/components/widgets/SovereignBadgeWidget.tsx`
- `frontend/components/widgets/index.ts`

**Flags:**
- `--walletConnect` - Generate wallet connection widget
- `--init-swap` - Generate swap interface
- `--bridge` - Generate cross-chain bridge UI
- `--fxGlow` - Generate glow effects
- `--sovereignBadge` - Generate badge display

---

### 🗺️ Aura Map Generation

#### `scripts/auraMap.ts`
Generates aura mapping utilities and configuration.

```bash
npm run aura
# or
npx ts-node scripts/auraMap.ts
```

**Generates:**
- `frontend/utils/auraMap.ts` - Utility functions (40KB)
- `config/aura.json` - Configuration file

**Features:**
- 400+ pre-generated aura points
- Color calculation functions
- Gradient generators
- Canvas rendering utilities
- TypeScript interfaces

---

### 🔀 Branch Management

#### `mergeTradeOSBranches.ts`
Automated git branch merging.

```bash
npx ts-node mergeTradeOSBranches.ts
```

**What it does:**
- Fetches latest changes
- Checks for uncommitted work
- Attempts to merge branches
- Detects and reports conflicts

**Configured branches:**
- `develop`
- `feature/widgets`
- `feature/contracts`
- `hotfix/*`

---

### 📝 Code Headers

#### `add-code-blocks.js`
Adds standardized headers to all source files.

```bash
npm run headers
# or
node add-code-blocks.js
```

**Processes:**
- `.sol` - Solidity contracts
- `.js` - JavaScript files
- `.ts` - TypeScript files
- `.jsx` - React components
- `.tsx` - TypeScript React components

**Skips:**
- `node_modules/`
- Build artifacts
- Already processed files

---

### 🚢 Deployment

#### `scripts/deployAll.js`
Deploy all EVM contracts.

```bash
npm run deploy:all
# or
node scripts/deployAll.js
```

**Deploys:**
- AdminControl
- VaultController
- LPController
- ProfitSplitter
- TradeOSAccess
- TradeOSBadges
- FeeRouter
- TradeOSGovernance

#### `scripts/DeployAll.s.sol`
Foundry deployment script.

```bash
forge script scripts/DeployAll.s.sol --rpc-url $RPC_URL --broadcast
```

#### `scripts/deployAll.solana.ts`
Deploy Solana programs.

```bash
npm run deploy:solana
# or
npx ts-node scripts/deployAll.solana.ts
```

---

### 🎯 Full Orchestration

#### `TradeOS-orchestrator.bat` (Windows)
Complete deployment pipeline.

```batch
TradeOS-orchestrator.bat
```

**Pipeline:**
1. Verifies core with `init-core.ps1`
2. Merges branches with `mergeTradeOSBranches.ts`
3. Generates widgets with `create-widget-relay.ts`
4. Generates aura map with `scripts/auraMap.ts`
5. Commits and pushes UI changes
6. Starts dev server
7. Deploys all contracts

---

## 📦 NPM Scripts

### Available in `package.json`

```json
{
  "dev": "next dev",                    // Start dev server
  "start": "next start",                 // Start production server
  "build": "next build",                 // Build for production
  "export": "next export -o docs",       // Export static site
  "deploy": "npm run build && npm run export",  // Build + export
  "deploy:all": "node scripts/deployAll.js",    // Deploy EVM contracts
  "deploy:solana": "npx ts-node scripts/deployAll.solana.ts",  // Deploy Solana
  "widgets": "npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge",  // Generate widgets
  "aura": "npx ts-node scripts/auraMap.ts",     // Generate aura map
  "headers": "node add-code-blocks.js",          // Add code headers
  "setup": "chmod +x install-deploy.sh && ./install-deploy.sh"  // Full setup
}
```

---

## 🔧 Configuration Files

### `config/deployment.json`
Deployment settings for all chains.

**Includes:**
- Network RPC URLs
- Chain IDs
- Contract lists
- Admin addresses
- Feature flags

### `config/aura.json`
Visual effects configuration.

**Settings:**
- Grid size: 20x20
- Update interval: 5000ms
- Color schemes
- Effect toggles

### `.env`
Environment variables.

**Required:**
- `MONGO_URI` - MongoDB connection
- `PORT` - Server port
- `PRIVATE_KEY` - EVM private key
- `RPC_URL` - Ethereum RPC
- `SOLANA_RPC_URL` - Solana RPC
- `ADMIN_WALLET` - Admin address

---

## 🎯 Common Workflows

### First Time Setup
```bash
# 1. Run full installation
./install-deploy.sh

# 2. Edit .env with your keys
nano .env

# 3. Start development
npm run dev
```

### Add New Widgets
```bash
# Generate widgets
npm run widgets

# Check generated files
ls frontend/components/widgets/
```

### Update Aura Map
```bash
# Regenerate aura map
npm run aura

# Check output
cat config/aura.json
```

### Deploy Contracts
```bash
# Deploy to EVM chains
npm run deploy:all

# Deploy to Solana
npm run deploy:solana
```

### Add Headers to New Files
```bash
# Run header injection
npm run headers
```

---

## 🐛 Troubleshooting

### TypeScript Errors
```bash
# Install TypeScript dependencies
npm install --save-dev typescript @types/node ts-node
```

### Permission Denied
```bash
# Make scripts executable
chmod +x install-deploy.sh
chmod +x *.sh
```

### Missing Directories
```bash
# Create manually
mkdir -p src frontend/utils frontend/components/widgets backend/api backend/db config tests
```

### Widget Generation Fails
```bash
# Compile TypeScript first
npx tsc create-widget-relay.ts --outDir . --module commonjs --target es2017 --esModuleInterop

# Then run
node create-widget-relay.js --walletConnect --init-swap --bridge --fxGlow --sovereignBadge
```

---

## 📚 Additional Resources

- **README.md** - Complete setup guide
- **SETUP_SUMMARY.md** - What was accomplished
- **auditReport.md** - Security audit
- **SECURITY.md** - Security policy

---

**Built with ⚡ by the TradeOS Team**
