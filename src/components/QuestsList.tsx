import React, { useState } from 'react';
import { Quest, BossBattle, Character, QuestPlanner } from '../types';
import {
  Shield,
  Sparkles,
  Plus,
  Trophy,
  Sword,
  Zap,
  Heart,
  Flame,
  RefreshCw,
  Hourglass,
  Activity,
  Dumbbell,
  Youtube,
  BookOpen,
  Compass,
  AlertTriangle,
  CheckCircle,
  Moon,
  Droplet,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface QuestsListProps {
  quests: Quest[];
  bossBattle: BossBattle | null;
  character: Character;
  onToggleQuest: (id: string) => void;
  onAddQuest: (text: string, difficulty: 'easy' | 'medium' | 'hard' | 'extreme', category: keyof Character['stats']) => void;
  onRollQuests: () => void;
  soundEnabled: boolean;
  questPlanner?: QuestPlanner;
  onUpdateQuestPlanner?: (updates: Partial<QuestPlanner>) => void;
}

export default function QuestsList({
  quests,
  bossBattle,
  character,
  onToggleQuest,
  onAddQuest,
  onRollQuests,
  soundEnabled,
  questPlanner,
  onUpdateQuestPlanner
}: QuestsListProps) {
  const [newQuestText, setNewQuestText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('easy');
  const [category, setCategory] = useState<keyof Character['stats']>('Discipline');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPlannerConsole, setShowPlannerConsole] = useState(false);

  // Fallback defaults if questPlanner is missing
  const planner: QuestPlanner = questPlanner || {
    hscCountdownDays: 210,
    hscWeakerSubjects: ['Physics', 'Chemistry', 'Math'],
    gymSchedule: 'push',
    contentSchedule: 'scripting',
    availableTimeHours: 8,
    energyLevel: 'medium',
    worshipStreaks: { 'Salah': 0, 'Quran': 0, 'Adhkar': 0 },
    missedObligatoryCount: 0,
    procrastinationModeActive: false,
    completedActsToday: []
  };

  const handleUpdatePlanner = (updates: Partial<QuestPlanner>) => {
    if (onUpdateQuestPlanner) {
      onUpdateQuestPlanner(updates);
      playSound('click', soundEnabled);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestText.trim()) return;
    onAddQuest(newQuestText.trim(), difficulty, category);
    setNewQuestText('');
    setShowAddForm(false);
    playSound('click', soundEnabled);
  };

  const getDifficultyColor = (diff: Quest['difficulty']) => {
    switch (diff) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'hard': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'extreme': return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Strength': return 'text-orange-400';
      case 'Agility': return 'text-green-400';
      case 'Endurance': return 'text-amber-500';
      case 'Intelligence': return 'text-blue-400';
      case 'Discipline': return 'text-purple-400';
      case 'Charisma': return 'text-pink-400';
      case 'Knowledge': return 'text-cyan-400';
      case 'Faith': return 'text-emerald-400';
      case 'Vitality': return 'text-red-400';
      case 'Business': return 'text-yellow-400';
      default: return 'text-zinc-400';
    }
  };

  // Group Quests by Category groups
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  const getGroupTitle = (quest: Quest) => {
    if (quest.id.includes('salah') || quest.id.includes('quran') || quest.id.includes('adhkar') || quest.id.includes('friday') || quest.id.includes('worship')) {
      return { title: '🕋 OBLIGATORY DEVOTION & FAITH', border: 'border-emerald-500/20 bg-emerald-500/[0.02]', text: 'text-emerald-400' };
    }
    if (quest.id.includes('hsc_block') || quest.id.includes('hsc_practice') || quest.id.includes('hsc_revision')) {
      return { title: `📚 ACADEMIC STUDY METRICS (${planner.hscCountdownDays} DAYS TO EXAMS)`, border: 'border-blue-500/20 bg-blue-500/[0.02]', text: 'text-blue-400' };
    }
    if (quest.id.includes('content') || quest.id.includes('recovery_creator')) {
      return { title: '🎥 MEDIA PRODUCTION PIPELINE', border: 'border-purple-500/20 bg-purple-500/[0.02]', text: 'text-purple-400' };
    }
    if (quest.id.includes('gym') || quest.id.includes('nutrition') || quest.id.includes('sleep')) {
      return { title: '💪 PHYSICAL RECONSTRUCTION & HEALTH', border: 'border-orange-500/20 bg-orange-500/[0.02]', text: 'text-orange-400' };
    }
    return { title: '🧠 PERSONAL ROUTINES & SKILLS', border: 'border-zinc-800 bg-zinc-900/10', text: 'text-zinc-300' };
  };

  const groupedActiveQuests: { [key: string]: { quests: Quest[], meta: any } } = {};
  activeQuests.forEach(q => {
    const meta = getGroupTitle(q);
    if (!groupedActiveQuests[meta.title]) {
      groupedActiveQuests[meta.title] = { quests: [], meta };
    }
    groupedActiveQuests[meta.title].quests.push(q);
  });

  return (
    <div id="quests-system-root" className="space-y-6">
      {/* Strategic Focus Sprint (formerly Weekly Boss Section) */}
      {bossBattle && bossBattle.active && (
        <div id="boss-raid-panel" className="relative overflow-hidden rounded-[14px] bg-[#111B2D] border border-cyan-500/10 p-6 shadow-[0_0_20px_rgba(0,242,254,0.01)]">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2.5 flex-1 w-full">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-cyan-400">ACTIVE SYSTEM FOCUS SPRINT</span>
              </div>
              <h2 className="text-base font-bold font-sans text-zinc-100 tracking-tight">
                {bossBattle.name}
              </h2>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-medium uppercase tracking-wider">SPRINT PROGRESS METRIC</span>
                  <span className="text-cyan-400 font-bold">{bossBattle.hp} / {bossBattle.maxHp} COMPLETIONS</span>
                </div>
                <div className="w-full h-1.5 bg-[#101726] rounded-full border border-cyan-500/5 overflow-hidden p-px flex items-center">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${(bossBattle.hp / bossBattle.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-cyan-500/10 rounded-xl p-4 w-full md:w-auto md:min-w-64">
              <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-2 font-bold">REWARD VALUATION</span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{bossBattle.rewardCoins} Coins</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+{bossBattle.rewardXp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300 font-medium col-span-2 border-t border-cyan-500/5 pt-2 mt-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Title: "{bossBattle.rewardTitle}"</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 relative z-10 border-t border-cyan-500/5 pt-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">TARGET MILESTONES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bossBattle.tasks.map((task) => (
                <div
                  key={task.id}
                  id={`boss-task-${task.id}`}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                    task.completed
                      ? 'bg-cyan-950/5 border-cyan-500/5 text-zinc-500 line-through'
                      : 'bg-[#101726] border-cyan-500/5 hover:border-cyan-500/20 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className={`w-4 h-4 ${task.completed ? 'text-cyan-400' : 'text-zinc-600'}`} />
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-200">{task.text}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Sector: {task.category}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold shrink-0 ml-2">
                    <span className={task.completed ? 'text-cyan-400' : 'text-zinc-400'}>
                      {task.current}
                    </span>
                    <span className="text-zinc-600"> / {task.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Anti-Procrastination Intervention Alert */}
      {planner.procrastinationModeActive && (
        <div id="procrastination-alert" className="p-4.5 rounded-[14px] bg-red-950/15 border border-red-500/20 flex gap-4 items-start">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold font-mono text-red-400 tracking-[0.12em] uppercase">ROUTINE INTERVENTION PROTOCOL ACTIVE</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal">
              Critical academic studies or obligatory acts of worship have repeatedly slipped. The dashboard advisor has scheduled simplified, high-impact momentum builders. Secondary creative tasks have been deferred to prioritize cognitive recharge. Let's make small, steady steps today.
            </p>
          </div>
        </div>
      )}

      {/* Objectives Calibration Console */}
      <div id="planner-console-card" className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm space-y-6 relative">
        <div className="flex justify-between items-center border-b border-cyan-500/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-cyan-400" />
              <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono">CALIBRATION PANEL</h2>
            </div>
            <p className="text-xs text-zinc-500 font-sans">Adjust current schedules, timelines, and energy parameters to structure optimized daily workflows.</p>
          </div>
          <button
            onClick={() => {
              setShowPlannerConsole(!showPlannerConsole);
              playSound('click', soundEnabled);
            }}
            className="text-xs font-mono px-3.5 py-2 bg-[#101726] hover:bg-[#101726]/80 text-zinc-300 border border-cyan-500/10 hover:border-cyan-500/25 rounded-xl cursor-pointer transition-colors uppercase tracking-wider"
          >
            {showPlannerConsole ? 'Hide System Settings' : 'Calibrate Schedule'}
          </button>
        </div>

        {showPlannerConsole && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* HSC & Availability parameters */}
            <div className="space-y-4 bg-[#101726] p-4.5 border border-cyan-500/5 rounded-xl">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/5 pb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>HSC Exam Matrix</span>
              </h3>
              
              {/* Countdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Days remaining:</span>
                  <span className="text-cyan-400 font-semibold">{planner.hscCountdownDays} Days</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="1"
                    max="210"
                    value={planner.hscCountdownDays}
                    onChange={(e) => handleUpdatePlanner({ hscCountdownDays: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#111B2D] rounded-lg accent-cyan-400 border border-cyan-500/5"
                  />
                  <input
                    type="number"
                    value={planner.hscCountdownDays}
                    onChange={(e) => handleUpdatePlanner({ hscCountdownDays: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 bg-[#111B2D] border border-cyan-500/10 rounded-lg px-1.5 py-0.5 text-xs font-mono text-zinc-300 text-center focus:outline-none focus:border-cyan-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Gym Split & Content splits */}
            <div className="space-y-4 bg-[#101726] p-4.5 border border-cyan-500/5 rounded-xl">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/5 pb-2">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                <span>Physical Routine Focus</span>
              </h3>
              
              <div className="grid grid-cols-5 gap-1">
                {[
                  { id: 'push', label: 'Push' },
                  { id: 'pull', label: 'Pull' },
                  { id: 'legs', label: 'Legs' },
                  { id: 'cardio', label: 'HIIT' },
                  { id: 'rest', label: 'Rest' }
                ].map(split => {
                  const active = planner.gymSchedule === split.id;
                  return (
                    <button
                      key={split.id}
                      onClick={() => handleUpdatePlanner({ gymSchedule: split.id as any })}
                      className={`text-[10px] font-mono py-1.5 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-950/20 border-cyan-500/25 text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.05)]'
                          : 'bg-[#111B2D] border-cyan-500/5 text-zinc-500 hover:border-cyan-500/15 hover:text-zinc-400'
                      }`}
                    >
                      {split.label}
                    </button>
                  );
                })}
              </div>

              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/5 pt-2 pb-2">
                <Youtube className="w-4 h-4 text-cyan-400" />
                <span>Media Creation Task</span>
              </h3>
              
              <div className="grid grid-cols-5 gap-1">
                {[
                  { id: 'scripting', label: 'Script' },
                  { id: 'recording', label: 'Shoot' },
                  { id: 'editing', label: 'Edit' },
                  { id: 'uploading', label: 'Post' },
                  { id: 'analyzing', label: 'Audit' }
                ].map(phase => {
                  const active = planner.contentSchedule === phase.id;
                  return (
                    <button
                      key={phase.id}
                      disabled={planner.procrastinationModeActive}
                      onClick={() => handleUpdatePlanner({ contentSchedule: phase.id as any })}
                      className={`text-[9px] font-mono py-1.5 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                        planner.procrastinationModeActive ? 'opacity-30 cursor-not-allowed' : ''
                      } ${
                        active
                          ? 'bg-cyan-950/20 border-cyan-500/25 text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.05)]'
                          : 'bg-[#111B2D] border-cyan-500/5 text-zinc-500 hover:border-cyan-500/15 hover:text-zinc-400'
                      }`}
                    >
                      {phase.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time & Energy parameters */}
            <div className="space-y-4 bg-[#101726] p-4.5 border border-cyan-500/5 rounded-xl">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/5 pb-2">
                <Hourglass className="w-4 h-4 text-cyan-400" />
                <span>Capacity Allocations</span>
              </h3>

              {/* Study Time slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Daily capacity study hours:</span>
                  <span className="text-zinc-200 font-semibold">{planner.availableTimeHours} Hours</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={planner.availableTimeHours}
                    onChange={(e) => handleUpdatePlanner({ availableTimeHours: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[#111B2D] rounded-lg accent-cyan-400 border border-cyan-500/5"
                  />
                  <span className="text-xs font-mono text-zinc-500 w-6 text-center">{planner.availableTimeHours}h</span>
                </div>
              </div>

              {/* Energy levels */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Focus Availability Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'low', label: '⚡ Low', bg: 'bg-red-950/20 text-red-400 border-red-500/20' },
                    { id: 'medium', label: '⚡⚡ Med', bg: 'bg-cyan-950/10 text-cyan-300 border-cyan-500/20' },
                    { id: 'high', label: '⚡⚡⚡ High', bg: 'bg-cyan-950/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(0,242,254,0.05)]' }
                  ].map(lvl => {
                    const active = planner.energyLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => handleUpdatePlanner({ energyLevel: lvl.id as any })}
                        className={`text-[10px] font-mono py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          active
                            ? `${lvl.bg} opacity-100`
                            : 'bg-[#111B2D] border-cyan-500/5 text-zinc-500 hover:text-zinc-400'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Islamic worship (Faith) Streaks Hub */}
      <div id="spiritual-streaks-hub" className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-cyan-500/5 pb-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <Compass className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest">Islamic Devotion Meters</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
              Continuous records for Farz and essential daily routines. Worship is performed solely with pure intention (Niyyah).
            </p>
          </div>
          <Award className="w-4.5 h-4.5 text-cyan-400 shrink-0 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'Salah', label: 'Farz Prayers', desc: 'Fajr to Isha on-time', streak: planner.worshipStreaks['Salah'] || 0, color: 'border-cyan-500/10 text-cyan-400' },
            { id: 'Quran', label: 'Quran Recitation', desc: 'Study verses with translation', streak: planner.worshipStreaks['Quran'] || 0, color: 'border-cyan-500/10 text-blue-400' },
            { id: 'Adhkar', label: 'Morning/Evening Dhikr', desc: 'Consistent morning/evening prayers', streak: planner.worshipStreaks['Adhkar'] || 0, color: 'border-cyan-500/10 text-amber-500' }
          ].map(habit => (
            <div
              key={habit.id}
              id={`spiritual-streak-${habit.id}`}
              className={`flex items-center gap-3.5 p-4 rounded-xl border bg-[#101726]/60 ${habit.color}`}
            >
              <div className="p-2.5 rounded-lg bg-[#111B2D] border border-cyan-500/10 flex items-center justify-center shrink-0">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-semibold text-zinc-200 truncate">{habit.label}</p>
                <p className="text-[10px] text-zinc-500 truncate leading-none">{habit.desc}</p>
                <p className="text-xs font-mono pt-1 text-zinc-400 uppercase tracking-wider">STREAK: <span className="text-xs font-bold text-zinc-100">{habit.streak} D</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Reminders timeline widget */}
      <div id="smart-reminders-panel" className="bg-[#101726]/40 border border-cyan-500/10 rounded-xl p-4">
        <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-zinc-500" />
          <span>DAILY SCHEDULE BLOCKS</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {[
            { title: '🕋 Farz Alignment', desc: 'Obligatory Salah block. Re-focus, perform wudu, and pray.', time: 'Salah Schedules', icon: Compass, col: 'text-cyan-400 bg-cyan-950/10 border-cyan-500/10' },
            { title: '📚 Academic Block', desc: `${planner.availableTimeHours}h recommended window. Revision focused.`, time: 'Milestone Study', icon: BookOpen, col: 'text-blue-400 bg-blue-950/10 border-blue-500/10' },
            { title: '💪 Strength Session', desc: `Target: ${planner.gymSchedule.toUpperCase()}. High-intensity output.`, time: 'Workout Window', icon: Dumbbell, col: 'text-orange-400 bg-orange-950/10 border-orange-500/10' },
            { title: '💤 Rejuvenation sleep', desc: 'Screens off 1h before bed. Maximize active growth.', time: '10:00 PM', icon: Moon, col: 'text-purple-400 bg-purple-950/10 border-purple-500/10' }
          ].map((rem, idx) => {
            const Icon = rem.icon;
            return (
              <div
                key={idx}
                id={`reminder-block-${idx}`}
                className={`p-3.5 rounded-xl border flex gap-2.5 items-start ${rem.col}`}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-[10px] uppercase tracking-wider">{rem.title}</span>
                    <span className="text-[9px] opacity-60 font-mono">{rem.time}</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-normal font-normal">{rem.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Daily Quests Display */}
      <div id="quests-list-container" className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>Daily Target Checklist</span>
              {planner.procrastinationModeActive && (
                <span className="text-[9px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30 uppercase font-bold">RECOVERY ACTIVE</span>
              )}
            </h2>
            <p className="text-xs text-zinc-500 font-sans">
              Complete these calibrated tasks to progress your workspace and collect system coins.
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                onRollQuests();
                playSound('click', soundEnabled);
              }}
              title="Refresh Daily Tasks"
              className="p-2 border border-cyan-500/10 hover:border-cyan-500/25 bg-[#101726] rounded-xl text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                playSound('click', soundEnabled);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold cursor-pointer transition-all uppercase tracking-wider shadow-[0_0_10px_rgba(0,242,254,0.1)]"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Custom Quest Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4.5 bg-[#101726] border border-cyan-500/10 rounded-xl space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Objective Description</label>
                <input
                  type="text"
                  required
                  value={newQuestText}
                  onChange={(e) => setNewQuestText(e.target.value)}
                  placeholder="e.g., Solve 10 Advanced Integration math problems"
                  className="w-full bg-[#111B2D] border border-cyan-500/10 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Difficulty Rating</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-[#111B2D] border border-cyan-500/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/30"
                >
                  <option value="easy">Easy (+10 XP / 15 Coins)</option>
                  <option value="medium">Medium (+25 XP / 35 Coins)</option>
                  <option value="hard">Hard (+50 XP / 70 Coins)</option>
                  <option value="extreme">Extreme (+100 XP / 150 Coins)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Associated Attribute</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#111B2D] border border-cyan-500/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/30"
                >
                  <option value="Strength">Strength</option>
                  <option value="Agility">Agility</option>
                  <option value="Endurance">Endurance</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Discipline">Discipline</option>
                  <option value="Charisma">Charisma</option>
                  <option value="Knowledge">Knowledge</option>
                  <option value="Faith">Faith</option>
                  <option value="Vitality">Vitality</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-cyan-500/10">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs rounded-lg cursor-pointer font-bold uppercase tracking-wider"
                >
                  Generate Task
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Grouped Quest List */}
        <div className="space-y-6">
          {activeQuests.length === 0 && completedQuests.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs border border-dashed border-cyan-500/10 rounded-2xl">
              No tasks currently registered. Calibrate your options above or create a custom task.
            </div>
          ) : (
            <>
              {/* Render active groups in priority order */}
              {Object.keys(groupedActiveQuests).map((groupTitle) => {
                const group = groupedActiveQuests[groupTitle];
                // Rewrite groups layout to match high-tech command lines:
                let textCol = group.meta.text;
                let borderCol = 'border-cyan-500/10';
                let bgCol = 'bg-[#101726]/60';

                if (groupTitle.includes('FAITH')) {
                  borderCol = 'border-emerald-500/20';
                  bgCol = 'bg-emerald-950/5';
                  textCol = 'text-emerald-400';
                } else if (groupTitle.includes('ACADEMIC')) {
                  borderCol = 'border-blue-500/20';
                  bgCol = 'bg-blue-950/5';
                  textCol = 'text-blue-400';
                } else if (groupTitle.includes('MEDIA')) {
                  borderCol = 'border-cyan-500/15';
                  bgCol = 'bg-cyan-950/5';
                  textCol = 'text-cyan-400';
                } else if (groupTitle.includes('PHYSICAL')) {
                  borderCol = 'border-orange-500/20';
                  bgCol = 'bg-orange-950/5';
                  textCol = 'text-orange-400';
                }

                return (
                  <div key={groupTitle} id={`quest-group-${groupTitle.replace(/\s+/g, '-')}`} className={`rounded-[14px] border ${borderCol} ${bgCol} p-4.5 space-y-3`}>
                    <h3 className={`text-[10px] font-mono font-bold tracking-widest border-b border-cyan-500/5 pb-2 uppercase ${textCol}`}>
                      {groupTitle}
                    </h3>
                    <div className="space-y-2">
                      {group.quests.map((quest) => (
                        <div
                          key={quest.id}
                          id={`quest-item-${quest.id}`}
                          onClick={() => onToggleQuest(quest.id)}
                          className="flex items-center justify-between p-3.5 bg-[#111B2D]/80 hover:bg-[#111B2D] border border-cyan-500/5 hover:border-cyan-500/20 rounded-xl cursor-pointer transition-all duration-150 group shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4.5 h-4.5 rounded border border-cyan-500/20 group-hover:border-cyan-500 flex items-center justify-center shrink-0 transition-colors">
                              <div className="w-2 h-2 rounded bg-cyan-400 scale-0 group-hover:scale-100 transition-transform duration-150 shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">
                                {quest.text}
                              </p>
                              <div className="flex gap-2 mt-1.5">
                                <span className={`text-[9px] px-1.5 py-0.5 border rounded font-mono uppercase tracking-wider ${getDifficultyColor(quest.difficulty)}`}>
                                  {quest.difficulty}
                                </span>
                                <span className={`text-[9px] font-mono font-medium uppercase tracking-wider ${getCategoryColor(quest.category)}`}>
                                  {quest.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-[10px] font-mono shrink-0 ml-2">
                            <div className="text-amber-500 font-semibold">+{quest.coinReward} COINS</div>
                            <div className="text-cyan-400 font-semibold">+{quest.xpReward} XP</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Completed heading */}
              {completedQuests.length > 0 && (
                <div id="completed-quests-container" className="pt-6 border-t border-cyan-500/5">
                  <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-bold">
                    <span>CLEARED OPERATIONS ({completedQuests.length})</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {completedQuests.map((quest) => (
                      <div
                        key={quest.id}
                        id={`quest-item-completed-${quest.id}`}
                        onClick={() => onToggleQuest(quest.id)}
                        className="flex items-center justify-between p-3 bg-[#101726]/30 border border-cyan-500/5 rounded-xl opacity-40 hover:opacity-90 cursor-pointer line-through text-zinc-500 transition-all duration-150"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-4 h-4 rounded border border-cyan-500/20 bg-cyan-950/10 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded bg-cyan-400" />
                          </div>
                          <div className="truncate">
                            <p className="text-[11px] font-semibold truncate text-zinc-400">{quest.text}</p>
                            <span className="text-[9px] font-mono text-zinc-600 uppercase">{quest.category}</span>
                          </div>
                        </div>

                        <div className="text-right text-[9px] font-mono text-zinc-600 shrink-0 ml-2">
                          <div>+{quest.coinReward} COINS</div>
                          <div>+{quest.xpReward} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
