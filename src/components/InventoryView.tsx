import React, { useState } from 'react';
import { InventoryItem, Character } from '../types';
import { Sparkles, HeartPulse, Box, Gem, Crown, Trophy, Check } from 'lucide-react';
import { playSound } from '../utils/sound';

interface InventoryViewProps {
  inventory: InventoryItem[];
  character: Character;
  onConsumeItem: (id: string) => void;
  onOpenChest: (id: string) => { success: boolean; loot: { coins: number; xp: number; rewardItem?: string; rarity: string } | null };
  onEquipTitle: (title: string) => void;
  soundEnabled: boolean;
}

export default function InventoryView({
  inventory,
  character,
  onConsumeItem,
  onOpenChest,
  onEquipTitle,
  soundEnabled
}: InventoryViewProps) {
  const [openingChest, setOpeningChest] = useState<InventoryItem | null>(null);
  const [chestAnimationState, setChestAnimationState] = useState<'closed' | 'shaking' | 'open'>('closed');
  const [revealedLoot, setRevealedLoot] = useState<{ coins: number; xp: number; rewardItem?: string; rarity: string } | null>(null);

  const getRarityColor = (rarity: InventoryItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
      case 'rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
      case 'epic': return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
      case 'legendary': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return HeartPulse;
      case 'Sparkles': return Sparkles;
      case 'Box': return Box;
      case 'Gem': return Gem;
      case 'Crown': return Crown;
      default: return Box;
    }
  };

  const triggerOpenChest = (chest: InventoryItem) => {
    if (chest.quantity <= 0) return;
    playSound('click', soundEnabled);
    setOpeningChest(chest);
    setChestAnimationState('shaking');
    setRevealedLoot(null);

    // After 1.2s shaking, trigger open
    setTimeout(() => {
      const res = onOpenChest(chest.id);
      if (res.success && res.loot) {
        setChestAnimationState('open');
        setRevealedLoot(res.loot);
      } else {
        setOpeningChest(null);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Visual Header */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative">
        <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest">
          WORKSPACE RESOURCE INVENTORY
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
          Deploy focus remedials, configure custom achievement titles, and unbox high-tier accomplishment packages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consumables & Chests */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">AVAILABLE RESOURCES</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inventory.map((item) => {
              const ItemIcon = getIcon(item.icon);
              const isChest = item.type.startsWith('chest');

              return (
                <div
                  key={item.id}
                  className={`bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-4.5 flex flex-col justify-between hover:border-cyan-500/25 transition-all duration-150 relative ${
                    item.quantity > 0 ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-[#101726] border border-cyan-500/10 shrink-0 flex items-center justify-center">
                      <ItemIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-zinc-100 uppercase font-mono tracking-wider">{item.name}</h4>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 border rounded uppercase font-bold ${getRarityColor(item.rarity)}`}>
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cyan-500/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-500">
                      QUANTITY: <span className="text-zinc-200 font-bold">{item.quantity}</span>
                    </span>

                    {item.quantity > 0 && (
                      <button
                        onClick={() => {
                          if (isChest) {
                            triggerOpenChest(item);
                          } else {
                            onConsumeItem(item.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          isChest
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_10px_rgba(0,242,254,0.1)]'
                            : 'bg-[#101726] hover:bg-[#101726]/80 text-cyan-400 border border-cyan-500/10'
                        }`}
                      >
                        {isChest ? 'Unbox Package' : 'Apply Remedial'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipable Titles Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">ACTIVE ACHIEVEMENT TITLES</h3>
          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
              Equip titles unlocked through your consistency milestones to customize your workspace identity.
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {character.titles.map((title) => {
                const isActive = character.activeTitle === title;

                return (
                  <button
                    key={title}
                    onClick={() => {
                      onEquipTitle(title);
                      playSound('click', soundEnabled);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                        : 'bg-[#101726] border-cyan-500/5 hover:border-cyan-500/15 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-600'}`} />
                      <span className="text-xs font-semibold">{title}</span>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-cyan-500/20">
                        <Check className="w-3 h-3 stroke-[3]" /> ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Package Unboxing Modal */}
      {openingChest && (
        <div className="fixed inset-0 bg-zinc-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-sm w-full bg-[#111B2D] border border-cyan-500/15 p-8 rounded-[14px] text-center space-y-6 shadow-2xl">
            {/* Shaking Chest Screen */}
            {chestAnimationState === 'shaking' && (
              <div className="space-y-6">
                <div className="h-44 flex items-center justify-center">
                  <Box className="w-16 h-16 text-cyan-400 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-100">
                    Unboxing System Package...
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-mono animate-pulse uppercase tracking-wider">Extracting digital contents</p>
                </div>
              </div>
            )}

            {/* Revealed loot screen */}
            {chestAnimationState === 'open' && revealedLoot && (
              <div className="space-y-6 animate-scaleUp">
                <div className="h-44 flex flex-col items-center justify-center space-y-2 relative">
                  <Crown className="w-12 h-12 text-cyan-400" />
                  <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-bold">UNBOXING COMPLETED</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-widest">
                    Acquired Contents
                  </h3>

                  <div className="bg-[#101726] border border-cyan-500/10 p-4 rounded-xl space-y-2.5 text-xs font-mono text-left max-w-xs mx-auto">
                    <div className="flex justify-between items-center text-amber-500">
                      <span>✦ GOLD COINS:</span>
                      <span className="font-bold">+{revealedLoot.coins}</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-400">
                      <span>✦ EXPERIENCE POINTS:</span>
                      <span className="font-bold">+{revealedLoot.xp} XP</span>
                    </div>
                    {revealedLoot.rewardItem && (
                      <div className="flex flex-col border-t border-cyan-500/10 pt-2 text-cyan-400 mt-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">CERTIFIED REWARD:</span>
                        <span className="font-bold text-zinc-200 mt-0.5">{revealedLoot.rewardItem}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOpeningChest(null);
                    setRevealedLoot(null);
                  }}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                >
                  Claim Yield
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
