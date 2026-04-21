// Auto-generated: FX Glow Effect Widget
import React, { useEffect } from 'react';

export default function FXGlowWidget({ intensity = 1.0 }) {
  useEffect(() => {
    document.body.style.setProperty('--fx-intensity', intensity.toString());
    document.body.classList.add('fx-glow-active');
    
    return () => {
      document.body.classList.remove('fx-glow-active');
    };
  }, [intensity]);

  return (
    <style jsx global>{`
      .fx-glow-active {
        animation: glow-pulse 2s ease-in-out infinite;
      }
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 10px rgba(76, 175, 80, calc(var(--fx-intensity) * 0.5)); }
        50% { box-shadow: 0 0 20px rgba(76, 175, 80, var(--fx-intensity)); }
      }
    `}</style>
  );
}
