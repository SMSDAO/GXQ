/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

﻿import React, { useState } from 'react';
import axios from 'axios';

export default function AirdropClaimPanel() {
  const [amount, setAmount] = useState(0);
  const [proof, setProof] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const fetchProof = async () => {
    if (
      typeof window !== 'undefined' &&
      (window as any).ethereum &&
      (window as any).ethereum.selectedAddress
    ) {
      const selected = (window as any).ethereum.selectedAddress;
      const res = await axios.get(`/api/merkle-proof?user=${selected}`);
      setAmount(res.data.amount);
      setProof(res.data.proof);
    } else {
      setStatus("❌ Wallet not connected");
    }
  };

  const claim = async () => {
    setStatus('⏳ Claiming...');
    try {
      await axios.post('/api/airdrop/claim', { proof, amount });
      setStatus('✅ Claimed!');
    } catch (e: any) {
      setStatus(`❌ ${e.message}`);
    }
  };

  return (
    <div>
      <h3>Airdrop Claim</h3>
      <button onClick={fetchProof}>Fetch Proof</button>
      {proof.length > 0 && (
        <>
          <p>Eligible for: {amount} tokens</p>
          <button onClick={claim}>Claim Now</button>
        </>
      )}
      <p>{status}</p>
    </div>
  );
}

