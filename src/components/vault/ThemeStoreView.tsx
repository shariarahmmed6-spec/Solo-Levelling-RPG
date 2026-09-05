import React, { useState } from 'react';
import { Character, ThemeMode } from '../../types';
import { useTheme, THEME_DEFINITIONS } from '../../context/ThemeContext';
import { playSound } from '../../utils/sound';
import { Palette, Check, Lock, Sparkles, Coins, ArrowRight, ShieldAlert } from 'lucide-react';

interface ThemeStoreViewProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  unlockedThemes: ThemeMode[];
  onUnlockTheme: (theme: ThemeMode, cost: number) => void;
  soundEnabled: boolean;
  totalFragmentsCollected: number;
}

interface StoreThemeItem {
  id: ThemeMode;
  name: string;
  category: 'Standard' | 'Premium' | 'Mythic';
  price: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  colors: {
    bg: string;
    card: string;
    accent: string;
    glow: string;
  };
}

const THEME_CATALOG: StoreThemeItem[] = [
  {
    id: 'dark-cyber',
    name: 'Dark Cyber (Default)',
    category: 'Standard',
    price: 0,
    description: 'Deep navy tactical command layout with high-contrast cyan laser highlights.',
    rarity: 'common',
    colors: { bg: '#090D18', card: '#111B2D', accent: '#00F2FE', glow: 'rgba(0, 242, 254, 0.4)' }
  },
  {
    id: 'neon-blue',
    name: 'Neon Blue',
    category: 'Standard',
    price: 0,
    description: 'Dark obsidian matrix with supercharged electric cobalt blue accents.',
    rarity: 'common',
    colors: { bg: '#050B17', card: '#0E1B38', accent: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' }
  },
  {
    id: 'monarch-purple',
    name: 'Monarch Purple',
    category: 'Standard',
    price: 0,
    description: 'Dark shadow void with royal arcane purple accents of sovereign authority.',
    rarity: 'rare',
    colors: { bg: '#0C0616', card: '#1B1030', accent: '#C084FC', glow: 'rgba(168, 85, 247, 0.4)' }
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    category: 'Premium',
    price: 800,
    description: 'Cybernetic data stream terminal with luminous cyber emerald accents.',
    rarity: 'rare',
    colors: { bg: '#040F0A', card: '#0D291D', accent: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' }
  },
  {
    id: 'crimson-protocol',
    name: 'Crimson Protocol',
    category: 'Premium',
    price: 1200,
    description: 'High-alert tactical combat layout with deep blood obsidian and crimson highlights.',
    rarity: 'epic',
    colors: { bg: '#0E0507', card: '#281116', accent: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)' }
  },
  {
    id: 'gold-commander',
    name: 'Gold Commander',
    category: 'Premium',
    price: 2000,
    description: 'Prestige imperial commander aesthetic with dark charcoal and regal auric gold.',
    rarity: 'epic',
    colors: { bg: '#0C0A04', card: '#231D0B', accent: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' }
  },
  {
    id: 'arctic-ghost',
    name: 'Arctic Ghost',
    category: 'Premium',
    price: 3500,
    description: 'Sub-zero polar night aesthetic with ice cyan crystal and frosted titanium edges.',
    rarity: 'legendary',
    colors: { bg: '#060D15', card: '#122338', accent: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)' }
  },
  {
    id: 'obsidian-elite',
    name: 'Obsidian Elite',
    category: 'Premium',
    price: 5000,
    description: 'Stealth pitch-black minimalist void with refined platinum titanium accents.',
    rarity: 'legendary',
    colors: { bg: '#040507', card: '#13161F', accent: '#E2E8F0', glow: 'rgba(226, 232, 240, 0.35)' }
  },
  {
    id: 'origin-protocol',
    name: 'Origin Protocol',
    category: 'Mythic',
    price: 0, // Unlocked exclusively by gathering 100 fragments
    description: 'The mythic system origin state with chromatic iridescent aura and celestial void.',
    rarity: 'mythic',
    colors: { bg: '#080512', card: '#1C1236', accent: '#38BDF8', glow: 'rgba(139, 92, 246, 0.6)' }
  }
];

export const ThemeStoreView: React.FC<ThemeStoreViewProps> = ({
  character,
  unlockedThemes,
  onUnlockTheme,
  soundEnabled,
  totalFragmentsCollected
}) => {
  const { theme, setTheme } = useTheme();
  const [selectedPreview, setSelectedPreview] = useState<ThemeMode>(theme);
  const [confirmModal, setConfirmModal] = useState<StoreThemeItem | null>(null);

  const handleEquip = (targetTheme: ThemeMode) => {
    playSound('buttonClick', soundEnabled);
    setTheme(targetTheme);
    setSelectedPreview(targetTheme);
  };

  const handleBuy = (item: StoreThemeItem) => {
    if (character.coins < item.price) return;
    playSound('achievement', soundEnabled);
    onUnlockTheme(item.id, item.price);
    setTheme(item.id);
    setSelectedPreview(item.id);
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Coins & Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111B2D] border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase mb-1">
            <Palette className="w-4 h-4" />
            <span>Theme Store • Visual Architecture Customizer</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Tactical HUD Themes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalize your terminal across every screen, button, border, and chart.
          </p>
        </div>

        {/* User Coin Balance */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#090D18] border border-cyan-500/30">
          <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Available Coins</div>
            <div className="text-lg font-bold text-amber-400 font-mono leading-tight">
              {character.coins.toLocaleString()} <span className="text-xs text-zinc-400">GOLD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEME_CATALOG.map((item) => {
          const isUnlocked =
            item.price === 0 && item.category === 'Standard'
              ? true
              : item.id === 'origin-protocol'
              ? totalFragmentsCollected >= 100
              : unlockedThemes.includes(item.id);

          const isCurrentActive = theme === item.id;
          const canAfford = character.coins >= item.price;
          const coinsNeeded = Math.max(0, item.price - character.coins);

          return (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${
                isCurrentActive
                  ? 'border-cyan-400 bg-[#111B2D] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.2)]'
                  : 'border-cyan-500/15 bg-[#101726]/80 hover:border-cyan-500/35 hover:bg-[#111B2D]'
              }`}
            >
              {/* Top Row: Rarity Tag & Active Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.rarity === 'mythic'
                      ? 'border-purple-500/60 bg-purple-500/10 text-purple-300 animate-pulse'
                      : item.rarity === 'legendary'
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : item.rarity === 'epic'
                      ? 'border-red-500/60 bg-red-500/10 text-red-300'
                      : item.rarity === 'rare'
                      ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.rarity}
                </span>

                {isCurrentActive && (
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    <Check className="w-3 h-3" /> EQUIPPED
                  </span>
                )}
              </div>

              {/* Theme Name & Description */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  {item.name}
                  {item.id === 'origin-protocol' && (
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                  )}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Color Swatch Preview Bar */}
              <div className="flex items-center gap-2 mb-5 p-2 rounded-lg bg-[#090D18] border border-cyan-500/10">
                <div
                  className="w-6 h-6 rounded-md border border-white/10"
                  style={{ backgroundColor: item.colors.bg }}
                  title="Canvas Background"
                />
                <div
                  className="w-6 h-6 rounded-md border border-white/10"
                  style={{ backgroundColor: item.colors.card }}
                  title="Card Surface"
                />
                <div
                  className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: item.colors.accent }}
                  title="Tactical Accent"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 ml-auto uppercase tracking-wider">
                  Spectrum
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-cyan-500/10">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 cursor-default"
                  >
                    Active Preset
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleEquip(item.id)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    Equip Theme
                  </button>
                ) : item.id === 'origin-protocol' ? (
                  <div className="text-center py-2 px-3 rounded-lg text-xs font-mono bg-purple-950/30 border border-purple-500/30 text-purple-300">
                    <span className="flex items-center justify-center gap-1 font-bold">
                      <Lock className="w-3.5 h-3.5" /> 100 System Fragments Required ({totalFragmentsCollected}/100)
                    </span>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setConfirmModal(item)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer'
                          : 'bg-zinc-800/80 border border-zinc-700 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Unlock for {item.price.toLocaleString()} Coins</span>
                    </button>
                    {!canAfford && (
                      <div className="text-[10px] text-center text-amber-500/80 font-mono mt-1.5">
                        Only {coinsNeeded.toLocaleString()} more Coins needed
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Theme Purchase */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400 font-mono text-sm tracking-wider uppercase">
              <Palette className="w-5 h-5" />
              <span>Confirm Theme Acquisition</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {confirmModal.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {confirmModal.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D18] border border-cyan-500/15 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Current Balance:</span>
                <span className="text-white font-bold">{character.coins.toLocaleString()} Coins</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Theme Cost:</span>
                <span className="text-amber-400 font-bold">-{confirmModal.price.toLocaleString()} Coins</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Remaining Balance:</span>
                <span className="text-cyan-400 font-bold">{(character.coins - confirmModal.price).toLocaleString()} Coins</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBuy(confirmModal)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                Confirm Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
