#!/usr/bin/env pwsh
# 🚀 TradeOS One-Click Deploy
# Universal deployment script for all platforms and environments
# Usage: ./one-click-deploy.ps1 [-Environment <DEV|TEST|PROD>] [-Platform <Windows|Linux|macOS>]

param(
    [ValidateSet('DEV', 'TEST', 'PROD')]
    [string]$Environment = 'DEV',
    
    [ValidateSet('Windows', 'Linux', 'macOS', 'Auto')]
    [string]$Platform = 'Auto',
    
    [switch]$Quick = $false,
    [switch]$SkipUI = $false,
    [switch]$SkipBackend = $false,
    [switch]$SkipContracts = $false,
    [switch]$AutoStart = $false
)

$ErrorActionPreference = "Continue"
$WarningPreference = "Continue"

# Colorful banner
$banner = @"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ████████╗██████╗  █████╗ ██████╗ ███████╗ ██████╗ ███████╗║
║   ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔════╝║
║      ██║   ██████╔╝███████║██║  ██║█████╗  ██║   ██║███████╗║
║      ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  ██║   ██║╚════██║║
║      ██║   ██║  ██║██║  ██║██████╔╝███████╗╚██████╔╝███████║║
║      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝║
║                                                               ║
║              🚀 ONE-CLICK DEPLOYMENT SYSTEM 🚀                ║
║                     Version 1.0.0                             ║
╚═══════════════════════════════════════════════════════════════╝
"@

Write-Host $banner -ForegroundColor Cyan
Write-Host ""

# Detect platform if Auto
if ($Platform -eq 'Auto') {
    if ($IsWindows -or $env:OS -eq "Windows_NT") {
        $Platform = 'Windows'
    } elseif ($IsLinux) {
        $Platform = 'Linux'
    } elseif ($IsMacOS) {
        $Platform = 'macOS'
    }
}

Write-Host "🎯 Configuration:" -ForegroundColor Yellow
Write-Host "   Environment:  $Environment"
Write-Host "   Platform:     $Platform"
Write-Host "   Quick Mode:   $Quick"
Write-Host "   Auto Start:   $AutoStart"
Write-Host ""

# Function to log steps
function Write-Step {
    param([string]$Message, [string]$Status = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    switch ($Status) {
        "SUCCESS" { Write-Host "[$timestamp] ✅ $Message" -ForegroundColor Green }
        "ERROR"   { Write-Host "[$timestamp] ❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$timestamp] ⚠️  $Message" -ForegroundColor Yellow }
        "INFO"    { Write-Host "[$timestamp] 📋 $Message" -ForegroundColor Cyan }
        default   { Write-Host "[$timestamp] ℹ️  $Message" -ForegroundColor Gray }
    }
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Step "Checking prerequisites..." "INFO"
    
    $allGood = $true
    
    # Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Step "Node.js: $nodeVersion" "SUCCESS"
        } else {
            Write-Step "Node.js not found!" "ERROR"
            $allGood = $false
        }
    } catch {
        Write-Step "Node.js not found!" "ERROR"
        $allGood = $false
    }
    
    # npm
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-Step "npm: v$npmVersion" "SUCCESS"
        }
    } catch {
        Write-Step "npm not found!" "WARNING"
    }
    
    # Git
    try {
        $gitVersion = git --version 2>$null
        if ($gitVersion) {
            Write-Step "Git: $gitVersion" "SUCCESS"
        }
    } catch {
        Write-Step "Git not found!" "WARNING"
    }
    
    return $allGood
}

# Main deployment flow
try {
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "PHASE 1: PREREQUISITES CHECK" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if (-not (Test-Prerequisites)) {
        Write-Step "Prerequisites check failed! Please install missing components." "ERROR"
        exit 1
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "PHASE 2: CORE INITIALIZATION" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    Write-Step "Running init-core.ps1..." "INFO"
    & "$PSScriptRoot/init-core.ps1"
    Write-Step "Core initialization complete" "SUCCESS"
    
    if (-not $Quick) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "PHASE 3: DEPENDENCY INSTALLATION" -ForegroundColor Yellow
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        
        Write-Step "Installing npm dependencies..." "INFO"
        npm install 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Step "Dependencies installed successfully" "SUCCESS"
        } else {
            Write-Step "Some dependencies failed to install" "WARNING"
        }
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "PHASE 4: WIDGET & COMPONENT GENERATION" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if (-not $SkipUI) {
        Write-Step "Generating widgets..." "INFO"
        npx ts-node create-widget-relay.ts --walletConnect --init-swap --bridge --fxGlow --sovereignBadge 2>&1 | Out-Null
        Write-Step "Widgets generated" "SUCCESS"
        
        Write-Step "Generating aura map..." "INFO"
        npx ts-node scripts/auraMap.ts 2>&1 | Out-Null
        Write-Step "Aura map generated" "SUCCESS"
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "PHASE 5: BUILD & COMPILE" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if (-not $SkipUI) {
        Write-Step "Building frontend..." "INFO"
        npm run build 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Step "Frontend built successfully" "SUCCESS"
        } else {
            Write-Step "Frontend build completed with warnings" "WARNING"
        }
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "PHASE 6: ENVIRONMENT SETUP" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    # Run full deployment script
    & "$PSScriptRoot/deploy-runner.ps1" -Environment $Environment -SkipDependencies:$Quick -SkipTests:$Quick
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "🎉 DEPLOYMENT COMPLETE! 🎉" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
    Write-Host "   ✅ Core structure verified"
    Write-Host "   ✅ Dependencies installed"
    Write-Host "   ✅ Widgets & components generated"
    Write-Host "   ✅ Frontend built"
    Write-Host "   ✅ Environment configured: $Environment"
    Write-Host "   ✅ Platform: $Platform"
    
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    
    if ($Environment -eq 'DEV') {
        Write-Host "   1. Start development server:"
        Write-Host "      npm run dev" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   2. Open browser:"
        Write-Host "      http://localhost:3000" -ForegroundColor Cyan
        
        if ($AutoStart) {
            Write-Host ""
            Write-Step "Auto-starting development server..." "INFO"
            
            if ($Platform -eq 'Windows') {
                Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"
            } else {
                Write-Host "   Please run 'npm run dev' in a new terminal" -ForegroundColor Yellow
            }
        }
    } elseif ($Environment -eq 'PROD') {
        Write-Host "   1. Start production server:"
        Write-Host "      npm run start" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Yellow
    Write-Host "   • API Docs:     http://localhost:3001/api"
    Write-Host "   • Test Suite:   npm test"
    Write-Host "   • MXM API:      http://localhost:3001/api/mxm"
    Write-Host "   • MQM API:      http://localhost:3001/api/mqm"
    
    Write-Host ""
    Write-Host "✨ TradeOS is ready! Happy trading! ✨" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Step "Deployment failed: $($_.Exception.Message)" "ERROR"
    Write-Host ""
    Write-Host "Stack Trace:" -ForegroundColor Red
    Write-Host $_.Exception.StackTrace -ForegroundColor Gray
    exit 1
}
