import React, { useEffect } from 'react'
import {
  getFXProfile,
  getChainContext,
  getUserBots,
  getAggregatorStatus,
} from './services/fxService'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

interface RoleFXManagerUnifiedProps {
  user: {
    id: string
    role: string
    chain: string
    milestones: string[]
    lastActive: string
  }
}

export default function RoleFXManagerUnified({ user }: RoleFXManagerUnifiedProps) {
  useEffect(() => {
    const fx = getFXProfile(user.role)
    const chainFX = getChainContext(user.chain)
    getUserBots(user.id)
    getAggregatorStatus()

    document.body.style.setProperty('--fx-glow', fx.glowColor)
    document.body.classList.add(`fx-${chainFX.ripple}`)

    const lastActiveAt = new Date(user.lastActive).getTime()
    const validatedLastActiveAt = Number.isFinite(lastActiveAt) ? lastActiveAt : Date.now()
    const daysInactive = (Date.now() - validatedLastActiveAt) / MILLISECONDS_PER_DAY
    const opacity = Math.max(1 - daysInactive / 30, 0.3)
    document.body.style.setProperty('--fx-opacity', `${opacity}`)
  }, [user.id, user.role, user.chain, user.lastActive, user.milestones])

  return null
}
