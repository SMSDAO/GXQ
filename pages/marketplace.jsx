/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Marketplace() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/marketplace').then(res => {
      setItems(res.data || []);
    });
  }, []);

  return (
    <div>
      <h2>🛒 TradeOS Marketplace</h2>
      {items.length === 0 ? (
        <p>No items available right now.</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              <strong>{item.name}</strong> — {item.price} tokens
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
