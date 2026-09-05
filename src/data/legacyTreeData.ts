import {
  AppState,
  LegacyTreeData,
  LegacyMilestone,
  LegacyRelic,
  MemoryCapsule,
  TreeStage,
  GrowthCategory,
  SeasonMode
} from '../types';

export interface BranchCategoryMeta {
  id: GrowthCategory;
  name: string;
  branchName: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  description: string;
  iconName: string;
}

export const BRANCH_CATEGORIES: Record<GrowthCategory, BranchCategoryMeta> = {
  education: {
    id: 'education',
    name: 'Education',
    branchName: 'Knowledge Branch',
    color: '#00F2FE',
    glowColor: 'rgba(0, 242, 254, 0.6)',
    bgGradient: 'from-cyan-500/20 to-blue-500/10',
    description: 'Expanded through study hours, academic mastery, and intellectual breakthroughs.',
    iconName: 'BookOpen'
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    branchName: 'Strength Branch',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'from-red-500/20 to-rose-500/10',
    description: 'Strengthened through grueling physical training, personal records, and unbroken discipline.',
    iconName: 'Flame'
  },
  faith: {
    id: 'faith',
    name: 'Faith',
    branchName: 'Light Branch',
    color: '#FDE047',
    glowColor: 'rgba(253, 224, 71, 0.6)',
    bgGradient: 'from-yellow-400/20 to-amber-500/10',
    description: 'Nourished by daily prayer (Salah), Quranic recitation, and sincere spiritual devotion.',
    iconName: 'Sun'
  },
  career: {
    id: 'career',
    name: 'Career & Business',
    branchName: 'Prosperity Branch',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    description: 'Gilded with golden leaves through deep work sessions, revenue generation, and enterprise.',
    iconName: 'Coins'
  },
  creativity: {
    id: 'creativity',
    name: 'Creativity',
    branchName: 'Inspiration Branch',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-500/20 to-violet-500/10',
    description: 'Unfurling vibrant violet petals through content creation, scripting, design, and innovation.',
    iconName: 'Palette'
  },
  health: {
    id: 'health',
    name: 'Health',
    branchName: 'Vitality Branch',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    description: 'Rejuvenated by restful sleep, optimal hydration, balanced nutrition, and energy management.',
    iconName: 'HeartPulse'
  },
  discipline: {
    id: 'discipline',
    name: 'Discipline',
    branchName: 'Deep Roots',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    bgGradient: 'from-sky-500/20 to-cyan-500/10',
    description: 'Underground mycorrhizal roots extending deep into the earth with every single day you show up.',
    iconName: 'Shield'
  }
};

export const INITIAL_LEGACY_RELICS: LegacyRelic[] = [
  {
    id: 'crystal_fruit',
    name: 'Crystal Fruit of Wisdom',
    category: 'education',
    description: 'A translucent crystalline fruit pulsing with deep knowledge and pristine mental clarity.',
    lore: 'Born from hundreds of hours of intense cerebral focus. Its facets reflect the eternal library of the mind.',
    icon: 'Gem',
    unlocked: false,
    unlockedAt: null,
    color: '#38BDF8',
    branchTarget: 'Knowledge Branch'
  },
  {
    id: 'golden_leaf',
    name: 'Golden Leaf of Prosperity',
    category: 'career',
    description: 'A leaf of pure woven gold, humming with the energetic pulse of fruitful enterprise.',
    lore: 'Sprouted when deliberate labor transformed ambition into real-world prosperity and sovereign freedom.',
    icon: 'Coins',
    unlocked: false,
    unlockedAt: null,
    color: '#FBBF24',
    branchTarget: 'Prosperity Branch'
  },
  {
    id: 'ancient_rune',
    name: 'Ancient Celestial Rune',
    category: 'faith',
    description: 'An ethereal celestial glyph etched in timeless golden light that warms the spirit.',
    lore: 'Inscribed through unwavering daily worship and devotion. It radiates tranquility in the darkest nights.',
    icon: 'Sparkles',
    unlocked: false,
    unlockedAt: null,
    color: '#FDE047',
    branchTarget: 'Light Branch'
  },
  {
    id: 'eternal_bloom',
    name: 'Eternal Bloom of Discipline',
    category: 'discipline',
    description: 'A perpetual flower that never wilts, anchored deep within the subterranean bedrock.',
    lore: 'Flourishes only when habit ceases to be an effort and becomes second nature through unbroken streaks.',
    icon: 'Flower2',
    unlocked: false,
    unlockedAt: null,
    color: '#34D399',
    branchTarget: 'Deep Roots'
  },
  {
    id: 'shadow_seed',
    name: 'Shadow Seed of Ascension',
    category: 'fitness',
    description: 'A dense, gravitational core enveloped in violet-black monarch energy.',
    lore: 'Claimed through the total vanquishing of inner fatigue and triumphant victory over system dungeon bosses.',
    icon: 'Zap',
    unlocked: false,
    unlockedAt: null,
    color: '#C084FC',
    branchTarget: 'Strength Branch'
  }
];

