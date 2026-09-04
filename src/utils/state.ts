import { AppState, Character, Quest, BossBattle, Achievement, InventoryItem, FitnessLog, LearningLog, BusinessLog, FaithLog, StreakState, QuestPlanner, Mission, MissionObjective, MissionBoss, DailyLifeArchive } from '../types';
import { playSound } from './sound';

// Helper to format date as YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate XP needed for character level
export function calculateXpNeeded(level: number): number {
  return Math.round(level * 100 * (1 + (level - 1) * 0.15));
}

// Calculate XP needed for an individual stat level
export function calculateStatXpNeeded(statLevel: number): number {
  return statLevel * 50;
}

// Map level to Rank
export function getRankFromLevel(level: number): string {
  if (level >= 140) return 'Shadow Monarch';
  if (level >= 120) return 'Monarch';
  if (level >= 100) return 'National Level';
  if (level >= 85) return 'Rank SSS';
  if (level >= 70) return 'Rank SS';
  if (level >= 50) return 'Rank S';
  if (level >= 40) return 'Rank A';
  if (level >= 30) return 'Rank B';
  if (level >= 20) return 'Rank C';
  if (level >= 10) return 'Rank D';
  return 'Rank E';
}

// Default list of achievements to seed
export const defaultAchievements: Achievement[] = [
  { id: 'first_workout', name: 'First Awakening', description: 'Log your first fitness workout to awaken your stats.', icon: 'Zap', category: 'Fitness', progressCurrent: 0, progressGoal: 1, unlocked: false, rewardCoins: 100 },
  { id: 'streak_7', name: 'Iron Will', description: 'Maintain a 7-day completion streak of daily quests.', icon: 'Flame', category: 'Streak', progressCurrent: 0, progressGoal: 7, unlocked: false, rewardCoins: 300 },
  { id: 'streak_30', name: 'Infinite Fortitude', description: 'Maintain a 30-day daily quest completion streak.', icon: 'ShieldAlert', category: 'Streak', progressCurrent: 0, progressGoal: 30, unlocked: false, rewardCoins: 1000 },
  { id: 'boss_defeat_1', name: 'Shadow Soldier', description: 'Defeat your first weekly Sunday Boss Battle.', icon: 'Sword', category: 'General', progressCurrent: 0, progressGoal: 1, unlocked: false, rewardCoins: 500 },
  { id: 'study_500', name: 'Ruler of Wisdom', description: 'Log 500 total minutes of learning or deep work.', icon: 'BookOpen', category: 'Learning', progressCurrent: 0, progressGoal: 500, unlocked: false, rewardCoins: 400 },
  { id: 'business_income', name: 'Monarch of Wealth', description: 'Earn a total of 5,000 gold coins from quests.', icon: 'Coins', category: 'Business', progressCurrent: 0, progressGoal: 5000, unlocked: false, rewardCoins: 600 },
  { id: 'faithful_weekly', name: 'Unshakable Faith', description: 'Pray all 5 daily prayers on the Faith Tracker for 7 days.', icon: 'Compass', category: 'Faith', progressCurrent: 0, progressGoal: 7, unlocked: false, rewardCoins: 500 },
  { id: 'pushups_100', name: 'Strength of One', description: 'Log a total of 100 pushups on the Fitness Tracker.', icon: 'Activity', category: 'Fitness', progressCurrent: 0, progressGoal: 100, unlocked: false, rewardCoins: 250 }
];

// Default starting inventory
export const defaultInventory: InventoryItem[] = [
  { id: 'potion_hp', name: 'Elixir of Life', type: 'potion', description: 'Restores 50 HP. Essential for recovering from fatigue.', quantity: 3, rarity: 'common', icon: 'HeartPulse', effectValue: 50 },
  { id: 'energy_drink', name: 'Elixir of Mana', type: 'energy', description: 'Restores 30 Energy. Replenish your focus capacity.', quantity: 3, rarity: 'common', icon: 'Sparkles', effectValue: 30 },
  { id: 'chest_rare', name: 'Rare Dungeon Chest', type: 'chest_rare', description: 'Open to obtain Coins, random potions, or Rare titles.', quantity: 1, rarity: 'rare', icon: 'Box' },
  { id: 'chest_epic', name: 'Epic S-Rank Chest', type: 'chest_epic', description: 'Contains substantial gold coins, epic potions, and special epic avatars.', quantity: 0, rarity: 'epic', icon: 'Gem' },
  { id: 'chest_legendary', name: 'Monarch’s Relic Chest', type: 'chest_legendary', description: 'Contains the ultimate loot. Unlocks Shadow Monarch cosmetics and legendary titles.', quantity: 0, rarity: 'legendary', icon: 'Crown' }
];

