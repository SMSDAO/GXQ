/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

import React from 'react';
import BadgeFX from '../badgeFX';

export default function ContributorCard({ name, role = 'contributor', tier = 'bronze' }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '6px',
      padding: '10px',
      marginBottom: '10px',
      boxShadow: `0 0 10px ${tier === 'gold' ? '#ffd700' : tier === 'silver' ? '#c0c0c0' : '#cd7f32'}`
    }}>
      <h4>{name}</h4>
      <p>Role: {role}</p>
      <BadgeFX tier={tier} />
    </div>
  );
}