export const INITIAL_LEGACY_MILESTONES: LegacyMilestone[] = [
  // --- EDUCATION / KNOWLEDGE BRANCH ---
  {
    id: 'edu_1',
    category: 'education',
    title: 'First 10 Study Hours',
    description: 'Complete your first 10 hours of documented learning or deep study.',
    requirementDesc: 'Accumulate 10 study/learning hours',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The flame of understanding begins with a single hour of quiet attention.'
  },
  {
    id: 'edu_2',
    category: 'education',
    title: 'Century of Wisdom (100 Study Hours)',
    description: 'Master 100 hours of curriculum, technical books, or skill acquisition.',
    requirementDesc: 'Reach 100 accumulated study hours',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Knowledge compounds like interest; what was once foreign is now second nature.'
  },
  {
    id: 'edu_3',
    category: 'education',
    title: 'Scholar’s Ascent (300 Study Hours)',
    description: 'Achieve 300 documented hours of deliberate learning.',
    requirementDesc: 'Reach 300 accumulated study hours',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The mind expands beyond the boundaries of ordinary thought.'
  },
  {
    id: 'edu_4',
    category: 'education',
    title: 'Academic Supremacy (Exam Victory)',
    description: 'Cross 500 study hours or complete major academic milestone objectives.',
    requirementDesc: '500+ study hours or 40+ learning logs',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    relicRewardId: 'crystal_fruit',
    reflectionQuote: 'A monument of intellect etched into the canopy of your personal history.'
  },

  // --- FITNESS / STRENGTH BRANCH ---
  {
    id: 'fit_1',
    category: 'fitness',
    title: 'Initiation of Iron (First Workout)',
    description: 'Complete and record your first physical training session.',
    requirementDesc: 'Log 1 completed workout session',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Your body heard the command of the mind and chose to respond.'
  },
  {
    id: 'fit_2',
    category: 'fitness',
    title: 'Iron Vanguard (50 Workouts)',
    description: 'Complete 50 logged workouts across gym, calisthenics, or cardio.',
    requirementDesc: 'Log 50 workout sessions',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Fifty times you entered the arena of fatigue and walked out transformed.'
  },
  {
    id: 'fit_3',
    category: 'fitness',
    title: 'Peak Condition: First PR',
    description: 'Log 50+ pushups, 15+ pullups, or 100+ squats in a single session.',
    requirementDesc: 'Set a verified personal record in pushups, pullups, or squats',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Limits are psychological thresholds masquerading as biological barriers.'
  },
  {
    id: 'fit_4',
    category: 'fitness',
    title: 'Centurion of Physical Mastery',
    description: 'Achieve 100 logged workouts and maintain physical discipline.',
    requirementDesc: 'Log 100+ workouts or vanquish a weekly boss',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    relicRewardId: 'shadow_seed',
    reflectionQuote: 'An unbreakable vessel forged through sweat, gravity, and steel.'
  },

  // --- FAITH / LIGHT BRANCH ---
  {
    id: 'faith_1',
    category: 'faith',
    title: '7 Days of Salah',
    description: 'Perform all daily prayers consistently for 7 consecutive days.',
    requirementDesc: 'Maintain a 7-day worship or prayer streak',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Seven days of aligning the heart before the Creator of the heavens and the earth.'
  },
  {
    id: 'faith_2',
    category: 'faith',
    title: '30 Days of Unbroken Devotion',
    description: 'Maintain 30 days of prayer and spiritual remembrance.',
    requirementDesc: 'Maintain a 30-day worship streak or 30 faith logs',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Consistency in prayer is the quiet axis upon which a chaotic world finds peace.'
  },
  {
    id: 'faith_3',
    category: 'faith',
    title: 'Quranic Luminary',
    description: 'Read and reflect upon 100+ pages of the Holy Quran.',
    requirementDesc: 'Log 100+ pages of Quran recitation or 20 Quran logs',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Words of light illuminate the dark corners of the soul.'
  },
  {
    id: 'faith_4',
    category: 'faith',
    title: 'Pillar of Light',
    description: 'Complete 50 days of faithful devotion and continuous remembrance.',
    requirementDesc: '50+ days of prayer and reflection logged',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    relicRewardId: 'ancient_rune',
    reflectionQuote: 'Anchored to the Divine, no earthly storm can shake your foundations.'
  },

  // --- CAREER / PROSPERITY BRANCH ---
  {
    id: 'car_1',
    category: 'career',
    title: 'First Commercial Initiative',
    description: 'Log your first deep work session or project milestone.',
    requirementDesc: 'Log 1 deep work or business initiative session',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The intention to create real value is the starting point of all prosperity.'
  },
  {
    id: 'car_2',
    category: 'career',
    title: 'Enterprise Velocity (50 Deep Work Hours)',
    description: 'Log 50 hours of uninterrupted deep work on projects or client deliverables.',
    requirementDesc: 'Accumulate 50 deep work hours',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Focus is the currency of the modern age. You have invested it wisely.'
  },
  {
    id: 'car_3',
    category: 'career',
    title: 'Prosperity Breakthrough',
    description: 'Generate commercial revenue or complete 10 client project tasks.',
    requirementDesc: 'Log income, revenue, or 10 completed project tasks',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Competence meets opportunity, yielding tangible independence.'
  },
  {
    id: 'car_4',
    category: 'career',
    title: 'Mastery of Enterprise (100+ Deep Work Hours)',
    description: 'Log 100+ hours of high-leverage business execution.',
    requirementDesc: '100+ deep work hours or 20+ completed project tasks',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    relicRewardId: 'golden_leaf',
    reflectionQuote: 'Leaves of pure gold now flourish on your Prosperity Branch.'
  },

  // --- CREATIVITY / INSPIRATION BRANCH ---
  {
    id: 'cre_1',
    category: 'creativity',
    title: 'Spark of Creation',
    description: 'Log your first creative writing, video, coding, or design session.',
    requirementDesc: 'Log 1 creative or content creation session',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'To bring something into existence from imagination is a divine spark.'
  },
  {
    id: 'cre_2',
    category: 'creativity',
    title: 'Prolific Artisan (15 Creative Sessions)',
    description: 'Complete 15 creative or content production sessions.',
    requirementDesc: 'Log 15 creative or content sessions',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Inspiration does not wait for the muse; it greets the artisan who sits to work.'
  },
  {
    id: 'cre_3',
    category: 'creativity',
    title: 'Master Craftsman (35 Creative Sessions)',
    description: 'Complete 35 creative sessions across design, writing, or media.',
    requirementDesc: 'Log 35 creative or content sessions',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Your voice gains clarity, resonance, and distinct identity.'
  },
  {
    id: 'cre_4',
    category: 'creativity',
    title: 'Cosmic Muse (50+ Milestones)',
    description: 'Produce 50+ creative works or milestones.',
    requirementDesc: '50+ creative sessions or advanced creative achievements',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The Inspiration Branch glows with radiant violet starlight blossoms.'
  },

  // --- HEALTH / VITALITY BRANCH ---
  {
    id: 'hea_1',
    category: 'health',
    title: 'Vitality Awakened',
    description: 'Log 5 days of health, hydration, or sleep habits.',
    requirementDesc: 'Log 5 health/fitness activity records',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Rest is not the absence of action, but the biological prerequisite for excellence.'
  },
  {
    id: 'hea_2',
    category: 'health',
    title: 'Bio-Harmonic Equilibrium',
    description: 'Log 25 records of healthy hydration, sleep, and physical recovery.',
    requirementDesc: 'Log 25 health/fitness activity records',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'A clear mind thrives in an energized, nourished physiology.'
  },
  {
    id: 'hea_3',
    category: 'health',
    title: 'Peak Vitality (60 Health Records)',
    description: 'Demonstrate continuous physiological care across 60 records.',
    requirementDesc: 'Log 60 health/fitness activity records',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Vitality is the bedrock upon which all ambition is built.'
  },
  {
    id: 'hea_4',
    category: 'health',
    title: 'Living Spring of Vitality',
    description: 'Accumulate 100+ health logs and optimal wellness habits.',
    requirementDesc: '100+ health activity records logged',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The emerald leaves of Vitality cascade with boundless natural energy.'
  },

  // --- DISCIPLINE / ROOT GROWTH ---
  {
    id: 'disc_1',
    category: 'discipline',
    title: 'Genesis Root (7-Day Streak)',
    description: 'Complete tasks and check in for 7 consecutive days.',
    requirementDesc: 'Reach a 7-day daily streak',
    branchLevel: 1,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'The first roots penetrate the dark soil, anchoring your resolve.'
  },
  {
    id: 'disc_2',
    category: 'discipline',
    title: 'Iron Taproot (30-Day Streak)',
    description: 'Sustain unbroken discipline for 30 consecutive days.',
    requirementDesc: 'Reach a 30-day daily streak',
    branchLevel: 2,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'One month of daily commitment transforms intention into character.'
  },
  {
    id: 'disc_3',
    category: 'discipline',
    title: 'Subterranean Network (100-Day Streak)',
    description: 'Reach a 100-day streak or 60 distinct active calendar days.',
    requirementDesc: 'Reach a 100-day streak or 60 Life Calendar days',
    branchLevel: 3,
    unlocked: false,
    unlockedAt: null,
    reflectionQuote: 'Your roots have woven through stone and subterranean crystal.'
  },
  {
    id: 'disc_4',
    category: 'discipline',
    title: 'Bedrock of the Sovereign (365-Day Streak)',
    description: 'Complete 365 days of unbroken consistency or 180 active calendar days.',
    requirementDesc: 'Reach a 365-day streak or 180 Life Calendar active days',
    branchLevel: 4,
    unlocked: false,
    unlockedAt: null,
    relicRewardId: 'eternal_bloom',
    reflectionQuote: 'Deep beneath the visible world lies an unshakeable mountain of discipline.'
  }
];

