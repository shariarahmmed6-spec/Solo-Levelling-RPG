import React, { useState, useMemo } from 'react';
import { InventoryItem, Character, SystemFragment, ThemeMode, LegacyRelic } from '../types';
import { Sparkles, HeartPulse, Box, Gem, Crown, Trophy, Check, Palette, Shield, Key, Award, Flame, Flower2, Zap, CheckCircle2, Lock } from 'lucide-react';
import { playSound } from '../utils/sound';
import { ThemeStoreView } from './vault/ThemeStoreView';
import { ProfileFramesView } from './vault/ProfileFramesView';
import { MysteryCratesView } from './vault/MysteryCratesView';
import { SystemFragmentsView } from './vault/SystemFragmentsView';
import { FounderBanner } from './vault/FounderBanner';

export type VaultSection = 'themes' | 'frames' | 'crates' | 'fragments' | 'relics' | 'supplies';

interface InventoryViewProps {
  inventory: InventoryItem[];
  character: Character;
  onConsumeItem: (id: string) => void;
  onOpenChest: (id: string) => { 
    success: boolean; 
    loot: { 
      coins: number; 
      xp: number; 
      rewardItem?: string; 
      rarity: string; 
      fragment?: SystemFragment;
      frameId?: string;
      title?: string;
    } | null 
  };
  onEquipTitle: (title: string) => void;
  soundEnabled: boolean;
  systemFragments?: SystemFragment[];
  unlockedThemes?: ThemeMode[];
  unlockedFrames?: string[];
  founderClaimed?: boolean;
  legacyRelics?: LegacyRelic[];
  onUnlockTheme?: (theme: ThemeMode, cost: number) => void;
  onEquipFrame?: (frameId: string) => void;
  onUnlockFrameWithCoins?: (frameId: string, cost: number) => void;
  onClaimFounder?: () => void;
  streakDays?: number;
  hasDefeatedBoss?: boolean;
  onActivateOriginProtocol?: () => void;
}

