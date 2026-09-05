import React, { useState, useMemo, useEffect } from 'react';
import {
  AppState,
  LegacyTreeData,
  LegacyMilestone,
  LegacyRelic,
  GrowthCategory,
  SeasonMode
} from '../../types';
import {
  BRANCH_CATEGORIES,
  getDailyQuote,
  getCurrentSeason,
  evaluateLegacyTree,
  INITIAL_LEGACY_TREE
} from '../../data/legacyTreeData';
import { LegacyTreeCanvas } from './LegacyTreeCanvas';
import { MemoryCapsulesList } from './MemoryCapsulesList';
import { LegacyRelicsModal } from './LegacyRelicsModal';
import { EternalTreeModal } from './EternalTreeModal';
import { playSound } from '../../utils/sound';
import {
  Sparkles,
  TreePine,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Flame,
  Sun,
  Coins,
  Palette,
  HeartPulse,
  Shield,
  CheckCircle2,
  Lock,
  Compass,
  Play,
  Gem,
  Info,
  ChevronRight,
  RefreshCw,
  Eye,
  Settings2
} from 'lucide-react';

interface LegacyTreeViewProps {
  state: AppState;
  onUpdateState: (newState: AppState | ((prev: AppState) => AppState)) => void;
  soundEnabled: boolean;
  onNavigateTab?: (tab: string) => void;
}

