// File: frontend/components/AirdropSpinGame.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Campaign {
  id: string;
  token: string;
  tokenName: string;
  remaining: string;
  minReward: string;
  maxReward: string;
  active: boolean;
}

interface UserSpinData {
  lastSpin: number;
  strikes: number;
  totalWon: string;
  spinsCount: number;
  nextSpinTime: number;
  canSpin: boolean;
}

export default function AirdropSpinGame() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [userData, setUserData] = useState<UserSpinData | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [timeUntilSpin, setTimeUntilSpin] = useState<string>('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      loadUserData(selectedCampaign);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    if (userData && !userData.canSpin) {
      const interval = setInterval(() => {
        const now = Date.now() / 1000;
        const timeLeft = userData.nextSpinTime - now;
        
        if (timeLeft <= 0) {
          setTimeUntilSpin('Ready to spin!');
          clearInterval(interval);
          loadUserData(selectedCampaign);
        } else {
          const hours = Math.floor(timeLeft / 3600);
          const minutes = Math.floor((timeLeft % 3600) / 60);
          const seconds = Math.floor(timeLeft % 60);
          setTimeUntilSpin(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [userData, selectedCampaign]);

  const loadCampaigns = async () => {
    try {
      const res = await axios.get('/api/airdrop/campaigns');
      setCampaigns(res.data.campaigns);
      if (res.data.campaigns.length > 0) {
        setSelectedCampaign(res.data.campaigns[0].id);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const loadUserData = async (campaignId: string) => {
    try {
      const res = await axios.get(`/api/airdrop/user-data/${campaignId}`);
      setUserData(res.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const executeSpin = async () => {
    if (!userData?.canSpin || spinning) return;
    
    setSpinning(true);
    setReward('');
    
    // Animate spin
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const newRotation = rotation + (spins * 360);
    setRotation(newRotation);
    
    try {
      const res = await axios.post('/api/airdrop/spin', {
        campaignId: selectedCampaign
      });
      
      setTimeout(() => {
        setReward(res.data.reward);
        setSpinning(false);
        loadUserData(selectedCampaign);
      }, 3000);
    } catch (error: any) {
      console.error('Spin failed:', error);
      setSpinning(false);
      alert(error.response?.data?.message || 'Spin failed');
    }
  };

  return (
    <div className="card-3d neon-glow-purple" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 className="gradient-text" style={{ textAlign: 'center', fontSize: '32px', marginBottom: '24px' }}>
        🎰 Airdrop Spin Game
      </h2>
      
      {/* Campaign Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
          Select Campaign:
        </label>
        <select
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '2px solid var(--neon-purple)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '16px',
          }}
        >
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.tokenName} - {c.remaining} remaining
            </option>
          ))}
        </select>
      </div>

      {/* Spin Wheel */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <div
          className="neon-glow-blue"
          style={{
            width: '200px',
            height: '200px',
            margin: '0 auto',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple), var(--neon-green))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            cursor: userData?.canSpin ? 'pointer' : 'not-allowed',
            opacity: userData?.canSpin ? 1 : 0.5,
          }}
          onClick={executeSpin}
        >
          🎁
        </div>
      </div>

      {/* User Stats */}
      {userData && (
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Strikes</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-green)' }}>
                {userData.strikes} 🔥
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Spins</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-blue)' }}>
                {userData.spinsCount}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Won</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-purple)' }}>
                {userData.totalWon}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Next Spin</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: userData.canSpin ? 'var(--neon-green)' : 'var(--text-secondary)' }}>
                {userData.canSpin ? '✅ Ready!' : timeUntilSpin}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Display */}
      {reward && (
        <div className="neon-glow-green" style={{
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center',
          animation: 'neon-pulse-green 1s ease-in-out',
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>🎉 You Won!</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--neon-green)' }}>
            {reward}
          </div>
        </div>
      )}

      {/* Spin Button */}
      <button
        className="btn-neon"
        onClick={executeSpin}
        disabled={!userData?.canSpin || spinning}
        style={{
          width: '100%',
          marginTop: '24px',
          opacity: userData?.canSpin && !spinning ? 1 : 0.5,
          cursor: userData?.canSpin && !spinning ? 'pointer' : 'not-allowed',
        }}
      >
        {spinning ? '🎰 Spinning...' : userData?.canSpin ? '🎰 Spin Now!' : '⏰ Wait for Next Spin'}
      </button>

      {/* Strike Info */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        borderRadius: '12px',
        background: 'var(--bg-secondary)',
        fontSize: '14px',
        color: 'var(--text-secondary)',
      }}>
        <strong style={{ color: 'var(--neon-green)' }}>Strike Bonus:</strong> Spin daily to build strikes! 
        After 3 consecutive days, your wait time decreases. 
        Miss a day and your strikes reset!
      </div>
    </div>
  );
}
