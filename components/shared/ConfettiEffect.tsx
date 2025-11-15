'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  type?: 'success' | 'milestone' | 'achievement';
}

export function ConfettiEffect({ trigger, type = 'success' }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;
    
    const configs = {
      success: {
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      },
      milestone: {
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#0088FE', '#00C49F', '#FFBB28']
      },
      achievement: {
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        startVelocity: 30
      }
    };
    
    confetti(configs[type]);
  }, [trigger, type]);

  return null;
}

