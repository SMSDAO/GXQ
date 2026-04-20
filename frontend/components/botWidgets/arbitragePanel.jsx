/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿import React, { useState } from 'react';
import axios from 'axios';

export default function ArbitragePanel() {
  const [paths, setPaths] = useState([]);
  const [amount, setAmount] = useState(0);
  const [log, setLog] = useState('');

  const runSniper = async () => {
    setLog('Running arbitrage...');
    try {
      const res = await axios.post('/api/sniper', {
        fromToken: paths[0],
        toToken: paths[1],
        amount
      });
      setLog(`Success: ${JSON.stringify(res.data.data)}`);
    } catch (e) {
      setLog(`Error: ${e.message}`);
    }
  };

  return (
    <div>
      <h3>🔀 Arbitrage Bot</h3>
      <input
        placeholder="Path comma-separated"
        onChange={e => setPaths(e.target.value.split(','))}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <button onClick={runSniper}>Execute</button>
      <pre>{log}</pre>
    </div>
  );
}
