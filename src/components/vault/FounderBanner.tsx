import React from 'react';
import { Sparkles, Shield, Award, CheckCircle2, Key, Clock } from 'lucide-react';
import { playSound } from '../../utils/sound';

interface FounderBannerProps {
  isClaimed: boolean;
  onClaim: () => void;
  soundEnabled: boolean;
}

export const FounderBanner: React.FC<FounderBannerProps> = ({
  isClaimed,
  onClaim,
  soundEnabled
}) => {
  const handleClaim = () => {
    playSound('achievement', soundEnabled);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([60, 100, 150]);
    }
    onClaim();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#1E1706] via-[#120F05] to-[#1E1706] p-5 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
      {/* Laser sweep animation for founder exclusivity */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent pointer-events-none animate-laser-sweep" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        {/* Left side: Information & Lore */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase font-bold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Limited Legacy • Founder Vanguard Collection</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Commemorating the First 1,000 ARISE Awakened Hunters
          </h3>
          <p className="text-xs text-amber-200/80 max-w-2xl leading-relaxed">
            As an early pioneer, claim your permanent legacy relics. These items will never be sold, re-issued, or available again once the Founder Vanguard window closes. Provides pure cosmetic prestige and identity.
          </p>

          {/* Relic Badges Preview */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              <Key className="w-3 h-3 text-amber-400" />
              <span>Fragment #001: Genesis Seed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Title: Pioneer 001</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Frame: Founder Vanguard</span>
            </span>
          </div>
        </div>

        {/* Right side: Claim CTA */}
        <div className="w-full lg:w-auto shrink-0">
          {isClaimed ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold shadow-inner">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Founder Relics Claimed</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className="w-full lg:w-auto py-2.5 px-5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Founder Legacy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
