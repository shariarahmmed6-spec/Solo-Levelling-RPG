import { UserGoal, Mission, Quest, Character } from '../types';

export type GoalCategory =
  | 'Education'
  | 'Fitness'
  | 'Faith'
  | 'Finance'
  | 'Career'
  | 'Business'
  | 'Skills'
  | 'Health'
  | 'Personal Growth';

/**
 * Smart AI detection of category based on natural language input
 */
export function detectCategory(text: string): GoalCategory {
  const lower = text.toLowerCase().trim();

  // Faith keywords
  if (
    lower.includes('pray') ||
    lower.includes('salah') ||
    lower.includes('namaz') ||
    lower.includes('allah') ||
    lower.includes('god') ||
    lower.includes('quran') ||
    lower.includes('faith') ||
    lower.includes('deen') ||
    lower.includes('dhikr') ||
    lower.includes('worship') ||
    lower.includes('spiritual') ||
    lower.includes('bible') ||
    lower.includes('mosque')
  ) {
    return 'Faith';
  }

  // Fitness keywords
  if (
    lower.includes('muscle') ||
    lower.includes('gym') ||
    lower.includes('workout') ||
    lower.includes('lift') ||
    lower.includes('bench') ||
    lower.includes('pushup') ||
    lower.includes('squat') ||
    lower.includes('pullup') ||
    lower.includes('run') ||
    lower.includes('cardio') ||
    lower.includes('stamina') ||
    lower.includes('endurance') ||
    lower.includes('train') ||
    lower.includes('bodybuild') ||
    lower.includes('exercise') ||
    lower.includes('fitness') ||
    lower.includes('abs')
  ) {
    return 'Fitness';
  }

  // Health keywords
  if (
    lower.includes('health') ||
    lower.includes('sleep') ||
    lower.includes('water') ||
    lower.includes('hydrate') ||
    lower.includes('diet') ||
    lower.includes('nutrition') ||
    lower.includes('weight') ||
    lower.includes('fat') ||
    lower.includes('recover') ||
    lower.includes('posture')
  ) {
    return 'Health';
  }

  // Business keywords
  if (
    lower.includes('business') ||
    lower.includes('startup') ||
    lower.includes('agency') ||
    lower.includes('ecommerce') ||
    lower.includes('client') ||
    lower.includes('sales') ||
    lower.includes('founder') ||
    lower.includes('venture') ||
    lower.includes('product')
  ) {
    return 'Business';
  }

  // Finance keywords
  if (
    lower.includes('money') ||
    lower.includes('earn') ||
    lower.includes('income') ||
    lower.includes('revenue') ||
    lower.includes('invest') ||
    lower.includes('crypto') ||
    lower.includes('stock') ||
    lower.includes('wealth') ||
    lower.includes('cash') ||
    lower.includes('finance') ||
    lower.includes('save')
  ) {
    return 'Finance';
  }

  // Skills & Programming keywords
  if (
    lower.includes('code') ||
    lower.includes('program') ||
    lower.includes('software') ||
    lower.includes('dev') ||
    lower.includes('developer') ||
    lower.includes('python') ||
    lower.includes('javascript') ||
    lower.includes('react') ||
    lower.includes('tech') ||
    lower.includes('ai tool') ||
    lower.includes('design') ||
    lower.includes('ui/ux') ||
    lower.includes('video edit') ||
    lower.includes('skill')
  ) {
    return 'Skills';
  }

  // Career keywords
  if (
    lower.includes('career') ||
    lower.includes('job') ||
    lower.includes('promotion') ||
    lower.includes('interview') ||
    lower.includes('resume') ||
    lower.includes('work') ||
    lower.includes('intern')
  ) {
    return 'Career';
  }

  // Education keywords
  if (
    lower.includes('grade') ||
    lower.includes('exam') ||
    lower.includes('study') ||
    lower.includes('gpa') ||
    lower.includes('hsc') ||
    lower.includes('school') ||
    lower.includes('college') ||
    lower.includes('university') ||
    lower.includes('degree') ||
    lower.includes('book') ||
    lower.includes('read') ||
    lower.includes('class') ||
    lower.includes('course') ||
    lower.includes('academic')
  ) {
    return 'Education';
  }

  // Personal Growth keywords
  if (
    lower.includes('discipline') ||
    lower.includes('habit') ||
    lower.includes('routine') ||
    lower.includes('focus') ||
    lower.includes('procrastinat') ||
    lower.includes('mindset') ||
    lower.includes('confidence') ||
    lower.includes('meditat') ||
    lower.includes('time') ||
    lower.includes('productivity') ||
    lower.includes('grow') ||
    lower.includes('improve')
  ) {
    return 'Personal Growth';
  }

  return 'Personal Growth';
}

