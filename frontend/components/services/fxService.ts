/**
 * ============================================================================
 * TradeOS TypeScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿// File: frontend/components/services/fxService.ts

// 1. Interfaces
export interface FXProfile {
  role: string
  tier: 'bronze' | 'silver' | 'gold'
  lastUpdate: number
  glowColor: string            // CSS color for FX glow
}

export interface ChainContext {
  chain: string
  chainId: number
  network: 'ethereum' | 'polygon' | 'optimism' | 'base' | 'solana'
  type: 'EVM' | 'Solana'
  rpcUrl: string
  ripple: string               // CSS class or key for ripple effect
}

export interface BotInfo {
  id: string
  owner: string
  status: string
}

export interface AggregatorStatus {
  name: string
  feeTier: number
}


// 2. Functions

export function getFXProfile(role: string): FXProfile {
  return {
    role,
    tier: 'bronze',
    lastUpdate: Date.now(),
    glowColor: '#4caf50',
  }
}

export function getChainContext(chain: string): ChainContext {
  const key = chain.toLowerCase()
  switch (key) {
    case 'ethereum':
      return {
        chain: 'ethereum',
        chainId: 1,
        network: 'ethereum',
        type: 'EVM',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
        ripple: 'eth-ripple',
      }
    case 'polygon':
      return {
        chain: 'polygon',
        chainId: 137,
        network: 'polygon',
        type: 'EVM',
        rpcUrl: 'https://polygon-rpc.com',
        ripple: 'poly-ripple',
      }
    case 'optimism':
      return {
        chain: 'optimism',
        chainId: 10,
        network: 'optimism',
        type: 'EVM',
        rpcUrl: 'https://mainnet.optimism.io',
        ripple: 'op-ripple',
      }
    case 'base':
      return {
        chain: 'base',
        chainId: 8453,
        network: 'base',
        type: 'EVM',
        rpcUrl: 'https://mainnet.base.org',
        ripple: 'base-ripple',
      }
    case 'solana':
      return {
        chain: 'solana',
        chainId: 0,
        network: 'solana',
        type: 'Solana',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        ripple: 'sol-ripple',
      }
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

export function getUserBots(userId: string): BotInfo[] {
  return [{ id: 'bot1', owner: userId, status: 'running' }]
}

export function getAggregatorStatus(): AggregatorStatus {
  return { name: 'Uniswap', feeTier: 0.3 }
}
