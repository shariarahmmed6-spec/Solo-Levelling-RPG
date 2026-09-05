import React, { useState } from 'react';
import { Character, ProfileFrame } from '../../types';
import { ALL_PROFILE_FRAMES } from '../../data/profileFramesData';
import { ProfileAvatar } from '../ProfileAvatar';
import { playSound } from '../../utils/sound';
import { Shield, Check, Lock, Coins, Sparkles, User, Award, Flame } from 'lucide-react';

interface ProfileFramesViewProps {
  character: Character;
  onEquipFrame: (frameId: string) => void;
  onUnlockFrameWithCoins: (frameId: string, cost: number) => void;
  unlockedFrames: string[];
  soundEnabled: boolean;
  totalFragmentsCollected: number;
  streakDays: number;
}

export const ProfileFramesView: React.FC<ProfileFramesViewProps> = ({
  character,
  onEquipFrame,
  onUnlockFrameWithCoins,
  unlockedFrames,
  soundEnabled,
  totalFragmentsCollected,
  streakDays
}) => {
  const equippedFrameId = character.equippedFrame || 'frame_default';
  const [previewFrameId, setPreviewFrameId] = useState<string>(equippedFrameId);
  const [confirmModal, setConfirmModal] = useState<ProfileFrame | null>(null);

  // Determine if a frame is unlocked
  const isFrameUnlocked = (frame: ProfileFrame): boolean => {
    if (frame.id === 'frame_default') return true;
    if (unlockedFrames.includes(frame.id)) return true;
    if (frame.unlockType === 'level' && frame.requiredLevel && character.level >= frame.requiredLevel) return true;
    if (frame.unlockType === 'streak' && frame.requiredStreak && streakDays >= frame.requiredStreak) return true;
    if (frame.unlockType === 'fragments' && totalFragmentsCollected >= 100) return true;
    return false;
  };

  const handleEquip = (frameId: string) => {
    playSound('buttonClick', soundEnabled);
    onEquipFrame(frameId);
    setPreviewFrameId(frameId);
  };

  const handleBuy = (frame: ProfileFrame) => {
    if (!frame.coinCost || character.coins < frame.coinCost) return;
    playSound('achievement', soundEnabled);
    onUnlockFrameWithCoins(frame.id, frame.coinCost);
    onEquipFrame(frame.id);
    setPreviewFrameId(frame.id);
    setConfirmModal(null);
  };

  const ownedFrames = ALL_PROFILE_FRAMES.filter(f => isFrameUnlocked(f));
  const lockedFrames = ALL_PROFILE_FRAMES.filter(f => !isFrameUnlocked(f));

  return (
    <div className="space-y-6">
      {/* Header with Live Avatar Frame Preview */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/25 shadow-[0_0_20px_rgba(0,242,254,0.06)]">
        <div className="flex items-center gap-5">
          {/* Live Preview Avatar */}
          <div className="relative">
            <ProfileAvatar
              character={character}
              frameId={previewFrameId}
              size="xl"
              showRankBadge={true}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
              <Shield className="w-4 h-4" />
              <span>Profile Frame Arsenal</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {ALL_PROFILE_FRAMES.find(f => f.id === previewFrameId)?.name || 'Custom Frame'}
            </h2>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              {ALL_PROFILE_FRAMES.find(f => f.id === previewFrameId)?.description}
            </p>
            <div className="pt-1 text-[11px] font-mono text-cyan-400/80">
              {previewFrameId === equippedFrameId ? '🟢 CURRENTLY EQUIPPED' : '👀 PREVIEWING ON AVATAR'}
            </div>
          </div>
        </div>

        {/* Stats Summary & Coin Balance */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-cyan-500/10">
          <div className="text-left lg:text-right">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Frames Unlocked</div>
            <div className="text-lg font-bold text-white font-mono">
              {ownedFrames.length} <span className="text-zinc-500 text-xs">/ {ALL_PROFILE_FRAMES.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090D18] border border-amber-500/30">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm font-bold text-amber-400 font-mono">
              {character.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Owned Frames Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Unlocked Frames ({ownedFrames.length})</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Cosmetics provide pure identity & pride</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedFrames.map((frame) => {
            const isEquipped = equippedFrameId === frame.id;
            const isPreviewing = previewFrameId === frame.id;

            return (
              <div
                key={frame.id}
                onClick={() => setPreviewFrameId(frame.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isEquipped
                    ? 'border-cyan-400 bg-[#111B2D] shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : isPreviewing
                    ? 'border-cyan-500/50 bg-[#16233B]'
                    : 'border-cyan-500/15 bg-[#101726]/90 hover:border-cyan-500/35 hover:bg-[#111B2D]'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-3">
                  <ProfileAvatar
                    character={character}
                    frameId={frame.id}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white truncate">
                        {frame.name}
                      </h4>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ml-2 shrink-0 ${
                          frame.rarity === 'mythic'
                            ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                            : frame.rarity === 'legendary'
                            ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                            : frame.rarity === 'epic'
                            ? 'border-red-500/60 bg-red-500/10 text-red-300'
                            : frame.rarity === 'rare'
                            ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                            : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {frame.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {frame.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">
                    {frame.unlockRequirement}
                  </span>

                  {isEquipped ? (
                    <span className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Equipped
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEquip(frame.id);
                      }}
                      className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase bg-cyan-500 hover:bg-cyan-400 text-black transition-colors cursor-pointer"
                    >
                      Equip
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked Frames Section */}
      {lockedFrames.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-cyan-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span>Locked Frames ({lockedFrames.length})</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Unlock through rank, milestones, or coins</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedFrames.map((frame) => {
              const canAfford = frame.coinCost ? character.coins >= frame.coinCost : false;
              const isPreviewing = previewFrameId === frame.id;

              return (
                <div
                  key={frame.id}
                  onClick={() => setPreviewFrameId(frame.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between opacity-85 hover:opacity-100 ${
                    isPreviewing
                      ? 'border-zinc-500 bg-[#16233B]'
                      : 'border-zinc-800 bg-[#0A0F1A]/80 hover:border-zinc-700 hover:bg-[#101726]'
                  }`}
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative">
                      <ProfileAvatar
                        character={character}
                        frameId={frame.id}
                        size="md"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-zinc-300 truncate">
                          {frame.name}
                        </h4>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ml-2 shrink-0 ${
                            frame.rarity === 'mythic'
                              ? 'border-purple-500/40 text-purple-400'
                              : frame.rarity === 'legendary'
                              ? 'border-amber-500/40 text-amber-400'
                              : frame.rarity === 'epic'
                              ? 'border-red-500/40 text-red-400'
                              : frame.rarity === 'rare'
                              ? 'border-blue-500/40 text-blue-400'
                              : 'border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {frame.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {frame.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/80 flex flex-col gap-2">
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{frame.unlockRequirement}</span>
                    </div>

                    {frame.coinCost ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canAfford) setConfirmModal(frame);
                        }}
                        disabled={!canAfford}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                            : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-700'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Acquire for {frame.coinCost.toLocaleString()} Coins</span>
                      </button>
                    ) : frame.unlockType === 'fragments' ? (
                      <div className="text-center py-1.5 px-2 rounded-lg text-[10px] font-mono bg-purple-950/20 text-purple-300 border border-purple-500/20">
                        {totalFragmentsCollected}/100 Fragments Found
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Frame Purchase */}
      {confirmModal && confirmModal.coinCost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400 font-mono text-sm tracking-wider uppercase">
              <Shield className="w-5 h-5" />
              <span>Acquire Profile Frame</span>
            </div>

            <div className="flex items-center gap-4">
              <ProfileAvatar
                character={character}
                frameId={confirmModal.id}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {confirmModal.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D18] border border-cyan-500/15 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Current Coins:</span>
                <span className="text-white font-bold">{character.coins.toLocaleString()} Coins</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Frame Cost:</span>
                <span className="text-amber-400 font-bold">-{confirmModal.coinCost.toLocaleString()} Coins</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Remaining Coins:</span>
                <span className="text-cyan-400 font-bold">{(character.coins - confirmModal.coinCost).toLocaleString()} Coins</span>
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
                Confirm & Equip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