/**
 * Dynamically generates a tactical mission name from the user's natural language goal
 */
export function generateMissionName(goalText: string, category: GoalCategory): string {
  const lower = goalText.toLowerCase();

  // Muscle / Strength
  if (lower.includes('muscle') || lower.includes('strength') || lower.includes('lift') || lower.includes('bench')) {
    return 'Strength Protocol';
  }
  // Money / Income
  if (lower.includes('earn') || lower.includes('money') || lower.includes('income') || lower.includes('revenue')) {
    return 'Income Engine';
  }
  // Code / Programming
  if (lower.includes('program') || lower.includes('code') || lower.includes('dev') || lower.includes('software')) {
    return 'Code Mastery';
  }
  // Faith / Prayer
  if (lower.includes('pray') || lower.includes('salah') || lower.includes('allah') || lower.includes('faith') || lower.includes('deen') || lower.includes('god')) {
    return 'Faith Protocol';
  }
  // Books / Reading
  if (lower.includes('book') || lower.includes('read')) {
    return 'Knowledge Matrix';
  }
  // Grades / Exams / HSC
  if (lower.includes('grade') || lower.includes('gpa') || lower.includes('exam') || lower.includes('study') || lower.includes('hsc')) {
    return 'Academic Zenith Protocol';
  }
  // Business / Startup
  if (lower.includes('business') || lower.includes('startup') || lower.includes('agency')) {
    return 'Venture Architecture';
  }
  // Discipline
  if (lower.includes('discipline') || lower.includes('habit') || lower.includes('routine')) {
    return 'Discipline Protocol';
  }
  // Run / Cardio / Endurance
  if (lower.includes('run') || lower.includes('cardio') || lower.includes('marathon') || lower.includes('stamina')) {
    return 'Endurance Protocol';
  }
  // Weight / Nutrition
  if (lower.includes('weight') || lower.includes('fat') || lower.includes('diet') || lower.includes('nutrition')) {
    return 'Physical Conditioning Matrix';
  }
  // Career
  if (lower.includes('career') || lower.includes('job') || lower.includes('promotion')) {
    return 'Career Acceleration Matrix';
  }
  // Sleep / Health
  if (lower.includes('sleep') || lower.includes('health') || lower.includes('vitality')) {
    return 'Vitality Optimization Protocol';
  }

  // Fallback based on category
  switch (category) {
    case 'Fitness':
      return 'Apex Fitness Protocol';
    case 'Finance':
      return 'Capital Growth Engine';
    case 'Business':
      return 'Venture Architecture';
    case 'Skills':
      return 'Skill Acquisition Matrix';
    case 'Education':
      return 'Cognitive Expansion Protocol';
    case 'Faith':
      return 'Faith Protocol';
    case 'Career':
      return 'Professional Vanguard Matrix';
    case 'Health':
      return 'Vitality Optimization Protocol';
    case 'Personal Growth':
    default:
      return 'Personal Sovereignty Protocol';
  }
}

/**
 * Category-specific icon selector
 */
export function getCategoryIcon(category: GoalCategory): string {
  switch (category) {
    case 'Fitness':
      return '💪';
    case 'Finance':
      return '💰';
    case 'Business':
      return '💼';
    case 'Skills':
      return '💻';
    case 'Education':
      return '🎓';
    case 'Faith':
      return '🕌';
    case 'Career':
      return '⚡';
    case 'Health':
      return '🧬';
    case 'Personal Growth':
    default:
      return '🎯';
  }
}

/**
 * Creates a fully configured Mission object integrating into the existing mission architecture
 */
