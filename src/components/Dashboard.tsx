import React, { useState } from 'react';
import {
  Character,
  Quest,
  StreakState,
  Achievement,
  InventoryItem,
  Mission,
  LearningLog,
  BusinessLog,
  FaithLog,
  FitnessLog
} from '../types';
import { playSound } from '../utils/sound';
import MissionDashboardModal from './MissionDashboardModal';
import { ProfileAvatar } from './ProfileAvatar';
import {
  Trophy,
  Coins,
  Flame,
  Zap,
  Clock,
  Heart,
  ChevronRight,
  Sparkles,
  Award,
  ArrowRight,
  User,
  HeartPulse,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  Info,
  Camera
} from 'lucide-react';

interface DashboardProps {
  character: Character;
  quests: Quest[];
  streak: StreakState;
  achievements: Achievement[];
  inventory: InventoryItem[];
  missions: Mission[];
  onConsumeItem: (id: string) => void;
  onNavigate: (tab: string) => void;
  soundEnabled: boolean;
  onUpdateState: (newState: Partial<any>) => void;
  onLogLearning: (log: Omit<LearningLog, 'id' | 'date'>) => void;
  onLogBusiness: (log: Omit<BusinessLog, 'id' | 'date'>) => void;
  onLogFaith: (log: Omit<FaithLog, 'date'>) => void;
  onLogFitness: (log: Omit<FitnessLog, 'date'>) => void;
  learningLogs?: LearningLog[];
  onEditIdentity?: () => void;
}

// Professional Intelligent Guidance engine (replaces RPG terminology while retaining conditions)
function generateCoachAdvice(character: Character, quests: Quest[], missions: Mission[], learningLogs: LearningLog[] = []) {
  const completedToday = quests.filter(q => q.completed).length;
  const totalToday = quests.length;
  const pct = totalToday > 0 ? (completedToday / totalToday) * 100 : 100;

  const hsc = missions.find(m => m.id === 'hsc');
  const faith = missions.find(m => m.id === 'faith');
  const fitness = missions.find(m => m.id === 'fitness');

  let alertLevel: 'success' | 'warning' | 'info' = 'success';
  let title = "Performance Calibration: Routine Consistency Stable";
  let content = "Your daily execution is highly disciplined. Core progress is solid. Continue completing targeted milestones to optimize performance and unlocked attributes.";

  // Calculate today's study hours from learningLogs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = (learningLogs || []).filter(log => log.date === todayStr);
  const todayStudyHours = todayLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);

  if (pct < 40 && totalToday > 0) {
    alertLevel = 'warning';
    title = "Burnout Risk Alert: Performance Intervention Needed";
    content = "Daily checklist completion is low, indicating potential energy fatigue. The workspace advisor recommends prioritising core tasks, study sessions, and prayers while postponing secondary activities.";
  } else if (hsc && todayStudyHours < 4) {
    alertLevel = 'info';
    title = "Academic Target Review (HSC Milestones)";
    content = `Your logged study duration is at ${todayStudyHours.toFixed(1)} hours today. Maintain focus on the 7-month countdown milestones to sustain peak learning momentum.`;
  } else if (faith && faith.stats.prayersCompleted < 15) {
    alertLevel = 'warning';
    title = "Faith & Routine Alignment Warning";
    content = "Consistent prayer schedules are slipping. Halt non-essential projects temporarily and secure Farz prayers (Fajr and Maghrib) immediately.";
  } else if (fitness && fitness.level < 3) {
    alertLevel = 'info';
    title = "Physical Balance & Well-being Review";
    content = "Your strength and physical parameters are lagging behind study metrics. Schedule a high-intensity short workout to balance your energy reserves.";
  }

  return { alertLevel, title, content };
}

