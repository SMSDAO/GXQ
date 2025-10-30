# 🎨 TradeOS UI/UX Complete Guide

## 🌈 Theme System

### Dark/Light Mode
The application features a sophisticated dark/light mode system with smooth transitions:

**Implementation:**
```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Add to your layout
<ThemeSwitcher />
```

**Customization:**
```css
:root {
  --neon-blue: #00d4ff;
  --neon-purple: #9945ff;
  --neon-green: #14f195;
}
```

## ✨ Neon Glow Effects

### Available Classes

#### Blue Glow
```html
<div class="neon-glow-blue">
  Your content here
</div>
```

#### Purple Glow (Solana Style)
```html
<div class="neon-glow-purple">
  Your content here
</div>
```

#### Green Glow
```html
<div class="neon-glow-green">
  Your content here
</div>
```

### 3D Card Effects
```html
<div class="card-3d">
  <h3>Interactive 3D Card</h3>
  <p>Hover to see the effect!</p>
</div>
```

### Glassmorphism
```html
<div class="glass-card">
  <p>Beautiful glass effect with blur</p>
</div>
```

## 🎰 Airdrop Spin Game

### Features
- **12-Hour Spin Cycles**: Users can spin once every 12 hours
- **Strike System**: Build consecutive daily spins to reduce wait time
- **Dynamic Rewards**: Randomized rewards within configured ranges
- **Visual Feedback**: Animated spinning wheel with neon effects

### Integration
```tsx
import AirdropSpinGame from '@/components/AirdropSpinGame';

<AirdropSpinGame />
```

### Strike Bonuses
- **Day 1-2**: 12 hour wait time
- **Day 3+**: Wait time decreases by 1 hour per consecutive day
- **Miss a day**: Strikes reset to 1

## 🚀 Launchpad Studio

### Jupiter Integration
View and execute swaps through Jupiter aggregator:

```tsx
// Get swap quote
const quote = await fetch('/api/launchpad/jupiter/quote?' + new URLSearchParams({
  inputMint: 'SOL_MINT',
  outputMint: 'USDC_MINT',
  amount: '1000000',
  slippage: '50'
}));
```

### Raydium Pools
Access real-time liquidity pool data:

```tsx
// Get pool info
const poolInfo = await fetch('/api/launchpad/raydium/pool/POOL_ID');
```

### New Token Launches
Monitor new token launches across all supported launchpads:

```tsx
const launches = await fetch('/api/launchpad/launches/new');
```

## 🎯 Sniper Bot

### Configuration
```typescript
const config = {
  targetLiquidity: 50000,    // Minimum liquidity
  maxBuyAmount: 1000,        // Max buy per token
  stopLossPercent: 10,       // Stop loss %
  takeProfitPercent: 50,     // Take profit %
  dynamicSlippage: true      // Auto-calculate slippage
};

const opportunities = await fetch('/api/launchpad/sniper/opportunities', {
  method: 'POST',
  body: JSON.stringify(config)
});
```

### Dynamic Slippage
The system automatically calculates optimal slippage based on:
- **Liquidity depth**
- **24h volume**
- **Market volatility**

## 💎 Affiliate System

### Registration
```tsx
const register = async (wallet) => {
  const response = await fetch('/api/affiliate/register', {
    method: 'POST',
    body: JSON.stringify({ wallet })
  });
  return response.json();
};
```

### Tier System
| Tier | Total Earned | Commission |
|------|-------------|-----------|
| Bronze | $0 - $999 | 3% |
| Silver | $1,000 - $4,999 | 4% |
| Gold | $5,000 - $9,999 | 5% |
| Platinum | $10,000+ | 7% |

### Share Your Link
```
https://jup-nine.vercel.app/?ref=YOUR_CODE
```

## 🌅 GM Token System

### Daily Check-in
```tsx
const checkIn = async (wallet) => {
  const response = await fetch('/api/gm/checkin', {
    method: 'POST',
    body: JSON.stringify({ wallet })
  });
  return response.json();
};
```

### Earning Bonuses
- **Base**: 10 GM per day
- **3-day streak**: +5 GM bonus
- **7-day streak**: +20 GM bonus
- **30-day streak**: +50 GM bonus
- **Weekend**: +5 GM bonus

### GM Token Uses
- Reduced trading fees
- Early access to new launches
- Exclusive airdrops
- Governance voting power

## 📱 Responsive Design

### Mobile Optimization
All components are fully responsive with touch-optimized interactions:

```css
/* Mobile */
@media (max-width: 768px) {
  .card-3d {
    padding: 16px;
    border-radius: 16px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .card-3d {
    padding: 20px;
  }
}
```

### Touch Gestures
- **Swipe**: Navigate between sections
- **Tap**: Execute actions
- **Long press**: Access context menus

## 🎮 Farcaster Frame Support

### Frame Configuration
```tsx
export const metadata = {
  'fc:frame': 'vNext',
  'fc:frame:image': 'https://jup-nine.vercel.app/og-image.png',
  'fc:frame:button:1': 'Spin for Airdrop',
  'fc:frame:button:2': 'View Launches',
  'fc:frame:button:3': 'Earn GM',
  'fc:frame:post_url': 'https://jup-nine.vercel.app/api/frame'
};
```

### Interactive Frames
- Airdrop spin directly in frame
- Token launch alerts
- GM check-in

## 🎨 Color Palette

### Neon Colors
```scss
$neon-blue: #00d4ff;
$neon-purple: #9945ff;
$neon-green: #14f195;
$neon-pink: #ff00ff;
$neon-cyan: #00ffff;
```

### Gradient Combinations
```css
/* Solana Gradient */
background: linear-gradient(135deg, #00d4ff, #9945ff, #14f195);

/* Fire Gradient */
background: linear-gradient(135deg, #ff00ff, #ff0080, #ff6b00);
```

## 🔧 Component API

### Button Variants
```tsx
<button className="btn-neon">Neon Button</button>
<button className="btn-neon" style={{
  '--aura-color': 'var(--neon-green)'
}}>
  Custom Color
</button>
```

### Card Variants
```tsx
<div className="card-3d neon-glow-purple">
  3D Card with Purple Glow
</div>

<div className="glass-card">
  Glass Card
</div>
```

## 📊 Performance Optimization

### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const AirdropSpinGame = dynamic(
  () => import('@/components/AirdropSpinGame'),
  { loading: () => <div>Loading...</div> }
);
```

### Image Optimization
```tsx
import Image from 'next/image';

<Image 
  src="/token-icon.png"
  width={48}
  height={48}
  alt="Token"
  priority
/>
```

## 🔐 Wallet Integration

### Connect Wallet
```tsx
const connectWallet = async () => {
  if (window.solana?.isPhantom) {
    const response = await window.solana.connect();
    return response.publicKey.toString();
  }
};
```

### Sign Transaction
```tsx
const signTransaction = async (transaction) => {
  const signed = await window.solana.signTransaction(transaction);
  return signed;
};
```

## 🎯 Best Practices

### Accessibility
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Support screen readers

### Performance
- Minimize re-renders
- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images and assets

### Security
- Validate all user inputs
- Use environment variables for secrets
- Implement rate limiting
- Sanitize data before display

---

**For Support**: support@gxqstudio.com
**Documentation**: https://jup-nine.vercel.app/docs
**GitHub**: https://github.com/SMSDAO/GXQ
