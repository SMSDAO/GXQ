/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

import React, { useState } from 'react';

export default function OnboardingQuest() {
  const [quests] = useState([
    'Connect wallet',
    'Explore dashboard',
    'Claim a badge',
    'Complete a swap',
  ]);

  return (
    <div>
      <h3>🚀 Onboarding Quest</h3>
      <ol>
        {quests.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>
    </div>
  );
}