// Static default Quest Planner
export const defaultQuestPlanner: QuestPlanner = {
  hscCountdownDays: 210, // 7 months left until HSC exams
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

// Calculate Progressive and Adaptive Study Goal Hours
export function calculateProgressiveStudyGoal(state: AppState | null, todayStr: string): { goalHours: number; totalCompletedDays: number } {
  const logs = state?.learningLogs || [];
  if (logs.length === 0) {
    return { goalHours: 2.0, totalCompletedDays: 0 };
  }

  // Calculate total duration in hours per day
  const dailyHours: { [date: string]: number } = {};
  logs.forEach(log => {
    dailyHours[log.date] = (dailyHours[log.date] || 0) + (log.durationMinutes / 60);
  });

  // Get all unique dates sorted
  const sortedDates = Object.keys(dailyHours).sort();
  if (sortedDates.length === 0) {
    return { goalHours: 2.0, totalCompletedDays: 0 };
  }

  const startDateStr = sortedDates[0];
  
  // We want to trace chronologically from startDateStr up to yesterday.
  const parts = todayStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const yesterday = new Date(year, month, day);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let activeTarget = 2.0;
  let totalSuccessDays = 0;
  let consecutiveSuccessDays = 0;
  let consecutiveMissDays = 0;

  if (startDateStr <= yesterdayStr) {
    const startParts = startDateStr.split('-');
    const endParts = yesterdayStr.split('-');
    const currentDate = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, parseInt(startParts[2], 10));
    const endDate = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, parseInt(endParts[2], 10));

    while (currentDate <= endDate) {
      const cy = currentDate.getFullYear();
      const cm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const cd = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${cy}-${cm}-${cd}`;
      const hoursLogged = dailyHours[dateStr] || 0;

      if (hoursLogged >= activeTarget) {
        totalSuccessDays++;
        consecutiveSuccessDays++;
        consecutiveMissDays = 0;

        // If consistently completing for several days (e.g. 3 days),
        // gradually increase the target by 30-60 minutes (0.5 hours)
        if (consecutiveSuccessDays >= 3) {
          activeTarget = Math.min(5.0, activeTarget + 0.5);
          consecutiveSuccessDays = 0;
        }
      } else {
        consecutiveSuccessDays = 0;
        consecutiveMissDays++;

        // If they miss several days (e.g. 3 days), maintain or slightly reduce by 30 mins
        if (consecutiveMissDays >= 3) {
          activeTarget = Math.max(2.0, activeTarget - 0.5);
          consecutiveMissDays = 0;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Also align with baseline progression based on total completed days
  let baselineTarget = 2.0;
  if (totalSuccessDays >= 35) {
    baselineTarget = 5.0;
  } else if (totalSuccessDays >= 25) {
    baselineTarget = 4.5;
  } else if (totalSuccessDays >= 18) {
    baselineTarget = 4.0;
  } else if (totalSuccessDays >= 12) {
    baselineTarget = 3.5;
  } else if (totalSuccessDays >= 7) {
    baselineTarget = 3.0;
  } else if (totalSuccessDays >= 3) {
    baselineTarget = 2.5;
  }

  // To prevent sudden jumps, clamp final goal near baselineTarget
  let finalTarget = activeTarget;
  if (finalTarget > baselineTarget + 1.0) {
    finalTarget = baselineTarget + 1.0;
  } else if (finalTarget < baselineTarget - 1.0) {
    finalTarget = baselineTarget - 1.0;
  }

  finalTarget = Math.max(2.0, Math.min(5.0, finalTarget));

  return {
    goalHours: finalTarget,
    totalCompletedDays: totalSuccessDays
  };
}

// Procedural generator to create daily quests
export function generateDailyQuests(stateOrDate: AppState | string | null, dateStrInput?: string): Quest[] {
  let state: AppState | null = null;
  let dateStr = getTodayDateString();

  if (stateOrDate && typeof stateOrDate === 'object') {
    state = stateOrDate;
    dateStr = dateStrInput || getTodayDateString();
  } else if (typeof stateOrDate === 'string') {
    dateStr = stateOrDate;
  }

  const planner = state?.questPlanner || defaultQuestPlanner;
  const generated: Quest[] = [];
  const procActive = planner.procrastinationModeActive;

  // Day of week detection
  const dateParts = dateStr.split('-');
  let dayOfWeek = 0;
  if (dateParts.length === 3) {
    const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    dayOfWeek = dateObj.getDay();
  } else {
    dayOfWeek = new Date().getDay();
  }
  const isFriday = dayOfWeek === 5;

  // --- MISSION 3: FAITH (Obligatory Farz is #1 Priority) ---
  // 1. Salah Quest (Obligatory Farz)
  generated.push({
    id: `q_${dateStr}_salah`,
    text: "🕋 PRAY ALL 5 OBLIGATORY SALAH ON TIME: Pray Fajr, Dhuhr, Asr, Maghrib, & Isha with pristine focus (Niyyah for Allah alone)",
    difficulty: 'hard',
    category: 'Faith',
    completed: false,
    date: dateStr,
    xpReward: 50,
    coinReward: 50
  });

  // 2. Quran Quest
  const quranPages = planner.energyLevel === 'high' ? 5 : 2;
  generated.push({
    id: `q_${dateStr}_quran`,
    text: `📖 READ QURAN: Recite ${quranPages} pages of Quran with translation and deep Tafsir contemplation`,
    difficulty: 'medium',
    category: 'Faith',
    completed: false,
    date: dateStr,
    xpReward: 30,
    coinReward: 30
  });

  // Friday Special
  if (isFriday) {
    generated.push({
      id: `q_${dateStr}_friday`,
      text: "=== FRIDAY SUNNAH === Recite Surah Al-Kahf, make plenty of Du'a, and send 100+ Salawat upon the Prophet (PBUH)",
      difficulty: 'medium',
      category: 'Faith',
      completed: false,
      date: dateStr,
      xpReward: 30,
      coinReward: 35
    });
  }

  // Recitations Quest (Mondays & Thursdays)
  const isRecitationsDay = dayOfWeek === 1 || dayOfWeek === 4;
  if (isRecitationsDay) {
    generated.push({
      id: `q_${dateStr}_adhkar`,
      text: "📿 RECITATIONS: Complete Morning and Evening Adhkar (protection and remembrance)",
      difficulty: 'easy',
      category: 'Faith',
      completed: false,
      date: dateStr,
      xpReward: 15,
      coinReward: 15
    });
  }

  // Spiritual Elevation Quest (Tuesdays & Saturdays)
  const isSpiritualElevationDay = dayOfWeek === 2 || dayOfWeek === 6;
  if (isSpiritualElevationDay) {
    generated.push({
      id: `q_${dateStr}_worship_daily`,
      text: "🤲 SPIRITUAL ELEVATION: Complete 100x Istighfar & 100x Salawat to purify intention and heart",
      difficulty: 'easy',
      category: 'Faith',
      completed: false,
      date: dateStr,
      xpReward: 15,
      coinReward: 15
    });
  }

  // --- MISSION 2: HSC GPA-5 STUDY HOURS PREPARATION (#2 Priority) ---
  // Generate exactly one Study Hours quest every day, tracking total focused study time.
  const targetObj = calculateProgressiveStudyGoal(state, dateStr);
  const calculatedStudyHours = targetObj.goalHours;
  const studyDifficulty = calculatedStudyHours >= 4.5 ? 'extreme' : calculatedStudyHours >= 3.5 ? 'hard' : calculatedStudyHours >= 2.5 ? 'medium' : 'easy';

  generated.push({
    id: `q_${dateStr}_hsc_block`, // keeping hsc_block in the ID to support yesterday's critical check and other features
    text: `🎓 Study for ${calculatedStudyHours} Hour${calculatedStudyHours === 1 ? '' : 's'}`,
    difficulty: studyDifficulty,
    category: 'Intelligence',
    completed: false,
    date: dateStr,
    xpReward: Math.round(calculatedStudyHours * 15),
    coinReward: Math.round(calculatedStudyHours * 20),
    missionId: 'hsc'
  });

  // --- MISSION 1: CREATOR ECONOMY CAREER ENGINE (#3 Priority) ---
  // Skip or simplify if procrastination mode is active to protect user from burnout
  if (!procActive) {
    let mainText = "";
    let mainDiff: 'easy' | 'medium' | 'hard' | 'extreme' = 'medium';
    let mainXp = 25;
    let mainCoins = 30;

    let subText = "";
    let subDiff: 'easy' | 'medium' | 'hard' | 'extreme' = 'easy';
    let subXp = 15;
    let subCoins = 15;

    switch (dayOfWeek) {
      case 1: // Monday
        mainText = "🎥 CREATOR (YouTube): Research one content idea and write a high-storytelling video script";
        mainDiff = 'medium';
        mainXp = 25;
        mainCoins = 30;

        subText = "💰 CREATOR (Skill): Complete a deep work session to study professional video storytelling techniques";
        subDiff = 'easy';
        subXp = 15;
        subCoins = 15;
        break;
      case 2: // Tuesday
        mainText = "✂️ CREATOR (YouTube): Record raw voice-overs/videos and perform a 2-hour video editing sprint";
        mainDiff = 'hard';
        mainXp = 40;
        mainCoins = 50;

        subText = "💰 CREATOR (Skill): Practice raw editing cuts, timing, or visual transitions to optimize workflow speed";
        subDiff = 'easy';
        subXp = 15;
        subCoins = 15;
        break;
      case 3: // Wednesday
        mainText = "🏆 CREATOR (Contest): Find a suitable freelancer contest, research requirements, and start a submission draft";
        mainDiff = 'medium';
        mainXp = 30;
        mainCoins = 35;

        subText = "💰 CREATOR (Skill): Research trending designer styles or market demands to expand your digital portfolio";
        subDiff = 'easy';
        subXp = 15;
        subCoins = 15;
        break;
      case 4: // Thursday
        mainText = "⚡ CREATOR (YouTube): Design a high-CTR thumbnail, write an SEO-optimized title, and upload content";
        mainDiff = 'medium';
        mainXp = 25;
        mainCoins = 30;

        subText = "💰 CREATOR (Skill): Refine your digital portfolio layout or research professional freelance networks";
        subDiff = 'easy';
        subXp = 15;
        subCoins = 15;
        break;
      case 5: // Friday
        mainText = "🏆 CREATOR (Contest): Review and improve your design entry and submit a finalized freelancer contest submission";
        mainDiff = 'hard';
        mainXp = 45;
        mainCoins = 55;

        subText = "💰 CREATOR (Skill): Complete a focused deep work session to study advanced client communication skills";
        subDiff = 'medium';
        subXp = 20;
        subCoins = 25;
        break;
      case 6: // Saturday
        mainText = "📊 CREATOR (YouTube): Audit channel analytics, study successful creator layouts, and brainstorm 5 video premises";
        mainDiff = 'easy';
        mainXp = 15;
        mainCoins = 20;

        subText = "💰 CREATOR (Skill): Learn a new professional AI tool (e.g., Midjourney, ChatGPT, or specialized copilot)";
        subDiff = 'easy';
        subXp = 15;
        subCoins = 15;
        break;
      case 0: // Sunday
        mainText = "📈 CREATOR (Review): Conduct your Creator Weekly Review: assess logs, deep work hours, and plan next week's schedule";
        mainDiff = 'easy';
        mainXp = 15;
        mainCoins = 20;

        subText = "💰 CREATOR (Skill): Practice creative copy drafting, high-CTR headline writing, or client outreach for 45 minutes";
        subDiff = 'medium';
        subXp = 20;
        subCoins = 25;
        break;
    }

    generated.push({
      id: `q_${dateStr}_creator_main`,
      text: mainText,
      difficulty: mainDiff,
      category: 'Business',
      completed: false,
      date: dateStr,
      xpReward: mainXp,
      coinReward: mainCoins,
      missionId: 'creator'
    });

    generated.push({
      id: `q_${dateStr}_creator_sub`,
      text: subText,
      difficulty: subDiff,
      category: 'Business',
      completed: false,
      date: dateStr,
      xpReward: subXp,
      coinReward: subCoins,
      missionId: 'creator'
    });
  } else {
    // Inject easy accountability recovery quest instead of complex content creation
    generated.push({
      id: `q_${dateStr}_recovery_creator`,
      text: "🌱 RECOVERY PROTOCOL: Study 1 successful content creator's layout or portfolio for 15 minutes to recover momentum",
      difficulty: 'easy',
      category: 'Business',
      completed: false,
      date: dateStr,
      xpReward: 10,
      coinReward: 15,
      missionId: 'creator'
    });
  }

  // --- MISSION 4: GYM & PHYSICAL WELLNESS (#4 Priority) ---
  let gymText = "";
  let gymCategory: keyof Character['stats'] = 'Strength';
  let gymDiff: 'easy' | 'medium' | 'hard' = 'hard';

  // If low energy, recommend a lighter workout or stretching to avoid burnout
  if (planner.energyLevel === 'low') {
    gymText = "🧘 RECOVERY STRETCHING: Perform 20 minutes of deep static stretching, joint mobility work, and muscle recovery breathing";
    gymCategory = 'Vitality';
    gymDiff = 'easy';
  } else {
    switch (planner.gymSchedule) {
      case 'push':
        gymText = "💪 PUSH WORKOUT: Heavy Bench press, Overhead shoulder presses, Tricep pushdowns & progressive overload tracking";
        gymCategory = 'Strength';
        gymDiff = 'hard';
        break;
      case 'pull':
        gymText = "⚡ PULL WORKOUT: Weighted Pullups, Barbell/Cable rows, Bicep curls, and posture improvement exercises";
        gymCategory = 'Strength';
        gymDiff = 'hard';
        break;
      case 'legs':
        gymText = "🦵 LEG DAY: Heavy Squats, Romanian Deadlifts, leg presses, and calf elevation training";
        gymCategory = 'Strength';
        gymDiff = 'hard';
        break;
      case 'cardio':
        gymText = "🏃 AGILITY & CORE: 5km continuous cardio run / interval sprint session, paired with 3-minute plank core circuits";
        gymCategory = 'Agility';
        gymDiff = 'medium';
        break;
      case 'rest':
        gymText = "🛡️ REST DAY RECOMMENDATION: Complete 20 minutes of light mobility exercises and foam rolling to prevent overtraining";
        gymCategory = 'Vitality';
        gymDiff = 'easy';
        break;
    }
  }

  generated.push({
    id: `q_${dateStr}_gym`,
    text: gymText,
    difficulty: gymDiff,
    category: gymCategory,
    completed: false,
    date: dateStr,
    xpReward: gymDiff === 'hard' ? 40 : gymDiff === 'medium' ? 25 : 15,
    coinReward: gymDiff === 'hard' ? 50 : gymDiff === 'medium' ? 35 : 20
  });

  // Physical nourishment: Water & Protein
  generated.push({
    id: `q_${dateStr}_nutrition`,
    text: `🍗 NUTRITION MATRIX: Consume 80g+ clean protein, hydrate with 3L pure water, and prepare clean unprocessed meals`,
    difficulty: 'easy',
    category: 'Vitality',
    completed: false,
    date: dateStr,
    xpReward: 10,
    coinReward: 15
  });

  // High quality Sleep
  generated.push({
    id: `q_${dateStr}_sleep`,
    text: "💤 REGENERATIVE SLEEP: Block blue screens 1 hour before bed and achieve 8 hours of deep restorative sleep",
    difficulty: 'easy',
    category: 'Vitality',
    completed: false,
    date: dateStr,
    xpReward: 10,
    coinReward: 15
  });

  // --- CATEGORY 5: PERSONAL DEVELOPMENT & CHARACTER (#5 Priority) ---
  generated.push({
    id: `q_${dateStr}_char_dev`,
    text: "👁️ CHARACTER TRIAL: Practice strict self-discipline: Lower your gaze, speak kind words to parents, and display good character",
    difficulty: 'medium',
    category: 'Discipline',
    completed: false,
    date: dateStr,
    xpReward: 20,
    coinReward: 20
  });

  // Sort generated quests based on strict Priority system:
  // 1. Obligatory Islamic acts (Faith)
  // 2. HSC preparation (Intelligence / Knowledge)
  // 3. Content creation (Business)
  // 4. Health & Gym (Strength / Agility / Vitality)
  // 5. Personal development (Discipline)
  const getPriorityWeight = (q: Quest) => {
    if (q.id.includes('salah')) return 1;
    if (q.id.includes('quran')) return 2;
    if (q.category === 'Faith' && q.id.includes('friday')) return 3;
    if (q.category === 'Faith') return 4;
    if (q.id.includes('hsc_block')) return 5;
    if (q.id.includes('hsc_practice')) return 6;
    if (q.id.includes('hsc_revision')) return 7;
    if (q.id.includes('content')) return 8;
    if (q.id.includes('gym')) return 9;
    if (q.id.includes('nutrition')) return 10;
    if (q.id.includes('sleep')) return 11;
    if (q.id.includes('char_dev')) return 12;
    return 100;
  };

  generated.sort((a, b) => getPriorityWeight(a) - getPriorityWeight(b));

  return generated.map(q => {
    let missionId: 'hsc' | 'creator' | 'faith' | 'fitness' = 'fitness';
    if (q.id.includes('salah') || q.id.includes('quran') || q.id.includes('adhkar') || q.id.includes('friday') || q.id.includes('worship') || q.category === 'Faith') {
      missionId = 'faith';
    } else if (q.id.includes('hsc') || q.category === 'Intelligence' || q.category === 'Knowledge') {
      missionId = 'hsc';
    } else if (q.id.includes('content') || q.id.includes('creator') || q.category === 'Business' || q.category === 'Charisma') {
      missionId = 'creator';
    } else if (q.id.includes('gym') || q.id.includes('nutrition') || q.id.includes('sleep') || q.category === 'Strength' || q.category === 'Agility' || q.category === 'Endurance' || q.category === 'Vitality') {
      missionId = 'fitness';
    } else if (q.id.includes('char_dev') || q.category === 'Discipline') {
      missionId = 'faith'; // character discipline counts for faith development
    }
    return { ...q, missionId };
  });
}

// Generate weekly boss battle
export function generateWeeklyBossBattle(dateStr: string): BossBattle {
  const bossNames = [
    'The Blue Venom Fang Kasaka (E-Rank Dungeon Boss)',
    'The Blood-Red Knight Commander Igris (A-Rank Sentry)',
    'Antares the Monarch of Destruction (SSS-Rank Raid)',
    'Baran, Monarch of White Flames (S-Rank Demon Lord)',
    'The Architect of the System (SS-Rank Final Trial)'
  ];
  // Select boss based on week or random
  const name = bossNames[Math.floor(Math.random() * bossNames.length)];
  
  return {
    active: true,
    name,
    hp: 5, // Requires 5 epic tasks to defeat
    maxHp: 5,
    tasks: [
      { id: 'bt_1', text: 'Complete all daily quests on Sunday', completed: false, target: 1, current: 0, unit: 'times', category: 'Discipline' },
      { id: 'bt_2', text: 'Perform 100 pushups/squats/pullups combo', completed: false, target: 100, current: 0, unit: 'reps', category: 'Strength' },
      { id: 'bt_3', text: 'Run or walk a continuous 10 km distance', completed: false, target: 10, current: 0, unit: 'km', category: 'Agility' },
      { id: 'bt_4', text: 'Conduct a 4-hour deep work/coding/business sprint', completed: false, target: 4, current: 0, unit: 'hours', category: 'Business' },
      { id: 'bt_5', text: 'Read 100 pages of books or learn a complete chapter', completed: false, target: 100, current: 0, unit: 'pages', category: 'Knowledge' }
    ],
    rewardXp: 500,
    rewardCoins: 800,
    rewardTitle: 'Dragon Slayer',
    rewardBadge: 'Shadow Seal',
    completed: false,
    weekStartDate: dateStr
  };
}

export function getInitialState(): AppState {
  return {
    character: null, // triggers onboarding
    quests: [],
    bossBattle: null,
    achievements: defaultAchievements,
    inventory: defaultInventory,
    fitnessLogs: [],
    learningLogs: [],
    businessLogs: [],
    faithLogs: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      weeklyStreak: 0,
      monthlyStreak: 0
    },
    xpHistory: {},
    settings: {
      pinLock: '',
      soundEnabled: true,
      vibrationEnabled: true,
      notificationsEnabled: true,
      themeMode: 'dark-cyber'
    },
    questPlanner: defaultQuestPlanner,
    missions: defaultMissions,
    lifeCalendarSettings: {
      expectedLifespanYears: 60,
      birthDate: '2007-04-17',
      themeColor: 'cyan',
      showStats: true,
      showMotivations: true,
      customMilestones: []
    },
    lifeReflections: {},
    lifeHistoryArchive: {}
  };
}

// Check and unlock achievements
export function updateAchievements(state: AppState): { unlockedList: Achievement[]; newState: AppState } {
  const unlockedList: Achievement[] = [];
  const updatedAchievements = state.achievements.map(ach => {
    if (ach.unlocked) return ach;

    let current = ach.progressCurrent;

    if (ach.id === 'first_workout') {
      current = state.fitnessLogs.length;
    } else if (ach.id === 'streak_7') {
      current = state.streak.currentStreak;
    } else if (ach.id === 'streak_30') {
      current = state.streak.currentStreak;
    } else if (ach.id === 'boss_defeat_1') {
      current = state.bossBattle && state.bossBattle.completed ? 1 : 0;
    } else if (ach.id === 'study_500') {
      const learnMins = state.learningLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
      const bizHrs = state.businessLogs.reduce((acc, log) => acc + log.deepWorkHours, 0) * 60;
      current = learnMins + bizHrs;
    } else if (ach.id === 'business_income') {
      current = state.character ? state.character.coins : 0;
    } else if (ach.id === 'faithful_weekly') {
      // Prayed all 5 prayers in a single day, check how many days logged
      const daysAllPrayed = state.faithLogs.filter(log => 
        log.prayers.fajr && log.prayers.dhuhr && log.prayers.asr && log.prayers.maghrib && log.prayers.isha
      ).length;
      current = daysAllPrayed;
    } else if (ach.id === 'pushups_100') {
      current = state.fitnessLogs.reduce((acc, log) => acc + log.pushups, 0);
    }

    const isUnlocked = current >= ach.progressGoal;
    if (isUnlocked && !ach.unlocked) {
      unlockedList.push({ ...ach, progressCurrent: current, unlocked: true, unlockedAt: getTodayDateString() });
      return { ...ach, progressCurrent: current, unlocked: true, unlockedAt: getTodayDateString() };
    }

    return { ...ach, progressCurrent: Math.min(current, ach.progressGoal) };
  });

  let characterCoins = state.character ? state.character.coins : 0;
  if (unlockedList.length > 0 && state.character) {
    unlockedList.forEach(ach => {
      characterCoins += ach.rewardCoins;
    });
  }

  return {
    unlockedList,
    newState: {
      ...state,
      achievements: updatedAchievements,
      character: state.character ? { ...state.character, coins: characterCoins } : null
    }
  };
}

// Add XP to Character and specific Stats
export function addXp(
  state: AppState,
  amount: number,
  category: keyof Character['stats'] | 'General'
): { leveledUp: boolean; statLeveledUp: string | null; newState: AppState } {
  if (!state.character) return { leveledUp: false, statLeveledUp: null, newState: state };

  let leveledUp = false;
  let statLeveledUp: string | null = null;
  const updatedChar = { ...state.character };
  
  // 1. Add XP to Heatmap
  const today = getTodayDateString();
  const updatedXpHistory = { ...state.xpHistory };
  updatedXpHistory[today] = (updatedXpHistory[today] || 0) + amount;

  // 2. Add XP to specific stat (if not General)
  if (category !== 'General' && updatedChar.stats[category]) {
    const stat = { ...updatedChar.stats[category] };
    stat.xp += amount;
    
    // Check if stat leveled up
    let neededForStat = calculateStatXpNeeded(stat.level);
    while (stat.xp >= neededForStat) {
      stat.xp -= neededForStat;
      stat.level += 1;
      statLeveledUp = category;
      neededForStat = calculateStatXpNeeded(stat.level);
      
      // Leveled up individual stat grants bonus character XP and unlocks higher stats
      updatedChar.xp += 50; // Bonus XP for stat level up
      updatedChar.coins += 25; // Bonus coins
    }
    updatedChar.stats[category] = stat;
  }

  // 3. Add XP to character
  updatedChar.xp += amount;
  let neededForChar = calculateXpNeeded(updatedChar.level);
  while (updatedChar.xp >= neededForChar) {
    updatedChar.xp -= neededForChar;
    updatedChar.level += 1;
    leveledUp = true;
    updatedChar.rank = getRankFromLevel(updatedChar.level);
    updatedChar.maxHp = 100 + (updatedChar.level - 1) * 15;
    updatedChar.maxEnergy = 50 + (updatedChar.level - 1) * 5;
    updatedChar.hp = updatedChar.maxHp; // Refill HP on level up
    updatedChar.energy = updatedChar.maxEnergy; // Refill energy on level up
    updatedChar.coins += 100; // Reward gold coins
    neededForChar = calculateXpNeeded(updatedChar.level);
  }

  // Create temporary state to check achievement updates
  let intermediateState: AppState = {
    ...state,
    character: updatedChar,
    xpHistory: updatedXpHistory
  };

  const { newState } = updateAchievements(intermediateState);

  return {
    leveledUp,
    statLeveledUp,
    newState
  };
}

// Complete Daily Quest
export function toggleQuestCompletion(
  state: AppState,
  questId: string
): { completed: boolean; rewards: { xp: number; coins: number; item?: InventoryItem } | null; newState: AppState } {
  let rewardApplied: { xp: number; coins: number; item?: InventoryItem } | null = null;
  let leveledUpFlag = false;
  let statLeveledUpFlag: string | null = null;

  const updatedQuests = state.quests.map(q => {
    if (q.id === questId) {
      const newStatus = !q.completed;
      if (newStatus) {
        rewardApplied = {
          xp: q.xpReward,
          coins: q.coinReward
        };
      } else {
        // Reverse rewards
        rewardApplied = {
          xp: -q.xpReward,
          coins: -q.coinReward
        };
      }
      return { ...q, completed: newStatus };
    }
    return q;
  });

  let nextState = { ...state, quests: updatedQuests };

  if (rewardApplied && state.character) {
    // Apply rewards using mission-integrated XP allocator
    const activeQuest = updatedQuests.find(q => q.id === questId);
    const missionId = activeQuest?.missionId || getMissionIdFromCategory(activeQuest?.category);

    const oldLevel = state.character?.level || 1;
    nextState = addMissionAndCharXp(nextState, missionId, rewardApplied.xp, activeQuest?.category || 'General');
    const newLevel = nextState.character?.level || 1;
    leveledUpFlag = newLevel > oldLevel;

    // Apply coins
    if (nextState.character) {
      nextState.character.coins = Math.max(0, nextState.character.coins + rewardApplied.coins);
    }

    // Play sounds
    if (rewardApplied.xp > 0) {
      if (leveledUpFlag) {
        playSound('levelUp', state.settings.soundEnabled);
      } else {
        playSound('reward', state.settings.soundEnabled);
      }
    }
  }

  // Handle worship streaks & completed acts updates
  const activeQuest = updatedQuests.find(q => q.id === questId);
  if (activeQuest && nextState.questPlanner) {
    const updatedPlanner = { ...nextState.questPlanner };
    updatedPlanner.worshipStreaks = { ...updatedPlanner.worshipStreaks };
    updatedPlanner.completedActsToday = [...(updatedPlanner.completedActsToday || [])];

    if (activeQuest.completed) {
      if (activeQuest.id.includes('salah')) {
        updatedPlanner.worshipStreaks['Salah'] = (updatedPlanner.worshipStreaks['Salah'] || 0) + 1;
        if (!updatedPlanner.completedActsToday.includes('Salah')) {
          updatedPlanner.completedActsToday.push('Salah');
        }
      } else if (activeQuest.id.includes('quran')) {
        updatedPlanner.worshipStreaks['Quran'] = (updatedPlanner.worshipStreaks['Quran'] || 0) + 1;
        if (!updatedPlanner.completedActsToday.includes('Quran')) {
          updatedPlanner.completedActsToday.push('Quran');
        }
      } else if (activeQuest.id.includes('adhkar')) {
        updatedPlanner.worshipStreaks['Adhkar'] = (updatedPlanner.worshipStreaks['Adhkar'] || 0) + 1;
        if (!updatedPlanner.completedActsToday.includes('Adhkar')) {
          updatedPlanner.completedActsToday.push('Adhkar');
        }
      }
    } else {
      // Uncompleted
      if (activeQuest.id.includes('salah')) {
        updatedPlanner.worshipStreaks['Salah'] = Math.max(0, (updatedPlanner.worshipStreaks['Salah'] || 1) - 1);
        updatedPlanner.completedActsToday = updatedPlanner.completedActsToday.filter(act => act !== 'Salah');
      } else if (activeQuest.id.includes('quran')) {
        updatedPlanner.worshipStreaks['Quran'] = Math.max(0, (updatedPlanner.worshipStreaks['Quran'] || 1) - 1);
        updatedPlanner.completedActsToday = updatedPlanner.completedActsToday.filter(act => act !== 'Quran');
      } else if (activeQuest.id.includes('adhkar')) {
        updatedPlanner.worshipStreaks['Adhkar'] = Math.max(0, (updatedPlanner.worshipStreaks['Adhkar'] || 1) - 1);
        updatedPlanner.completedActsToday = updatedPlanner.completedActsToday.filter(act => act !== 'Adhkar');
      }
    }
    nextState.questPlanner = updatedPlanner;
  }

  // Re-evaluate streak on completion change
  const today = getTodayDateString();
  const allTodayQuests = nextState.quests.filter(q => q.date === today);
  const completedToday = allTodayQuests.filter(q => q.completed);
  
  const updatedStreak = { ...state.streak };
  if (allTodayQuests.length > 0 && completedToday.length === allTodayQuests.length) {
    // If all completed, daily streak rises
    if (updatedStreak.lastActiveDate !== today) {
      updatedStreak.currentStreak += 1;
      updatedStreak.longestStreak = Math.max(updatedStreak.longestStreak, updatedStreak.currentStreak);
      updatedStreak.lastActiveDate = today;
    }
  }

  nextState.streak = updatedStreak;

  // Final achievements check
  const finalRes = updateAchievements(nextState);

  return {
    completed: updatedQuests.find(q => q.id === questId)?.completed || false,
    rewards: rewardApplied,
    newState: finalRes.newState
  };
}

// Open chest loot container simulation
export function openChest(
  state: AppState,
  chestId: string
): { success: boolean; loot: { coins: number; xp: number; rewardItem?: string; rarity: string } | null; newState: AppState } {
  if (!state.character) return { success: false, loot: null, newState: state };

  const itemIndex = state.inventory.findIndex(item => item.id === chestId && item.quantity > 0);
  if (itemIndex === -1) return { success: false, loot: null, newState: state };

  const updatedInventory = [...state.inventory];
  updatedInventory[itemIndex] = {
    ...updatedInventory[itemIndex],
    quantity: updatedInventory[itemIndex].quantity - 1
  };

  const itemType = updatedInventory[itemIndex].type;
  let coinsEarned = 0;
  let xpEarned = 0;
  let rewardItem = '';
  let rarity = 'common';

  if (itemType === 'chest_rare') {
    coinsEarned = Math.floor(Math.random() * 200) + 100;
    xpEarned = Math.floor(Math.random() * 100) + 50;
    rarity = 'rare';
    // 50% chance to drop another potion
    if (Math.random() < 0.5) {
      rewardItem = 'Elixir of Life (Potion)';
      const potIdx = updatedInventory.findIndex(i => i.id === 'potion_hp');
      if (potIdx !== -1) updatedInventory[potIdx].quantity += 1;
    }
  } else if (itemType === 'chest_epic') {
    coinsEarned = Math.floor(Math.random() * 500) + 300;
    xpEarned = Math.floor(Math.random() * 250) + 100;
    rarity = 'epic';
    // Unlocks a random Title or high-tier cosmetic
    const epicTitles = ['Knight Sentry', 'Dungeon Raider', 'White Flame Lord'];
    rewardItem = epicTitles[Math.floor(Math.random() * epicTitles.length)] + ' (Title)';
  } else if (itemType === 'chest_legendary') {
    coinsEarned = Math.floor(Math.random() * 1500) + 800;
    xpEarned = Math.floor(Math.random() * 600) + 300;
    rarity = 'legendary';
    rewardItem = 'Shadow Monarch Legacy (Avatar & Title)';
  }

  let nextState = {
    ...state,
    inventory: updatedInventory
  };

  // Add coins
  if (nextState.character) {
    nextState.character.coins += coinsEarned;
    // Add unlocked title if legendary
    if (itemType === 'chest_legendary') {
      if (!nextState.character.titles.includes('Shadow Monarch Legacy')) {
        nextState.character.titles.push('Shadow Monarch Legacy');
      }
    } else if (itemType === 'chest_epic') {
      const cleanTitle = rewardItem.replace(' (Title)', '');
      if (!nextState.character.titles.includes(cleanTitle)) {
        nextState.character.titles.push(cleanTitle);
      }
    }
  }

  // Add XP
  const xpRes = addXp(nextState, xpEarned, 'General');
  nextState = xpRes.newState;

  playSound('achievement', state.settings.soundEnabled);

  return {
    success: true,
    loot: { coins: coinsEarned, xp: xpEarned, rewardItem: rewardItem || undefined, rarity },
    newState: nextState
  };
}

// Use Potion or Energy Item
export function consumeItem(
  state: AppState,
  itemId: string
): { success: boolean; recoveredValue: number; newState: AppState } {
  if (!state.character) return { success: false, recoveredValue: 0, newState: state };

  const itemIndex = state.inventory.findIndex(item => item.id === itemId && item.quantity > 0);
  if (itemIndex === -1) return { success: false, recoveredValue: 0, newState: state };

  const item = state.inventory[itemIndex];
  const updatedChar = { ...state.character };
  let valueRecovered = item.effectValue || 0;

  if (item.type === 'potion') {
    if (updatedChar.hp >= updatedChar.maxHp) return { success: false, recoveredValue: 0, newState: state };
    updatedChar.hp = Math.min(updatedChar.maxHp, updatedChar.hp + valueRecovered);
  } else if (item.type === 'energy') {
    if (updatedChar.energy >= updatedChar.maxEnergy) return { success: false, recoveredValue: 0, newState: state };
    updatedChar.energy = Math.min(updatedChar.maxEnergy, updatedChar.energy + valueRecovered);
  } else {
    return { success: false, recoveredValue: 0, newState: state }; // not a consumable
  }

  const updatedInventory = [...state.inventory];
  updatedInventory[itemIndex] = {
    ...item,
    quantity: item.quantity - 1
  };

  playSound('heal', state.settings.soundEnabled);

  const nextState = {
    ...state,
    character: updatedChar,
    inventory: updatedInventory
  };

  return {
    success: true,
    recoveredValue: valueRecovered,
    newState: nextState
  };
}

// Generate weekly boss and manage task updates
export function updateBossTaskProgress(
  state: AppState,
  taskId: string,
  amount: number
): { completedNow: boolean; newState: AppState } {
  if (!state.bossBattle || !state.bossBattle.active) return { completedNow: false, newState: state };

  let completedNow = false;
  const updatedTasks = state.bossBattle.tasks.map(t => {
    if (t.id === taskId) {
      const prevCompleted = t.completed;
      const nextCurrent = Math.min(t.target, t.current + amount);
      const nowCompleted = nextCurrent >= t.target;
      if (nowCompleted && !prevCompleted) {
        completedNow = true;
      }
      return { ...t, current: nextCurrent, completed: nowCompleted };
    }
    return t;
  });

  const allCompleted = updatedTasks.every(t => t.completed);
  let updatedBoss = {
    ...state.bossBattle,
    tasks: updatedTasks,
    hp: state.bossBattle.maxHp - updatedTasks.filter(t => t.completed).length,
    completed: allCompleted
  };

  let nextState = {
    ...state,
    bossBattle: updatedBoss
  };

  if (allCompleted && !state.bossBattle.completed && state.character) {
    // Reward for defeating boss
    playSound('bossDefeated', state.settings.soundEnabled);
    
    // Add title and coins
    const updatedChar = { ...nextState.character! };
    if (!updatedChar.titles.includes(updatedBoss.rewardTitle)) {
      updatedChar.titles.push(updatedBoss.rewardTitle);
    }
    updatedChar.coins += updatedBoss.rewardCoins;
    
    // Add Chest reward to inventory
    const updatedInventory = [...nextState.inventory];
    const legendaryChestIdx = updatedInventory.findIndex(i => i.id === 'chest_legendary');
    if (legendaryChestIdx !== -1) {
      updatedInventory[legendaryChestIdx].quantity += 1;
    }

    nextState = {
      ...nextState,
      character: updatedChar,
      inventory: updatedInventory
    };

    // Apply XP reward
    const xpRes = addXp(nextState, updatedBoss.rewardXp, 'General');
    nextState = xpRes.newState;
  }

  const finalRes = updateAchievements(nextState);
  return {
    completedNow,
    newState: finalRes.newState
  };
}

// Helper to compile a daily archive of progress before day-end rollover
export function archiveDay(state: AppState, dateStr: string): DailyLifeArchive {
  const completedQuests = (state.quests || [])
    .filter(q => q.date === dateStr && q.completed)
    .map(q => ({
      id: q.id,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      xpReward: q.xpReward,
      coinReward: q.coinReward
    }));

  const studyMinutes = (state.learningLogs || [])
    .filter(l => l.date === dateStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const studyHours = Number((studyMinutes / 60).toFixed(2));

  const fitnessLog = (state.fitnessLogs || []).find(l => l.date === dateStr);
  const workout = fitnessLog
    ? {
        pushups: fitnessLog.pushups || 0,
        pullups: fitnessLog.pullups || 0,
        squats: fitnessLog.squats || 0,
        runKm: fitnessLog.runKm || 0,
        calories: fitnessLog.calories || 0
      }
    : null;

  const faithLog = (state.faithLogs || []).find(l => l.date === dateStr);
  const prayerCompleted = faithLog
    ? {
        fajr: !!faithLog.prayers.fajr,
        dhuhr: !!faithLog.prayers.dhuhr,
        asr: !!faithLog.prayers.asr,
        maghrib: !!faithLog.prayers.maghrib,
        isha: !!faithLog.prayers.isha
      }
    : null;

  const missionProgress = (state.missions || []).map(m => ({
    missionId: m.id,
    name: m.name,
    level: m.level,
    xp: m.xp
  }));

  const xpEarned = state.xpHistory?.[dateStr] || 0;

  const achievementsUnlocked = (state.achievements || [])
    .filter(ach => ach.unlocked && ach.unlockedAt === dateStr)
    .map(ach => ach.name);

  const reflection = state.lifeReflections?.[dateStr] || '';

  return {
    date: dateStr,
    reflection,
    completedQuests,
    studyHours,
    workout,
    prayerCompleted,
    missionProgress,
    xpEarned,
    achievementsUnlocked
  };
}

// Reset daily quests on date change and calculate streak penalties
export function checkInDaily(state: AppState): { streakBroken: boolean; newState: AppState } {
  const today = getTodayDateString();
  const lastActive = state.streak.lastActiveDate;

  if (lastActive === today) {
    // Already checked in today, but let's make sure we filter out past quests and generate today's if missing
    const todayQuests = (state.quests || []).filter(q => q.date === today);
    if (todayQuests.length > 0) {
      return { 
        streakBroken: false, 
        newState: {
          ...state,
          quests: todayQuests
        } 
      };
    } else {
      // No quests for today in the list, regenerate today's daily quests
      const newQuests = generateDailyQuests(state, today);
      return {
        streakBroken: false,
        newState: {
          ...state,
          quests: newQuests
        }
      };
    }
  }

  let streakBroken = false;
  const updatedStreak = { ...state.streak };

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken!
      updatedStreak.currentStreak = 0;
      streakBroken = true;
      playSound('failure', state.settings.soundEnabled);
    }
  }

  // Evaluate previous day's skipped high-priority tasks to trigger anti-procrastination mode
  let missedCount = state.questPlanner?.missedObligatoryCount || 0;
  let procActive = state.questPlanner?.procrastinationModeActive || false;
  let worshipStreaks = state.questPlanner ? { ...state.questPlanner.worshipStreaks } : { Salah: 0, Quran: 0, Adhkar: 0 };
  let completedActsToday = state.questPlanner?.completedActsToday || [];

  if (lastActive) {
    const yesterdayQuests = state.quests.filter(q => q.date === lastActive);
    // Important quests are Obligatory Salah & HSC core study block
    const importantQuests = yesterdayQuests.filter(q => q.id.includes('salah') || q.id.includes('hsc_block'));
    const anyImportantSkipped = importantQuests.length > 0 && importantQuests.some(q => !q.completed);

    if (anyImportantSkipped) {
      missedCount += 1;
      if (missedCount >= 2) {
        procActive = true;
      }
    } else {
      missedCount = 0;
      procActive = false;
    }

    // Reset worship streaks if acts were missed yesterday
    worshipStreaks = { ...worshipStreaks };
    if (!completedActsToday.includes('Salah')) worshipStreaks['Salah'] = 0;
    if (!completedActsToday.includes('Quran')) worshipStreaks['Quran'] = 0;
    if (!completedActsToday.includes('Adhkar')) worshipStreaks['Adhkar'] = 0;
  }

  // Prepare updated planner for today
  let hscCountdown = state.questPlanner?.hscCountdownDays ?? 210;
  if (lastActive && hscCountdown > 0) {
    hscCountdown = Math.max(0, hscCountdown - 1); // countdown ticks down daily
  }

  const updatedPlanner: QuestPlanner = {
    hscCountdownDays: hscCountdown,
    hscWeakerSubjects: state.questPlanner?.hscWeakerSubjects || ['Physics', 'Chemistry', 'Math'],
    gymSchedule: state.questPlanner?.gymSchedule || 'push',
    contentSchedule: state.questPlanner?.contentSchedule || 'scripting',
    availableTimeHours: state.questPlanner?.availableTimeHours || 8,
    energyLevel: state.questPlanner?.energyLevel || 'medium',
    worshipStreaks,
    missedObligatoryCount: missedCount,
    procrastinationModeActive: procActive,
    completedActsToday: [] // reset completed acts for the new day
  };

  // Generate new daily quests for today passing the state with today's planner
  const tempStateForGeneration: AppState = {
    ...state,
    questPlanner: updatedPlanner
  };
  const newQuests = generateDailyQuests(tempStateForGeneration, today);

  // Generate boss battle if Sunday and not active
  const todayObj = new Date();
  let updatedBoss = state.bossBattle;
  if (todayObj.getDay() === 0) { // Sunday
    if (!state.bossBattle || state.bossBattle.weekStartDate !== today) {
      updatedBoss = generateWeeklyBossBattle(today);
    }
  }

  const targetObj = calculateProgressiveStudyGoal(tempStateForGeneration, today);
  let updatedMissions = state.missions;
  if (updatedMissions) {
    updatedMissions = updatedMissions.map(m => {
      if (m.id === 'hsc') {
        const stats = m.stats || {};
        return {
          ...m,
          stats: {
            ...stats,
            dailyGoalHours: targetObj.goalHours
          }
        };
      }
      return m;
    });
  }

  // Generate the archive entry for yesterday
  const updatedArchive = { ...(state.lifeHistoryArchive || {}) };
  if (lastActive && lastActive !== today) {
    updatedArchive[lastActive] = archiveDay(state, lastActive);
  }

  return {
    streakBroken,
    newState: {
      ...state,
      quests: newQuests,
      bossBattle: updatedBoss,
      questPlanner: updatedPlanner,
      streak: {
        ...updatedStreak,
        lastActiveDate: today // Set to today so we are fully checked in
      },
      missions: updatedMissions,
      lifeHistoryArchive: updatedArchive
    }
  };
}

// Log Fitness Action
export function logFitness(state: AppState, log: Omit<FitnessLog, 'date'>): AppState {
  const today = getTodayDateString();
  const newLog: FitnessLog = { ...log, date: today };
  const updatedFitness = [newLog, ...state.fitnessLogs.filter(l => l.date !== today)];

  let nextState = {
    ...state,
    fitnessLogs: updatedFitness
  };

  // Give XP and increase strength/endurance
  let earnedXp = 0;
  if (log.pushups > 0) earnedXp += Math.floor(log.pushups / 5);
  if (log.pullups > 0) earnedXp += Math.floor(log.pullups / 2) * 5;
  if (log.squats > 0) earnedXp += Math.floor(log.squats / 5);
  if (log.runKm > 0) earnedXp += Math.floor(log.runKm * 30);

  // Apply XP to Strength & Agility on both character and fitness mission
  nextState = addMissionAndCharXp(nextState, 'fitness', earnedXp, 'Strength');

  if (log.runKm > 0) {
    nextState = addMissionAndCharXp(nextState, 'fitness', Math.floor(log.runKm * 20), 'Agility');
  }

  // Update fitness mission statistics!
  nextState = updateMissionStats(nextState, 'fitness', (stats) => ({
    ...stats,
    workouts: (stats.workouts || 0) + 1,
    waterLitres: Math.min(stats.waterLitres || 3, (stats.waterLitres || 0) + 1),
    proteinDays: (stats.proteinDays || 0) + (earnedXp > 10 ? 1 : 0)
  }));

  // Update fitness objectives
  nextState = updateMissionObjectiveProgress(nextState, 'fitness', 'fitness_w_gym', 1);
  nextState = updateMissionObjectiveProgress(nextState, 'fitness', 'fitness_w_protein', earnedXp > 10 ? 1 : 0);
  nextState = updateMissionObjectiveProgress(nextState, 'fitness', 'fitness_m_intensity', 1);

  // Update fitness Boss Battle progress
  nextState = updateMissionBossTaskProgress(nextState, 'fitness', 'fitness_b_gym', 1);

  // Check Weekly Boss task updates (task bt_2 is reps, bt_3 is running km)
  if (nextState.bossBattle && nextState.bossBattle.active) {
    const totalReps = log.pushups + log.pullups + log.squats;
    if (totalReps > 0) {
      nextState = updateBossTaskProgress(nextState, 'bt_2', totalReps).newState;
    }
    if (log.runKm > 0) {
      nextState = updateBossTaskProgress(nextState, 'bt_3', log.runKm).newState;
    }
  }

  return updateAchievements(nextState).newState;
}

// Log Learning Action
export function logLearning(state: AppState, log: Omit<LearningLog, 'id' | 'date'>): AppState {
  const today = getTodayDateString();
  const id = `learn_${Date.now()}`;
  const newLog: LearningLog = { ...log, id, date: today };
  const updatedLearning = [newLog, ...state.learningLogs];

  let nextState = {
    ...state,
    learningLogs: updatedLearning
  };

  // XP Rewards: Reward XP based on completed study hours.
  // 30 minutes = Small XP, 1 hour = Medium XP, 2 hours = High XP, 4+ hours = Bonus XP
  // Long uninterrupted focus sessions earn extra rewards.
  const durationMin = log.durationMinutes;
  let earnedXp = 0;
  if (durationMin >= 240) {
    // 4+ hours = Bonus XP
    earnedXp = Math.floor(durationMin * 3.5) + 120; // High rate + bonus
  } else if (durationMin >= 120) {
    // 2 hours = High XP
    earnedXp = Math.floor(durationMin * 3.0) + 50;
  } else if (durationMin >= 60) {
    // 1 hour = Medium XP
    earnedXp = Math.floor(durationMin * 2.5);
  } else if (durationMin >= 30) {
    // 30 minutes = Small XP
    earnedXp = Math.floor(durationMin * 2.0);
  } else {
    earnedXp = Math.max(10, Math.floor(durationMin * 1.5));
  }

  // Extra rewards for long uninterrupted focus sessions:
  if (durationMin >= 90) {
    earnedXp += 80; // 90m uninterrupted focus bonus
  } else if (durationMin >= 50) {
    earnedXp += 30; // 50m uninterrupted focus bonus
  } else if (durationMin >= 25) {
    earnedXp += 10; // 25m focus bonus
  }

  const cat: keyof Character['stats'] = 'Intelligence';
  nextState = addMissionAndCharXp(nextState, 'hsc', earnedXp, cat);

  // Update HSC mission statistics!
  const durationHours = durationMin / 60;
  const isDeep = durationMin >= 50;

  nextState = updateMissionStats(nextState, 'hsc', (stats) => {
    const prevStats = stats || {};
    return {
      ...prevStats,
      studyHours: (prevStats.studyHours || 0) + durationHours,
      focusSessions: (prevStats.focusSessions || 0) + 1,
      deepWorkSessions: (prevStats.deepWorkSessions || 0) + (isDeep ? 1 : 0),
      lifetimeStudyHours: (prevStats.lifetimeStudyHours || 0) + durationHours
    };
  });

  // Update HSC objectives
  nextState = updateMissionObjectiveProgress(nextState, 'hsc', 'hsc_w_hours', durationHours);
  nextState = updateMissionObjectiveProgress(nextState, 'hsc', 'hsc_w_sessions', 1);
  if (isDeep) {
    nextState = updateMissionObjectiveProgress(nextState, 'hsc', 'hsc_w_deep', 1);
  }
  nextState = updateMissionObjectiveProgress(nextState, 'hsc', 'hsc_m_hours', durationHours);
  nextState = updateMissionObjectiveProgress(nextState, 'hsc', 'hsc_m_sessions', 1);

  // Update HSC Boss Battle progress
  nextState = updateMissionBossTaskProgress(nextState, 'hsc', 'hsc_b_study', durationHours);

  // Check Weekly Boss task updates (task bt_5 is reading pages)
  if (log.type === 'book' && nextState.bossBattle && nextState.bossBattle.active) {
    // Assume roughly 1.5 minutes per page
    const pagesRead = Math.round(log.durationMinutes / 1.5);
    nextState = updateBossTaskProgress(nextState, 'bt_5', pagesRead).newState;
  }

  return updateAchievements(nextState).newState;
}

// Log Business Action
export function logBusiness(state: AppState, log: Omit<BusinessLog, 'id' | 'date'>): AppState {
  const today = getTodayDateString();
  const id = `biz_${Date.now()}`;
  const newLog: BusinessLog = { ...log, id, date: today };
  const updatedBusiness = [newLog, ...state.businessLogs];

  let nextState = {
    ...state,
    businessLogs: updatedBusiness
  };

  // Give XP and coins based on work & revenue
  const earnedXp = Math.floor(log.deepWorkHours * 40) + Math.floor(log.completedTasksCount * 15) + (log.projectName?.toLowerCase().includes('win') ? 300 : 0);
  const earnedCoins = Math.floor(log.income || log.revenue || 0) + Math.floor(log.completedTasksCount * 10) + (log.projectName?.toLowerCase().includes('win') ? 500 : 0);

  nextState = addMissionAndCharXp(nextState, 'creator', earnedXp, 'Business');

  if (nextState.character) {
    nextState.character.coins += earnedCoins;
  }

  // Update Creator mission statistics!
  nextState = updateMissionStats(nextState, 'creator', (stats) => ({
    ...stats,
    videosCreated: (stats.videosCreated || 0) + (log.projectName?.toLowerCase().includes('youtube') && log.completedTasksCount > 0 ? 1 : 0),
    contestsSubmitted: (stats.contestsSubmitted || 0) + (log.projectName?.toLowerCase().includes('contest') ? 1 : 0),
    contestsWon: (stats.contestsWon || 0) + (log.projectName?.toLowerCase().includes('contest win') || log.projectName?.toLowerCase().includes('won') ? 1 : 0),
    incomeEarned: (stats.incomeEarned || 0) + (log.income || log.revenue || 0),
    deepWorkHours: (stats.deepWorkHours || 0) + (log.deepWorkHours || 0),
    // Preserve old stats compatibility
    scriptsWritten: (stats.scriptsWritten || 0) + (log.completedTasksCount > 0 ? 1 : 0),
    videosEdited: (stats.videosEdited || 0) + (log.deepWorkHours > 1 ? 1 : 0),
    videosPublished: (stats.videosPublished || 0) + (log.income > 0 ? 1 : 0)
  }));

  // Update Creator objectives
  if (log.projectName?.toLowerCase().includes('youtube') && log.completedTasksCount > 0) {
    nextState = updateMissionObjectiveProgress(nextState, 'creator', 'creator_w_video', 1);
    nextState = updateMissionObjectiveProgress(nextState, 'creator', 'creator_m_videos', 1);
  }
  if (log.projectName?.toLowerCase().includes('contest')) {
    nextState = updateMissionObjectiveProgress(nextState, 'creator', 'creator_w_contest', 1);
    nextState = updateMissionObjectiveProgress(nextState, 'creator', 'creator_m_contests', 1);
    // Update creator Boss Battle progress
    nextState = updateMissionBossTaskProgress(nextState, 'creator', 'creator_b_contest', 1);
  }

  // Check Weekly Boss task updates (task bt_4 is deep work hours)
  if (log.deepWorkHours > 0 && nextState.bossBattle && nextState.bossBattle.active) {
    nextState = updateBossTaskProgress(nextState, 'bt_4', log.deepWorkHours).newState;
  }

  return updateAchievements(nextState).newState;
}

// Log Faith Action
export function logFaith(state: AppState, log: Omit<FaithLog, 'date'>): AppState {
  const today = getTodayDateString();
  const newLog: FaithLog = { ...log, date: today };
  const updatedFaith = [newLog, ...state.faithLogs.filter(l => l.date !== today)];

  let nextState = {
    ...state,
    faithLogs: updatedFaith
  };

  // XP for prayers & quran
  let earnedXp = 0;
  const prayersDone = Object.values(log.prayers).filter(Boolean).length;
  earnedXp += prayersDone * 20;
  earnedXp += log.quranPages * 30;
  earnedXp += Math.floor(log.dhikrCount / 10) * 5;

  nextState = addMissionAndCharXp(nextState, 'faith', earnedXp, 'Faith');

  // Increment mission statistics for prayers, quran pages, dhikr
  nextState = updateMissionStats(nextState, 'faith', (stats) => ({
    ...stats,
    prayersCompleted: (stats.prayersCompleted || 0) + prayersDone,
    quranPages: (stats.quranPages || 0) + log.quranPages,
    dhikrCount: (stats.dhikrCount || 0) + log.dhikrCount
  }));

  // Update weekly objective progress
  nextState = updateMissionObjectiveProgress(nextState, 'faith', 'faith_w_salah', prayersDone);
  nextState = updateMissionObjectiveProgress(nextState, 'faith', 'faith_w_quran', log.quranPages);

  // Update Faith Boss Battle progress
  nextState = updateMissionBossTaskProgress(nextState, 'faith', 'faith_b_salah', prayersDone);

  return updateAchievements(nextState).newState;
}

// ==========================================
// MISSION PROGRESSION SYSTEM IMPLEMENTATION
// ==========================================



export const defaultMissions: Mission[] = [
  {
    id: 'hsc',
    name: 'HSC GPA-5',
    icon: '🎓',
    description: 'Our highest academic priority: secure a pristine GPA-5 in the upcoming HSC board exam.',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    streak: 0,
    rank: 'Novice Scholar',
    stats: {
      studyHours: 0,
      deepWorkSessions: 0,
      focusSessions: 0,
      dailyGoalHours: 2,
      weeklyGoalHours: 35,
      monthlyGoalHours: 150,
      lifetimeStudyHours: 0,
      studyStreak: 0
    },
    weeklyObjectives: [
      { id: 'hsc_w_hours', text: 'Study for 35 Hours', current: 0, target: 35, completed: false, unit: 'Hours' },
      { id: 'hsc_w_sessions', text: 'Complete 15 Focus Sessions', current: 0, target: 15, completed: false, unit: 'Sessions' },
      { id: 'hsc_w_deep', text: 'Complete 5 Deep Work Sessions', current: 0, target: 5, completed: false, unit: 'Sessions' }
    ],
    monthlyObjectives: [
      { id: 'hsc_m_hours', text: 'Complete 150 study hours', current: 0, target: 150, completed: false, unit: 'Hours' },
      { id: 'hsc_m_sessions', text: 'Complete 60 Focus Sessions', current: 0, target: 60, completed: false, unit: 'Sessions' }
    ],
    bossBattle: {
      name: 'The Academic Procrastination Overlord',
      hp: 35,
      maxHp: 35,
      completed: false,
      rewardCoins: 500,
      rewardXp: 1000,
      rewardTitle: 'S-Rank Scholar',
      tasks: [
        { id: 'hsc_b_study', text: 'Log 35 Study Hours this week', current: 0, target: 35, completed: false, unit: 'Hours' }
      ]
    }
  },
  {
    id: 'creator',
    name: 'Creator Economy',
    icon: '💼',
    description: 'Build valuable skills, create digital assets, participate in freelancing contests, grow your online presence, and eventually earn money.',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    streak: 0,
    rank: 'Novice Freelancer',
    stats: {
      videosCreated: 0,
      contestsSubmitted: 0,
      contestsWon: 0,
      incomeEarned: 0,
      deepWorkHours: 0,
      skillsLearned: [],
      ideas: []
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
  },
  {
    id: 'faith',
    name: 'Closer to Allah',
    icon: '🕌',
    description: 'Maintain absolute daily consistency and sincerity in acts of worship for Allah alone.',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    streak: 0,
    rank: 'Seeker of Truth',
    stats: {
      prayersCompleted: 0,
      quranPages: 0,
      dhikrCount: 0,
      charityCount: 0,
      reflectionEntries: 0
    },
    weeklyObjectives: [
      { id: 'faith_w_salah', text: 'Pray all 35 obligatory Salah on time', current: 0, target: 35, completed: false, unit: 'Prayers' },
      { id: 'faith_w_quran', text: 'Read 15 pages of Quran with Tafsir', current: 0, target: 15, completed: false, unit: 'Pages' }
    ],
    monthlyObjectives: [
      { id: 'faith_m_tahajjud', text: 'Pray Tahajjud or Duha 10 times', current: 0, target: 10, completed: false, unit: 'Prayers' },
      { id: 'faith_m_journal', text: 'Write 10 reflection journal entries', current: 0, target: 10, completed: false, unit: 'Entries' }
    ],
    bossBattle: {
      name: 'The Whispers of Nafs (Ego Challenge)',
      hp: 35,
      maxHp: 35,
      completed: false,
      rewardCoins: 500,
      rewardXp: 1000,
      rewardTitle: 'Sincere Servant',
      tasks: [
        { id: 'faith_b_salah', text: 'Complete all 35 Salah on time this week', current: 0, target: 35, completed: false, unit: 'Prayers' }
      ]
    }
  },
  {
    id: 'fitness',
    name: 'Strong Body',
    icon: '💪',
    description: 'Sculpt a strong, agile physical body through workouts, proper sleep, and hydration.',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    streak: 0,
    rank: 'Iron Apprentice',
    stats: {
      workouts: 0,
      proteinDays: 0,
      waterLitres: 0,
      weightLogs: []
    },
    weeklyObjectives: [
      { id: 'fitness_w_gym', text: 'Complete 4 workouts', current: 0, target: 4, completed: false, unit: 'Workouts' },
      { id: 'fitness_w_protein', text: 'Hit protein target (150g) for 5 days', current: 0, target: 5, completed: false, unit: 'Days' }
    ],
    monthlyObjectives: [
      { id: 'fitness_m_intensity', text: 'Log 16 intense gym workouts', current: 0, target: 16, completed: false, unit: 'Workouts' }
    ],
    bossBattle: {
      name: 'The Gravity Titan (Endurance Block)',
      hp: 4,
      maxHp: 4,
      completed: false,
      rewardCoins: 500,
      rewardXp: 1000,
      rewardTitle: 'Indomitable Beast',
      tasks: [
        { id: 'fitness_b_gym', text: 'Finish 4 major workout splits this week', current: 0, target: 4, completed: false, unit: 'Sessions' }
      ]
    }
  }
];

// Hydrate state to guarantee missions list exists
export function ensureMissionsExist(state: AppState): AppState {
  if (!state.missions || state.missions.length === 0) {
    return {
      ...state,
      missions: defaultMissions
    };
  }
  return state;
}

// Map mission ID to corresponding prestigious ranks
export function getMissionRank(missionId: 'hsc' | 'creator' | 'faith' | 'fitness', level: number): string {
  if (missionId === 'hsc') {
    if (level < 10) return 'Novice Scholar';
    if (level < 25) return 'Academic Slayer';
    if (level < 50) return 'A+ Contender';
    if (level < 75) return 'Golden GPA-5 Elite';
    return 'National Topper';
  } else if (missionId === 'creator') {
    if (level < 10) return 'Aspiring Creator';
    if (level < 25) return 'Content Artisan';
    if (level < 50) return 'Scripting Sensei';
    if (level < 75) return 'Algorithm Conqueror';
    return 'Viral Legend';
  } else if (missionId === 'faith') {
    if (level < 10) return 'Seeker of Truth';
    if (level < 25) return 'Faith Practitioner';
    if (level < 50) return 'Consistent Pray-er';
    if (level < 75) return 'Guardian of Sincerity';
    return 'Al-Mumin';
  } else {
    // fitness
    if (level < 10) return 'Iron Apprentice';
    if (level < 25) return 'Gym Regular';
    if (level < 50) return 'Fitness Beast';
    if (level < 75) return 'Titan Lifter';
    return 'Aesthetic God';
  }
}

// Maps category to corresponding mission ID
export function getMissionIdFromCategory(category?: string): 'hsc' | 'creator' | 'faith' | 'fitness' {
  if (!category) return 'fitness';
  if (category === 'Faith') return 'faith';
  if (category === 'Intelligence' || category === 'Knowledge') return 'hsc';
  if (category === 'Business' || category === 'Charisma') return 'creator';
  return 'fitness'; // Default fallback
}

// Add XP to both a mission and the character
export function addMissionAndCharXp(
  state: AppState,
  missionId: 'hsc' | 'creator' | 'faith' | 'fitness',
  amount: number,
  category: keyof Character['stats'] | 'General' = 'General'
): AppState {
  let nextState = ensureMissionsExist(state);

  // Update the specific mission's XP
  const updatedMissions = nextState.missions!.map(m => {
    if (m.id === missionId) {
      let mXp = m.xp + amount;
      let mLevel = m.level;
      let mXpNeeded = 100 * mLevel;

      while (mXp >= mXpNeeded) {
        mXp -= mXpNeeded;
        mLevel += 1;
        mXpNeeded = 100 * mLevel;
        // Reward some bonus gold coins on mission level-up
        if (nextState.character) {
          nextState.character.coins += 50;
        }
      }

      if (mXp < 0) {
        if (mLevel > 1) {
          mLevel -= 1;
          mXpNeeded = 100 * mLevel;
          mXp += mXpNeeded;
        } else {
          mXp = 0;
        }
      }

      const rank = getMissionRank(missionId, mLevel);

      return {
        ...m,
        level: mLevel,
        xp: mXp,
        xpNeeded: mXpNeeded,
        rank
      };
    }
    return m;
  });

  nextState.missions = updatedMissions;

  // Add identical XP to character overall
  const xpRes = addXp(nextState, amount, category);
  return xpRes.newState;
}

// Update helper to increment stats fields inside a specific mission
export function updateMissionStats(
  state: AppState,
  missionId: 'hsc' | 'creator' | 'faith' | 'fitness',
  updater: (stats: { [key: string]: any }) => { [key: string]: any }
): AppState {
  let nextState = ensureMissionsExist(state);
  nextState.missions = nextState.missions!.map(m => {
    if (m.id === missionId) {
      return {
        ...m,
        stats: updater(m.stats || {})
      };
    }
    return m;
  });
  return nextState;
}

// Update weekly/monthly objective progress for a mission
export function updateMissionObjectiveProgress(
  state: AppState,
  missionId: 'hsc' | 'creator' | 'faith' | 'fitness',
  objectiveId: string,
  progressIncrement: number
): AppState {
  let nextState = ensureMissionsExist(state);
  nextState.missions = nextState.missions!.map(m => {
    if (m.id === missionId) {
      const updatedWeekly = m.weeklyObjectives.map(obj => {
        if (obj.id === objectiveId) {
          const current = Math.min(obj.target, obj.current + progressIncrement);
          const completed = current >= obj.target;
          return { ...obj, current, completed };
        }
        return obj;
      });

      const updatedMonthly = m.monthlyObjectives.map(obj => {
        if (obj.id === objectiveId) {
          const current = Math.min(obj.target, obj.current + progressIncrement);
          const completed = current >= obj.target;
          return { ...obj, current, completed };
        }
        return obj;
      });

      return {
        ...m,
        weeklyObjectives: updatedWeekly,
        monthlyObjectives: updatedMonthly
      };
    }
    return m;
  });
  return nextState;
}

// Update boss challenge task progress for a mission
export function updateMissionBossTaskProgress(
  state: AppState,
  missionId: 'hsc' | 'creator' | 'faith' | 'fitness',
  taskId: string,
  progressIncrement: number
): AppState {
  let nextState = ensureMissionsExist(state);
  nextState.missions = nextState.missions!.map(m => {
    if (m.id === missionId && !m.bossBattle.completed) {
      const updatedTasks = m.bossBattle.tasks.map(t => {
        if (t.id === taskId) {
          const current = Math.min(t.target, t.current + progressIncrement);
          const completed = current >= t.target;
          return { ...t, current, completed };
        }
        return t;
      });

      const allCompleted = updatedTasks.every(t => t.completed);
      let hp = m.bossBattle.hp;
      if (allCompleted) {
        hp = 0;
      } else {
        // Decrease HP based on completed tasks
        const completedCount = updatedTasks.filter(t => t.completed).length;
        hp = Math.max(0, m.bossBattle.maxHp - completedCount);
      }

      const bossCompleted = hp === 0;

      if (bossCompleted && !m.bossBattle.completed && nextState.character) {
        // Reward boss defeat
        nextState.character.coins += m.bossBattle.rewardCoins;
        // Add to active title list if not exists
        if (!nextState.character.titles.includes(m.bossBattle.rewardTitle)) {
          nextState.character.titles.push(m.bossBattle.rewardTitle);
        }
        // Also award mission XP
        setTimeout(() => {
          playSound('achievement', state.settings.soundEnabled);
        }, 100);
      }

      return {
        ...m,
        bossBattle: {
          ...m.bossBattle,
          tasks: updatedTasks,
          hp,
          completed: bossCompleted
        }
      };
    }
    return m;
  });
  return nextState;
}

