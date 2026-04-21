// Auto-generated: WalletConnect Widget
import React, { useState } from 'react';

export default function WalletConnectWidget() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    }
  };

  return (
    <div className="wallet-widget">
      {!connected ? (
        <button onClick={connectWallet}>🔗 Connect Wallet</button>
      ) : (
        <div>
          ✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
}
