/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

// File: frontend/components/botWidgets/RoleFXManagerCore.tsx

import React, { useEffect } from 'react'
import {
  getFXProfile,
  getChainContext,
  getUserBots,
  getAggregatorStatus,
  FXProfile,
  ChainContext,
  BotInfo,
  AggregatorStatus,
} from '../services/fxService'

interface RoleFXManagerCoreProps {
  user: {
    id: string
    role: string
    chain: string
    milestones: string[]
    lastActive: string  // ISO date string
  }
}

const RoleFXManagerCore: React.FC<RoleFXManagerCoreProps> = ({ user }) => {
  const fxProfile: FXProfile = getFXProfile(user.role)
  const chainFX: ChainContext = getChainContext(user.chain)
  const bots: BotInfo[] = getUserBots(user.id)
  const aggregators: AggregatorStatus = getAggregatorStatus()

  useEffect(() => {
    // 1) FX Glow + Ripple
    document.body.style.setProperty('--fx-glow', fxProfile.glowColor)
    document.body.classList.add(`fx-${chainFX.ripple}`)

    // 2) Synth Trigger on milestone
    if (user.milestones.includes('InvestorSpark')) {
      new Audio('/sounds/synthPulse.mp3').play()
    }

    // 3) Time‐decay FX: fade after 30 days of inactivity
    const days =
      (Date.now() - new Date(user.lastActive).getTime()) /
      (1000 * 60 * 60 * 24)
    const opacity = Math.max(1 - days / 30, 0.3)
    document.body.style.setProperty('--fx-opacity', `${opacity}`)
  }, [
    fxProfile.glowColor,
    chainFX.ripple,
    user.milestones.join(','),  // stringify array for comparison
    user.lastActive,
  ])

  // If you want to render UI here, swap out null for JSX
  return null
}

export default RoleFXManagerCore
