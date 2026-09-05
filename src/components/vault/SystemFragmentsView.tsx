import React, { useState, useMemo } from 'react';
import { SystemFragment, Character } from '../../types';
import { playSound } from '../../utils/sound';
import { 
  Sparkles, Lock, CheckCircle2, Search, Filter, Key, 
  Flame, Dumbbell, BookOpen, Compass, Crown, Shield, 
  Calendar, Layers, Zap, Info, X, ExternalLink
} from 'lucide-react';

interface SystemFragmentsViewProps {
  fragments: SystemFragment[];
  character: Character;
  soundEnabled: boolean;
  onActivateOriginProtocol?: () => void;
}

export const SystemFragmentsView: React.FC<SystemFragmentsViewProps> = ({
  fragments,
  character,
  soundEnabled,
  onActivateOriginProtocol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedFragment, setSelectedFragment] = useState<SystemFragment | null>(null);

  // Unlocked metrics
  const unlockedCount = useMemo(() => {
    return fragments.filter(f => f.discoveryDate !== null).length;
  }, [fragments]);

  const progressPercent = Math.round((unlockedCount / 100) * 100);

  // Category counts
  const categories = ['All', 'Discipline', 'Strength', 'Knowledge', 'Spirit', 'Mastery', 'Legacy'];

  const filteredFragments = useMemo(() => {
    return fragments.filter(f => {
      const isUnlocked = f.discoveryDate !== null;
      if (filterStatus === 'unlocked' && !isUnlocked) return false;
      if (filterStatus === 'locked' && isUnlocked) return false;

      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const numStr = `#${f.number.toString().padStart(3, '0')}`;
        const matchName = f.name.toLowerCase().includes(q);
        const matchDesc = f.description.toLowerCase().includes(q);
        const matchHint = f.hint.toLowerCase().includes(q);
        const matchNum = numStr.includes(q) || f.number.toString() === q;
        return matchName || matchDesc || matchHint || matchNum;
      }

      return true;
    });
  }, [fragments, filterStatus, selectedCategory, searchQuery]);

  const handleSelectFragment = (frag: SystemFragment) => {
    playSound('buttonClick', soundEnabled);
    setSelectedFragment(frag);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Discipline': return Flame;
      case 'Strength': return Dumbbell;
      case 'Knowledge': return BookOpen;
      case 'Spirit': return Compass;
      case 'Mastery': return Crown;
      case 'Legacy': return Sparkles;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-6">
      {/* Master Header with Origin Protocol Progress */}
      <div className="p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/30 shadow-[0_0_25px_rgba(0,242,254,0.08)] relative overflow-hidden">
        {/* Background circuit glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
              <Key className="w-4 h-4 animate-pulse" />
              <span>System Codex • 100 Hidden System Fragments</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
              <span>Origin Protocol Matrix</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                {unlockedCount} / 100 Discovered
              </span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Scattered across daily discipline, workouts, learning, prayer, and weekly boss battles. Unlocking all 100 fragments synthesizes the final <strong>Origin Protocol</strong> mythic theme, frame, and sovereign title.
            </p>
          </div>

          {/* Progress Bar & Status */}
          <div className="w-full lg:w-72 p-4 rounded-xl bg-[#090D18] border border-cyan-500/20 shrink-0 space-y-2.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Synthesis Progress</span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <span>{100 - unlockedCount} Encrypted</span>
              <span className="text-purple-400 font-semibold">Origin Synthesis: {progressPercent >= 100 ? 'READY' : 'SEALED'}</span>
            </div>
          </div>
        </div>

        {/* 100% Origin Protocol Unlocked Banner */}
        {unlockedCount >= 100 && (
          <div className="mt-5 p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 text-purple-300">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider">Origin Protocol Fully Synthesized!</div>
                <div className="text-xs text-purple-200">The 100th Fragment has broken the final seal. Origin Theme and Sovereign Frame are activated.</div>
              </div>
            </div>
            {onActivateOriginProtocol && (
              <button
                onClick={onActivateOriginProtocol}
                className="py-2 px-4 rounded-lg text-xs font-mono font-bold uppercase bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer"
              >
                Equip Origin
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-[#111B2D] border border-cyan-500/15">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fragments by title, #number, or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#090D18] border border-cyan-500/20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Toggle (All / Unlocked / Locked) */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#090D18] border border-cyan-500/20 self-start md:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterStatus === 'all'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All (100)
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterStatus === 'unlocked'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Found ({unlockedCount})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterStatus === 'locked'
                ? 'bg-zinc-700 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Locked ({100 - unlockedCount})
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const Icon = getCategoryIcon(cat);

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.15)] font-bold'
                  : 'border-zinc-800 bg-[#0E1524] text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of 100 System Fragments */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredFragments.map((frag) => {
          const isUnlocked = frag.discoveryDate !== null;
          const numStr = `#${frag.number.toString().padStart(3, '0')}`;
          const CatIcon = getCategoryIcon(frag.category);

          return (
            <div
              key={frag.id}
              onClick={() => handleSelectFragment(frag)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                isUnlocked
                  ? 'border-cyan-500/30 bg-[#111B2D] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'border-zinc-800/80 bg-[#090D18]/90 hover:border-zinc-700 hover:bg-[#0E1524]'
              }`}
            >
              {/* Top Header: Number & Category Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold ${isUnlocked ? 'text-cyan-400' : 'text-zinc-500'}`}>
                  {numStr}
                </span>

                <div className="flex items-center gap-1">
                  <CatIcon className={`w-3 h-3 ${isUnlocked ? 'text-cyan-400' : 'text-zinc-600'}`} />
                  {isUnlocked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Center Content: Icon & Title */}
              <div className="py-2 text-center flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 border transition-all ${
                    isUnlocked
                      ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-600'
                  }`}
                >
                  {isUnlocked ? (
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-600" />
                  )}
                </div>

                <div className="w-full">
                  <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-white' : 'text-zinc-500 font-mono'}`}>
                    {isUnlocked ? frag.name : `FRAGMENT ${numStr}`}
                  </h4>
                  <div className={`text-[10px] font-mono truncate mt-0.5 ${isUnlocked ? 'text-cyan-400/80' : 'text-zinc-600'}`}>
                    {isUnlocked ? frag.rarity : 'ENCRYPTED'}
                  </div>
                </div>
              </div>

              {/* Footer: Discovery or Encrypted Hint */}
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-center truncate">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold">
                    ✓ Found {frag.discoveryDate}
                  </span>
                ) : (
                  <span className="text-zinc-500 hover:text-zinc-400">
                    Tap to view hint
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredFragments.length === 0 && (
        <div className="text-center py-12 text-zinc-500 font-mono text-xs">
          No fragments matched your search or filter parameters.
        </div>
      )}

      {/* Fragment Deep Inspection Modal */}
      {selectedFragment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#111B2D] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,242,254,0.3)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Fragment Codex #{selectedFragment.number.toString().padStart(3, '0')}</span>
              </div>
              <button
                onClick={() => setSelectedFragment(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fragment Presentation */}
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${
                  selectedFragment.discoveryDate
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                }`}
              >
                {selectedFragment.discoveryDate ? (
                  <Key className="w-7 h-7 text-cyan-400" />
                ) : (
                  <Lock className="w-6 h-6 text-zinc-500" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">
                  {selectedFragment.discoveryDate ? selectedFragment.name : `[Encrypted Fragment #${selectedFragment.number.toString().padStart(3, '0')}]`}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-400">{selectedFragment.category}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-purple-300">{selectedFragment.rarity} Rarity</span>
                </div>
              </div>
            </div>

            {/* Lore or Encrypted Description */}
            <div className="p-4 rounded-xl bg-[#090D18] border border-cyan-500/15 space-y-2">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                {selectedFragment.discoveryDate ? 'Fragment Telemetry' : 'Cipher Decryption Hint'}
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {selectedFragment.discoveryDate
                  ? selectedFragment.description
                  : selectedFragment.hint}
              </p>
            </div>

            {/* Discovery Status Bar */}
            <div className="flex items-center justify-between text-xs font-mono p-3 rounded-lg bg-[#0E1524] border border-zinc-800">
              <span className="text-zinc-400">Status:</span>
              {selectedFragment.discoveryDate ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Discovered on {selectedFragment.discoveryDate}
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Encrypted in System Matrix
                </span>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedFragment(null)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              Close Codex
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
