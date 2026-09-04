import React, { useState, useEffect } from 'react';
import { AppState, Character, LifeCalendarSettings } from './types';
import {
  getInitialState,
  checkInDaily,
  toggleQuestCompletion,
  consumeItem,
  openChest,
  logFitness,
  logLearning,
  logBusiness,
  logFaith,
  getTodayDateString,
  generateDailyQuests,
  defaultMissions
} from './utils/state';
import { playSound } from './utils/sound';

// View Imports
import Dashboard from './components/Dashboard';
import QuestsList from './components/QuestsList';
import StatsView from './components/StatsView';
import InventoryView from './components/InventoryView';
import Trackers from './components/Trackers';
import FocusMode from './components/FocusMode';
import AchievementsView from './components/AchievementsView';
import CalendarHeatmap from './components/CalendarHeatmap';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import CharacterCreator from './components/CharacterCreator';
import LifeCalendar from './components/LifeCalendar';

// Icons for navigation
import {
  Home,
  Compass,
  Activity,
  Box,
  Brain,
  Trophy,
  Calendar,
  CalendarDays,
  BarChart2,
  Settings as SettingsIcon,
  Lock,
  Flame,
  Zap,
  ChevronRight,
  Sparkles,
  Clock
} from 'lucide-react';

export default function App() {
  // Core Local Storage App State
  const [state, setState] = useState<AppState>(() => {
    const local = localStorage.getItem('solo-leveling-state');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && parsed.settings) {
          if (!parsed.questPlanner) {
            parsed.questPlanner = {
              hscCountdownDays: 210,
              hscWeakerSubjects: ['Physics', 'Chemistry', 'Math'],
              gymSchedule: 'push',
              contentSchedule: 'scripting',
              availableTimeHours: 8,
              energyLevel: 'medium',
              worshipStreaks: {
                'Salah': 0,
                'Quran': 0,
                'Adhkar': 0
              },
              missedObligatoryCount: 0,
              procrastinationModeActive: false,
              completedActsToday: []
            };
          }
          if (!parsed.missions || parsed.missions.length === 0) {
            parsed.missions = defaultMissions;
          } else {
            // Check and migrate 'creator' mission to the new 'Creator Economy' specification
            parsed.missions = parsed.missions.map((m: any) => {
              if (m.id === 'creator' && m.name !== 'Creator Economy') {
                return {
                  ...m,
                  name: 'Creator Economy',
                  icon: '💼',
                  description: 'Build valuable skills, create digital assets, participate in freelancing contests, grow your online presence, and eventually earn money.',
                  rank: 'Novice Freelancer',
                  stats: {
                    videosCreated: m.stats?.videosPublished || 0,
                    contestsSubmitted: m.stats?.contestsSubmitted || 0,
                    contestsWon: m.stats?.contestsWon || 0,
                    incomeEarned: m.stats?.incomeEarned || 0,
                    deepWorkHours: m.stats?.deepWorkHours || 0,
                    skillsLearned: m.stats?.skillsLearned || [],
                    ideas: m.stats?.ideas || []
                  },
                  weeklyObjectives: [
                    { id: 'creator_w_contest', text: 'Submit 2 Freelancer Contest Entries', current: 0, target: 2, completed: false, unit: 'Entries' },
                    { id: 'creator_w_video', text: 'Complete 1 YouTube Video Cycle', current: 0, target: 1, completed: false, unit: 'Video' }
                  ],
                  monthlyObjectives: [
                    { id: 'creator_m_contests', text: 'Submit 8 Freelancer Contests', current: 0, target: 8, completed: false, unit: 'Contests' },
                    { id: 'creator_m_videos', text: 'Publish 4 YouTube videos', current: 0, target: 4, completed: false, unit: 'Videos' },
                    { id: 'creator_m_skills', text: 'Learn 4 new professional skills', current: 0, target: 4, completed: false, unit: 'Skills' }
                  ],
                  bossBattle: {
                    name: 'The Freelance & Algorithm Apex',
                    hp: 3,
                    maxHp: 3,
                    completed: false,
                    rewardCoins: 1000,
                    rewardXp: 2000,
                    rewardTitle: 'Apex Creator-Entrepreneur',
                    tasks: [
                      { id: 'creator_b_contest', text: 'Submit 2 Contest Entries and Publish 1 Video', current: 0, target: 1, completed: false, unit: 'Milestone' }
                    ]
                  }
                };
              }
              return m;
            });
          }
          if (!parsed.lifeCalendarSettings) {
            parsed.lifeCalendarSettings = {
              expectedLifespanYears: 60,
              birthDate: '2007-04-17',
              themeColor: 'cyan',
              showStats: true,
              showMotivations: true,
              customMilestones: []
            };
          }
          if (!parsed.lifeReflections) {
            parsed.lifeReflections = {};
          }
          if (!parsed.lifeHistoryArchive) {
            parsed.lifeHistoryArchive = {};
          }
          return parsed;
        }
      } catch (err) {
        console.error('State parse failed, falling back', err);
      }
    }
    return getInitialState();
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinEntry, setPinEntry] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  
  // Custom HUD Overlays
  const [levelUpAlert, setLevelUpAlert] = useState<{ active: boolean; oldLevel: number; newLevel: number } | null>(null);
  const [streakBrokenAlert, setStreakBrokenAlert] = useState<boolean>(false);

  // Sync state changes to local storage
  useEffect(() => {
    localStorage.setItem('solo-leveling-state', JSON.stringify(state));
  }, [state]);

  // Check PIN Lock authentication state on load
  useEffect(() => {
    if (state.settings.pinLock) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [state.settings.pinLock]);

  // Check-in on mount and perform daily roll
  useEffect(() => {
    if (state.character && isAuthenticated) {
      const res = checkInDaily(state);
      if (res.streakBroken) {
        setStreakBrokenAlert(true);
      }
      setState(res.newState);
    }
  }, [isAuthenticated, state.character]);

  // Automatic progress: Check every 30 seconds for date roll (midnight transition)
  useEffect(() => {
    if (!state.character || !isAuthenticated) return;

    const interval = setInterval(() => {
      const today = getTodayDateString();
      setState(current => {
        if (current.character && current.streak.lastActiveDate !== today) {
          const res = checkInDaily(current);
          if (res.streakBroken) {
            setStreakBrokenAlert(true);
          }
          return res.newState;
        }
        return current;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, state.character]);

  // PIN code keypress handling
  const handlePinDigit = (num: string) => {
    playSound('click', state.settings.soundEnabled);
    if (pinEntry.length < 4) {
      const nextPin = pinEntry + num;
      setPinEntry(nextPin);
      setPinError('');

      if (nextPin === state.settings.pinLock) {
        setIsAuthenticated(true);
        playSound('levelUp', state.settings.soundEnabled);
      } else if (nextPin.length === 4) {
        // Incorrect PIN
        setTimeout(() => {
          setPinError('INVALID SECURE HUNTER SIGNATURE');
          setPinEntry('');
          playSound('failure', state.settings.soundEnabled);
        }, 300);
      }
    }
  };

  const handlePinClear = () => {
    setPinEntry('');
    playSound('click', state.settings.soundEnabled);
  };

  // State Updates Wrapper
  const handleAwaken = (char: Character) => {
    setState(prev => {
      const today = getTodayDateString();
      return {
        ...prev,
        character: char,
        quests: generateDailyQuests(today),
        streak: {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          weeklyStreak: 1,
          monthlyStreak: 1
        }
      };
    });
  };

  const handleToggleQuest = (questId: string) => {
    const res = toggleQuestCompletion(state, questId);
    setState(res.newState);
  };

  const handleAddQuest = (
    text: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme',
    category: keyof Character['stats']
  ) => {
    let xpReward = 10;
    let coinReward = 15;
    if (difficulty === 'medium') { xpReward = 25; coinReward = 35; }
    else if (difficulty === 'hard') { xpReward = 50; coinReward = 70; }
    else if (difficulty === 'extreme') { xpReward = 100; coinReward = 150; }

    const newQ = {
      id: `custom_${Date.now()}`,
      text,
      difficulty,
      category,
      completed: false,
      date: getTodayDateString(),
      xpReward,
      coinReward
    };

    setState(prev => ({
      ...prev,
      quests: [newQ, ...prev.quests]
    }));
  };

  const handleRollQuests = () => {
    const today = getTodayDateString();
    setState(prev => ({
      ...prev,
      quests: generateDailyQuests(prev, today)
    }));
  };

  const handleUpdateQuestPlanner = (updates: any) => {
    setState(prev => {
      const updatedPlanner = {
        ...(prev.questPlanner || {
          hscCountdownDays: 210,
          hscWeakerSubjects: ['Physics', 'Chemistry', 'Math'],
          gymSchedule: 'push',
          contentSchedule: 'scripting',
          availableTimeHours: 8,
          energyLevel: 'medium',
          worshipStreaks: {
            'Salah': 0,
            'Quran': 0,
            'Adhkar': 0
          },
          missedObligatoryCount: 0,
          procrastinationModeActive: false,
          completedActsToday: []
        }),
        ...updates
      };
      const today = getTodayDateString();
      const tempState = { ...prev, questPlanner: updatedPlanner };
      const newQuests = generateDailyQuests(tempState, today);
      return {
        ...tempState,
        quests: newQuests
      };
    });
  };

  const handleConsumeItem = (itemId: string) => {
    const res = consumeItem(state, itemId);
    if (res.success) {
      setState(res.newState);
    }
  };

  const handleOpenChest = (chestId: string) => {
    const res = openChest(state, chestId);
    if (res.success) {
      setState(res.newState);
    }
    return res;
  };

  const handleEquipTitle = (title: string) => {
    setState(prev => {
      if (!prev.character) return prev;
      return {
        ...prev,
        character: {
          ...prev.character,
          activeTitle: title
        }
      };
    });
  };

  const handleCompleteFocusSession = (minutes: number, xpEarned: number, coinsEarned: number) => {
    setState(prev => {
      if (!prev.character) return prev;
      
      // 1. Create focus session learning log
      const focusLog = {
        type: 'other' as const,
        title: `⏱️ Focus Timer Session`,
        durationMinutes: minutes,
        progressPercent: 100,
        notes: `Completed a timed focus session (${minutes} minutes) on the focus matrix.`
      };

      // Call logLearning to get updated state (this handles hsc mission, achievements, xp)
      let nextState = logLearning(prev, focusLog);
      
      // 2. Add extra Discipline stats and Coins
      if (nextState.character) {
        const disc = { ...nextState.character.stats.Discipline };
        disc.xp += xpEarned;
        
        let needed = disc.level * 50;
        while (disc.xp >= needed) {
          disc.xp -= needed;
          disc.level += 1;
        }
        nextState.character.stats.Discipline = disc;
        nextState.character.coins += coinsEarned;
      }
      
      return nextState;
    });
  };

  const handleLogFitness = (log: any) => {
    const next = logFitness(state, log);
    setState(next);
  };

  const handleLogLearning = (log: any) => {
    const next = logLearning(state, log);
    setState(next);
  };

  const handleLogBusiness = (log: any) => {
    const next = logBusiness(state, log);
    setState(next);
  };

  const handleLogFaith = (log: any) => {
    const next = logFaith(state, log);
    setState(next);
  };

  const handleResetProgress = () => {
    setState(getInitialState());
    setActiveTab('dashboard');
  };

  const handleImportState = (imported: AppState) => {
    setState(imported);
    setActiveTab('dashboard');
  };

  const handleUpdateSettings = (newSet: Partial<AppState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSet
      }
    }));
  };

  const handleUpdateLifeCalendarSettings = (newSettings: Partial<LifeCalendarSettings>) => {
    setState(prev => {
      const current = prev.lifeCalendarSettings || {
        expectedLifespanYears: 60,
        birthDate: '2007-04-17',
        themeColor: 'cyan',
        showStats: true,
        showMotivations: true,
        customMilestones: []
      };
      return {
        ...prev,
        lifeCalendarSettings: {
          ...current,
          ...newSettings
        }
      };
    });
  };

  // 1. Render Onboarding Screen if no profile awakened
  if (!state.character) {
    return (
      <CharacterCreator
        onAwaken={handleAwaken}
        soundEnabled={state.settings.soundEnabled}
      />
    );
  }

  // 2. Render Security PIN Entry if locked
  if (state.settings.pinLock && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D18] text-zinc-100 flex flex-col justify-center items-center px-4 font-sans relative select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,242,254,0.04),transparent_50%)] pointer-events-none" />

        <div className="relative max-w-sm w-full bg-[#111B2D] border border-cyan-500/15 rounded-[14px] p-8 text-center space-y-6 shadow-[0_0_30px_rgba(0,242,254,0.02)] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#101726] border border-cyan-500/10 flex items-center justify-center mb-1">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500">SYSTEM LOCK</h2>
            <h1 className="text-base font-semibold text-zinc-200 tracking-tight">SECURITY VERIFICATION</h1>
          </div>

          {/* Code slots */}
          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = pinEntry.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-sm transition-all ${
                    hasDigit
                      ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400 scale-105 shadow-[0_0_10px_rgba(0,242,254,0.1)]'
                      : 'border-zinc-800 bg-[#101726] text-zinc-700'
                  }`}
                >
                  {hasDigit ? '●' : ''}
                </div>
              );
            })}
          </div>

          {pinError && <p className="text-red-400 text-xs font-mono tracking-wider animate-shake">{pinError}</p>}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinDigit(digit)}
                className="py-3 bg-[#101726]/80 hover:bg-[#101726] border border-cyan-500/5 hover:border-cyan-500/25 text-sm font-medium rounded-xl cursor-pointer text-zinc-300 transition-all active:scale-95 hover:shadow-[0_0_10px_rgba(0,242,254,0.05)]"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handlePinClear}
              className="py-3 bg-red-950/10 hover:bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-xl cursor-pointer"
            >
              CLEAR
            </button>
            <button
              onClick={() => handlePinDigit('0')}
              className="py-3 bg-[#101726]/80 hover:bg-[#101726] border border-cyan-500/5 hover:border-cyan-500/25 text-sm font-medium rounded-xl cursor-pointer text-zinc-300"
            >
              0
            </button>
            <div className="flex items-center justify-center text-zinc-600 text-[9px] font-mono tracking-wider uppercase">
              SECURE LN
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define tab navigation elements
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'quests', label: 'Daily Quests', icon: Compass },
    { id: 'stats', label: 'Attributes & Stats', icon: Activity },
    { id: 'inventory', label: 'Vault & Armory', icon: Box },
    { id: 'trackers', label: 'Activity Logs', icon: Brain },
    { id: 'focus', label: 'Focus Timer', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'life-calendar', label: 'Life Calendar', icon: Calendar },
    { id: 'calendar', label: 'Consistency Map', icon: CalendarDays },
    { id: 'analytics', label: 'Performance Insights', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className={`min-h-screen bg-[#090D18] text-zinc-100 font-sans relative flex flex-col md:flex-row select-none theme-${state.settings.themeMode}`}>
      {/* Premium subtle background lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.01] rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-[#101726] border-r border-cyan-500/10 p-5 shrink-0 z-20">
        <div className="mb-6 flex items-center justify-between border-b border-cyan-500/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#111B2D] border border-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-bold tracking-[0.08em] uppercase text-zinc-100 font-mono">
              LifeOS Console
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">v1.4</span>
        </div>

        {/* Profile Card & Stats HUD */}
        <div className="mb-6 p-4 bg-[#111B2D]/60 border border-cyan-500/10 rounded-[14px] space-y-2.5 shadow-[0_0_15px_rgba(0,242,254,0.02)]">
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
            <span>OPERATOR RATING</span>
            <span className="text-cyan-400 font-medium tracking-wide uppercase">{state.character.rank.split(' ')[0]}</span>
          </div>
          <h4 className="text-xs font-bold text-zinc-200 truncate tracking-tight">{state.character.name}</h4>
          <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono border-t border-cyan-500/5 pt-2">
            <span>LVL {state.character.level}</span>
            <span className="text-zinc-600">•</span>
            <span>{state.character.coins} Coins</span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  playSound('click', state.settings.soundEnabled);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-semibold shadow-[0_0_12px_rgba(0,242,254,0.04)]'
                    : 'bg-transparent border border-transparent text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Mobile Floating header Bar */}
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-[#101726] border-b border-cyan-500/10 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-[0.1em] uppercase font-mono text-zinc-200">LifeOS</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-zinc-300 font-medium">{state.character.coins} Coins</span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400 font-medium">LVL {state.character.level}</span>
        </div>
      </header>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto pb-24 md:pb-8 relative z-10">
        {activeTab === 'dashboard' && (
          <Dashboard
            character={state.character}
            quests={state.quests}
            streak={state.streak}
            achievements={state.achievements}
            inventory={state.inventory}
            missions={state.missions || []}
            onConsumeItem={handleConsumeItem}
            onNavigate={setActiveTab}
            soundEnabled={state.settings.soundEnabled}
            onUpdateState={(fields) => setState(prev => ({ ...prev, ...fields }))}
            onLogLearning={handleLogLearning}
            onLogBusiness={handleLogBusiness}
            onLogFaith={handleLogFaith}
            onLogFitness={handleLogFitness}
            learningLogs={state.learningLogs}
          />
        )}

        {activeTab === 'quests' && (
          <QuestsList
            quests={state.quests}
            bossBattle={state.bossBattle}
            character={state.character}
            onToggleQuest={handleToggleQuest}
            onAddQuest={handleAddQuest}
            onRollQuests={handleRollQuests}
            soundEnabled={state.settings.soundEnabled}
            questPlanner={state.questPlanner}
            onUpdateQuestPlanner={handleUpdateQuestPlanner}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            character={state.character}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            inventory={state.inventory}
            character={state.character}
            onConsumeItem={handleConsumeItem}
            onOpenChest={handleOpenChest}
            onEquipTitle={handleEquipTitle}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'trackers' && (
          <Trackers
            onLogFitness={handleLogFitness}
            onLogLearning={handleLogLearning}
            onLogBusiness={handleLogBusiness}
            onLogFaith={handleLogFaith}
            fitnessLogs={state.fitnessLogs}
            learningLogs={state.learningLogs}
            businessLogs={state.businessLogs}
            faithLogs={state.faithLogs}
            character={state.character}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'focus' && (
          <FocusMode
            onCompleteSession={handleCompleteFocusSession}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            achievements={state.achievements}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'life-calendar' && (
          <LifeCalendar
            state={state}
            onUpdateState={setState}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarHeatmap
            xpHistory={state.xpHistory}
            currentStreak={state.streak.currentStreak}
            longestStreak={state.streak.longestStreak}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            character={state.character}
            xpHistory={state.xpHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={state.settings}
            character={state.character}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onImportState={handleImportState}
            fullState={state}
            soundEnabled={state.settings.soundEnabled}
            onUpdateLifeCalendarSettings={handleUpdateLifeCalendarSettings}
          />
        )}
      </main>

      {/* 4. Mobile Bottom Navigation Drawer */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#101726] border-t border-cyan-500/10 flex justify-around py-2.5 z-20 overflow-x-auto gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                playSound('click', state.settings.soundEnabled);
              }}
              className={`flex flex-col items-center justify-center cursor-pointer transition-colors text-zinc-500 hover:text-zinc-300 min-w-[70px] shrink-0 pb-1 ${
                isActive ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[9px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* LEVEL UP OVERLAY DIALOG */}
      {levelUpAlert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-sm w-full bg-[#111B2D] border border-cyan-500/20 p-8 rounded-[14px] text-center space-y-6 shadow-[0_0_30px_rgba(0,242,254,0.04)] animate-scaleUp">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-1">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-[10px] font-mono tracking-[0.15em] text-cyan-400 uppercase font-semibold">WORKSPACE UPGRADE</h2>
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">
                SYSTEM CALIBRATION COMPLETE
              </h1>
            </div>

            <div className="flex justify-center items-center gap-6 py-4 border-y border-cyan-500/10">
              <div className="text-center">
                <span className="text-[9px] text-zinc-500 block font-mono uppercase tracking-wider">PREVIOUS</span>
                <span className="text-lg font-medium text-zinc-400">{levelUpAlert.oldLevel}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-500" />
              <div className="text-center">
                <span className="text-[9px] text-cyan-400 block font-mono uppercase tracking-wider">CURRENT</span>
                <span className="text-xl font-bold text-cyan-400">{levelUpAlert.newLevel}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Your overall attribute progression has been cataloged. Health and energy limits have been fully replenished. Keep maintaining your daily routines.
            </p>

            <button
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,242,254,0.1)]"
            >
              Continue Console
            </button>
          </div>
        </div>
      )}

      {/* STREAK BROKEN DIALOG OVERLAY */}
      {streakBrokenAlert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-sm w-full bg-[#111B2D] border border-red-500/20 p-8 rounded-[14px] text-center space-y-5 shadow-[0_0_30px_rgba(239,68,68,0.04)]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-1">
                <Flame className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-[10px] font-mono tracking-[0.15em] text-red-400 uppercase font-semibold">STREAK RESET</h2>
              <h1 className="text-base font-bold text-zinc-100">ROUTINE DEGRADED</h1>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              You did not complete your check-in series yesterday. Your multiplier has reverted back to zero. Refocus and establish consistency today.
            </p>

            <button
              onClick={() => setStreakBrokenAlert(false)}
              className="w-full py-2.5 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-100 font-bold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider"
            >
              Restart Sequence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
