import React, { useState } from 'react';
import { Mission, Character, FitnessLog, LearningLog, BusinessLog, FaithLog } from '../types';
import { playSound } from '../utils/sound';
import { motion } from 'motion/react';
import {
  X,
  TrendingUp,
  Award,
  Flame,
  Zap,
  Sword,
  Coins,
  GraduationCap,
  Calendar,
  BookOpen,
  CheckCircle,
  Plus,
  Trash2,
  Video,
  Eye,
  EyeOff,
  Compass,
  Play,
  Dumbbell,
  Droplet,
  Heart,
  ChevronRight,
  BookOpenCheck,
  DollarSign,
  Briefcase,
  Laptop,
  Search,
  Youtube
} from 'lucide-react';

interface MissionDashboardModalProps {
  mission: Mission;
  character: Character;
  onClose: () => void;
  onUpdateMission: (updated: Mission) => void;
  onLogLearning: (log: Omit<LearningLog, 'id' | 'date'>) => void;
  onLogBusiness: (log: Omit<BusinessLog, 'id' | 'date'>) => void;
  onLogFaith: (log: Omit<FaithLog, 'date'>) => void;
  onLogFitness: (log: Omit<FitnessLog, 'date'>) => void;
  soundEnabled: boolean;
  learningLogs?: LearningLog[];
}

