/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

// RoleFXManagerUnified.tsx

import React, { useEffect } from 'react';
import { getFXProfile, getChainContext, getUserBots, getAggregatorStatus } from '../services/fxService';
import BotWidget from './BotWidget';
import AggregatorWidget from './AggregatorWidget';
import SynthFXAudio from './SynthFXAudio';

const RoleFXManagerUnified = ({ user }) => {
  useEffect(() => {
    const fx = getFXProfile(user.role);
    const chainFX = getChainContext(user.chain);
    const bots = getUserBots(user.id);
    const aggregators = getAggregatorStatus();

    document.body.style.setProperty('--fx-glow', fx.glowColor);
    document.body.classList.add(`fx-${chainFX.ripple}`);

    if (user.milestones.includes('InvestorSpark')) {
      SynthFXAudio.play();
    }

    const days = (Date.now() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24);
    const opacity = Math.max(1 - days / 30, 0.3);
    document.body.style.setProperty('--fx-opacity', `${opacity}`);
  }, 