export default function Dashboard({
  character,
  quests,
  streak,
  achievements,
  inventory,
  missions = [],
  onConsumeItem,
  onNavigate,
  soundEnabled,
  onUpdateState,
  onLogLearning,
  onLogBusiness,
  onLogFaith,
  onLogFitness,
  learningLogs = [],
  onEditIdentity
}: DashboardProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const hpPercent = Math.min(100, (character.hp / character.maxHp) * 100);
  const energyPercent = Math.min(100, (character.energy / character.maxEnergy) * 100);
  const xpPercent = Math.min(100, (character.xp / character.xpNeeded) * 100);

  // Completed quests calculation
  const completedToday = quests.filter(q => q.completed).length;
  const totalToday = quests.length;
  const questsPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Recent Achievements
  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => {
      const d1 = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const d2 = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return d2 - d1;
    })
    .slice(0, 3);

  const hpPotion = inventory.find(i => i.id === 'potion_hp');
  const energyDrink = inventory.find(i => i.id === 'energy_drink');

  const coachAdvice = generateCoachAdvice(character, quests, missions, learningLogs);

  const handleUpdateMission = (updated: Mission) => {
    const nextMissions = missions.map(m => m.id === updated.id ? updated : m);
    onUpdateState({ missions: nextMissions });
    // Keep local state in sync if modal is open
    setSelectedMission(updated);
  };

  return (
    <div className="space-y-6">
      {/* Immersive Smart Workspace Advisor Banner */}
      <div className={`border rounded-[14px] p-4.5 shadow-sm relative overflow-hidden transition-all duration-300 ${
        coachAdvice.alertLevel === 'warning'
          ? 'bg-red-950/10 border-red-500/20 text-red-200'
          : coachAdvice.alertLevel === 'info'
          ? 'bg-cyan-950/10 border-cyan-500/20 text-cyan-200'
          : 'bg-[#111B2D]/40 border-cyan-500/10 text-zinc-200'
      }`}>
        <div className="relative z-10 flex gap-3.5 items-start">
          <div className="p-1.5 rounded bg-[#101726] border border-cyan-500/15 shrink-0">
            {coachAdvice.alertLevel === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            ) : coachAdvice.alertLevel === 'info' ? (
              <Info className="w-4 h-4 text-cyan-400" />
            ) : (
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
              SYSTEM ADVISOR • {coachAdvice.title}
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              "{coachAdvice.content}"
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Block Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & XP Indicators */}
        <div className="md:col-span-2 bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm space-y-6 relative overflow-hidden">
          {/* User profile row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                avatar={character.avatar}
                equippedFrame={character.equippedFrame}
                level={character.level}
                size="md"
                showLevelBadge={true}
                isClickable={!!onEditIdentity}
                onClick={onEditIdentity}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-zinc-100 tracking-tight">{character.name}</h1>
                  {character.age !== undefined && (
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#101726] border border-cyan-500/15 px-1.5 py-0.5 rounded">
                      Age {character.age}
                    </span>
                  )}
                  <span className="text-[9px] font-mono bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {character.rank}
                  </span>
                  {onEditIdentity && (
                    <button
                      type="button"
                      onClick={onEditIdentity}
                      title="Edit System Identity"
                      className="p-1 rounded-md bg-[#101726] hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500 font-sans">
                  Current Designation: <span className="text-cyan-400 font-medium">{character.activeTitle}</span>
                </p>
              </div>
            </div>

            <div className="bg-[#101726] border border-cyan-500/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-mono text-xs text-amber-400 shrink-0">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-zinc-200">{character.coins} COINS</span>
            </div>
          </div>

          {/* Vital Status bars */}
          <div className="space-y-4 pt-2 border-t border-cyan-500/5">
            {/* HP Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> WORKSPACE RESILIENCE
                </span>
                <span className="text-zinc-300 font-semibold">{character.hp} / {character.maxHp} HP</span>
              </div>
              <div className="w-full h-1.5 bg-[#101726] rounded-full overflow-hidden border border-cyan-500/5 p-px flex items-center">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-500"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" /> ATTENTION ENERGY
                </span>
                <span className="text-zinc-300 font-semibold">{character.energy} / {character.maxEnergy} EP</span>
              </div>
              <div className="w-full h-1.5 bg-[#101726] rounded-full overflow-hidden border border-cyan-500/5 p-px flex items-center">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>

            {/* Overall System XP Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span className="font-medium tracking-wider">COMBINED CAPABILITY PROGRESS</span>
                <span className="font-semibold">{character.xp} / {character.xpNeeded} XP</span>
              </div>
              <div className="w-full h-1.5 bg-[#101726] rounded-full overflow-hidden border border-cyan-500/5 p-px flex items-center">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Elixirs & Daily Rating */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">DAILY COMPLETION RATE</span>
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold font-mono text-zinc-100">{questsPct}%</h2>
              <span className="text-[11px] font-mono text-zinc-500">{completedToday} / {totalToday} Tasks</span>
            </div>
            
            <div className="w-full h-1 bg-[#101726] rounded-full overflow-hidden border border-cyan-500/5">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${questsPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-cyan-500/5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1">REPLENISHMENT APOTHECARY</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                disabled={!hpPotion || hpPotion.quantity <= 0 || character.hp >= character.maxHp}
                onClick={() => {
                  onConsumeItem('potion_hp');
                }}
                className="flex flex-col items-center justify-center p-2.5 bg-[#101726] hover:bg-[#101726]/80 disabled:opacity-30 border border-cyan-500/10 rounded-[12px] cursor-pointer text-zinc-300 text-center transition-all font-medium gap-1"
              >
                <HeartPulse className="w-4 h-4 text-red-500" />
                <span className="text-[11px]">Restore HP</span>
                <span className="text-[9px] font-mono text-zinc-500">Qty: {hpPotion?.quantity || 0}</span>
              </button>

              <button
                disabled={!energyDrink || energyDrink.quantity <= 0 || character.energy >= character.maxEnergy}
                onClick={() => {
                  onConsumeItem('energy_drink');
                }}
                className="flex flex-col items-center justify-center p-2.5 bg-[#101726] hover:bg-[#101726]/80 disabled:opacity-30 border border-cyan-500/10 rounded-[12px] cursor-pointer text-zinc-300 text-center transition-all font-medium gap-1"
              >
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-[11px]">Recharge EP</span>
                <span className="text-[9px] font-mono text-zinc-500">Qty: {energyDrink?.quantity || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PRIMARY LIFE OBJECTIVES & MILESTONES */}
      {/* ========================================== */}
      <div className="space-y-4">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
          PRIMARY LIFE OBJECTIVES & MILESTONES
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {missions.map((m) => {
            // Precise, gorgeous mission coloring based on requirements:
            // HSC = Emerald Green, Creator = Purple, Deen (Faith) = Blue, Body (Fitness) = Orange
            let themeBorder = 'border-cyan-500/10 hover:border-cyan-500/25';
            let iconBg = 'bg-[#101726] text-zinc-400 border-cyan-500/10';
            let barBg = 'bg-cyan-500';

            if (m.id === 'hsc') {
              themeBorder = 'border-cyan-500/10 hover:border-emerald-500/35';
              iconBg = 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20';
              barBg = 'bg-emerald-500';
            } else if (m.id === 'creator') {
              themeBorder = 'border-cyan-500/10 hover:border-cyan-500/35';
              iconBg = 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20';
              barBg = 'bg-cyan-400';
            } else if (m.id === 'faith') {
              themeBorder = 'border-cyan-500/10 hover:border-blue-500/35';
              iconBg = 'bg-blue-950/20 text-blue-400 border-blue-500/20';
              barBg = 'bg-blue-500';
            } else if (m.id === 'fitness') {
              themeBorder = 'border-cyan-500/10 hover:border-orange-500/35';
              iconBg = 'bg-orange-950/20 text-orange-400 border-orange-500/20';
              barBg = 'bg-orange-500';
            }

            const missionXpPct = Math.round((m.xp / m.xpNeeded) * 100);

            return (
              <div
                key={m.id}
                className={`bg-[#111B2D] border rounded-[14px] p-5 flex flex-col justify-between transition-all duration-200 hover:translate-y-[-1px] relative overflow-hidden group ${themeBorder}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 ${iconBg}`}>
                        {m.icon}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">
                          LEVEL {m.level}
                        </span>
                        <h3 className="text-sm font-semibold text-zinc-200 tracking-tight group-hover:text-zinc-100 transition-colors">
                          {m.name}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 bg-[#101726] border border-cyan-500/10 rounded text-cyan-400 font-medium">
                      {m.rank.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans font-normal">
                    {m.description}
                  </p>

                  {/* XP Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">OBJECTIVE PROGRESS</span>
                      <span className="text-zinc-400 font-semibold">{m.xp} / {m.xpNeeded} XP ({missionXpPct}%)</span>
                    </div>
                    <div className="w-full h-1 bg-[#101726] rounded-full overflow-hidden border border-cyan-500/5">
                      <div
                        className={`h-full rounded-full ${barBg} transition-all duration-300`}
                        style={{ width: `${missionXpPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Open command action */}
                <button
                  onClick={() => {
                    setSelectedMission(m);
                    playSound('click', soundEnabled);
                  }}
                  className="mt-5 w-full py-2 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/25 text-zinc-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Manage Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streaks & Codex shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Flame streak */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">STREAK MULTIPLIER</span>
          <div className="flex items-center gap-4 py-2">
            <div className="p-3 bg-orange-500/5 border border-orange-500/20 text-orange-500 rounded-xl shrink-0">
              <Flame className="w-5 h-5 fill-orange-500/10" />
            </div>
            <div className="text-xs">
              <span className="text-zinc-200 font-semibold text-sm block">{streak.currentStreak} DAYS STREAK</span>
              <span className="text-zinc-500 text-[11px]">Best personal streak: {streak.longestStreak} days</span>
            </div>
          </div>
          <button
            onClick={() => { onNavigate('calendar'); playSound('click', soundEnabled); }}
            className="w-full py-2 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/25 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Consistency Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saved accomplishments achievements list */}
        <div className="md:col-span-2 bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 flex flex-col justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">RECENT ACCOMPLISHMENTS</span>
            <div className="space-y-2">
              {recentAchievements.length === 0 ? (
                <div className="text-xs text-zinc-500 py-3 font-sans">No objectives unlocked yet. Complete daily quests to earn badges!</div>
              ) : (
                recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-center p-2.5 bg-[#101726] border border-cyan-500/10 rounded-xl text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-semibold text-zinc-200 truncate max-w-[180px] sm:max-w-xs">{ach.name}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[11px] shrink-0">+{ach.rewardCoins} COINS</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => { onNavigate('achievements'); playSound('click', soundEnabled); }}
            className="w-full py-2 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/25 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Achievements Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Slide-over for Selected Mission */}
      {selectedMission && (
        <MissionDashboardModal
          mission={selectedMission}
          character={character}
          soundEnabled={soundEnabled}
          onClose={() => setSelectedMission(null)}
          onUpdateMission={handleUpdateMission}
          onLogLearning={onLogLearning}
          onLogBusiness={onLogBusiness}
          onLogFaith={onLogFaith}
          onLogFitness={onLogFitness}
          learningLogs={learningLogs}
        />
      )}
    </div>
  );
}
