import React from 'react';
import { LegacyRelic } from '../../types';
import {
  Gem,
  Coins,
  Sparkles,
  Flower2,
  Zap,
  X,
  Lock,
  CheckCircle2,
  Shield,
  Layers
} from 'lucide-react';

interface LegacyRelicsModalProps {
  relics: LegacyRelic[];
  selectedRelic: LegacyRelic | null;
  onClose: () => void;
  onSelectRelic: (relic: LegacyRelic) => void;
}

export const LegacyRelicsModal: React.FC<LegacyRelicsModalProps> = ({
  relics,
  selectedRelic,
  onClose,
  onSelectRelic
}) => {
  const getRelicIcon = (id: string) => {
    switch (id) {
      case 'crystal_fruit':
        return Gem;
      case 'golden_leaf':
        return Coins;
      case 'ancient_rune':
        return Sparkles;
      case 'eternal_bloom':
        return Flower2;
      case 'shadow_seed':
        return Zap;
      default:
        return Shield;
    }
  };

  const unlockedCount = relics.filter(r => r.unlocked).length;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0D1424] border border-cyan-500/25 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Hidden Legacy Relics
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Ancient artifacts concealed within the deepest branches of your tree. Discovered: {unlockedCount} / {relics.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Relics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relics.map(relic => {
            const Icon = getRelicIcon(relic.id);
            const isSelected = selectedRelic?.id === relic.id;

            return (
              <div
                key={relic.id}
                onClick={() => onSelectRelic(relic)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  relic.unlocked
                    ? isSelected
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                      : 'bg-[#101726]/80 border-cyan-500/20 hover:border-cyan-500/40'
                    : 'bg-[#0A0F1A]/50 border-zinc-800/60 opacity-65'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md"
                      style={{
                        borderColor: relic.unlocked ? `${relic.color}60` : '#27272a',
                        backgroundColor: relic.unlocked ? `${relic.color}15` : '#18181b',
                        color: relic.unlocked ? relic.color : '#71717a'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 tracking-tight">
                        {relic.name}
                      </h4>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {relic.branchTarget}
                      </div>
                    </div>
                  </div>

                  {relic.unlocked ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>FOUND</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>CONCEALED</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">
                  "{relic.unlocked ? relic.lore : 'Earned through extraordinary dedication in its corresponding branch.'}"
                </p>

                {relic.unlocked && relic.unlockedAt && (
                  <div className="text-[9px] font-mono text-cyan-400/80 border-t border-cyan-500/10 pt-2 flex justify-between">
                    <span>Discovered On</span>
                    <span className="text-zinc-300">{relic.unlockedAt}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Relic Focus Panel */}
        {selectedRelic && (
          <div className="p-4 bg-[#0A0F1A] border border-cyan-500/25 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span>RELIC TELEMETRY: {selectedRelic.name.toUpperCase()}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedRelic.description}
            </p>
            <div className="text-[11px] text-zinc-500 italic">
              "This artifact permanently manifests upon your Legacy Tree and is archived within your Vault & Armory."
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-cyan-500/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono tracking-wider transition-colors cursor-pointer font-semibold"
          >
            RETURN TO TREE
          </button>
        </div>
      </div>
    </div>
  );
};
