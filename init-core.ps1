# 🔎 TradeOS Core Verification Script
# Ensures all required folders, subfolders, and dependencies exist

Write-Host "🚀 Initializing TradeOS Core..." -ForegroundColor Cyan

# Define required folder structure
$requiredFolders = @(
    "backend",
    "backend/api",
    "backend/db",
    "backend/models",
    "backend/services",
    "backend/utils",
    "frontend",
    "frontend/components",
    "frontend/components/botWidgets",
    "frontend/components/services",
    "frontend/pages",
    "frontend/utils",
    "contracts",
    "contracts/interfaces",
    "contracts/programs",
    "scripts",
    "tests",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "docs",
    "assets",
    "assets/css",
    "assets/js",
    "assets/images",
    "config",
    "logs",
    "temp"
)

# Create missing folders
Write-Host "`n📁 Checking folder structure..." -ForegroundColor Yellow
$created = 0
foreach ($folder in $requiredFolders) {
    $path = Join-Path $PSScriptRoot $folder
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  ✅ Created: $folder" -ForegroundColor Green
        $created++
    }
}
if ($created -eq 0) {
    Write-Host "  ✅ All folders exist" -ForegroundColor Green
} else {
    Write-Host "  ✅ Created $created missing folders" -ForegroundColor Green
}

# Check for required files
Write-Host "`n📄 Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    @{Path="package.json"; Template='{"name":"tradeos-app","version":"1.0.0"}'},
    @{Path="tsconfig.json"; Template='{"compilerOptions":{"target":"ES2020","module":"commonjs"}}'},
    @{Path=".env.example"; Template='MONGO_URI=mongodb://localhost:27017/tradeos\nPORT=3001'},
    @{Path="backend/db/connection.js"; Template='// Database connection placeholder'},
    @{Path="frontend/utils/auraMap.ts"; Template='// Aura mapping utility placeholder'},
    @{Path="tests/README.md"; Template='# TradeOS Test Suite'}
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PSScriptRoot $file.Path
    if (-not (Test-Path $path)) {
        $dir = Split-Path $path -Parent
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        Set-Content -Path $path -Value $file.Template
        Write-Host "  ✅ Created: $($file.Path)" -ForegroundColor Green
    }
}

# Check Node.js installation
Write-Host "`n🔧 Checking dependencies..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
}

try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "  ✅ npm: v$npmVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠️  npm not found" -ForegroundColor Yellow
}

# Check for node_modules
$nodeModulesPath = Join-Path $PSScriptRoot "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "  ⚠️  node_modules not found. Run 'npm install'" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ node_modules exists" -ForegroundColor Green
}

# Verify Git installation
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "  ✅ Git: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠️  Git not found" -ForegroundColor Yellow
}

Write-Host "`n✅ Core verification complete!" -ForegroundColor Cyan
Write-Host "🎯 Ready to proceed with TradeOS deployment" -ForegroundColor Cyan
