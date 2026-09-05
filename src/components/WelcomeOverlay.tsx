import React, { useEffect, useState } from 'react';

interface WelcomeOverlayProps {
  userName: string;
  missionDay: number;
  isFirstDayOrUnlock: boolean;
  onDismiss?: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  userName,
  missionDay,
  isFirstDayOrUnlock,
  onDismiss
}) => {
  const [stage, setStage] = useState<'entering' | 'visible' | 'exiting' | 'gone'>('entering');

  useEffect(() => {
    // 1. Fade in smoothly (0 - 200ms)
    const enterTimer = setTimeout(() => {
      setStage('visible');
    }, 50);

    // 2. Stay visible for 1.5 seconds, then begin exit fade (1550ms)
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 1600);

    // 3. Fully dismiss after fade out (1600ms + 350ms = 1950ms)
    const doneTimer = setTimeout(() => {
      setStage('gone');
      if (onDismiss) onDismiss();
    }, 1950);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDismiss]);

  if (stage === 'gone') return null;

  // Exact Dynamic Greeting formatting from specifications:
  // First Day / Just Unlocked:
  //   Welcome, {UserName}.
  //   Mission Day 1 begins now. (or Mission Day {X} begins now.)
  // Returning Users (after day 1):
  //   Welcome back, {UserName}.
  //   Mission Day {X}.
  const title = isFirstDayOrUnlock
    ? `Welcome, ${userName}.`
    : `Welcome back, ${userName}.`;

  const subtitle = isFirstDayOrUnlock
    ? `Mission Day ${missionDay} begins now.`
    : `Mission Day ${missionDay}.`;

  const isFadingOut = stage === 'exiting';
  const isEntering = stage === 'entering';

  return (
    <div
      id="arise-welcome-overlay"
      className={`fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out select-none ${
        isEntering
          ? 'opacity-0 -translate-y-2 scale-95'
          : isFadingOut
          ? 'opacity-0 -translate-y-1 scale-98 transition-all duration-350 ease-in'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div className="relative bg-[#09111f]/95 border border-cyan-400/40 rounded-xl px-5 py-3 shadow-[0_0_35px_rgba(0,229,255,0.22),inset_0_0_15px_rgba(0,229,255,0.06)] backdrop-blur-md flex items-center gap-3.5 max-w-sm sm:max-w-md">
        {/* Subtle scanline texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:100%_3px] rounded-xl pointer-events-none" />

        {/* Soft Tactical Status Dot */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <div className="absolute w-5 h-5 rounded-full border border-cyan-400/30 animate-ping" />
        </div>

        {/* Thin divider */}
        <div className="w-px h-7 bg-cyan-500/25 shrink-0" />

        {/* Greeting Content */}
        <div className="space-y-0.5 text-left font-mono">
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-tight">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-cyan-300/90 tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
