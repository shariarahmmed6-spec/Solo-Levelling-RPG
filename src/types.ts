export interface StatProgress {
  level: number;
  xp: number;
  xpNeeded: number;
}

export interface Character {
  name: string;
  avatar: string; // URL or local emoji/svg identifier
  level: number;
  rank: string;
  xp: number;
  xpNeeded: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  activeTitle: string;
  titles: string[];
  stats: {
    Strength: StatProgress;
    Agility: StatProgress;
    Endurance: StatProgress;
    Intelligence: StatProgress;
    Discipline: StatProgress;
    Charisma: StatProgress;
    Knowledge: StatProgress;
    Faith: StatProgress;
    Vitality: StatProgress;
    Business: StatProgress;
  };
}

export interface Quest {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  category: keyof Character['stats'] | 'General';
  completed: boolean;
  date: string; // YYYY-MM-DD
  xpReward: number;
  coinReward: number;
  missionId?: 'hsc' | 'creator' | 'faith' | 'fitness';
}

export interface BossTask {
  id: string;
  text: string;
  completed: boolean;
  target: number;
  current: number;
  unit: string;
  category: keyof Character['stats'] | 'General';
}

export interface BossBattle {
  active: boolean;
  name: string;
  hp: number;
  maxHp: number;
  tasks: BossTask[];
  rewardXp: number;
  rewardCoins: number;
  rewardTitle: string;
  rewardBadge: string;
  completed: boolean;
  weekStartDate: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Name of Lucide icon
  category: 'General' | 'Fitness' | 'Learning' | 'Business' | 'Faith' | 'Streak';
  progressCurrent: number;
  progressGoal: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardCoins: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'potion' | 'energy' | 'chest_rare' | 'chest_epic' | 'chest_legendary' | 'cosmetic' | 'title';
  description: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string; // Lucide icon name
  effectValue?: number; // e.g. HP or Energy recovery value
}

// Trackers
export interface FitnessLog {
  date: string; // YYYY-MM-DD
  pushups: number;
  pullups: number;
  squats: number;
  runKm: number;
  runMinutes: number;
  calories: number;
  weight: number;
  bodyFat: number;
  notes: string;
  photoUrl?: string; // local simulation URL/base64
}

export interface LearningLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'book' | 'course' | 'video' | 'other';
  title: string;
  durationMinutes: number;
  progressPercent: number;
  notes: string;
}

export interface BusinessLog {
  id: string;
  date: string; // YYYY-MM-DD
  deepWorkHours: number;
  income: number;
  clientsCount: number;
  revenue: number;
  projectName: string;
  completedTasksCount: number;
}

export interface FaithLog {
  date: string; // YYYY-MM-DD
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  quranPages: number;
  dhikrCount: number;
  lastDhikrPhrase: string;
}

// Streaks
export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  weeklyStreak: number;
  monthlyStreak: number;
}

export interface LifeCalendarSettings {
  expectedLifespanYears: number; // default 60
  birthDate: string; // YYYY-MM-DD, default '2007-04-17'
  themeColor: 'cyan' | 'emerald' | 'amber' | 'blue' | 'rose'; // default 'cyan'
  showStats: boolean; // default true
  showMotivations: boolean; // default true
  customMilestones?: { id: string; ageYears: number; label: string }[];
}

export interface DailyLifeArchive {
  date: string; // YYYY-MM-DD
  reflection?: string;
  completedQuests: { id: string; text: string; category: string; difficulty: string; xpReward: number; coinReward: number }[];
  studyHours: number;
  workout: { pushups: number; pullups: number; squats: number; runKm: number; calories: number } | null;
  prayerCompleted: { fajr: boolean; dhuhr: boolean; asr: boolean; maghrib: boolean; isha: boolean } | null;
  missionProgress: { missionId: string; name: string; level: number; xp: number }[];
  xpEarned: number;
  achievementsUnlocked: string[];
}

// Full State for localStorage
export interface QuestPlanner {
  hscCountdownDays: number;
  hscWeakerSubjects: string[];
  gymSchedule: 'push' | 'pull' | 'legs' | 'cardio' | 'rest';
  contentSchedule: 'scripting' | 'recording' | 'editing' | 'uploading' | 'analyzing';
  availableTimeHours: number;
  energyLevel: 'low' | 'medium' | 'high';
  worshipStreaks: { [act: string]: number };
  missedObligatoryCount: number;
  procrastinationModeActive: boolean;
  completedActsToday: string[];
}

export interface MissionObjective {
  id: string;
  text: string;
  current: number;
  target: number;
  completed: boolean;
  unit: string;
}

export interface MissionBoss {
  name: string;
  hp: number;
  maxHp: number;
  completed: boolean;
  rewardCoins: number;
  rewardXp: number;
  rewardTitle: string;
  tasks: {
    id: string;
    text: string;
    current: number;
    target: number;
    completed: boolean;
    unit: string;
  }[];
}

export interface Mission {
  id: 'hsc' | 'creator' | 'faith' | 'fitness';
  name: string;
  icon: string;
  description: string;
  level: number;
  xp: number;
  xpNeeded: number;
  rank: string;
  streak: number;
  stats: { [key: string]: any };
  weeklyObjectives: MissionObjective[];
  monthlyObjectives: MissionObjective[];
  bossBattle: MissionBoss;
}

export interface AppState {
  character: Character | null;
  quests: Quest[];
  bossBattle: BossBattle | null;
  achievements: Achievement[];
  inventory: InventoryItem[];
  fitnessLogs: FitnessLog[];
  learningLogs: LearningLog[];
  businessLogs: BusinessLog[];
  faithLogs: FaithLog[];
  streak: StreakState;
  xpHistory: { [date: string]: number }; // Heatmap: YYYY-MM-DD -> XP earned
  settings: {
    pinLock: string; // Empty if disabled
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    notificationsEnabled: boolean;
    themeMode: 'dark-cyber' | 'neon-blue' | 'monarch-purple';
  };
  questPlanner?: QuestPlanner;
  missions?: Mission[];
  lifeCalendarSettings?: LifeCalendarSettings;
  lifeReflections?: { [date: string]: string };
  lifeHistoryArchive?: { [date: string]: DailyLifeArchive };
}
