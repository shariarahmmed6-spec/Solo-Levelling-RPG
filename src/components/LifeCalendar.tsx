import React, { useState, useMemo } from 'react';
import { AppState, DailyLifeArchive, LifeCalendarSettings } from '../types';
import { playSound } from '../utils/sound';
import { getTodayDateString } from '../utils/state';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Save,
  Plus,
  Trash2,
  Zap,
  Trophy,
  Shield,
  Activity,
  Flame,
  BookOpen,
  Compass,
  Coins,
  Sparkles,
  Lock,
  Download,
  Upload,
  Info
} from 'lucide-react';

interface LifeCalendarProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export default function LifeCalendar({ state, onUpdateState }: LifeCalendarProps) {
  const soundEnabled = state.settings.soundEnabled;

  // Settings
  const settings: LifeCalendarSettings = useMemo(() => {
    return state.lifeCalendarSettings || {
      expectedLifespanYears: 60,
      birthDate: '2007-04-17',
      themeColor: 'cyan',
      showStats: true,
      showMotivations: true,
      customMilestones: []
    };
  }, [state.lifeCalendarSettings]);

  // View settings
  const [zoomLevel, setZoomLevel] = useState<'daily' | 'monthly' | 'yearly' | 'lifetime'>('daily');
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    // Default to current year of age
    const dob = new Date(settings.birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(0, age);
  });

  // Selected cell for detailed historical popover/modal
  const [selectedDateArchive, setSelectedDateArchive] = useState<string | null>(null);

  // New custom milestone form
  const [milestoneAge, setMilestoneAge] = useState<string>('');
  const [milestoneLabel, setMilestoneLabel] = useState<string>('');
  const [milestoneError, setMilestoneError] = useState<string>('');

  // Daily reflection editor state
  const todayStr = getTodayDateString();
  const [todayReflection, setTodayReflection] = useState<string>(() => {
    return state.lifeReflections?.[todayStr] || '';
  });
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  // MOTIVATIONAL QUOTES
  const quotes = [
    "Time is your most limited resource.",
    "You cannot earn back a day once it has passed.",
    "The best time to plant a tree was 20 years ago. The second best time is today.",
    "Every day is a small lifetime: every morning is a small youth.",
    "Do not count the days, make the days count.",
    "Your time is limited, so do not waste it.",
    "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    "A year from now you may wish you had started today."
  ];

  const currentQuote = useMemo(() => {
    // Stable random quote based on the day of the year
    const d = new Date();
    const index = (d.getFullYear() + d.getMonth() * 31 + d.getDate()) % quotes.length;
    return quotes[index];
  }, []);

  // DATE CALCULATIONS
  const birthDateObj = useMemo(() => new Date(settings.birthDate), [settings.birthDate]);
  const todayObj = useMemo(() => new Date(), []);

  const {
    currentAge,
    daysLived,
    totalDays,
    daysRemaining,
    weeksRemaining,
    monthsRemaining,
    yearsRemaining,
    pctUsed,
    pctRemaining,
    expectedEndDateStr
  } = useMemo(() => {
    const dob = birthDateObj;
    const lifespan = settings.expectedLifespanYears;
    
    // Total days in lifespan
    const endDate = new Date(dob);
    endDate.setFullYear(dob.getFullYear() + lifespan);
    
    const diffLifespanTime = endDate.getTime() - dob.getTime();
    const totalDays = Math.ceil(diffLifespanTime / (1000 * 60 * 60 * 24));

    // Days lived
    const diffLivedTime = todayObj.getTime() - dob.getTime();
    const daysLived = Math.max(0, Math.ceil(diffLivedTime / (1000 * 60 * 60 * 24)));

    // Days remaining
    const daysRemaining = Math.max(0, totalDays - daysLived);

    // Current age in years
    let age = todayObj.getFullYear() - dob.getFullYear();
    const m = todayObj.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && todayObj.getDate() < dob.getDate())) {
      age--;
    }
    const currentAge = Math.max(0, age);

    // Weeks, Months, Years remaining
    const weeksRemaining = Math.ceil(daysRemaining / 7);
    const monthsRemaining = Math.max(0, lifespan * 12 - (todayObj.getFullYear() - dob.getFullYear()) * 12 - (todayObj.getMonth() - dob.getMonth()));
    const yearsRemaining = Math.max(0, lifespan - currentAge);

    // Percentages
    const pctUsed = Number(((daysLived / totalDays) * 100).toFixed(2));
    const pctRemaining = Number((100 - pctUsed).toFixed(2));

    // Formatted expected end date
    const expectedEndDateStr = endDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      currentAge,
      daysLived,
      totalDays,
      daysRemaining,
      weeksRemaining,
      monthsRemaining,
      yearsRemaining,
      pctUsed,
      pctRemaining,
      expectedEndDateStr
    };
  }, [birthDateObj, todayObj, settings.expectedLifespanYears]);

  // MILESTONES
  const defaultMilestones = [
    { age: 18, label: 'Adulthood / Civic Responsibility' },
    { age: 20, label: 'Entering Twenties' },
    { age: 25, label: 'Quarter-life Calibrations' },
    { age: 30, label: 'Peak Cognitive Window' },
    { age: 40, label: 'Mid-career Authority' },
    { age: 50, label: 'Sovereign Wisdom' },
    { age: 60, label: 'Master Architect Horizon' }
  ];

  const milestonesMap = useMemo(() => {
    const map: { [age: number]: string } = {};
    // Add defaults
    defaultMilestones.forEach(m => {
      map[m.age] = m.label;
    });
    // Add customs
    if (settings.customMilestones) {
      settings.customMilestones.forEach(m => {
        map[m.ageYears] = m.label;
      });
    }
    return map;
  }, [settings.customMilestones]);

  // Color classes map based on setting
  const themeColors = {
    cyan: {
      past: 'bg-cyan-950/40 border-cyan-500/20 text-cyan-400',
      today: 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-[0_0_15px_rgba(0,242,254,0.6)] animate-pulse',
      future: 'bg-zinc-950 border-zinc-800 text-zinc-600',
      activeBorder: 'border-cyan-500/30',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/5',
      accentGlow: 'shadow-[0_0_10px_rgba(0,242,254,0.1)]',
      pastCircle: 'bg-cyan-950/40 border-cyan-500/10'
    },
    emerald: {
      past: 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400',
      today: 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse',
      future: 'bg-zinc-950 border-zinc-800 text-zinc-600',
      activeBorder: 'border-emerald-500/30',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/5',
      accentGlow: 'shadow-[0_0_10px_rgba(16,185,129,0.1)]',
      pastCircle: 'bg-emerald-950/40 border-emerald-500/10'
    },
    amber: {
      past: 'bg-amber-950/40 border-amber-500/20 text-amber-400',
      today: 'bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse',
      future: 'bg-zinc-950 border-zinc-800 text-zinc-600',
      activeBorder: 'border-amber-500/30',
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500/5',
      accentGlow: 'shadow-[0_0_10px_rgba(245,158,11,0.1)]',
      pastCircle: 'bg-amber-950/40 border-amber-500/10'
    },
    blue: {
      past: 'bg-blue-950/40 border-blue-500/20 text-blue-400',
      today: 'bg-blue-500 border-blue-400 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse',
      future: 'bg-zinc-950 border-zinc-800 text-zinc-600',
      activeBorder: 'border-blue-500/30',
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-500/5',
      accentGlow: 'shadow-[0_0_10px_rgba(59,130,246,0.1)]',
      pastCircle: 'bg-blue-950/40 border-blue-500/10'
    },
    rose: {
      past: 'bg-rose-950/40 border-rose-500/20 text-rose-400',
      today: 'bg-rose-500 border-rose-400 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse',
      future: 'bg-zinc-950 border-zinc-800 text-zinc-600',
      activeBorder: 'border-rose-500/30',
      accentText: 'text-rose-400',
      accentBg: 'bg-rose-500/5',
      accentGlow: 'shadow-[0_0_10px_rgba(244,63,94,0.1)]',
      pastCircle: 'bg-rose-950/40 border-rose-500/10'
    }
  };

  const activeColor = themeColors[settings.themeColor] || themeColors.cyan;

  // Reflection saving
  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click', soundEnabled);

    const updatedReflections = {
      ...(state.lifeReflections || {}),
      [todayStr]: todayReflection
    };

    // Update in archive too if it exists for today (unlikely to have rollover already but good for safety)
    const updatedArchive = { ...(state.lifeHistoryArchive || {}) };
    if (updatedArchive[todayStr]) {
      updatedArchive[todayStr].reflection = todayReflection;
    }

    onUpdateState({
      ...state,
      lifeReflections: updatedReflections,
      lifeHistoryArchive: updatedArchive
    });

    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2000);
  };

  // Milestone saving
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    setMilestoneError('');

    const age = parseInt(milestoneAge);
    if (isNaN(age) || age <= 0 || age > settings.expectedLifespanYears) {
      setMilestoneError(`Enter a valid age between 1 and ${settings.expectedLifespanYears}.`);
      playSound('failure', soundEnabled);
      return;
    }

    if (!milestoneLabel.trim()) {
      setMilestoneError('Enter a description for the milestone.');
      playSound('failure', soundEnabled);
      return;
    }

    const newMilestone = {
      id: `milestone_${Date.now()}`,
      ageYears: age,
      label: milestoneLabel.trim()
    };

    const updatedCustom = [...(settings.customMilestones || []), newMilestone].sort((a, b) => a.ageYears - b.ageYears);

    onUpdateState({
      ...state,
      lifeCalendarSettings: {
        ...settings,
        customMilestones: updatedCustom
      }
    });

    setMilestoneAge('');
    setMilestoneLabel('');
    playSound('levelUp', soundEnabled);
  };

  const handleDeleteMilestone = (id: string) => {
    playSound('click', soundEnabled);
    const updatedCustom = (settings.customMilestones || []).filter(m => m.id !== id);
    onUpdateState({
      ...state,
      lifeCalendarSettings: {
        ...settings,
        customMilestones: updatedCustom
      }
    });
  };

  // RENDERING HELPERS FOR ZOOM LEVELS

  // 1. DAILY DETAIL VIEW (shows 365 days of a selected Year of age)
  const renderDailyDetailView = () => {
    const startYear = birthDateObj.getFullYear() + selectedYear;
    
    // Construct days for this specific year of age
    const days: { dateStr: string; label: string; state: 'past' | 'today' | 'future'; dateObj: Date }[] = [];
    const birthYear = birthDateObj.getFullYear();
    const dobMonth = birthDateObj.getMonth();
    const dobDate = birthDateObj.getDate();

    // Start date of this year of age
    const yearStart = new Date(birthYear + selectedYear, dobMonth, dobDate);
    // End date of this year of age
    const yearEnd = new Date(birthYear + selectedYear + 1, dobMonth, dobDate);

    let cur = new Date(yearStart);
    while (cur < yearEnd) {
      const year = cur.getFullYear();
      const month = String(cur.getMonth() + 1).padStart(2, '0');
      const date = String(cur.getDate()).padStart(2, '0');
      const curDateStr = `${year}-${month}-${date}`;

      let dayState: 'past' | 'today' | 'future' = 'past';
      
      const compareCur = new Date(year, cur.getMonth(), cur.getDate()).getTime();
      const compareToday = new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate()).getTime();

      if (compareCur === compareToday) {
        dayState = 'today';
      } else if (compareCur > compareToday) {
        dayState = 'future';
      }

      days.push({
        dateStr: curDateStr,
        label: cur.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        state: dayState,
        dateObj: new Date(cur)
      });

      cur.setDate(cur.getDate() + 1);
    }

    // Group days by month name
    const monthsGroup: { [monthName: string]: typeof days } = {};
    days.forEach(d => {
      const mName = d.dateObj.toLocaleDateString('en-US', { month: 'long' });
      if (!monthsGroup[mName]) monthsGroup[mName] = [];
      monthsGroup[mName].push(d);
    });

    const isCurrentYear = selectedYear === currentAge;

    return (
      <div className="space-y-6">
        {/* Year Navigator */}
        <div className="flex items-center justify-between bg-[#101726]/80 p-3 rounded-xl border border-cyan-500/5">
          <button
            disabled={selectedYear === 0}
            onClick={() => {
              setSelectedYear(prev => prev - 1);
              playSound('click', soundEnabled);
            }}
            className="p-2 bg-[#111B2D] border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-400 hover:text-zinc-100 rounded-lg cursor-pointer disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-bold">ACTIVE TIME SLICE</span>
            <span className="text-xs font-bold font-mono text-zinc-100 uppercase">
              YEAR {selectedYear + 1} <span className="text-zinc-600">|</span> AGE {selectedYear} <span className="text-zinc-600">|</span> {startYear} - {startYear + 1}
              {isCurrentYear && <span className="ml-2 text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-bold">CURRENT</span>}
            </span>
          </div>

          <button
            disabled={selectedYear >= settings.expectedLifespanYears - 1}
            onClick={() => {
              setSelectedYear(prev => prev + 1);
              playSound('click', soundEnabled);
            }}
            className="p-2 bg-[#111B2D] border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-400 hover:text-zinc-100 rounded-lg cursor-pointer disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone info overlay for this year */}
        {milestonesMap[selectedYear] && (
          <div className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-xl">
            <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <span className="font-mono text-[9px] text-zinc-500 uppercase block font-bold">MILESTONE MARKER ACHIEVED</span>
              <span className="font-mono text-zinc-200 font-bold uppercase">{selectedYear} YEARS: {milestonesMap[selectedYear]}</span>
            </div>
          </div>
        )}

        {/* Dense Grid of Months */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(monthsGroup).map(([mName, mDays]) => {
            return (
              <div key={mName} className="bg-[#111B2D]/40 border border-cyan-500/5 rounded-xl p-3 space-y-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold tracking-wider border-b border-cyan-500/5 pb-1">{mName}</span>
                <div className="grid grid-cols-7 gap-1">
                  {mDays.map(d => {
                    const hasArchive = state.lifeHistoryArchive?.[d.dateStr];
                    const hasReflection = state.lifeReflections?.[d.dateStr];
                    const isToday = d.state === 'today';
                    const cellColor = d.state === 'today'
                      ? activeColor.today
                      : d.state === 'past'
                        ? activeColor.past
                        : activeColor.future;

                    return (
                      <div
                        key={d.dateStr}
                        onClick={() => {
                          if (d.state === 'past' || isToday) {
                            setSelectedDateArchive(d.dateStr);
                            playSound('click', soundEnabled);
                          }
                        }}
                        className={`aspect-square rounded-sm border flex items-center justify-center cursor-pointer transition-all hover:scale-110 relative group ${cellColor}`}
                        title={`${d.label} (${d.dateStr})`}
                      >
                        {/* Dot indicator inside if it has a historical record or reflection */}
                        {(hasArchive || hasReflection) && d.state === 'past' && (
                          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-zinc-950 border border-zinc-800 text-[10px] font-mono py-1 px-2 rounded whitespace-nowrap text-zinc-200 shadow-xl">
                          {d.label} {isToday ? '(Today)' : ''}
                          {(hasArchive || hasReflection) && " • Logged"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. MONTHLY VIEW (shows all months in expected lifetime: e.g. 60 x 12 = 720 squares)
  const renderMonthlyView = () => {
    const totalMonths = settings.expectedLifespanYears * 12;
    const months: { ageYears: number; monthIndex: number; state: 'past' | 'today' | 'future'; dateStr: string }[] = [];

    // Today month offsets
    const monthsLivedTotal = (todayObj.getFullYear() - birthDateObj.getFullYear()) * 12 + (todayObj.getMonth() - birthDateObj.getMonth());

    for (let i = 0; i < totalMonths; i++) {
      const ageYears = Math.floor(i / 12);
      const monthIndex = i % 12;

      // Approximate date string for this month
      const targetDate = new Date(birthDateObj);
      targetDate.setMonth(birthDateObj.getMonth() + i);
      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dateStr = `${y}-${m}-01`;

      let mState: 'past' | 'today' | 'future' = 'past';
      if (i === monthsLivedTotal) {
        mState = 'today';
      } else if (i > monthsLivedTotal) {
        mState = 'future';
      }

      months.push({
        ageYears,
        monthIndex,
        state: mState,
        dateStr
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase">
          <span>BIRTH (AGE 0)</span>
          <span>MONTHLY MATRIX ({totalMonths} TOTAL MONTHS)</span>
          <span>END (AGE {settings.expectedLifespanYears})</span>
        </div>

        <div className="grid grid-cols-12 gap-1.5 p-4 bg-[#111B2D]/40 border border-cyan-500/5 rounded-xl">
          {months.map((m, idx) => {
            const isMilestoneYear = milestonesMap[m.ageYears] && m.monthIndex === 0;
            const isToday = m.state === 'today';
            const cellColor = m.state === 'today'
              ? activeColor.today
              : m.state === 'past'
                ? activeColor.past
                : activeColor.future;

            return (
              <div
                key={idx}
                className={`aspect-square rounded border flex items-center justify-center transition-all cursor-pointer relative group ${cellColor} ${isMilestoneYear && m.state !== 'today' ? 'border-amber-500/60 shadow-[0_0_5px_rgba(245,158,11,0.2)]' : ''}`}
                onClick={() => {
                  setSelectedYear(m.ageYears);
                  setZoomLevel('daily');
                  playSound('click', soundEnabled);
                }}
              >
                {isMilestoneYear && m.state !== 'today' && (
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-zinc-950 border border-zinc-800 text-[9px] font-mono py-1 px-2 rounded whitespace-nowrap text-zinc-200">
                  Age {m.ageYears} Y, Mo {m.monthIndex + 1} {isToday ? '(Current)' : ''}
                  {milestonesMap[m.ageYears] && m.monthIndex === 0 && ` • Milestone: ${milestonesMap[m.ageYears]}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. YEARLY VIEW (shows all expected years: e.g. 60 squares)
  const renderYearlyView = () => {
    const totalYears = settings.expectedLifespanYears;
    const years: { ageYears: number; state: 'past' | 'today' | 'future' }[] = [];

    for (let i = 0; i < totalYears; i++) {
      let yState: 'past' | 'today' | 'future' = 'past';
      if (i === currentAge) {
        yState = 'today';
      } else if (i > currentAge) {
        yState = 'future';
      }

      years.push({
        ageYears: i,
        state: yState
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase">
          <span>SECURE ERA INCEPTION</span>
          <span>YEARLY MILESTONE CELLS</span>
          <span>MISSION END HORIZON</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 p-4 bg-[#111B2D]/40 border border-cyan-500/5 rounded-xl">
          {years.map((y) => {
            const hasMilestone = !!milestonesMap[y.ageYears];
            const isToday = y.state === 'today';
            const cellColor = y.state === 'today'
              ? activeColor.today
              : y.state === 'past'
                ? activeColor.past
                : activeColor.future;

            return (
              <div
                key={y.ageYears}
                onClick={() => {
                  setSelectedYear(y.ageYears);
                  setZoomLevel('daily');
                  playSound('click', soundEnabled);
                }}
                className={`flex flex-col justify-between p-3.5 h-20 rounded-xl border cursor-pointer transition-all relative group overflow-hidden ${cellColor} ${hasMilestone && y.state !== 'today' ? 'border-amber-500/40 bg-amber-500/5' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold">YR {y.ageYears + 1}</span>
                  {hasMilestone && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-right mt-auto">
                  {isToday ? 'ACTIVE' : y.state === 'past' ? 'PAST' : 'FUTURE'}
                </span>

                {/* Tooltip with milestone description */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-zinc-950 border border-zinc-800 text-[10px] font-mono py-1 px-2 rounded whitespace-nowrap text-zinc-200 shadow-2xl">
                  Age {y.ageYears} ({birthDateObj.getFullYear() + y.ageYears})
                  {milestonesMap[y.ageYears] && ` • ${milestonesMap[y.ageYears]}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. LIFETIME VIEW - COMPACT (Weeks representation: 52 columns x Expected Lifespan Years)
  const renderLifetimeView = () => {
    const totalYears = settings.expectedLifespanYears;
    const totalWeeks = totalYears * 52;
    const weeks: { ageYears: number; weekIndex: number; state: 'past' | 'today' | 'future' }[] = [];

    // Calculate how many weeks lived total
    const diffTime = todayObj.getTime() - birthDateObj.getTime();
    const weeksLivedTotal = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));

    for (let i = 0; i < totalWeeks; i++) {
      const ageYears = Math.floor(i / 52);
      const weekIndex = i % 52;

      let wState: 'past' | 'today' | 'future' = 'past';
      if (i === weeksLivedTotal) {
        wState = 'today';
      } else if (i > weeksLivedTotal) {
        wState = 'future';
      }

      weeks.push({
        ageYears,
        weekIndex,
        state: wState
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase">
          <span>SECURE INCEPTION (WEEK 1)</span>
          <span>LIFETIME DENSE TIMELINE (WEEKS)</span>
          <span>TACTICAL END HORIZON (WEEK {totalWeeks})</span>
        </div>

        {/* Dense scrollable Weeks Matrix */}
        <div className="overflow-x-auto p-4 bg-[#111B2D]/40 border border-cyan-500/5 rounded-xl">
          <div className="min-w-[650px] space-y-1">
            {/* Week indices header */}
            <div className="flex justify-between text-[8px] font-mono text-zinc-600 mb-1 px-1">
              <span>W 1</span>
              <span>W 10</span>
              <span>W 20</span>
              <span>W 30</span>
              <span>W 40</span>
              <span>W 52</span>
            </div>

            {Array.from({ length: totalYears }).map((_, yIdx) => {
              const yearMilestone = milestonesMap[yIdx];
              return (
                <div key={yIdx} className="flex items-center gap-2">
                  {/* Row Age Label */}
                  <span className="w-10 text-[8px] font-mono text-zinc-500 select-none text-right uppercase">AGE {yIdx}</span>

                  {/* 52 Week Cells */}
                  <div className="flex-1 grid grid-cols-52 gap-0.5">
                    {Array.from({ length: 52 }).map((_, wIdx) => {
                      const absoluteWeekIdx = yIdx * 52 + wIdx;
                      const w = weeks[absoluteWeekIdx];
                      if (!w) return null;

                      const isToday = w.state === 'today';
                      const cellColor = w.state === 'today'
                        ? activeColor.today
                        : w.state === 'past'
                          ? activeColor.past
                          : activeColor.future;

                      return (
                        <div
                          key={wIdx}
                          onClick={() => {
                            setSelectedYear(yIdx);
                            setZoomLevel('daily');
                            playSound('click', soundEnabled);
                          }}
                          className={`aspect-square rounded-[1px] border-[0.5px] transition-all cursor-pointer relative group ${cellColor} ${yearMilestone && wIdx === 0 ? 'border-amber-500' : ''}`}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-zinc-950 border border-zinc-800 text-[8px] font-mono py-1 px-2 rounded whitespace-nowrap text-zinc-200">
                            Age {yIdx} Y, Wk {wIdx + 1} {isToday ? '(Current)' : ''}
                            {yearMilestone && wIdx === 0 && ` • Milestone: ${yearMilestone}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // RETRIEVE HISTORIC LOG MODAL
  const renderHistoryModal = () => {
    if (!selectedDateArchive) return null;

    const archive: DailyLifeArchive | undefined = state.lifeHistoryArchive?.[selectedDateArchive];
    const reflection = state.lifeReflections?.[selectedDateArchive] || archive?.reflection;
    const formattedDate = new Date(selectedDateArchive).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="w-full max-w-2xl bg-[#111B2D] border border-cyan-500/20 rounded-[14px] shadow-2xl p-6 relative overflow-hidden">
          {/* Neon header */}
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-100">
                CLASSIFIED TIMELINE RECORD
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedDateArchive(null);
                playSound('click', soundEnabled);
              }}
              className="text-zinc-500 hover:text-zinc-100 text-xs font-mono uppercase cursor-pointer hover:underline"
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Meta info block */}
            <div className="grid grid-cols-2 gap-4 bg-[#101726]/60 p-4 border border-cyan-500/5 rounded-xl font-mono text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500 text-[9px] block uppercase font-bold">LOG TIMESTAMP</span>
                <span className="text-cyan-400 font-bold">{formattedDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] block uppercase font-bold">SECTOR IDENTITY</span>
                <span className="text-zinc-100 font-bold uppercase">{selectedDateArchive}</span>
              </div>
            </div>

            {/* Archive Content */}
            {archive ? (
              <div className="space-y-4">
                {/* Daily reflection */}
                {reflection && (
                  <div className="bg-[#101726]/40 p-4 border-l-2 border-cyan-500 rounded-r-xl">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">PRACTITIONER REFLECTION</span>
                    <p className="text-zinc-200 text-xs italic leading-relaxed font-sans">
                      "{reflection}"
                    </p>
                  </div>
                )}

                {/* Quests */}
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-2">COMPLETED QUESTS</span>
                  {archive.completedQuests.length > 0 ? (
                    <div className="space-y-1.5">
                      {archive.completedQuests.map((q, qIdx) => (
                        <div key={qIdx} className="flex justify-between items-center bg-[#101726]/40 border border-cyan-500/5 px-3 py-2 rounded-lg text-xs font-mono text-zinc-300">
                          <span className="truncate">{q.text}</span>
                          <span className="text-cyan-400 shrink-0 ml-2 font-bold uppercase">+{q.xpReward} XP</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500 italic font-mono block">No custom quests completed in this sector.</span>
                  )}
                </div>

                {/* Tracker stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fitness & Prayers */}
                  <div className="bg-[#101726]/30 border border-cyan-500/5 p-4 rounded-xl space-y-3">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" /> FITNESS DRILLS
                      </span>
                      {archive.workout ? (
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                          <div>PUSHUPS: <span className="text-zinc-100 font-bold">{archive.workout.pushups}</span></div>
                          <div>PULLUPS: <span className="text-zinc-100 font-bold">{archive.workout.pullups}</span></div>
                          <div>SQUATS: <span className="text-zinc-100 font-bold">{archive.workout.squats}</span></div>
                          <div>RUN DIST: <span className="text-zinc-100 font-bold">{archive.workout.runKm} KM</span></div>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">No exercise modules logged.</span>
                      )}
                    </div>

                    <div className="border-t border-cyan-500/5 pt-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-cyan-400" /> FAITH ALIGNMENT
                      </span>
                      {archive.prayerCompleted ? (
                        <div className="flex gap-1.5 flex-wrap">
                          {Object.entries(archive.prayerCompleted).map(([name, completed]) => (
                            <span
                              key={name}
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${
                                completed
                                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                              }`}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">No faith telemetry logged.</span>
                      )}
                    </div>
                  </div>

                  {/* Study & Milestones */}
                  <div className="bg-[#101726]/30 border border-cyan-500/5 p-4 rounded-xl space-y-3">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> COGNITIVE DEPTH
                      </span>
                      <div className="text-xs font-mono text-zinc-400 space-y-1">
                        <div>STUDY TIMELINE: <span className="text-zinc-100 font-bold">{archive.studyHours} HOURS</span></div>
                        <div>CUMULATIVE EARNED: <span className="text-cyan-400 font-bold">+{archive.xpEarned} XP</span></div>
                      </div>
                    </div>

                    <div className="border-t border-cyan-500/5 pt-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1.5 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM MILESTONES
                      </span>
                      {archive.achievementsUnlocked && archive.achievementsUnlocked.length > 0 ? (
                        <div className="space-y-1">
                          {archive.achievementsUnlocked.map((name, aIdx) => (
                            <div key={aIdx} className="text-xs font-mono text-amber-500 flex items-center gap-1">
                              • {name} UNLOCKED
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">No achievements unlocked in this sector.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* No archive recorded but there is reflection saved manually */}
                {reflection ? (
                  <div className="bg-[#101726]/40 p-4 border-l-2 border-cyan-500 rounded-r-xl">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">PRACTITIONER REFLECTION</span>
                    <p className="text-zinc-200 text-xs italic leading-relaxed font-sans">
                      "{reflection}"
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs font-mono text-zinc-500 uppercase">
                    No timeline archive recorded for this sector. Complete quests, workouts, study hours, or write reflections to log historic entries.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* HUD HEADER BANNER */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative z-10">
          <div>
            <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              LIFETIME DEEP HORIZON
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal max-w-xl">
              A chronological mapping of your expected lifespan. Remember: time is a finite resource. Align every day with mission intent and build persistent historic achievements.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {/* ZOOM TOGGLE RAIL */}
            {(['daily', 'monthly', 'yearly', 'lifetime'] as const).map((view) => (
              <button
                key={view}
                onClick={() => {
                  setZoomLevel(view);
                  playSound('click', soundEnabled);
                }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  zoomLevel === view
                    ? 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                    : 'bg-[#101726] border-cyan-500/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STATS HUD MODULE */}
      {settings.showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-4 font-mono">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">CHRONOLOGICAL AGE</span>
            <span className="text-sm font-bold text-zinc-100">{currentAge} YEARS OLD</span>
            <span className="text-[8px] text-zinc-500 block uppercase font-bold mt-1">START: 17 APR 2007</span>
          </div>

          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-4 font-mono">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">DAYS TRANSPIRED</span>
            <span className="text-sm font-bold text-zinc-100">{daysLived} DAYS</span>
            <span className="text-[8px] text-zinc-500 block uppercase font-bold mt-1">PERCENT USED: {pctUsed}%</span>
          </div>

          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-4 font-mono">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">DAYS SECURED REMAINING</span>
            <span className="text-sm font-bold text-cyan-400">{daysRemaining} DAYS</span>
            <span className="text-[8px] text-zinc-500 block uppercase font-bold mt-1">PERCENT REMAINING: {pctRemaining}%</span>
          </div>

          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-4 font-mono">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">TIME SLICE SUMMARY</span>
            <div className="text-[10px] text-zinc-400 mt-1 leading-snug uppercase">
              {weeksRemaining} WKS REMAINING<br />
              {monthsRemaining} MOS REMAINING<br />
              {yearsRemaining} YRS REMAINING
            </div>
          </div>
        </div>
      )}

      {/* MAIN CALENDAR GRAPH CONTAINER */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative">
        {zoomLevel === 'daily' && renderDailyDetailView()}
        {zoomLevel === 'monthly' && renderMonthlyView()}
        {zoomLevel === 'yearly' && renderYearlyView()}
        {zoomLevel === 'lifetime' && renderLifetimeView()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REFLECTION AND TODAY'S ARCHIVE MODULE */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase mb-3 flex items-center gap-1.5 font-mono tracking-widest">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              DAILY COGNITIVE REFLECTION
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5 leading-relaxed font-normal">
              Writing down your daily progress anchors memory consolidation and reinforces motivation.
            </p>

            <form onSubmit={handleSaveReflection} className="mt-4 space-y-4">
              <textarea
                value={todayReflection}
                onChange={(e) => setTodayReflection(e.target.value)}
                placeholder="What meaningful thing did you accomplish today?"
                className="w-full h-24 bg-[#101726] border border-cyan-500/10 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/30 font-sans transition-all resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Sector: {todayStr} (Today)</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,254,0.1)] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Entry</span>
                </button>
              </div>
            </form>
            {reflectionSaved && (
              <p className="text-cyan-400 text-[10px] font-mono mt-2 uppercase tracking-wider font-bold animate-pulse text-right">
                ✓ Entry registered into permanent archive
              </p>
            )}
          </div>

          {/* MOTIVATION QUOTE BAR */}
          {settings.showMotivations && (
            <div className="border-t border-cyan-500/5 pt-4 mt-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1.5">MOTIVATIONAL DIRECTIVE</span>
              <p className="text-xs text-cyan-400/80 font-sans italic">
                "{currentQuote}"
              </p>
            </div>
          )}
        </div>

        {/* MILESTONES CONFIGURATION HUD */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase mb-3 flex items-center gap-1.5 font-mono tracking-widest">
              <Trophy className="w-4 h-4 text-cyan-400" />
              CLASSIFIED LIFE MILESTONES
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed font-normal">
              Map out crucial temporal horizons in your life. The system automatically highlights them on your monthly, yearly, and weekly grids.
            </p>

            {/* List of current milestones (Default + Custom) */}
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
              {/* Default milestones header */}
              <span className="text-[8px] font-mono text-zinc-600 uppercase block font-bold tracking-widest mb-1">GLOBAL TIMELINE PRESETS</span>
              {defaultMilestones.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#101726]/40 border border-cyan-500/5 px-3 py-1.5 rounded-lg text-xs font-mono">
                  <span className="text-zinc-400 font-bold uppercase">{m.age} YEARS</span>
                  <span className="text-zinc-500 truncate">{m.label}</span>
                </div>
              ))}

              {/* Custom milestones */}
              {settings.customMilestones && settings.customMilestones.length > 0 && (
                <>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase block font-bold tracking-widest mt-3 mb-1">CUSTOM TIMELINE ENTRIES</span>
                  {settings.customMilestones.map((m) => (
                    <div key={m.id} className="flex justify-between items-center bg-[#101726]/40 border border-cyan-500/10 px-3 py-1.5 rounded-lg text-xs font-mono">
                      <span className="text-cyan-400 font-bold uppercase">{m.ageYears} YEARS</span>
                      <span className="text-zinc-300 truncate max-w-[200px]">{m.label}</span>
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Add custom milestone form */}
          <form onSubmit={handleAddMilestone} className="border-t border-cyan-500/5 pt-4 mt-auto space-y-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">CONFIGURE CUSTOM MILESTONE</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={milestoneAge}
                onChange={(e) => setMilestoneAge(e.target.value)}
                placeholder="Age"
                className="bg-[#101726] border border-cyan-500/10 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/30 text-xs font-mono w-16 text-center"
              />
              <input
                type="text"
                value={milestoneLabel}
                onChange={(e) => setMilestoneLabel(e.target.value)}
                placeholder="Milestone directive description..."
                className="flex-1 bg-[#101726] border border-cyan-500/10 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#101726] border border-cyan-500/10 hover:border-cyan-500/20 text-cyan-400 rounded-xl cursor-pointer hover:bg-cyan-500/5 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {milestoneError && <p className="text-red-400 text-[10px] font-mono uppercase tracking-wider">{milestoneError}</p>}
          </form>
        </div>
      </div>

      {/* DETAIL MODAL RETRIEVAL IF CLICKED */}
      {renderHistoryModal()}
    </div>
  );
}