export const LegacyTreeView: React.FC<LegacyTreeViewProps> = ({
  state,
  onUpdateState,
  soundEnabled,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'branches' | 'relics' | 'capsules' | 'roots'>('branches');
  const [selectedCategory, setSelectedCategory] = useState<GrowthCategory | 'all'>('all');
  const [selectedRelic, setSelectedRelic] = useState<LegacyRelic | null>(null);
  const [isRelicsModalOpen, setIsRelicsModalOpen] = useState<boolean>(false);
  const [isEternalModalOpen, setIsEternalModalOpen] = useState<boolean>(false);
  const [animatingCategory, setAnimatingCategory] = useState<string | null>(null);
  const [growthAlert, setGrowthAlert] = useState<{ title: string; branch: string } | null>(null);

  // Evaluate & synchronize tree data on mount or state changes
  useEffect(() => {
    const evaluation = evaluateLegacyTree(state);
    if (
      evaluation.newlyGrownBranches.length > 0 ||
      evaluation.newlyUnlockedRelics.length > 0 ||
      evaluation.stageChanged ||
      !state.legacyTree
    ) {
      if (evaluation.newlyGrownBranches.length > 0) {
        playSound('systemUnlock', soundEnabled);
        setGrowthAlert({
          title: `${evaluation.newlyGrownBranches[0]} Expanded`,
          branch: evaluation.newlyGrownBranches[0]
        });
      }
      onUpdateState(prev => ({
        ...prev,
        legacyTree: evaluation.updatedTree
      }));
    }
  }, []);

  const treeData: LegacyTreeData = state.legacyTree || INITIAL_LEGACY_TREE;

  // Real active calendar days from history
  const activeCalendarDays = useMemo(() => {
    const daysSet = new Set<string>();
    if (state.xpHistory) {
      Object.keys(state.xpHistory).forEach(d => daysSet.add(d));
    }
    if (state.lifeHistoryArchive) {
      Object.keys(state.lifeHistoryArchive).forEach(d => daysSet.add(d));
    }
    state.fitnessLogs?.forEach(f => daysSet.add(f.date));
    state.faithLogs?.forEach(f => daysSet.add(f.date));
    state.learningLogs?.forEach(l => daysSet.add(l.date));
    state.businessLogs?.forEach(b => daysSet.add(b.date));

    // Ensure at least today's date if empty
    if (daysSet.size === 0) {
      daysSet.add(new Date().toISOString().split('T')[0]);
    }
    return Array.from(daysSet).sort();
  }, [state.xpHistory, state.lifeHistoryArchive, state.fitnessLogs, state.faithLogs, state.learningLogs, state.businessLogs]);

  // Statistics calculation
  const totalMilestones = treeData.milestones.length;
  const unlockedMilestones = treeData.milestones.filter(m => m.unlocked).length;
  const unlockedRelics = treeData.relics.filter(r => r.unlocked).length;
  const completionPercentage = Math.round((unlockedMilestones / totalMilestones) * 100);

  // Days since character awakened
  const daysSinceAwakening = useMemo(() => {
    const createdDate = state.character?.createdAt || activeCalendarDays[0] || '2026-01-01';
    const start = new Date(createdDate).getTime();
    const now = Date.now();
    const diff = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [state.character?.createdAt, activeCalendarDays]);

  // Daily Emotional Touch Quote
  const dailyQuote = useMemo(() => getDailyQuote(), []);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    if (selectedCategory === 'all') return treeData.milestones;
    return treeData.milestones.filter(m => m.category === selectedCategory);
  }, [treeData.milestones, selectedCategory]);

  // Trigger branch surge animation
  const handleTriggerGrowth = () => {
    playSound('systemUnlock', soundEnabled);
    setAnimatingCategory('education');
    setTimeout(() => setAnimatingCategory(null), 3000);
  };

  // Claim Eternal Tree awakening
  const handleClaimEternal = () => {
    playSound('achievement', soundEnabled);
    onUpdateState(prev => ({
      ...prev,
      character: prev.character
        ? {
            ...prev.character,
            activeTitle: 'Eternal Sovereign',
            titles: prev.character.titles?.includes('Eternal Sovereign')
              ? prev.character.titles
              : [...(prev.character.titles || []), 'Eternal Sovereign'],
            equippedFrame: 'frame_eternal',
            unlockedFrames: prev.character.unlockedFrames?.includes('frame_eternal')
              ? prev.character.unlockedFrames
              : [...(prev.character.unlockedFrames || []), 'frame_eternal']
          }
        : null,
      legacyTree: prev.legacyTree
        ? {
            ...prev.legacyTree,
            stage: 'eternal_tree',
            isEternalAwakened: true
          }
        : undefined
    }));
    setIsEternalModalOpen(false);
  };

  // Seasonal cycle toggle
  const handleSeasonToggle = (mode: SeasonMode) => {
    playSound('click', soundEnabled);
    onUpdateState(prev => ({
      ...prev,
      legacyTree: prev.legacyTree
        ? {
            ...prev.legacyTree,
            seasonMode: mode,
            seasonalEnabled: true
          }
        : undefined
    }));
  };

  // Add operator note to a memory capsule
  const handleSaveCapsuleNote = (capsuleId: string, note: string) => {
    playSound('click', soundEnabled);
    onUpdateState(prev => {
      if (!prev.legacyTree) return prev;
      const updated = prev.legacyTree.memoryCapsules.map(c =>
        c.id === capsuleId ? { ...c, userNote: note } : c
      );
      return {
        ...prev,
        legacyTree: {
          ...prev.legacyTree,
          memoryCapsules: updated
        }
      };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Daily Emotional Touch Quote Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101726]/90 via-[#0F1D33]/70 to-[#101726]/90 border border-cyan-500/20 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <TreePine className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Daily System Contemplation
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-zinc-200">
                "{dailyQuote}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEternalModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                treeData.isEternalAwakened
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-[#131E33] border-cyan-500/20 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>THE ETERNAL TREE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Philosophy Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight font-serif">
              THE LEGACY TREE
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 uppercase font-semibold">
              Stage: {treeData.stage.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            <span className="text-cyan-400">The Life Calendar answers:</span> "How much time has passed?"{' '}
            <span className="text-amber-400">The Legacy Tree answers:</span> "What did I build with that time?"
          </p>
        </div>

        {/* Season Selector Pill */}
        <div className="flex items-center gap-1.5 bg-[#101726]/80 p-1 rounded-xl border border-cyan-500/15 text-[10px] font-mono">
          <span className="text-zinc-500 px-2">SEASON:</span>
          {(['auto', 'spring', 'summer', 'autumn', 'winter'] as SeasonMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleSeasonToggle(mode)}
              className={`px-2 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                treeData.seasonMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Living Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Tree Age</div>
          <div className="text-sm sm:text-base font-bold text-zinc-200 font-mono">
            {daysSinceAwakening} <span className="text-[10px] font-normal text-zinc-400">Days</span>
          </div>
        </div>

        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Awakened Days</div>
          <div className="text-sm sm:text-base font-bold text-cyan-400 font-mono">
            {activeCalendarDays.length} <span className="text-[10px] font-normal text-zinc-400">Checked</span>
          </div>
        </div>

        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Branches Grown</div>
          <div className="text-sm sm:text-base font-bold text-amber-400 font-mono">
            {unlockedMilestones} / {totalMilestones}
          </div>
        </div>

        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Leaves Earned</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            {treeData.totalLeaves.toLocaleString()}
          </div>
        </div>

        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Root Network</div>
          <div className="text-sm sm:text-base font-bold text-sky-400 font-mono">
            {activeCalendarDays.length} <span className="text-[10px] font-normal text-zinc-400">Nodes</span>
          </div>
        </div>

        <div
          onClick={() => setIsRelicsModalOpen(true)}
          className="p-3 bg-[#101726]/60 hover:bg-[#101726] rounded-xl border border-cyan-500/10 hover:border-amber-500/30 transition-colors cursor-pointer space-y-1 shadow-sm"
        >
          <div className="text-[9px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>Hidden Relics</span>
            <Eye className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-purple-400 font-mono">
            {unlockedRelics} / {treeData.relics.length}
          </div>
        </div>

        <div className="p-3 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-1 shadow-sm col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">Legacy Mastery</div>
          <div className="text-sm sm:text-base font-bold text-emerald-300 font-mono">
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* 4. Living Tree Canvas Interactive Stage */}
      <LegacyTreeCanvas
        treeData={treeData}
        activeCalendarDays={activeCalendarDays}
        selectedRelic={selectedRelic}
        onSelectRelic={(relic) => {
          setSelectedRelic(relic);
          setIsRelicsModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        onTriggerGrowthAnimation={handleTriggerGrowth}
        animatingBranchCategory={animatingCategory}
      />

      {/* 5. Feature Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('branches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
              activeSubTab === 'branches'
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TreePine className="w-4 h-4 text-cyan-400" />
            <span>Milestones & Branches</span>
          </button>

          <button
            onClick={() => setActiveSubTab('relics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
              activeSubTab === 'relics'
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gem className="w-4 h-4 text-amber-400" />
            <span>Hidden Relics ({unlockedRelics}/5)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('capsules')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
              activeSubTab === 'capsules'
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Memory Capsules ({treeData.memoryCapsules.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roots')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
              activeSubTab === 'roots'
                ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Subterranean Consistency</span>
          </button>
        </div>
      </div>

      {/* 6. Sub-Tab Content Panes */}
      {activeSubTab === 'branches' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 bg-[#101726]/60 border border-transparent'
              }`}
            >
              ALL PILLARS ({treeData.milestones.length})
            </button>
            {(Object.keys(BRANCH_CATEGORIES) as GrowthCategory[]).map((cat) => {
              const meta = BRANCH_CATEGORIES[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'border font-bold'
                      : 'text-zinc-500 hover:text-zinc-300 bg-[#101726]/60 border-transparent'
                  }`}
                  style={{
                    borderColor: isSelected ? meta.color : undefined,
                    color: isSelected ? meta.color : undefined,
                    backgroundColor: isSelected ? `${meta.color}15` : undefined
                  }}
                >
                  <span>{meta.name}</span>
                </button>
              );
            })}
          </div>

          {/* Milestones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMilestones.map(milestone => {
              const meta = BRANCH_CATEGORIES[milestone.category];
              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    milestone.unlocked
                      ? 'bg-[#101726]/90 border-cyan-500/25 shadow-[0_0_15px_rgba(0,242,254,0.03)]'
                      : 'bg-[#0A0F1A]/50 border-zinc-800/60 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold"
                          style={{
                            borderColor: `${meta.color}40`,
                            color: meta.color,
                            backgroundColor: `${meta.color}10`
                          }}
                        >
                          {meta.branchName} • TIER {milestone.branchLevel}
                        </span>
                        {milestone.relicRewardId && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                            <Gem className="w-2.5 h-2.5" />
                            RELIC REWARD
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight mt-1.5">
                        {milestone.title}
                      </h4>
                    </div>

                    {milestone.unlocked ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        GROWN
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-cyan-500/5 pt-2">
                    <span className="text-zinc-500">Requirement: {milestone.requirementDesc}</span>
                    {milestone.unlockedAt && (
                      <span className="text-cyan-400/90">{milestone.unlockedAt}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden Relics Showcase */}
      {activeSubTab === 'relics' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#101726]/60 rounded-xl border border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 tracking-tight">
                Sacred Collectibles of the Legacy Tree
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Five mythical artifacts that awaken upon branches during monumental achievements.
              </p>
            </div>
            <button
              onClick={() => setIsRelicsModalOpen(true)}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-semibold tracking-wide cursor-pointer transition-colors"
            >
              OPEN RELIC TELEMETRY
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {treeData.relics.map(relic => {
              return (
                <div
                  key={relic.id}
                  onClick={() => {
                    setSelectedRelic(relic);
                    setIsRelicsModalOpen(true);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    relic.unlocked
                      ? 'bg-[#101726]/90 border-cyan-500/30 hover:border-amber-400/50 shadow-md'
                      : 'bg-[#0A0F1A]/50 border-zinc-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-zinc-200">{relic.name}</div>
                    {relic.unlocked ? (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        DISCOVERED
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded">
                        LOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs italic text-zinc-400 font-serif leading-relaxed">
                    "{relic.unlocked ? relic.lore : 'Hidden deep in the canopy awaiting an operator of supreme dedication.'}"
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between border-t border-cyan-500/10 pt-2">
                    <span>Target: {relic.branchTarget}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Memory Capsules Sub-Tab */}
      {activeSubTab === 'capsules' && (
        <MemoryCapsulesList
          capsules={treeData.memoryCapsules}
          onSaveNote={handleSaveCapsuleNote}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Subterranean Roots & Life Calendar Metaphor Sub-Tab */}
      {activeSubTab === 'roots' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E1624] via-[#101C2E] to-[#0A101C] border border-sky-500/25 space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-zinc-100 tracking-tight">
                The Subterranean Mirror: Consistency as Bedrock
              </h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              While your visible branches celebrate prominent milestone achievements, your underground roots are built from pure consistency. Every single day you show up, complete quests, or check into your Life Calendar quietly extends the subterranean root network deeper into the earth.
            </p>
            <div className="p-3 bg-[#080C14] rounded-xl border border-sky-500/20 text-xs font-mono text-sky-300/90 flex items-center justify-between">
              <span>"Branches are achievements. Roots are consistency."</span>
              <span className="text-zinc-500 text-[10px]">{activeCalendarDays.length} Active Days Anchored</span>
            </div>
          </div>

          <div className="p-4 bg-[#101726]/60 rounded-xl border border-cyan-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Anchor Node History ({activeCalendarDays.length} Dates Logged)
              </h4>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('life-calendar')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Life Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
              {activeCalendarDays.slice(-24).reverse().map((date, idx) => (
                <div
                  key={date}
                  className="p-2 rounded-lg bg-[#0A0F1A] border border-sky-500/15 text-[11px] font-mono text-zinc-300"
                >
                  <div className="text-sky-400 text-[9px]">Root #{activeCalendarDays.length - idx}</div>
                  <div className="font-semibold mt-0.5">{date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relics Modal */}
      {isRelicsModalOpen && (
        <LegacyRelicsModal
          relics={treeData.relics}
          selectedRelic={selectedRelic}
          onClose={() => setIsRelicsModalOpen(false)}
          onSelectRelic={(relic) => setSelectedRelic(relic)}
        />
      )}

      {/* Eternal Tree Modal */}
      {isEternalModalOpen && (
        <EternalTreeModal
          treeData={treeData}
          onClose={() => setIsEternalModalOpen(false)}
          onClaimEternal={handleClaimEternal}
          isEternalClaimed={Boolean(treeData.isEternalAwakened)}
        />
      )}
    </div>
  );
};