export function createPersonalizedMission(goal: UserGoal, index: number): Mission {
  const missionName = goal.missionName || generateMissionName(goal.text, goal.category);
  const icon = getCategoryIcon(goal.category);
  const id = `m_${goal.category.toLowerCase()}_${index}`;

  return {
    id,
    name: missionName,
    icon,
    description: `Tactical directive focused on "${goal.text}". Execute consistent milestones to achieve progressive mastery.`,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    rank: 'Initiate Practitioner',
    streak: 0,
    goalCategory: goal.category,
    originalGoal: goal.text,
    priority: goal.priority,
    stats: {
      completedSessions: 0,
      hoursInvested: 0,
      streak: 0,
      dailyTarget: 1,
      weeklyTarget: 5
    },
    weeklyObjectives: [
      {
        id: `${id}_w1`,
        text: `Execute 4 focused milestones for ${missionName}`,
        current: 0,
        target: 4,
        completed: false,
        unit: 'Milestones'
      },
      {
        id: `${id}_w2`,
        text: `Log 3 structured progress tracking updates`,
        current: 0,
        target: 3,
        completed: false,
        unit: 'Logs'
      },
      {
        id: `${id}_w3`,
        text: `Complete 1 high-leverage weekly breakthrough`,
        current: 0,
        target: 1,
        completed: false,
        unit: 'Breakthrough'
      }
    ],
    monthlyObjectives: [
      {
        id: `${id}_m1`,
        text: `Accumulate 16 dedicated ${missionName} blocks`,
        current: 0,
        target: 16,
        completed: false,
        unit: 'Blocks'
      },
      {
        id: `${id}_m2`,
        text: `Maintain a 20-day uninterrupted momentum streak`,
        current: 0,
        target: 20,
        completed: false,
        unit: 'Days'
      }
    ],
    bossBattle: {
      name: `The Resistance Titan (${missionName} Trial)`,
      hp: 4,
      maxHp: 4,
      completed: false,
      rewardCoins: 750,
      rewardXp: 1500,
      rewardTitle: `${missionName} Vanguard`,
      tasks: [
        {
          id: `${id}_b1`,
          text: `Complete 4 core sessions without breaking discipline`,
          current: 0,
          target: 4,
          completed: false,
          unit: 'Sessions'
        }
      ]
    }
  };
}

/**
 * Generates personalized daily quests matching the user's prioritized goals
 */
export function generateGoalQuests(goals: UserGoal[], dateStr: string): Quest[] {
  if (!goals || goals.length === 0) return [];

  // Sort by priority (1 = highest)
  const sorted = [...goals].sort((a, b) => a.priority - b.priority);
  const quests: Quest[] = [];

  sorted.forEach((goal, idx) => {
    const isTopPriority = idx === 0;
    const missionName = goal.missionName || generateMissionName(goal.text, goal.category);
    let categoryStat: keyof Character['stats'] = 'Discipline';
    let icon = '⚡';

    switch (goal.category) {
      case 'Fitness':
        categoryStat = 'Strength';
        icon = '💪';
        break;
      case 'Finance':
      case 'Business':
        categoryStat = 'Business';
        icon = '💼';
        break;
      case 'Skills':
        categoryStat = 'Intelligence';
        icon = '💻';
        break;
      case 'Education':
        categoryStat = 'Knowledge';
        icon = '🎓';
        break;
      case 'Faith':
        categoryStat = 'Faith';
        icon = '🕌';
        break;
      case 'Health':
        categoryStat = 'Vitality';
        icon = '🧬';
        break;
      case 'Career':
        categoryStat = 'Charisma';
        icon = '⚡';
        break;
      default:
        categoryStat = 'Discipline';
        icon = '🎯';
    }

    const priorityBadge = isTopPriority ? ' [PRIORITY #1]' : ` [PRIORITY #${goal.priority}]`;

    quests.push({
      id: `q_goal_${dateStr}_${idx}`,
      text: `${icon} ${missionName.toUpperCase()}${priorityBadge}: Execute dedicated action towards "${goal.text}" (45-90 min session)`,
      difficulty: isTopPriority ? 'hard' : 'medium',
      category: categoryStat,
      completed: false,
      date: dateStr,
      xpReward: isTopPriority ? 50 : 35,
      coinReward: isTopPriority ? 60 : 40
    });
  });

  return quests;
}
