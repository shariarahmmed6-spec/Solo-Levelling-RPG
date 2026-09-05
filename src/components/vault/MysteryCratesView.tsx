import React, { useState } from 'react';
import { Character, InventoryItem, SystemFragment } from '../../types';
import { playSound } from '../../utils/sound';
import { Box, Sparkles, Gem, Crown, Gift, ArrowRight, ShieldCheck, Zap, Coins, Award, Lock, CheckCircle2 } from 'lucide-react';

interface MysteryCratesViewProps {
  character: Character;
  inventory: InventoryItem[];
  onOpenCrate: (crateId: string) => {
    success: boolean;
    loot: {
      coins: number;
      xp: number;
      rewardItem?: string;
      rarity: string;
      fragment?: SystemFragment;
      frameId?: string;
      title?: string;
    } | null;
  };
  soundEnabled: boolean;
  streakDays: number;
  hasDefeatedBoss: boolean;
}

interface CrateMeta {
  id: 'crate_common' | 'chest_rare' | 'chest_epic' | 'chest_legendary';
  name: string;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  earnSource: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: any;
  borderClass: string;
  glowColor: string;
}

const CRATE_DEFINITIONS: CrateMeta[] = [
  {
    id: 'crate_common',
    name: 'Operative Supply Crate',
    tier: 'Common',
    description: 'Standard tactical drop containing essential coins, recovery elixirs, and basic operative supplies.',
    earnSource: 'Earned from 3-day streaks and daily quest milestone clears',
    rarity: 'common',
    icon: Box,
    borderClass: 'border-zinc-700 bg-zinc-900/60',
    glowColor: 'rgba(113, 113, 122, 0.3)'
  },
  {
    id: 'chest_rare',
    name: 'Rare Dungeon Cache',
    tier: 'Rare',
    description: 'Hardened titanium dungeon crate containing gold coins, high-grade potions, or rare profile frames.',
    earnSource: 'Earned from Weekly Boss Battles, 7-Day Streaks, or Iron Will achievement',
    rarity: 'rare',
    icon: Sparkles,
    borderClass: 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,242,254,0.15)]',
    glowColor: 'rgba(0, 242, 254, 0.4)'
  },
  {
    id: 'chest_epic',
    name: 'Epic S-Rank Cache',
    tier: 'Epic',
    description: 'Reinforced purple vault casing carrying substantial gold, rare system fragments, and exclusive titles.',
    earnSource: 'Earned from 30-Day Streaks, Infinite Fortitude, or S-Rank raid encounters',
    rarity: 'epic',
    icon: Gem,
    borderClass: 'border-purple-500/40 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    glowColor: 'rgba(168, 85, 247, 0.5)'
  },
  {
    id: 'chest_legendary',
    name: 'Monarch’s Relic Crate',
    tier: 'Legendary',
    description: 'Ancient sovereign reliquary. Contains immense gold, mythic titles, and guaranteed hidden system fragments.',
    earnSource: 'Earned from major life milestones, 60+ day streaks, and national achievements',
    rarity: 'legendary',
    icon: Crown,
    borderClass: 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    glowColor: 'rgba(245, 158, 11, 0.6)'
  }
];

