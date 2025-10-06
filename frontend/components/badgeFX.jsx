/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

import React from 'react';

export default function BadgeFX({ tier = 'bronze' }) {
  const glowMap = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
  };

  const glow = glowMap[tier] || '#4caf50';

  return (
    <div style={{
      border: `2px solid ${glow}`,
      boxShadow: `0 0 10px ${glow}`,
      padding: '10px',
      borderRadius: '5px',
    }}>
      <p>🏅 Badge Tier: {tier}</p>
    </div>
  );
}