export const DAILY_EMOTIONAL_QUOTES: string[] = [
  'Your tree remembers every act of discipline.',
  'Roots grow in silence.',
  'The strongest branches were built one day at a time.',
  'What is built in secret flourishes in the light.',
  'No storm can overturn what was anchored by daily faith.',
  'Every deep root was once a fragile seed that refused to quit.',
  'Consistency is the quiet architecture of greatness.',
  'When you show up on the hard days, the subterranean roots drink the deepest.',
  'A leaf does not rush its unfolding; honor your natural pace of growth.',
  'The soil of patience yields the sweetest fruit of legacy.'
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return DAILY_EMOTIONAL_QUOTES[dayOfYear % DAILY_EMOTIONAL_QUOTES.length];
}

export function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
  if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return 'autumn'; // Sep, Oct, Nov
  return 'winter'; // Dec, Jan, Feb
}

export const INITIAL_LEGACY_TREE: LegacyTreeData = {
  stage: 'seed',
  totalLeaves: 0,
  seasonMode: 'auto',
  seasonalEnabled: true,
  milestones: INITIAL_LEGACY_MILESTONES,
  relics: INITIAL_LEGACY_RELICS,
  memoryCapsules: [],
  lastDailyMessageDate: undefined,
  isEternalAwakened: false
};

