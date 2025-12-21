/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BadgeExplorer() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    axios.get('/api/badges').then(res => {
      setBadges(res.data || []);
    });
  }, []);

  return (
    <div>
      <h2>🧭 Badge Explorer</h2>
      {badges.length === 0 ? (
        <p>No badges found.</p>
      ) : (
        <ul>
          {badges.map((b, i) => (
            <li key={i} style={{ color: b.glowColor }}>
              <strong>{b.name}</strong> — Tier: {b.tier}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
