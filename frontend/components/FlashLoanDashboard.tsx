/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿import React, { useState } from 'react';
import axios from 'axios';

export default function FlashLoanDashboard() {
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const runFlashLoan = async () => {
    setStatus('⏳ Initiating flash loan...');
    try {
      const res = await axios.post('/api/flashloan', { token, amount });
      setStatus(`✅ Success: ${res.data.txHash}`);
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
    }
  };

  return (
    <div>
      <h3>Flash Loan Executor</h3>
      <input
        placeholder="Token address"
        value={token}
        onChange={e => setToken(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={runFlashLoan}>Execute</button>
      <p>{status}</p>
    </div>
  );
}