export default function MissionDashboardModal({
  mission,
  character,
  onClose,
  onUpdateMission,
  onLogLearning,
  onLogBusiness,
  onLogFaith,
  onLogFitness,
  soundEnabled,
  learningLogs = []
}: MissionDashboardModalProps) {
  // Common states
  const [activeTab, setActiveTab] = useState<'stats' | 'boss' | 'objectives'>('stats');

  // HSC Mission States
  const [focusPreset, setFocusPreset] = useState<'25' | '50' | '90' | 'custom'>('25');
  const [customStudyMinutes, setCustomStudyMinutes] = useState<number>(60);
  const [studyNotes, setStudyNotes] = useState<string>('');
  const [newWeakTopic, setNewWeakTopic] = useState<string>('');

  // Creator Mission States
  const [newIdeaTitle, setNewIdeaTitle] = useState<string>('');
  const [newIdeaCategory, setNewIdeaCategory] = useState<string>('Tech/Productivity');
  const [creatorHours, setCreatorHours] = useState<number>(2);
  const [ytTask, setYtTask] = useState<'script' | 'record' | 'edit' | 'thumbnail' | 'upload' | 'analyze'>('script');
  const [contestProjectName, setContestProjectName] = useState<string>('');
  const [contestHours, setContestHours] = useState<number>(3);
  const [contestWonAmount, setContestWonAmount] = useState<number>(250);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('AI Tool');

  // Faith Mission States
  const [localSalah, setLocalSalah] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  });
  const [localQuranPages, setLocalQuranPages] = useState<number>(2);
  const [dhikrText, setDhikrText] = useState<'SubhanAllah' | 'Alhamdulillah' | 'Allahu Akbar' | 'Astaghfirullah'>('SubhanAllah');
  const [newJournalEntry, setNewJournalEntry] = useState<string>('');

  // Fitness Mission States
  const [localPushups, setLocalPushups] = useState<number>(0);
  const [localPullups, setLocalPullups] = useState<number>(0);
  const [localSquats, setLocalSquats] = useState<number>(0);
  const [localRunKm, setLocalRunKm] = useState<number>(0);
  const [proteinGrams, setProteinGrams] = useState<number>(120);

  // Tap Dhikr Handler
  const handleDhikrTap = () => {
    playSound('click', soundEnabled);
    const updated = { ...mission };
    updated.stats.dhikrCount = (updated.stats.dhikrCount || 0) + 1;
    onUpdateMission(updated);
  };

  // Log HSC Study Session
  const submitHscStudy = (e: React.FormEvent) => {
    e.preventDefault();
    
    let duration = 25;
    let focusLabel = 'Pomodoro Block';
    if (focusPreset === '50') {
      duration = 50;
      focusLabel = 'Deep Focus Sprint';
    } else if (focusPreset === '90') {
      duration = 90;
      focusLabel = 'Extreme Focus Block';
    } else if (focusPreset === 'custom') {
      duration = customStudyMinutes;
      focusLabel = 'Custom Focus Block';
    }

    onLogLearning({
      type: 'course',
      title: `📚 ${focusLabel}`,
      durationMinutes: duration,
      progressPercent: 100,
      notes: studyNotes.trim() || `Completed a structured ${duration}-minute study block.`
    });
    
    // Update local mission statistics as well
    const durationHours = duration / 60;
    const isDeep = duration >= 50;

    const updated = { ...mission };
    updated.stats = {
      ...updated.stats,
      studyHours: (updated.stats.studyHours || 0) + durationHours,
      focusSessions: (updated.stats.focusSessions || 0) + 1,
      deepWorkSessions: (updated.stats.deepWorkSessions || 0) + (isDeep ? 1 : 0),
      lifetimeStudyHours: (updated.stats.lifetimeStudyHours || 0) + durationHours
    };
    onUpdateMission(updated);
    
    playSound('reward', soundEnabled);
    setStudyNotes('');
  };

  // Add Weak Topic
  const addWeakTopic = () => {
    if (!newWeakTopic.trim()) return;
    const updated = { ...mission };
    updated.stats.weakTopics = [...(updated.stats.weakTopics || []), newWeakTopic.trim()];
    onUpdateMission(updated);
    setNewWeakTopic('');
    playSound('click', soundEnabled);
  };

  // Remove Weak Topic
  const removeWeakTopic = (topic: string) => {
    const updated = { ...mission };
    updated.stats.weakTopics = (updated.stats.weakTopics || []).filter((t: string) => t !== topic);
    onUpdateMission(updated);
    playSound('click', soundEnabled);
  };

  // YouTube Action Logging
  const submitYtTask = (e: React.FormEvent) => {
    e.preventDefault();
    const taskLabels: Record<string, string> = {
      script: 'Draft Video Script',
      record: 'Record Video/Audio',
      edit: 'Video Editing Sprint',
      thumbnail: 'Design Video Thumbnail',
      upload: 'SEO & Publish Content',
      analyze: 'Analyze Performance Metrics'
    };
    const hoursAssigned = ytTask === 'edit' || ytTask === 'record' ? 2 : 1;

    onLogBusiness({
      projectName: `YouTube: ${taskLabels[ytTask]}`,
      deepWorkHours: hoursAssigned,
      income: 0,
      clientsCount: 0,
      revenue: 0,
      completedTasksCount: 1
    });

    const updated = { ...mission };
    updated.stats = {
      ...updated.stats,
      videosCreated: (updated.stats.videosCreated || 0) + (ytTask === 'upload' ? 1 : 0),
      deepWorkHours: (updated.stats.deepWorkHours || 0) + hoursAssigned
    };
    onUpdateMission(updated);

    playSound('reward', soundEnabled);
  };

  // Freelancer Contest Submission
  const submitContestSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const name = contestProjectName.trim() || 'Logo design/Web assets contest';
    
    onLogBusiness({
      projectName: `Freelancer Contest Submission: ${name}`,
      deepWorkHours: contestHours,
      income: 0,
      clientsCount: 0,
      revenue: 0,
      completedTasksCount: 1
    });

    const updated = { ...mission };
    updated.stats = {
      ...updated.stats,
      contestsSubmitted: (updated.stats.contestsSubmitted || 0) + 1,
      deepWorkHours: (updated.stats.deepWorkHours || 0) + contestHours
    };
    onUpdateMission(updated);

    playSound('reward', soundEnabled);
    setContestProjectName('');
  };

  // Freelancer Contest Win
  const submitContestWin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = contestProjectName.trim() || 'Design Contest Champion';

    onLogBusiness({
      projectName: `Freelancer Contest Win: ${name}`,
      deepWorkHours: 4,
      income: contestWonAmount,
      clientsCount: 1,
      revenue: contestWonAmount,
      completedTasksCount: 1
    });

    const updated = { ...mission };
    updated.stats = {
      ...updated.stats,
      contestsWon: (updated.stats.contestsWon || 0) + 1,
      incomeEarned: (updated.stats.incomeEarned || 0) + contestWonAmount
    };
    onUpdateMission(updated);

    playSound('levelUp', soundEnabled);
    setContestProjectName('');
  };

  // Skill Growth Log
  const submitSkillGrowth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    onLogLearning({
      type: 'course',
      title: `💡 Skill: [${newSkillCategory}] ${newSkillName.trim()}`,
      durationMinutes: 60,
      progressPercent: 100,
      notes: `Studied and practiced new professional skill: ${newSkillName.trim()}`
    });

    const updated = { ...mission };
    const currentSkills = updated.stats.skillsLearned || [];
    if (!currentSkills.includes(newSkillName.trim())) {
      updated.stats.skillsLearned = [...currentSkills, newSkillName.trim()];
    }
    // Also advance objective
    const objIndex = updated.monthlyObjectives.findIndex((o: any) => o.id === 'creator_m_skills');
    if (objIndex !== -1) {
      updated.monthlyObjectives[objIndex].current = Math.min(
        updated.monthlyObjectives[objIndex].target,
        updated.monthlyObjectives[objIndex].current + 1
      );
      if (updated.monthlyObjectives[objIndex].current >= updated.monthlyObjectives[objIndex].target) {
        updated.monthlyObjectives[objIndex].completed = true;
      }
    }
    onUpdateMission(updated);

    playSound('reward', soundEnabled);
    setNewSkillName('');
  };

  // Add Video Idea
  const addVideoIdea = () => {
    if (!newIdeaTitle.trim()) return;
    const updated = { ...mission };
    updated.stats.ideas = [
      ...(updated.stats.ideas || []),
      { title: newIdeaTitle.trim(), category: newIdeaCategory, date: new Date().toLocaleDateString() }
    ];
    onUpdateMission(updated);
    setNewIdeaTitle('');
    playSound('click', soundEnabled);
  };

  // Remove Video Idea
  const removeVideoIdea = (index: number) => {
    const updated = { ...mission };
    updated.stats.ideas = (updated.stats.ideas || []).filter((_: any, i: number) => i !== index);
    onUpdateMission(updated);
    playSound('click', soundEnabled);
  };

  // Log Faith Salah & Quran
  const submitFaithLog = () => {
    onLogFaith({
      prayers: localSalah,
      quranPages: localQuranPages,
      dhikrCount: 0,
      lastDhikrPhrase: dhikrText
    });

    // Reset fields
    setLocalSalah({ fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false });
    setLocalQuranPages(2);
    setNewJournalEntry('');
    playSound('reward', soundEnabled);
  };

  // Log Fitness Workout
  const submitFitnessWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    onLogFitness({
      pushups: localPushups,
      pullups: localPullups,
      squats: localSquats,
      runKm: localRunKm,
      runMinutes: localRunKm * 6,
      calories: Math.round((localRunKm * 60) + (localPushups + localPullups + localSquats) * 0.4),
      weight: 70,
      bodyFat: 15,
      notes: 'Logged via Mission Dashboard'
    });

    // Update local protein statistics
    const updated = { ...mission };
    updated.stats.proteinDays = (updated.stats.proteinDays || 0) + (proteinGrams >= 140 ? 1 : 0);
    onUpdateMission(updated);

    setLocalPushups(0);
    setLocalPullups(0);
    setLocalSquats(0);
    setLocalRunKm(0);
    playSound('reward', soundEnabled);
  };

  // Hydrate quick hydration (+250ml)
  const logHydration = () => {
    const updated = { ...mission };
    updated.stats.waterLitres = Math.min(3, (updated.stats.waterLitres || 0) + 0.25);
    onUpdateMission(updated);
    playSound('click', soundEnabled);
  };

  // Complete Boss Battle manually (Cheat/Defeat simulation if goals completed)
  const claimBossRewards = () => {
    const updated = { ...mission };
    updated.bossBattle.completed = true;
    updated.bossBattle.hp = 0;
    onUpdateMission(updated);
    playSound('levelUp', soundEnabled);
  };

  const xpPercent = Math.round((mission.xp / mission.xpNeeded) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      {/* Immersive RPG Slate Container */}
      <motion.div
        id={`mission_panel_${mission.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#0e0f13] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col max-h-[92vh]"
      >
        {/* Header Block */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 bg-[#111318] relative flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{mission.icon}</span>
              <div>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
                  MISSION CONSOLE
                </span>
                <h2 className="text-base font-semibold text-zinc-100 tracking-tight">{mission.name}</h2>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg mt-1">{mission.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 rounded-xl text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mission Progression HUD Row */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-850 px-6 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">CURRENT GRADE</span>
            <span className="text-sm font-semibold text-zinc-100 font-mono">Level {mission.level}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">METRICS RANK</span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider truncate max-w-[130px] block mx-auto font-sans">
              {mission.rank}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">ACTIVE STREAK</span>
            <span className="text-xs font-semibold text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse text-orange-400" />
              {mission.streak || character.level} DAYS
            </span>
          </div>
        </div>

        {/* Inner Progress Bar */}
        <div className="bg-zinc-950/20 px-6 py-2.5 border-b border-zinc-850 flex items-center gap-3">
          <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden p-px">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 font-semibold tracking-wider shrink-0">
            {mission.xp} / {mission.xpNeeded} XP ({xpPercent}%)
          </span>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex bg-[#111318]/40 p-1 border-b border-zinc-850">
          <button
            onClick={() => { setActiveTab('stats'); playSound('click', soundEnabled); }}
            className={`flex-1 py-2 text-xs font-medium tracking-tight transition-all cursor-pointer rounded-lg ${
              activeTab === 'stats'
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Routines & Inputs
          </button>
          <button
            onClick={() => { setActiveTab('boss'); playSound('click', soundEnabled); }}
            className={`flex-1 py-2 text-xs font-medium tracking-tight transition-all cursor-pointer rounded-lg flex items-center justify-center gap-1.5 ${
              activeTab === 'boss'
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Milestone Challenge
          </button>
          <button
            onClick={() => { setActiveTab('objectives'); playSound('click', soundEnabled); }}
            className={`flex-1 py-2 text-xs font-medium tracking-tight transition-all cursor-pointer rounded-lg ${
              activeTab === 'objectives'
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Strategic Goals
          </button>
        </div>

        {/* Scrollable Panel Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* === MISSION 1: HSC EXAMS === */}
              {mission.id === 'hsc' && (() => {
                // Calculate dynamic metrics
                const todayStr = new Date().toISOString().split('T')[0];
                const todayLogs = learningLogs.filter(log => log.date === todayStr);
                const todayHours = todayLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);

                const oneDayMs = 24 * 60 * 60 * 1000;
                const startOfWeek = new Date(Date.now() - 7 * oneDayMs);
                const weeklyLogs = learningLogs.filter(log => {
                  const logDate = new Date(log.date);
                  return logDate >= startOfWeek;
                });
                const weeklyHours = weeklyLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);

                const startOfMonth = new Date(Date.now() - 30 * oneDayMs);
                const monthlyLogs = learningLogs.filter(log => {
                  const logDate = new Date(log.date);
                  return logDate >= startOfMonth;
                });
                const monthlyHours = monthlyLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);

                const lifetimeHours = learningLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);
                const focusSessionsCount = learningLogs.length;
                const deepWorkSessionsCount = learningLogs.filter(log => log.durationMinutes >= 50).length;

                const loggedDates = Array.from(new Set(learningLogs.map(log => log.date))).sort();
                let studyStreak = 0;
                if (loggedDates.length > 0) {
                  let checkDateObj = new Date();
                  let checking = true;
                  while (checking) {
                    const checkStr = checkDateObj.toISOString().split('T')[0];
                    if (loggedDates.includes(checkStr)) {
                      studyStreak++;
                      checkDateObj.setDate(checkDateObj.getDate() - 1);
                    } else {
                      if (checkStr === todayStr) {
                        checkDateObj.setDate(checkDateObj.getDate() - 1);
                        const yesterdayStr = checkDateObj.toISOString().split('T')[0];
                        if (loggedDates.includes(yesterdayStr)) {
                          continue;
                        }
                      }
                      checking = false;
                    }
                  }
                }

                const dailyGoal = mission.stats.dailyGoalHours || 5;
                const weeklyGoal = mission.stats.weeklyGoalHours || 35;
                const monthlyGoal = mission.stats.monthlyGoalHours || 150;

                const todayProgressPct = Math.min(100, Math.round((todayHours / dailyGoal) * 100));
                const weeklyProgressPct = Math.min(100, Math.round((weeklyHours / weeklyGoal) * 100));
                const monthlyProgressPct = Math.min(100, Math.round((monthlyHours / monthlyGoal) * 100));

                return (
                  <div className="space-y-6">
                    {/* Presets and Custom Focus Session Logger */}
                    <form onSubmit={submitHscStudy} className="bg-zinc-905/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">STUDY SESSION PLANNING</span>
                        <span className="text-[9px] font-mono text-zinc-500 font-semibold">100% USER-DRIVEN TARGETS</span>
                      </div>

                      {/* Presets selection row */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-500 block uppercase font-semibold">CHOOSE FOCUS PRESET</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { val: '25', label: '25m', desc: 'Pomodoro' },
                            { val: '50', label: '50m', desc: 'Deep Work' },
                            { val: '90', label: '90m', desc: 'Extreme block' },
                            { val: 'custom', label: 'Custom', desc: 'Slick Slider' }
                          ].map(preset => (
                            <button
                              key={preset.val}
                              type="button"
                              onClick={() => {
                                setFocusPreset(preset.val as any);
                                playSound('click', soundEnabled);
                              }}
                              className={`p-2.5 rounded-xl border font-mono text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                                focusPreset === preset.val
                                  ? 'bg-zinc-100 border-zinc-200 text-zinc-950 font-bold'
                                  : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-400'
                              }`}
                            >
                              <span className="text-sm font-semibold">{preset.label}</span>
                              <span className="text-[8px] font-semibold text-zinc-500 tracking-wider uppercase mt-0.5">{preset.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Minutes Slider */}
                      {focusPreset === 'custom' && (
                        <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                            <span>CUSTOM FOCUS DURATION</span>
                            <span className="text-emerald-400 font-bold">{customStudyMinutes} MINUTES ({(customStudyMinutes/60).toFixed(1)} HRS)</span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="300"
                            step="5"
                            value={customStudyMinutes}
                            onChange={(e) => setCustomStudyMinutes(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Optional notes input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">STUDY LOG MEMO / NOTES (OPTIONAL)</label>
                        <input
                          type="text"
                          placeholder="e.g. Practiced mathematics board problems, revised physics formulae"
                          value={studyNotes}
                          onChange={(e) => setStudyNotes(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none placeholder:text-zinc-700"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <BookOpenCheck className="w-4 h-4" />
                        Log Focus Sprint to Study Hours
                      </button>
                    </form>

                    {/* STUDY HOURS SUMMARY */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">STUDY HOUR SUMMARY</span>
                        <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-lg">
                          <Flame className="w-3 h-3 fill-orange-400" />
                          <span>{studyStreak} DAY STREAK</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Today card */}
                        <div className="bg-[#111318]/40 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">TODAY'S STUDY</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-lg font-bold text-zinc-200">{todayHours.toFixed(1)}h</span>
                              <span className="text-xs font-mono text-zinc-500">Goal: {dailyGoal}h</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${todayProgressPct}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400 block text-right font-bold">{todayProgressPct}% COMPLETE</span>
                          </div>
                        </div>

                        {/* Weekly card */}
                        <div className="bg-[#111318]/40 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">WEEKLY PROGRESS</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-lg font-bold text-zinc-200">{weeklyHours.toFixed(1)}h</span>
                              <span className="text-xs font-mono text-zinc-500">Goal: {weeklyGoal}h</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${weeklyProgressPct}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-amber-500 block text-right font-bold">{weeklyProgressPct}% COMPLETE</span>
                          </div>
                        </div>

                        {/* Monthly card */}
                        <div className="bg-[#111318]/40 border border-[#1e2025] rounded-2xl p-4 flex flex-col justify-between space-y-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">MONTHLY PROGRESS</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-lg font-bold text-zinc-200">{monthlyHours.toFixed(1)}h</span>
                              <span className="text-xs font-mono text-zinc-500">Goal: {monthlyGoal}h</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${monthlyProgressPct}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-blue-400 block text-right font-bold">{monthlyProgressPct}% COMPLETE</span>
                          </div>
                        </div>
                      </div>

                      {/* Lifetime & Sessions Details Grid */}
                      <div className="grid grid-cols-3 gap-3.5 pt-1 font-sans">
                        <div className="bg-zinc-950/60 p-3 border border-zinc-850 rounded-xl flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">LIFETIME STUDY</span>
                          <span className="text-xs font-bold text-zinc-200 mt-1">{lifetimeHours.toFixed(1)} hrs</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 border border-zinc-850 rounded-xl flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">FOCUS SESSIONS</span>
                          <span className="text-xs font-bold text-zinc-200 mt-1">{focusSessionsCount}</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 border border-zinc-850 rounded-xl flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">DEEP WORK (50m+)</span>
                          <span className="text-xs font-bold text-zinc-200 mt-1">{deepWorkSessionsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* === MISSION 2: CREATOR ECONOMY === */}
              {mission.id === 'creator' && (() => {
                const day = new Date().getDay();
                const getDailyGoalForDay = () => {
                  switch (day) {
                    case 1: return { text: "🎥 Monday: YouTube Script Writing", desc: "Research a high-storytelling content idea and draft your next script." };
                    case 2: return { text: "✂️ Tuesday: YouTube Video Editing", desc: "Record raw voiceovers/clips and complete a 2-hour editing sprint." };
                    case 3: return { text: "🏆 Wednesday: Freelancer Contest Draft", desc: "Find a suitable contest on Freelancer.com and draft your entry." };
                    case 4: return { text: "⚡ Thursday: Thumbnail & Upload", desc: "Design a high-CTR thumbnail, write SEO descriptions, and upload content." };
                    case 5: return { text: "🏆 Friday: Freelancer Contest Submission", desc: "Polish entry details, review design specs, and submit to your contest." };
                    case 6: return { text: "📊 Saturday: Research & Analytics", desc: "Audit metrics, evaluate competitors, and brainstorm 5 video concepts." };
                    case 0: return { text: "📈 Sunday: Weekly Creator Review", desc: "Reflect on consistency, sum up deep work hours, and plan the next week." };
                    default: return { text: "💼 Creator Economy Day", desc: "Build valuable skills, create digital assets, and win contracts." };
                  }
                };
                const activeGoal = getDailyGoalForDay();

                // Extract statistics
                const stats = mission.stats || {};
                const videosCreated = stats.videosCreated || stats.videosPublished || 0;
                const contestsSubmitted = stats.contestsSubmitted || 0;
                const contestsWon = stats.contestsWon || 0;
                const incomeEarned = stats.incomeEarned || 0;
                const deepWorkHours = stats.deepWorkHours || 0;
                const skillsList = stats.skillsLearned || [];

                // Weekly contest progress (target is 2 per week)
                const weeklyContestObj = mission.weeklyObjectives?.find((o: any) => o.id === 'creator_w_contest');
                const weeklyContestCount = weeklyContestObj?.current || 0;

                return (
                  <div className="space-y-6 font-sans text-zinc-300">
                    {/* Active Daily Goal Banner */}
                    <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl flex items-start gap-3.5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border-l border-b border-emerald-500/20 rounded-bl-xl font-bold uppercase tracking-wider">
                        Active Goal Today
                      </div>
                      <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-100 mt-1">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="space-y-1 pr-16">
                        <h4 className="text-sm font-bold text-zinc-100 tracking-tight">{activeGoal.text}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-normal">{activeGoal.desc}</p>
                      </div>
                    </div>

                    {/* Bento Grid HUD Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Weekly Contest Progress Card */}
                      <div className="bg-[#111318]/40 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase font-semibold">
                            <span>CONTEST PROGRESS</span>
                            <span className="text-amber-400">{weeklyContestCount === 0 ? "No Entry Yet" : weeklyContestCount >= 2 ? "Goal Met" : "1 Left"}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-2xl font-bold text-zinc-200">{weeklyContestCount} / 2</span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">This Week</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (weeklyContestCount / 2) * 100)}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-amber-500 block text-right font-bold uppercase tracking-wider">
                            {Math.round(Math.min(100, (weeklyContestCount / 2) * 100))}% of Weekly Goal
                          </span>
                        </div>
                      </div>

                      {/* Video & Contest Matrix Card */}
                      <div className="bg-[#111318]/40 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">CREATIVE PIPELINE</span>
                        <div className="grid grid-cols-2 gap-2 text-center pt-1">
                          <div className="bg-zinc-950/60 p-2 border border-zinc-850 rounded-xl flex flex-col justify-center">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">VIDEOS OK</span>
                            <span className="text-sm font-bold text-zinc-200 mt-0.5">{videosCreated}</span>
                          </div>
                          <div className="bg-zinc-950/60 p-2 border border-zinc-850 rounded-xl flex flex-col justify-center">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">CONTESTS</span>
                            <span className="text-sm font-bold text-zinc-200 mt-0.5">{contestsSubmitted}</span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Ledger & Clock Card */}
                      <div className="bg-[#111318]/40 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">LEDGER & DEEP CLOCK</span>
                        <div className="grid grid-cols-2 gap-2 text-center pt-1">
                          <div className="bg-zinc-950/60 p-2 border border-zinc-850 rounded-xl flex flex-col justify-center">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">EARNED</span>
                            <span className="text-xs font-bold text-emerald-400 mt-0.5">${incomeEarned}</span>
                          </div>
                          <div className="bg-zinc-950/60 p-2 border border-zinc-850 rounded-xl flex flex-col justify-center">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">DEEP WORK</span>
                            <span className="text-xs font-bold text-zinc-200 mt-0.5">{deepWorkHours.toFixed(1)}h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Console Logging Hub */}
                    <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">CREATOR ECONOMY CONSOLE</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* 1. YouTube Pipeline Form */}
                        <form onSubmit={submitYtTask} className="space-y-3 p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span>🎥 YouTube Pipeline Logger</span>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 font-semibold uppercase">Select Pipeline Activity</label>
                            <select
                              value={ytTask}
                              onChange={(e: any) => setYtTask(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                            >
                              <option value="script">Research Content & Write Script (+25 XP)</option>
                              <option value="record">Record raw video/audio tracks (+40 XP)</option>
                              <option value="edit">Video Editing Sprint (Pacing/FX) (+40 XP)</option>
                              <option value="thumbnail">Design custom CTR thumbnail (+25 XP)</option>
                              <option value="upload">SEO Metadata & Upload Video (+25 XP)</option>
                              <option value="analyze">Audit Analytics & Competitors (+15 XP)</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Log YouTube Activity
                          </button>
                        </form>

                        {/* 2. Freelancer.com Contests */}
                        <div className="space-y-3 p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                            <Briefcase className="w-4 h-4 text-amber-500" />
                            <span>🏆 Freelancer.com Contest Console</span>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Contest/Project Name (e.g. Logo Design, Web Assets)..."
                              value={contestProjectName}
                              onChange={(e) => setContestProjectName(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:border-zinc-700 outline-none placeholder:text-zinc-650"
                            />

                            <div className="grid grid-cols-2 gap-2">
                              {/* Log Submission Button */}
                              <button
                                onClick={submitContestSubmission}
                                className="py-2 px-1 bg-zinc-100 hover:bg-white text-zinc-950 text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center"
                              >
                                Log Submission (+45 XP)
                              </button>
                              
                              {/* Log Victory Button */}
                              <button
                                onClick={submitContestWin}
                                className="py-2 px-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center"
                              >
                                Log Victory (+300 XP)
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                            <span>*Contest entries are spread naturally (~2/week)</span>
                            <span>Prize Reward: +$250</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Skill Growth Bank */}
                      <form onSubmit={submitSkillGrowth} className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                          <Laptop className="w-4 h-4 text-blue-500" />
                          <span>💰 Professional Skill elevation</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              placeholder="Study a professional skill (e.g. Midjourney AI, Storytelling, Premiere Pro FX)..."
                              value={newSkillName}
                              onChange={(e) => setNewSkillName(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none placeholder:text-zinc-650"
                            />
                          </div>
                          <div>
                            <select
                              value={newSkillCategory}
                              onChange={(e) => setNewSkillCategory(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                            >
                              <option value="AI Tool">AI Tool</option>
                              <option value="Video Editing">Video Editing</option>
                              <option value="Thumbnail Design">Thumbnail Design</option>
                              <option value="Storytelling">Storytelling</option>
                              <option value="Communication">Communication</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/20 text-blue-300 hover:text-blue-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          Log New Professional Skill Learned (+40 XP)
                        </button>

                        {/* List of skills */}
                        {skillsList.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1.5">Acquired Skill Bank ({skillsList.length})</span>
                            <div className="flex flex-wrap gap-1.5">
                              {skillsList.map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded-md text-[10px] font-medium text-zinc-400 font-sans"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Creative Ideas Directory */}
                    <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">CREATIVE ASSETS & VIDEO IDEAS (SAVED: {stats.ideas?.length || 0})</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Video/Project concept or design premise..."
                          value={newIdeaTitle}
                          onChange={(e) => setNewIdeaTitle(e.target.value)}
                          className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none placeholder:text-zinc-750"
                        />
                        <button
                          onClick={addVideoIdea}
                          className="bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-semibold cursor-pointer transition-all uppercase font-mono tracking-wider"
                        >
                          Add Idea
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pt-2">
                        {(stats.ideas || []).map((idea: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-zinc-950/60 border border-zinc-850 rounded-xl flex justify-between items-center text-xs">
                            <div className="space-y-0.5 truncate max-w-[80%] font-sans">
                              <span className="font-semibold text-zinc-200 block truncate">{idea.title}</span>
                              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-mono">{idea.category} • {idea.date}</span>
                            </div>
                            <button onClick={() => removeVideoIdea(idx)} className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* === MISSION 3: CLOSER TO ALLAH === */}
              {mission.id === 'faith' && (
                <div className="space-y-6">
                  {/* Daily 5 Salah Toggles */}
                  <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">DAILY WORSHIP & PRAYERS</span>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                      {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => {
                        const checked = localSalah[p as keyof typeof localSalah];
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              playSound('click', soundEnabled);
                              setLocalSalah(prev => ({ ...prev, [p]: !prev[p as keyof typeof prev] }));
                            }}
                            className={`p-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                              checked
                                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-bold'
                                : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            <span className="text-lg mb-1">{p === 'fajr' ? '🌅' : p === 'dhuhr' ? '☀️' : p === 'asr' ? '🌤️' : p === 'maghrib' ? '🌇' : '🌃'}</span>
                            <span className="uppercase text-[9px] font-bold tracking-wider">{p}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quran Reader slider */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">QURAN RECITATION LOGS</span>
                      <div className="flex justify-between items-center font-sans">
                        <span className="text-xs text-zinc-400">Pages Recited Today</span>
                        <span className="font-bold text-yellow-400 text-sm">{localQuranPages} Pages</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={localQuranPages}
                        onChange={(e) => setLocalQuranPages(parseInt(e.target.value))}
                        className="w-full accent-yellow-500 cursor-pointer"
                      />
                    </div>

                    {/* Submit Log Button */}
                    <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">WORSHIP & STUDY ENTRIES</span>
                      <textarea
                        value={newJournalEntry}
                        onChange={(e) => setNewJournalEntry(e.target.value)}
                        placeholder="Write brief spiritual reflection memo..."
                        className="flex-1 min-h-[50px] bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none resize-none font-sans"
                      />
                      <button
                        onClick={submitFaithLog}
                        className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-semibold uppercase transition-colors cursor-pointer"
                      >
                        Log Devotions
                      </button>
                    </div>
                  </div>

                  {/* Tasbih Reciter */}
                  <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-4 text-center relative overflow-hidden">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">TASBIH RECITER</span>
                    
                    <div className="flex justify-center gap-1.5 text-[9px] font-mono flex-wrap">
                      {['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'Astaghfirullah'].map((w) => (
                        <button
                          key={w}
                          onClick={() => setDhikrText(w as any)}
                          className={`px-2 py-1 border rounded-lg transition-colors cursor-pointer ${
                            dhikrText === w
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleDhikrTap}
                        className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-yellow-500/20 hover:border-yellow-500/40 flex flex-col items-center justify-center mx-auto cursor-pointer"
                      >
                        <span className="text-[8px] font-mono text-zinc-500 tracking-wider uppercase font-semibold">TAP BEAD</span>
                        <span className="text-lg font-bold text-yellow-400 font-mono">{mission.stats.dhikrCount || 0}</span>
                        <span className="text-[8px] font-mono text-yellow-500/80 font-bold truncate max-w-[80px] block mt-0.5">{dhikrText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === MISSION 4: STRONG BODY === */}
              {mission.id === 'fitness' && (
                <div className="space-y-6">
                  {/* Calorie / Protein form */}
                  <form onSubmit={submitFitnessWorkout} className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">LOG WORKOUTS & LIFTING REPS</span>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="space-y-1">
                        <label className="text-zinc-500 font-semibold uppercase">PUSHUPS (REPS)</label>
                        <input
                          type="number"
                          value={localPushups}
                          onChange={(e) => setLocalPushups(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none focus:border-zinc-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-500 font-semibold uppercase">PULLUPS (REPS)</label>
                        <input
                          type="number"
                          value={localPullups}
                          onChange={(e) => setLocalPullups(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none focus:border-zinc-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-500 font-semibold uppercase">RUNNING DISTANCE (KM)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={localRunKm}
                          onChange={(e) => setLocalRunKm(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none focus:border-zinc-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-500 font-semibold uppercase">PROTEIN TARGET (G)</label>
                        <input
                          type="number"
                          value={proteinGrams}
                          onChange={(e) => setProteinGrams(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none focus:border-zinc-700"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Log Session Activities
                    </button>
                  </form>

                  {/* Water quick tracker */}
                  <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-1 z-10 font-sans">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">DAILY WATER METRIC</span>
                      <span className="text-base font-bold text-blue-400 block font-mono">{(mission.stats.waterLitres || 0).toFixed(2)} L / 3.00 L</span>
                    </div>
                    
                    <button
                      onClick={logHydration}
                      className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors z-10"
                    >
                      <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
                      DRINK (+250ML)
                    </button>
                  </div>
                </div>
              )}

              {/* === PERSONALIZED DYNAMIC PROTOCOL (For custom / generated missions) === */}
              {!['hsc', 'creator', 'faith', 'fitness'].includes(mission.id) && (
                <div className="space-y-6">
                  {/* Tactical Directive Overview */}
                  <div className="bg-[#111B2D] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-2xl">
                          {mission.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest bg-cyan-950/80 border border-cyan-500/25 px-2 py-0.5 rounded">
                              {mission.goalCategory || 'TACTICAL PROTOCOL'}
                            </span>
                            {mission.priority && (
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/25 px-2 py-0.5 rounded font-bold">
                                PRIORITY #{mission.priority}
                              </span>
                            )}
                          </div>
                          <h2 className="text-base font-bold text-zinc-100 mt-1 font-mono">
                            {mission.name}
                          </h2>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded font-bold">
                        LEVEL {mission.level} • {mission.rank}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {mission.description}
                    </p>

                    {mission.originalGoal && (
                      <div className="p-3 bg-[#101726] border border-cyan-500/15 rounded-xl text-xs font-mono text-zinc-400 flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">PRIMARY DIRECTIVE:</span>
                        <span className="text-zinc-200">"{mission.originalGoal}"</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Session Logger */}
                  <div className="bg-[#111B2D] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                      LOG PROTOCOL EXECUTION BLOCK
                    </span>
                    <p className="text-xs text-zinc-400 font-sans">
                      Complete dedicated work towards this objective to advance mission level and earn tactical telemetry XP.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[30, 45, 60, 90].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => {
                            playSound('click', soundEnabled);
                            const updated = { ...mission };
                            const hours = mins / 60;
                            updated.stats = updated.stats || {};
                            updated.stats.completedSessions = (updated.stats.completedSessions || 0) + 1;
                            updated.stats.hoursInvested = Number(((updated.stats.hoursInvested || 0) + hours).toFixed(2));
                            updated.xp = updated.xp + (mins >= 60 ? 30 : 15);
                            if (updated.xp >= updated.xpNeeded) {
                              updated.level += 1;
                              updated.xp = updated.xp - updated.xpNeeded;
                              updated.xpNeeded = Math.round(updated.xpNeeded * 1.25);
                            }
                            onUpdateMission(updated);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#101726] hover:bg-cyan-950/50 border border-cyan-500/20 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>+{mins} MIN SPRINT</span>
                          <span className="text-[10px] text-zinc-500">({mins >= 60 ? '+30' : '+15'} XP)</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-4 bg-[#111B2D] border border-cyan-500/15 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">SESSIONS</span>
                      <span className="text-lg font-bold text-cyan-400">{mission.stats?.completedSessions || 0}</span>
                    </div>
                    <div className="p-4 bg-[#111B2D] border border-cyan-500/15 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">HOURS INVESTED</span>
                      <span className="text-lg font-bold text-cyan-400">{(mission.stats?.hoursInvested || 0).toFixed(1)}h</span>
                    </div>
                    <div className="p-4 bg-[#111B2D] border border-cyan-500/15 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">PROGRESS</span>
                      <span className="text-lg font-bold text-emerald-400">{Math.round((mission.xp / mission.xpNeeded) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'boss' && (
            <div className="space-y-6">
              {/* Boss arena card */}
              <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-6 text-center relative overflow-hidden space-y-4 shadow-sm">
                <div className="relative z-10 space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 tracking-wider font-semibold uppercase bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                    WEEKLY KEY MILESTONE CHALLENGE
                  </span>
                  <h3 className="text-base font-semibold text-zinc-100 tracking-tight mt-2">
                    {mission.bossBattle.name}
                  </h3>
                </div>

                {/* HP Indicator */}
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-red-400 font-semibold">CHALLENGE HP: {mission.bossBattle.hp} / {mission.bossBattle.maxHp}</span>
                    <span className="text-zinc-500">
                      {mission.bossBattle.completed ? 'STATUS: RESOLVED' : 'STATUS: PENDING'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden p-px flex items-center">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-red-500"
                      style={{ width: `${(mission.bossBattle.hp / mission.bossBattle.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Boss Battle Vulnerability tasks */}
                <div className="space-y-2 text-left relative z-10 bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold mb-1">CHALLENGE VALIDATION REQUIREMENTS</span>
                  
                  {mission.bossBattle.tasks.map((task) => (
                    <div key={task.id} className="flex justify-between items-center text-xs font-mono border-b border-zinc-900/40 py-2 last:border-0">
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                        )}
                        <span className={task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}>
                          {task.text}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-400 shrink-0">{task.current} / {task.target} {task.unit}</span>
                    </div>
                  ))}
                </div>

                {/* Claim rewards button if HP is 0 */}
                {mission.bossBattle.hp === 0 && !mission.bossBattle.completed && (
                  <button
                    onClick={claimBossRewards}
                    className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs uppercase rounded-xl cursor-pointer tracking-wider"
                  >
                    RESOLVE CHALLENGE & CLAIM PROGRESSION
                  </button>
                )}

                {mission.bossBattle.completed ? (
                  <div className="p-3 border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 rounded-xl text-xs font-sans font-semibold flex items-center justify-center gap-2">
                    <Award className="w-4.5 h-4.5 text-emerald-400" />
                    CHALLENGE CONQUERED! REWARDS SYNCED. UNLOCKED TITLE: {mission.bossBattle.rewardTitle}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-zinc-500 text-center">
                    Completing this milestone awards <span className="text-yellow-400 font-semibold">+{mission.bossBattle.rewardCoins} gold coins</span>, and unlocks the exclusive title <span className="text-emerald-400 font-semibold">"{mission.bossBattle.rewardTitle}"</span>.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="space-y-4">
              {/* Weekly objectives */}
              <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">WEEKLY CORE OBJECTIVES</span>
                <div className="space-y-2">
                  {mission.weeklyObjectives.map((obj) => (
                    <div key={obj.id} className="p-3 bg-zinc-950/40 border border-zinc-850/60 rounded-xl flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2.5">
                        {obj.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                        )}
                        <span className={obj.completed ? 'text-zinc-500 line-through' : 'text-zinc-300 font-sans'}>
                          {obj.text}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-400">{obj.current} / {obj.target} {obj.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly objectives */}
              <div className="bg-[#111318]/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">MONTHLY STRATEGIC OBJECTIVES</span>
                <div className="space-y-2">
                  {mission.monthlyObjectives.map((obj) => (
                    <div key={obj.id} className="p-3 bg-[#111318]/40 border border-zinc-850/60 rounded-xl flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2.5">
                        {obj.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                        )}
                        <span className={obj.completed ? 'text-zinc-500 line-through' : 'text-zinc-300 font-sans'}>
                          {obj.text}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-400">{obj.current} / {obj.target} {obj.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
