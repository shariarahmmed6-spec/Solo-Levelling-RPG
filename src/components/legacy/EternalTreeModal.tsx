import React from 'react';
import { LegacyTreeData } from '../../types';
import {
  Sparkles,
  Shield,
  Trophy,
  CheckCircle2,
  Lock,
  X,
  Zap,
  Award
} from 'lucide-react';

interface EternalTreeModalProps {
  treeData: LegacyTreeData;
  onClose: () => void;
  onClaimEternal: () => void;
  isEternalClaimed: boolean;
}

export const EternalTreeModal: React.FC<EternalTreeModalProps> = ({
  treeData,
  onClose,
  onClaimEternal,
  isEternalClaimed
}) => {
  const unlockedMilestones = treeData.milestones.filter(m => m.unlocked).length;
  const unlockedRelics = treeData.relics.filter(r => r.unlocked).length;

  const milestonesMet = unlockedMilestones >= 24;
  const relicsMet = unlockedRelics === 5;
  const canAwaken = milestonesMet && relicsMet;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#0F172A] via-[#101726] to-[#090D18] border-2 border-emerald-500/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative overflow-hidden">
        {/* Background glow flares */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/60 border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.5)] mb-1">
            <Sparkles className="w-8 h-8 text-emerald-300 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight font-serif">
            THE ETERNAL TREE
          </h2>
          <p className="text-xs text-emerald-400 font-mono tracking-wider uppercase">
            The Supreme Pinnacle of ARISE Progression
          </p>
        </div>

        <p className="text-xs text-zinc-300 text-center max-w-md mx-auto leading-relaxed">
          The rarest achievement in ARISE. Reserved solely for operators who have mastered all seven pillars of life and uncovered the five sacred relics.
        </p>

        {/* Requirements Checklist */}
        <div className="p-4 bg-[#0A0F1A]/80 rounded-2xl border border-emerald-500/20 space-y-3">
          <h4 className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
            Awakening Requirements:
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#101726] border border-cyan-500/10">
              <div className="flex items-center gap-2">
                {milestonesMet ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-zinc-500" />
                )}
                <span className={milestonesMet ? 'text-zinc-200 font-medium' : 'text-zinc-500'}>
                  Master Core Branches (24+ Milestones)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {unlockedMilestones} / 28
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#101726] border border-cyan-500/10">
              <div className="flex items-center gap-2">
                {relicsMet ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-zinc-500" />
                )}
                <span className={relicsMet ? 'text-zinc-200 font-medium' : 'text-zinc-500'}>
                  Uncover All 5 Hidden Legacy Relics
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {unlockedRelics} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Permanent Rewards Preview */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Eternal Awakening Rewards:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-zinc-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Mythic Eternal Frame</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-zinc-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              <span>"Eternal Sovereign" Title</span>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-zinc-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Dashboard Cosmic Aura</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-zinc-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Transcendent Living Tree</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isEternalClaimed ? (
            <div className="w-full py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
              ✦ ETERNAL TREE ALREADY AWAKENED ✦
            </div>
          ) : canAwaken ? (
            <button
              onClick={onClaimEternal}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold rounded-xl text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(52,211,153,0.5)] cursor-pointer"
            >
              AWAKEN THE ETERNAL TREE
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-zinc-800/60 border border-zinc-700/60 text-zinc-500 rounded-xl text-xs font-mono tracking-widest uppercase cursor-not-allowed"
            >
              LOCKED • COMPLETE REQUIREMENTS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