export default function InventoryView({
  inventory,
  character,
  onConsumeItem,
  onOpenChest,
  onEquipTitle,
  soundEnabled,
  systemFragments = [],
  unlockedThemes = ['dark-cyber', 'neon-blue', 'monarch-purple'],
  unlockedFrames = ['frame_default'],
  founderClaimed = false,
  legacyRelics = [],
  onUnlockTheme,
  onEquipFrame,
  onUnlockFrameWithCoins,
  onClaimFounder,
  streakDays = 0,
  hasDefeatedBoss = false,
  onActivateOriginProtocol
}: InventoryViewProps) {
  const [activeSection, setActiveSection] = useState<VaultSection>('themes');

  // Fragment Discovery Metrics
  const totalFragmentsCollected = useMemo(() => {
    return systemFragments.filter(f => f.discoveryDate !== null).length;
  }, [systemFragments]);

  // Crate count
  const availableCratesCount = useMemo(() => {
    return inventory
      .filter(item => item.type.startsWith('chest') || item.type.startsWith('crate'))
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [inventory]);

  const handleSectionSwitch = (sec: VaultSection) => {
    playSound('buttonClick', soundEnabled);
    setActiveSection(sec);
  };

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tactical Vault Header */}
      <div className="bg-[#111B2D] border border-cyan-500/20 rounded-[14px] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase font-bold mb-1">
              <Box className="w-4 h-4" />
              <span>ARISE SYSTEM • VAULT & ARMORY ECOSYSTEM</span>
            </div>
            <h2 className="text-xl font-bold text-white font-mono tracking-wider">
              REWARD VAULT & TACTICAL DEPOT
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1 max-w-2xl font-normal leading-relaxed">
              Realize your earned progress into personal identity, high-tech HUD themes, profile frames, authentic merit crates, and encrypted system fragments.
            </p>
          </div>

          {/* Player Coin & Hunter Identity Counter */}
          <div className="flex items-center gap-4 bg-[#090D18] p-3 rounded-xl border border-cyan-500/25 self-start md:self-auto shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Hunter Treasury</div>
              <div className="text-base font-bold text-amber-400 font-mono">
                {character.coins.toLocaleString()} <span className="text-xs text-zinc-500">COINS</span>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Fragments</div>
              <div className="text-base font-bold text-cyan-400 font-mono">
                {totalFragmentsCollected} <span className="text-xs text-zinc-500">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Legacy Banner (Permanent for early adopters) */}
      <FounderBanner
        isClaimed={founderClaimed}
        onClaim={onClaimFounder || (() => {})}
        soundEnabled={soundEnabled}
      />

      {/* Vault Navigation Tabs (4 Permanent Sections + Tactical Supplies) */}
      <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-2 overflow-x-auto scrollbar-none">
        {/* 1. Theme Store */}
        <button
          onClick={() => handleSectionSwitch('themes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'themes'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Theme Store</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-normal">
            {unlockedThemes.length}/9
          </span>
        </button>

        {/* 2. Profile Frames */}
        <button
          onClick={() => handleSectionSwitch('frames')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'frames'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Profile Frames</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-normal">
            {unlockedFrames.length}
          </span>
        </button>

        {/* 3. Mystery Crates */}
        <button
          onClick={() => handleSectionSwitch('crates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'crates'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <Box className="w-4 h-4 text-cyan-400" />
          <span>Mystery Crates</span>
          {availableCratesCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold animate-pulse">
              {availableCratesCount}
            </span>
          )}
        </button>

        {/* 4. System Fragments */}
        <button
          onClick={() => handleSectionSwitch('fragments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'fragments'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <Key className="w-4 h-4 text-purple-400" />
          <span>System Fragments</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold">
            {totalFragmentsCollected}/100
          </span>
        </button>

        {/* 5. Legacy Relics (Permanent Tree Collectibles) */}
        <button
          onClick={() => handleSectionSwitch('relics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'relics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <Gem className="w-4 h-4 text-amber-400" />
          <span>Legacy Relics</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
            {legacyRelics.filter(r => r.unlocked).length}/5
          </span>
        </button>

        {/* 6. Tactical Supplies & Titles (Original Inventory) */}
        <button
          onClick={() => handleSectionSwitch('supplies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeSection === 'supplies'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-cyan-400" />
          <span>Tactical Supplies</span>
        </button>
      </div>

      {/* SECTION 1: THEME STORE */}
      {activeSection === 'themes' && (
        <ThemeStoreView
          character={character}
          onUpdateCharacter={() => {}}
          unlockedThemes={unlockedThemes}
          onUnlockTheme={onUnlockTheme || (() => {})}
          soundEnabled={soundEnabled}
          totalFragmentsCollected={totalFragmentsCollected}
        />
      )}

      {/* SECTION 2: PROFILE FRAMES */}
      {activeSection === 'frames' && (
        <ProfileFramesView
          character={character}
          onEquipFrame={onEquipFrame || (() => {})}
          onUnlockFrameWithCoins={onUnlockFrameWithCoins || (() => {})}
          unlockedFrames={unlockedFrames}
          soundEnabled={soundEnabled}
          totalFragmentsCollected={totalFragmentsCollected}
          streakDays={streakDays}
        />
      )}

      {/* SECTION 3: MYSTERY CRATES */}
      {activeSection === 'crates' && (
        <MysteryCratesView
          character={character}
          inventory={inventory}
          onOpenCrate={onOpenChest}
          soundEnabled={soundEnabled}
          streakDays={streakDays}
          hasDefeatedBoss={hasDefeatedBoss}
        />
      )}

      {/* SECTION 4: SYSTEM FRAGMENTS (100 FRAGMENTS) */}
      {activeSection === 'fragments' && (
        <SystemFragmentsView
          fragments={systemFragments}
          character={character}
          soundEnabled={soundEnabled}
          onActivateOriginProtocol={onActivateOriginProtocol}
        />
      )}

      {/* SECTION 5: LEGACY RELICS (5 MYTHICAL ARTIFACTS) */}
      {activeSection === 'relics' && (
        <div className="space-y-6">
          <div className="bg-[#111B2D] border border-amber-500/20 rounded-[14px] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase font-bold mb-1">
                <Gem className="w-4 h-4" />
                <span>SACRED LEGACY RELICS • LIVING TREE ARTIFACTS</span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                CONCEALED BRANCH ARTIFACTS ({legacyRelics.filter(r => r.unlocked).length} / 5 DISCOVERED)
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Rare permanent collectibles earned through monumental achievements. Each relic anchors to a specific branch of your Legacy Tree.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Tree Synchrony</span>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {legacyRelics.filter(r => r.unlocked).length === 5 ? 'MAX RESONANCE' : `${Math.round((legacyRelics.filter(r => r.unlocked).length / 5) * 100)}% UNLOCKED`}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legacyRelics.map(relic => {
              return (
                <div
                  key={relic.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    relic.unlocked
                      ? 'bg-[#111B2D]/90 border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                      : 'bg-[#0A0F1A]/50 border-zinc-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg"
                        style={{
                          borderColor: relic.unlocked ? `${relic.color}60` : '#27272a',
                          backgroundColor: relic.unlocked ? `${relic.color}15` : '#18181b',
                          color: relic.unlocked ? relic.color : '#71717a'
                        }}
                      >
                        <Gem className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 tracking-tight">
                          {relic.name}
                        </h4>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Branch: {relic.branchTarget}
                        </div>
                      </div>
                    </div>

                    {relic.unlocked ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COLLECTED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        CONCEALED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {relic.description}
                  </p>

                  <div className="p-3 bg-[#0A0F1A] rounded-xl border border-cyan-500/10 text-xs italic text-zinc-400 font-serif leading-relaxed">
                    "{relic.unlocked ? relic.lore : 'Earned by reaching Tier IV in its corresponding pillar of the Legacy Tree.'}"
                  </div>

                  {relic.unlocked && relic.unlockedAt && (
                    <div className="text-[10px] font-mono text-cyan-400/80 border-t border-cyan-500/10 pt-2 flex justify-between">
                      <span>Awakened Date</span>
                      <span className="text-zinc-300">{relic.unlockedAt}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 6: TACTICAL SUPPLIES & TITLES (ORIGINAL VIEW) */}
      {activeSection === 'supplies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consumables List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              FIELD REMEDIALS & ASSETS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory
                .filter(i => i.type === 'potion' || i.type === 'energy')
                .map((item) => {
                  const ItemIcon = getIcon(item.icon);

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
                        <span className="text-[10px] font-mono text-zinc-400">
                          QUANTITY: <span className="text-zinc-200 font-bold">{item.quantity}</span>
                        </span>

                        {item.quantity > 0 && (
                          <button
                            onClick={() => onConsumeItem(item.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all bg-[#101726] hover:bg-[#101726]/80 text-cyan-400 border border-cyan-500/10"
                          >
                            Apply Remedial
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
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              ACQUIRED TITLES & HONORS
            </h3>
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
      )}
    </div>
  );
}