export const MysteryCratesView: React.FC<MysteryCratesViewProps> = ({
  character,
  inventory,
  onOpenCrate,
  soundEnabled,
  streakDays,
  hasDefeatedBoss
}) => {
  // Opening animation states
  const [openingCrate, setOpeningCrate] = useState<CrateMeta | null>(null);
  const [animationStage, setAnimationStage] = useState<'idle' | 'scanning' | 'unlocking' | 'revealed'>('idle');
  const [revealedLoot, setRevealedLoot] = useState<{
    coins: number;
    xp: number;
    rewardItem?: string;
    rarity: string;
    fragment?: SystemFragment;
    frameId?: string;
    title?: string;
  } | null>(null);

  // Helper to count quantity of each crate in inventory
  const getCrateQuantity = (crateId: string): number => {
    if (crateId === 'crate_common') {
      const match = inventory.find(i => i.id === 'crate_common' || i.type === 'crate_common');
      return match ? match.quantity : 0;
    }
    const match = inventory.find(i => i.id === crateId || i.type === (crateId as any));
    return match ? match.quantity : 0;
  };

  const handleStartOpening = (crate: CrateMeta) => {
    const qty = getCrateQuantity(crate.id);
    if (qty <= 0) return;

    setOpeningCrate(crate);
    setAnimationStage('scanning');
    playSound('buttonClick', soundEnabled);

    // Vibrate tactical pulse if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([40, 60, 40]);
    }

    // Step 1: Laser scanning (1.2s)
    setTimeout(() => {
      setAnimationStage('unlocking');
      playSound('heal', soundEnabled);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([80, 100]);
      }

      // Step 2: Mechanical unlock and reveal (1.0s)
      setTimeout(() => {
        const res = onOpenCrate(crate.id);
        if (res.success && res.loot) {
          setRevealedLoot(res.loot);
          setAnimationStage('revealed');
          playSound('achievement', soundEnabled);
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate?.([50, 50, 150]);
          }
        } else {
          // fallback
          setAnimationStage('idle');
          setOpeningCrate(null);
        }
      }, 1000);
    }, 1200);
  };

  const handleCloseModal = () => {
    setAnimationStage('idle');
    setOpeningCrate(null);
    setRevealedLoot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase mb-1">
            <Box className="w-4 h-4" />
            <span>Mystery Crates • Authentic Merit Vault</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Tactical Crate Matrix
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Crates cannot be bought with real money. Every crate is strictly earned through real-world consistency, Sunday Boss Battles, and milestone streaks.
          </p>
        </div>

        {/* Crate Integrity Pledge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#090D18] border border-cyan-500/30">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-[11px] font-mono text-zinc-300">
            <div className="font-bold text-emerald-400 uppercase tracking-wider">100% Merit-Based</div>
            <div className="text-zinc-400">Zero Pay-to-Win Mechanics</div>
          </div>
        </div>
      </div>

      {/* Crates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CRATE_DEFINITIONS.map((crate) => {
          const quantity = getCrateQuantity(crate.id);
          const hasAvailable = quantity > 0;
          const IconComp = crate.icon;

          return (
            <div
              key={crate.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${crate.borderClass}`}
            >
              {/* Top Row: Rarity Tag & Available Count */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    crate.rarity === 'legendary'
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : crate.rarity === 'epic'
                      ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                      : crate.rarity === 'rare'
                      ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {crate.tier} Tier
                </span>

                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                    hasAvailable
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 animate-pulse'
                      : 'bg-zinc-800/80 border border-zinc-700 text-zinc-500'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{quantity} Available</span>
                </div>
              </div>

              {/* Center Content with Crate Visual */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-[#090D18]"
                  style={{ boxShadow: hasAvailable ? `0 0 15px ${crate.glowColor}` : 'none' }}
                >
                  <IconComp
                    className={`w-7 h-7 ${
                      crate.rarity === 'legendary'
                        ? 'text-amber-400'
                        : crate.rarity === 'epic'
                        ? 'text-purple-400'
                        : crate.rarity === 'rare'
                        ? 'text-cyan-400'
                        : 'text-zinc-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1">
                    {crate.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                    {crate.description}
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{crate.earnSource}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/5">
                {hasAvailable ? (
                  <button
                    onClick={() => handleStartOpening(crate)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    <Box className="w-4 h-4" />
                    <span>Unbox Crate Now</span>
                  </button>
                ) : (
                  <div className="text-center py-2 px-3 rounded-lg text-xs font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Earn via consistency & weekly boss</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Opening & Unboxing Modal with Laser Scanline Animation */}
      {openingCrate && animationStage !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-[#111B2D] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.3)] space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Dungeon Vault Terminal • Container Unboxing</span>
            </div>

            {/* Viewport for Crate Animation */}
            <div className="relative w-48 h-48 mx-auto my-4 rounded-2xl bg-[#090D18] border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Tactical Grid Background */}
              <div className="absolute inset-0 tactical-scanline opacity-40" />

              {/* Laser Scanline Beam */}
              {animationStage === 'scanning' && (
                <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#00f2fe] animate-laser-sweep z-20" />
              )}

              {/* Center Graphic */}
              <div
                className={`relative z-10 transition-all duration-500 ${
                  animationStage === 'scanning'
                    ? 'scale-100'
                    : animationStage === 'unlocking'
                    ? 'scale-110 rotate-3'
                    : 'scale-125'
                }`}
              >
                {animationStage === 'revealed' ? (
                  <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
                ) : (
                  <openingCrate.icon
                    className={`w-20 h-20 ${
                      openingCrate.rarity === 'legendary'
                        ? 'text-amber-400'
                        : openingCrate.rarity === 'epic'
                        ? 'text-purple-400'
                        : openingCrate.rarity === 'rare'
                        ? 'text-cyan-400'
                        : 'text-zinc-400'
                    }`}
                  />
                )}
              </div>

              {/* Status Banner inside Viewport */}
              <div className="absolute bottom-2 inset-x-2 py-1 bg-black/70 rounded border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                {animationStage === 'scanning' && 'LASER SCANNING BIOMETRICS...'}
                {animationStage === 'unlocking' && 'MECHANICAL SEALS DEPLOYING...'}
                {animationStage === 'revealed' && 'CONTAINER BREACHED!'}
              </div>
            </div>

            {/* Revealed Loot Card */}
            {animationStage === 'revealed' && revealedLoot && (
              <div className="p-4 rounded-2xl bg-[#090D18] border border-cyan-500/30 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Loot Discovered
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2.5 rounded-lg bg-[#111B2D] border border-amber-500/20 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-[10px] font-mono text-zinc-400">Gold Coins</div>
                      <div className="text-sm font-bold text-amber-400 font-mono">+{revealedLoot.coins}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#111B2D] border border-cyan-500/20 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-[10px] font-mono text-zinc-400">Hunter XP</div>
                      <div className="text-sm font-bold text-cyan-400 font-mono">+{revealedLoot.xp} XP</div>
                    </div>
                  </div>
                </div>

                {revealedLoot.rewardItem && (
                  <div className="p-2.5 rounded-lg bg-[#111B2D] border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Special Drop: <strong>{revealedLoot.rewardItem}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {animationStage === 'revealed' && (
              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all cursor-pointer"
              >
                Claim Loot & Return to Armory
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