// Main evaluation function for the Legacy Tree
export function evaluateLegacyTree(state: AppState): {
  updatedTree: LegacyTreeData;
  newlyGrownBranches: string[];
  newlyUnlockedRelics: LegacyRelic[];
  newCapsules: MemoryCapsule[];
  stageChanged: boolean;
} {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentTree: LegacyTreeData = state.legacyTree
    ? {
        ...state.legacyTree,
        milestones: state.legacyTree.milestones?.length ? [...state.legacyTree.milestones] : [...INITIAL_LEGACY_MILESTONES],
        relics: state.legacyTree.relics?.length ? [...state.legacyTree.relics] : [...INITIAL_LEGACY_RELICS],
        memoryCapsules: state.legacyTree.memoryCapsules ? [...state.legacyTree.memoryCapsules] : []
      }
    : { ...INITIAL_LEGACY_TREE };

  // Calculate Metrics from state
  // 1. Education: Total Study Hours
  let totalStudyHours = 0;
  state.learningLogs?.forEach(log => {
    totalStudyHours += (log.durationMinutes || 0) / 60;
  });
  if (state.lifeHistoryArchive) {
    Object.values(state.lifeHistoryArchive).forEach(archive => {
      if (archive.studyHours) totalStudyHours += archive.studyHours;
    });
  }
  const learningLogCount = state.learningLogs?.length || 0;

  // 2. Fitness: Workouts & PRs
  const fitnessLogCount = state.fitnessLogs?.length || 0;
  let maxPushups = 0;
  let maxPullups = 0;
  let maxSquats = 0;
  state.fitnessLogs?.forEach(f => {
    if (f.pushups > maxPushups) maxPushups = f.pushups;
    if (f.pullups > maxPullups) maxPullups = f.pullups;
    if (f.squats > maxSquats) maxSquats = f.squats;
  });

  // 3. Faith: Prayer & Worship
  const faithLogCount = state.faithLogs?.length || 0;
  let totalQuranPages = 0;
  state.faithLogs?.forEach(f => {
    totalQuranPages += f.quranPages || 0;
  });
  const worshipStreak = state.questPlanner?.worshipStreaks?.['Salah'] || 0;

  // 4. Career: Deep Work & Revenue
  let totalDeepWorkHours = 0;
  let totalRevenue = 0;
  let totalBusinessTasks = 0;
  state.businessLogs?.forEach(b => {
    totalDeepWorkHours += b.deepWorkHours || 0;
    totalRevenue += b.revenue || b.income || 0;
    totalBusinessTasks += b.completedTasksCount || 0;
  });

  // 5. Creativity: Creative Sessions
  const creativeLogsCount = (state.learningLogs?.filter(l => l.type === 'video' || l.type === 'other')?.length || 0) +
    (state.questPlanner?.contentSchedule ? 10 : 0);

  // 6. Health: Activity & Sleep Records
  const healthRecordsCount = (state.fitnessLogs?.length || 0) + (state.faithLogs?.length || 0);

  // 7. Discipline: Streaks & Active Days
  const currentStreak = state.streak?.currentStreak || 0;
  const longestStreak = state.streak?.longestStreak || 0;
  const activeDaysSet = new Set<string>();
  if (state.xpHistory) {
    Object.keys(state.xpHistory).forEach(d => activeDaysSet.add(d));
  }
  if (state.lifeHistoryArchive) {
    Object.keys(state.lifeHistoryArchive).forEach(d => activeDaysSet.add(d));
  }
  const totalActiveDays = activeDaysSet.size;

  // 8. Boss & Quests
  const hasDefeatedBoss = Boolean(
    state.bossBattle?.completed ||
    state.missions?.some(m => m.bossBattle?.completed)
  );
  const totalCompletedQuests = state.quests?.filter(q => q.completed).length || 0;

  const newlyGrownBranches: string[] = [];
  const newlyUnlockedRelics: LegacyRelic[] = [];
  const newCapsules: MemoryCapsule[] = [];

  // Evaluate each milestone
  currentTree.milestones.forEach(milestone => {
    if (milestone.unlocked) return; // already unlocked

    let isUnlocked = false;

    switch (milestone.id) {
      // Education
      case 'edu_1':
        isUnlocked = totalStudyHours >= 10 || learningLogCount >= 3;
        break;
      case 'edu_2':
        isUnlocked = totalStudyHours >= 100 || learningLogCount >= 15;
        break;
      case 'edu_3':
        isUnlocked = totalStudyHours >= 300 || learningLogCount >= 30;
        break;
      case 'edu_4':
        isUnlocked = totalStudyHours >= 500 || learningLogCount >= 45;
        break;

      // Fitness
      case 'fit_1':
        isUnlocked = fitnessLogCount >= 1;
        break;
      case 'fit_2':
        isUnlocked = fitnessLogCount >= 50;
        break;
      case 'fit_3':
        isUnlocked = maxPushups >= 50 || maxPullups >= 15 || maxSquats >= 100 || fitnessLogCount >= 20;
        break;
      case 'fit_4':
        isUnlocked = fitnessLogCount >= 100 || hasDefeatedBoss;
        break;

      // Faith
      case 'faith_1':
        isUnlocked = faithLogCount >= 7 || worshipStreak >= 7;
        break;
      case 'faith_2':
        isUnlocked = faithLogCount >= 30 || worshipStreak >= 30;
        break;
      case 'faith_3':
        isUnlocked = totalQuranPages >= 100 || faithLogCount >= 20;
        break;
      case 'faith_4':
        isUnlocked = faithLogCount >= 50 || worshipStreak >= 50;
        break;

      // Career
      case 'car_1':
        isUnlocked = totalDeepWorkHours >= 5 || state.businessLogs?.length >= 1;
        break;
      case 'car_2':
        isUnlocked = totalDeepWorkHours >= 50 || state.businessLogs?.length >= 10;
        break;
      case 'car_3':
        isUnlocked = totalRevenue >= 500 || totalBusinessTasks >= 10;
        break;
      case 'car_4':
        isUnlocked = totalDeepWorkHours >= 100 || totalBusinessTasks >= 20;
        break;

      // Creativity
      case 'cre_1':
        isUnlocked = creativeLogsCount >= 1 || learningLogCount >= 2;
        break;
      case 'cre_2':
        isUnlocked = creativeLogsCount >= 15 || learningLogCount >= 10;
        break;
      case 'cre_3':
        isUnlocked = creativeLogsCount >= 35 || learningLogCount >= 25;
        break;
      case 'cre_4':
        isUnlocked = creativeLogsCount >= 50 || learningLogCount >= 40;
        break;

      // Health
      case 'hea_1':
        isUnlocked = healthRecordsCount >= 5;
        break;
      case 'hea_2':
        isUnlocked = healthRecordsCount >= 25;
        break;
      case 'hea_3':
        isUnlocked = healthRecordsCount >= 60;
        break;
      case 'hea_4':
        isUnlocked = healthRecordsCount >= 100;
        break;

      // Discipline
      case 'disc_1':
        isUnlocked = currentStreak >= 7 || longestStreak >= 7 || totalActiveDays >= 7;
        break;
      case 'disc_2':
        isUnlocked = currentStreak >= 30 || longestStreak >= 30 || totalActiveDays >= 30;
        break;
      case 'disc_3':
        isUnlocked = longestStreak >= 100 || totalActiveDays >= 60;
        break;
      case 'disc_4':
        isUnlocked = longestStreak >= 365 || totalActiveDays >= 180;
        break;
    }

    if (isUnlocked) {
      milestone.unlocked = true;
      milestone.unlockedAt = todayStr;
      const meta = BRANCH_CATEGORIES[milestone.category];
      newlyGrownBranches.push(meta.branchName);

      // Check for relic reward
      if (milestone.relicRewardId) {
        const relic = currentTree.relics.find(r => r.id === milestone.relicRewardId);
        if (relic && !relic.unlocked) {
          relic.unlocked = true;
          relic.unlockedAt = todayStr;
          newlyUnlockedRelics.push(relic);
        }
      }

      // Automatically create a Memory Capsule for this moment!
      const capsule: MemoryCapsule = {
        id: `capsule_${milestone.id}_${Date.now()}`,
        date: todayStr,
        milestoneTitle: milestone.title,
        branchName: meta.branchName,
        category: milestone.category,
        level: state.character?.level || 1,
        rank: state.character?.rank || 'F-Rank',
        reflection: milestone.reflectionQuote
      };
      newCapsules.push(capsule);
      currentTree.memoryCapsules.unshift(capsule);
    }
  });

  // Calculate total unlocked milestones
  const unlockedCount = currentTree.milestones.filter(m => m.unlocked).length;

  // Determine stage progression
  const previousStage = currentTree.stage;
  let nextStage: TreeStage = 'seed';

  if (unlockedCount === 0) {
    nextStage = 'seed';
  } else if (unlockedCount <= 4) {
    nextStage = 'sprout';
  } else if (unlockedCount <= 10) {
    nextStage = 'young_tree';
  } else if (unlockedCount <= 18) {
    nextStage = 'growing_tree';
  } else if (unlockedCount <= 24) {
    nextStage = 'ancient_tree';
  } else {
    nextStage = 'legendary_tree';
  }

  // Check Eternal Tree requirement
  const allRelicsUnlocked = currentTree.relics.every(r => r.unlocked);
  if (unlockedCount >= 26 && allRelicsUnlocked) {
    nextStage = 'eternal_tree';
    currentTree.isEternalAwakened = true;
  }

  const stageChanged = previousStage !== nextStage;
  currentTree.stage = nextStage;

  // Total Leaves calculation: Completed quests * 5 + unlocked milestones * 25 + active days * 3
  currentTree.totalLeaves = (totalCompletedQuests * 5) + (unlockedCount * 25) + (totalActiveDays * 3);

  return {
    updatedTree: currentTree,
    newlyGrownBranches,
    newlyUnlockedRelics,
    newCapsules,
    stageChanged
  };
}
