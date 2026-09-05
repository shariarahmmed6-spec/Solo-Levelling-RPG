import React, { useEffect, useState } from 'react';
import { playSound } from '../utils/sound';

interface SystemUnlockTransitionProps {
  onComplete: () => void;
  soundEnabled?: boolean;
  startPhase?: 1 | 2;
}

export const SystemUnlockTransition: React.FC<SystemUnlockTransitionProps> = ({
  onComplete,
  soundEnabled = true,
  startPhase = 1
}) => {
  // Phase 1: 'lock' (0-200ms)
  // Phase 2: 'compression' (200-500ms)
  // Phase 3: 'unlock' (500-800ms)
  const [phase, setPhase] = useState<'lock' | 'compression' | 'unlock'>(
    startPhase === 2 ? 'compression' : 'lock'
  );

  useEffect(() => {
    // If starting from phase 1:
    if (startPhase === 1) {
      playSound('systemUnlock', soundEnabled);

      const timerPhase2 = setTimeout(() => {
        setPhase('compression');
      }, 200);

      const timerPhase3 = setTimeout(() => {
        setPhase('unlock');
      }, 500);

      const timerDone = setTimeout(() => {
        onComplete();
      }, 800);

      return () => {
        clearTimeout(timerPhase2);
        clearTimeout(timerPhase3);
        clearTimeout(timerDone);
      };
    } else {
      // Starting from phase 2 (since phase 1 200ms completed in button fade)
      // Phase 2 runs for 300ms (200ms -> 500ms)
      const timerPhase3 = setTimeout(() => {
        setPhase('unlock');
      }, 300);

      // Phase 3 runs for 300ms (500ms -> 800ms)
      const timerDone = setTimeout(() => {
        onComplete();
      }, 600);

      return () => {
        clearTimeout(timerPhase3);
        clearTimeout(timerDone);
      };
    }
  }, [onComplete, soundEnabled, startPhase]);

  return (
    <div
      id="arise-system-unlock-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* Background Veil that smoothly dissolves in Phase 3 */}
      <div
        className={`absolute inset-0 bg-[#050811] transition-opacity duration-300 ease-out ${
          phase === 'unlock' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Subtle grid accent aligned with tactical UI */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* Center Motion Stage */}
      <div className="relative flex items-center justify-center pointer-events-none">
        {/* ========================================================================= */}
        {/* PHASE 1: Soft Cyan Pulse in Center (0 - 200ms) */}
        {/* ========================================================================= */}
        <div
          className={`absolute rounded-full bg-cyan-500/15 blur-2xl transition-all duration-200 ease-out ${
            phase === 'lock'
              ? 'w-44 h-44 opacity-80 scale-100'
              : phase === 'compression'
              ? 'w-24 h-24 opacity-50 scale-75'
              : 'w-[120vw] h-[120vw] opacity-0 scale-150 transition-all duration-300 ease-out'
          }`}
        />

        {/* ========================================================================= */}
        {/* PHASE 2: Thin Cyan Scanner Ring Contracting to Center (200 - 500ms) */}
        {/* ========================================================================= */}
        <div
          className={`absolute rounded-full border border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all ease-in-out ${
            phase === 'lock'
              ? 'w-48 h-48 opacity-70 scale-100 duration-200'
              : phase === 'compression'
              ? 'w-2 h-2 opacity-100 scale-100 duration-300 shadow-[0_0_20px_rgba(0,229,255,0.8)]'
              : 'w-[140vw] h-[140vw] opacity-0 scale-125 duration-300 border-cyan-300/30'
          }`}
          style={{
            transitionTimingFunction:
              phase === 'compression'
                ? 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
                : 'cubic-bezier(0.15, 0, 0.2, 1.0)'
          }}
        />

        {/* ========================================================================= */}
        {/* PHASE 2 & 3: Powering-up Glowing Point & Smooth Unlock Expansion */}
        {/* ========================================================================= */}
        <div
          className={`rounded-full bg-cyan-300 transition-all duration-300 ${
            phase === 'lock'
              ? 'w-1 h-1 opacity-0 scale-0'
              : phase === 'compression'
              ? 'w-2 h-2 opacity-100 scale-100 shadow-[0_0_25px_4px_#00e5ff,0_0_50px_8px_rgba(0,229,255,0.5)]'
              : 'w-[160vw] h-[160vw] opacity-0 scale-150 bg-cyan-400/10 blur-md ease-out'
          }`}
        />

        {/* Subtle Inner Concentric Glow Point */}
        <div
          className={`absolute w-1 h-1 rounded-full bg-white transition-opacity duration-200 ${
            phase === 'compression' ? 'opacity-100 shadow-[0_0_10px_#ffffff]' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
