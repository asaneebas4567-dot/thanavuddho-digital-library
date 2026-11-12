'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface FlyingCoin {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  burstX: number;
  burstY: number;
  delayMs: number;
  durationMs: number;
  scale: number;
}

// Synthesized Web Audio Chime (no external files needed)
function playCoinDing(frequency = 1200) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  } catch {}
}

/**
 * Global trigger to launch flying coins from any component
 */
export function triggerFlyingCoins(options?: {
  startX?: number;
  startY?: number;
  count?: number;
  sound?: boolean;
}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('trigger-flying-coins', {
      detail: options || {}
    })
  );
}

export default function FlyingCoinAnimation() {
  const [coins, setCoins] = useState<FlyingCoin[]>([]);

  const handleTrigger = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<{
      startX?: number;
      startY?: number;
      count?: number;
      sound?: boolean;
    }>;
    const detail = customEvent.detail || {};

    const count = detail.count || 12;
    const sound = detail.sound !== false;

    // Determine target location (Navbar Points Pill)
    let targetX = window.innerWidth - 120;
    let targetY = 28;

    const navPill = document.getElementById('navbar-points-pill');
    if (navPill) {
      const rect = navPill.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Determine start location
    const startX = detail.startX ?? window.innerWidth / 2;
    const startY = detail.startY ?? window.innerHeight / 2;

    const newCoins: FlyingCoin[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const burstDist = 40 + Math.random() * 65;
      const burstX = Math.cos(angle) * burstDist;
      const burstY = Math.sin(angle) * burstDist - 20;

      newCoins.push({
        id: now + i,
        startX,
        startY,
        targetX,
        targetY,
        burstX,
        burstY,
        delayMs: i * 35,
        durationMs: 700 + Math.random() * 200,
        scale: 0.85 + Math.random() * 0.35
      });
    }

    setCoins(prev => [...prev, ...newCoins]);

    // Play subtle chimes as coins arrive
    if (sound) {
      newCoins.forEach((_, idx) => {
        setTimeout(() => {
          playCoinDing(1100 + (idx % 6) * 120);
        }, 500 + idx * 40);
      });
    }

    // Animate target pill bounce
    setTimeout(() => {
      const pill = document.getElementById('navbar-points-pill');
      if (pill) {
        pill.classList.add('scale-115', 'ring-4', 'ring-amber-300', 'transition-all');
        setTimeout(() => {
          pill.classList.remove('scale-115', 'ring-4', 'ring-amber-300');
        }, 400);
      }
    }, 700);

    // Clean up coins after animations complete
    setTimeout(() => {
      setCoins(prev => prev.filter(c => !newCoins.some(nc => nc.id === c.id)));
    }, 1800);
  }, []);

  useEffect(() => {
    window.addEventListener('trigger-flying-coins', handleTrigger);
    return () => window.removeEventListener('trigger-flying-coins', handleTrigger);
  }, [handleTrigger]);

  if (coins.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute will-change-transform"
          style={{
            left: `${coin.startX}px`,
            top: `${coin.startY}px`,
            animation: `flyToNavbar ${coin.durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${coin.delayMs}ms forwards`,
            ['--target-x' as string]: `${coin.targetX - coin.startX}px`,
            ['--target-y' as string]: `${coin.targetY - coin.startY}px`,
            ['--burst-x' as string]: `${coin.burstX}px`,
            ['--burst-y' as string]: `${coin.burstY}px`,
          }}
        >
          {/* Glowing Golden Coin Graphic with KaTeX-free Unicode coin */}
          <div 
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_12px_rgba(251,191,36,0.85)] border-2 border-white text-white font-black text-xs select-none animate-spin-slow"
            style={{ transform: `scale(${coin.scale})` }}
          >
            <span className="drop-shadow-xs">🪙</span>
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes flyToNavbar {
          0% {
            transform: translate(0, 0) scale(0.6);
            opacity: 0;
          }
          15% {
            transform: translate(var(--burst-x), var(--burst-y)) scale(1.2);
            opacity: 1;
          }
          40% {
            transform: translate(
              calc(var(--burst-x) + (var(--target-x) - var(--burst-x)) * 0.35),
              calc(var(--burst-y) + (var(--target-y) - var(--burst-y)) * 0.2 - 30px)
            ) scale(1.05);
            opacity: 1;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(0.4);
            opacity: 0;
          }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 1.4s linear infinite;
        }
      `}</style>
    </div>
  );
}
