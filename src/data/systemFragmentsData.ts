import { SystemFragment, AppState } from '../types';

// The canonical 100 System Fragments of the ARISE System (#001 - #100)
export const INITIAL_SYSTEM_FRAGMENTS: SystemFragment[] = [
  // --- LEGACY & GENESIS (#001 - #010) ---
  {
    id: 'frag_001',
    number: 1,
    name: 'Genesis Seed',
    description: 'The primordial system spark that initiates your path to sovereignty.',
    hint: 'Claimed by early vanguard pioneers of the ARISE System.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Legacy',
    icon: 'Sparkles'
  },
  {
    id: 'frag_002',
    number: 2,
    name: 'Iron Initiation',
    description: 'Forged on the first day you challenged your physical limits.',
    hint: 'Log your very first physical workout or calisthenics session.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Strength',
    icon: 'Dumbbell'
  },
  {
    id: 'frag_003',
    number: 3,
    name: 'The First Spark',
    description: 'Awarded upon completing your first daily system quest.',
    hint: 'Complete any daily quest on your active tactical board.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Discipline',
    icon: 'CheckCircle'
  },
  {
    id: 'frag_004',
    number: 4,
    name: 'Sanctuary of Fajr',
    description: 'Awarded for greeting the dawn with devotion before the sunrise.',
    hint: 'Log your morning Fajr prayer in the Faith Tracker.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Spirit',
    icon: 'Sunrise'
  },
  {
    id: 'frag_005',
    number: 5,
    name: 'Focus Protocol α',
    description: 'The initial moment of uninterrupted cognitive deep work.',
    hint: 'Complete a timed focus session of 25 minutes or more.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Knowledge',
    icon: 'Timer'
  },
  {
    id: 'frag_006',
    number: 6,
    name: 'Century Pushups',
    description: 'One hundred repetitions etched in muscle memory and discipline.',
    hint: 'Accumulate 100 total pushups logged across your fitness journey.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Strength',
    icon: 'Activity'
  },
  {
    id: 'frag_007',
    number: 7,
    name: 'Unbroken Orbit',
    description: 'A continuous chain of seven consecutive days of execution.',
    hint: 'Attain a 7-day completion streak on your daily quest board.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_008',
    number: 8,
    name: 'Sentry Breaker',
    description: 'Extracted from the shattered core of your first Sunday Dungeon Boss.',
    hint: 'Defeat a weekly boss battle on Sunday.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'Sword'
  },
  {
    id: 'frag_009',
    number: 9,
    name: 'Five Pillars Pillar',
    description: 'A day where all five obligatory prayers were punctually preserved.',
    hint: 'Complete all 5 daily prayers (Fajr to Isha) on a single day.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Spirit',
    icon: 'Compass'
  },
  {
    id: 'frag_010',
    number: 10,
    name: 'The First Tome',
    description: 'Immersion in written mastery and timeless wisdom.',
    hint: 'Log at least 100 pages of book reading or study revision.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Knowledge',
    icon: 'BookOpen'
  },

  // --- DISCIPLINE & ROUTINE (#011 - #025) ---
  {
    id: 'frag_011',
    number: 11,
    name: 'Midnight Solitude',
    description: 'While the weak sleep, the architect constructs reality.',
    hint: 'Complete a night focus or reflection session after 10 PM.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Discipline',
    icon: 'Moon'
  },
  {
    id: 'frag_012',
    number: 12,
    name: 'The Scholar Matrix',
    description: 'Five hundred minutes of intellectual ascension.',
    hint: 'Accumulate 500 total minutes logged in the Learning Tracker.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'GraduationCap'
  },
  {
    id: 'frag_013',
    number: 13,
    name: 'Commerce Engine',
    description: 'Economic vitality manifested through deliberate productivity.',
    hint: 'Amass an armory balance of 1,000 Gold Coins.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Mastery',
    icon: 'Coins'
  },
  {
    id: 'frag_014',
    number: 14,
    name: 'Fortitude of Fourteen',
    description: 'Two full weeks without a single broken link.',
    hint: 'Reach a continuous 14-day completion streak.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Discipline',
    icon: 'Shield'
  },
  {
    id: 'frag_015',
    number: 15,
    name: 'Sprint of Ten Kilometers',
    description: 'The earth measured beneath determined footfalls.',
    hint: 'Log a cumulative distance of 10 km in running/walking.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Strength',
    icon: 'Zap'
  },
  {
    id: 'frag_016',
    number: 16,
    name: 'The Quranic Pulse',
    description: 'Recitation that illuminates the chambers of the chest.',
    hint: 'Log 7 days of Quran study or reflection.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Spirit',
    icon: 'Bookmark'
  },
  {
    id: 'frag_017',
    number: 17,
    name: 'Deep Work Titan',
    description: 'Four consecutive hours of uninterrupted creative execution.',
    hint: 'Log 4 or more deep work hours in a single business day.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Knowledge',
    icon: 'Cpu'
  },
  {
    id: 'frag_018',
    number: 18,
    name: 'Dungeon Raider Rank C',
    description: 'Surpassing the initial rank boundary through sheer grit.',
    hint: 'Reach Hunter Level 10.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Mastery',
    icon: 'Award'
  },
  {
    id: 'frag_019',
    number: 19,
    name: 'Cold Shower Resolve',
    description: 'Willpower imposed over immediate bodily comfort.',
    hint: 'Log a recovery or cold therapy habit in your daily routine.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Discipline',
    icon: 'Droplets'
  },
  {
    id: 'frag_020',
    number: 20,
    name: 'Mortal Horizon',
    description: 'Looking into the finite matrix of life weeks to awaken urgency.',
    hint: 'Configure and inspect your Life Calendar.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Legacy',
    icon: 'Calendar'
  },
  {
    id: 'frag_021',
    number: 21,
    name: 'Century Squats',
    description: 'Pillars of leg drive forged in repetition.',
    hint: 'Log 100 cumulative squats on the Fitness Tracker.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Strength',
    icon: 'TrendingUp'
  },
  {
    id: 'frag_022',
    number: 22,
    name: 'Friday Grace',
    description: 'Observing the sacred Friday prayer and community bond.',
    hint: 'Complete the Friday worship quest on any Friday.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Spirit',
    icon: 'Sun'
  },
  {
    id: 'frag_023',
    number: 23,
    name: 'Digital Scribe',
    description: 'Publishing insight into the global digital ether.',
    hint: 'Log a content creation, coding release, or video publish milestone.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'Share2'
  },
  {
    id: 'frag_024',
    number: 24,
    name: 'Crate Infiltrator',
    description: 'Cracking open a high-tech loot container.',
    hint: 'Open any mystery crate or dungeon chest in the Vault.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Mastery',
    icon: 'Box'
  },
  {
    id: 'frag_025',
    number: 25,
    name: 'The Quarter Century',
    description: 'Twenty-five days of unrelenting momentum.',
    hint: 'Maintain a 25-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Discipline',
    icon: 'Target'
  },

  // --- STRENGTH & METABOLIC SUPREMACY (#026 - #040) ---
  {
    id: 'frag_026',
    number: 26,
    name: 'Iron Back Pullups',
    description: 'Lifting one’s full bodyweight against gravity.',
    hint: 'Log 50 cumulative pullups in fitness logs.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Strength',
    icon: 'ArrowUpCircle'
  },
  {
    id: 'frag_027',
    number: 27,
    name: 'HSC Sovereign α',
    description: 'Conquering the grueling syllabus block by block.',
    hint: 'Log 10 HSC subject study sessions.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'BookMarked'
  },
  {
    id: 'frag_028',
    number: 28,
    name: 'Dawn Tahajjud Echo',
    description: 'Secret devotion in the quietest third of the night.',
    hint: 'Log night vigil worship or early reflection before dawn.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Spirit',
    icon: 'Stars'
  },
  {
    id: 'frag_029',
    number: 29,
    name: 'Vault Investor',
    description: 'Personalizing your terminal with custom visual themes.',
    hint: 'Unlock or equip any premium visual theme in the Theme Store.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Mastery',
    icon: 'Palette'
  },
  {
    id: 'frag_030',
    number: 30,
    name: 'Infinite Fortitude',
    description: 'One full solar month of unbroken daily excellence.',
    hint: 'Attain a 30-day daily quest completion streak.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_031',
    number: 31,
    name: 'Calorie Crucible',
    description: 'Burning 3,000 calories through deliberate physical output.',
    hint: 'Accumulate 3,000 total calories burned in the Fitness Tracker.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Strength',
    icon: 'Activity'
  },
  {
    id: 'frag_032',
    number: 32,
    name: 'Fifty Workouts',
    description: 'Fifty visits to the temple of iron and transformation.',
    hint: 'Log 50 total workout sessions.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Strength',
    icon: 'ShieldCheck'
  },
  {
    id: 'frag_033',
    number: 33,
    name: 'The 100 Hour Scholar',
    description: 'Six thousand minutes committed to intellectual superiority.',
    hint: 'Log 100 total hours (6,000 minutes) in learning logs.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Knowledge',
    icon: 'Clock'
  },
  {
    id: 'frag_034',
    number: 34,
    name: 'Gold Vault Sovereign',
    description: 'A war-chest accumulated through consistent discipline.',
    hint: 'Accumulate 5,000 Gold Coins in your armory.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Mastery',
    icon: 'Layers'
  },
  {
    id: 'frag_035',
    number: 35,
    name: 'Dungeon Raider Rank B',
    description: 'Level twenty attained. The system begins to notice you.',
    hint: 'Reach Hunter Level 20.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'ChevronsUp'
  },
  {
    id: 'frag_036',
    number: 36,
    name: 'Remembrance of the Heart',
    description: 'Morning and evening dhikr shielding the spiritual vessel.',
    hint: 'Log 14 days of Morning & Evening Adhkar.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Spirit',
    icon: 'Heart'
  },
  {
    id: 'frag_037',
    number: 37,
    name: 'Marathon Cumulative',
    description: 'Forty-two kilometers traversed over time.',
    hint: 'Accumulate 42 km total distance in running/walking.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Strength',
    icon: 'Compass'
  },
  {
    id: 'frag_038',
    number: 38,
    name: 'Zero Procrastination Code',
    description: 'Completing all daily quests before 6:00 PM.',
    hint: 'Clear every single quest on your board before evening.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Discipline',
    icon: 'Zap'
  },
  {
    id: 'frag_039',
    number: 39,
    name: 'Profile Aegis Unlocked',
    description: 'Adorning your avatar with a customized profile frame.',
    hint: 'Equip any custom Profile Frame in the Vault & Armory.',
    discoveryDate: null,
    rarity: 'Common',
    category: 'Mastery',
    icon: 'UserCheck'
  },
  {
    id: 'frag_040',
    number: 40,
    name: 'Past The Storm',
    description: 'Completing all quests on a low-energy or difficult day.',
    hint: 'Complete daily quests when energy level was set to low or depleted.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Discipline',
    icon: 'CloudLightning'
  },

  // --- KNOWLEDGE & INTELLECTUAL ARSENAL (#041 - #060) ---
  {
    id: 'frag_041',
    number: 41,
    name: 'HSC Mastery: Physics',
    description: 'Deconstructing the foundational mechanics of the physical universe.',
    hint: 'Complete 10 Physics revision or problem sets.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'Atom'
  },
  {
    id: 'frag_042',
    number: 42,
    name: 'HSC Mastery: Chemistry',
    description: 'Understanding molecular bonds, equilibrium, and stoichiometry.',
    hint: 'Complete 10 Chemistry practice logs.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'FlaskConical'
  },
  {
    id: 'frag_043',
    number: 43,
    name: 'HSC Mastery: Mathematics',
    description: 'Sharpening logic through calculus, vectors, and complex proofs.',
    hint: 'Complete 10 Mathematics problem sets.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'Divide'
  },
  {
    id: 'frag_044',
    number: 44,
    name: 'The 500 Pushup Threshold',
    description: 'Five hundred repetitions built rep by rep.',
    hint: 'Accumulate 500 total pushups logged in Fitness.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Strength',
    icon: 'Crosshair'
  },
  {
    id: 'frag_045',
    number: 45,
    name: 'The Golden Forty-Five',
    description: 'A month and a half of unwavering persistence.',
    hint: 'Attain a 45-day continuous quest streak.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Discipline',
    icon: 'ShieldAlert'
  },
  {
    id: 'frag_046',
    number: 46,
    name: 'Double Boss Slayer',
    description: 'Two weekly bosses vanquished back-to-back.',
    hint: 'Defeat 2 Sunday Boss Battles.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Mastery',
    icon: 'Swords'
  },
  {
    id: 'frag_047',
    number: 47,
    name: 'Script to Screen',
    description: 'Documenting your knowledge for thousands to witness.',
    hint: 'Log 5 completed content creation or video production tasks.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Knowledge',
    icon: 'Video'
  },
  {
    id: 'frag_048',
    number: 48,
    name: 'Unshakable Salah Chain',
    description: 'Thirty consecutive days of every single daily prayer.',
    hint: 'Maintain 30 consecutive days of 5/5 daily Salah.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Spirit',
    icon: 'Compass'
  },
  {
    id: 'frag_049',
    number: 49,
    name: 'Calisthenics Beast',
    description: '200 pullups conquered over your hunter career.',
    hint: 'Log 200 cumulative pullups.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Strength',
    icon: 'TrendingUp'
  },
  {
    id: 'frag_050',
    number: 50,
    name: 'Halfway to Sovereignty',
    description: 'Fifty system fragments collected. You now command the matrix.',
    hint: 'Collect 50 total System Fragments.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Legacy',
    icon: 'CheckSquare'
  },
  {
    id: 'frag_051',
    number: 51,
    name: 'Dungeon Raider Rank A',
    description: 'Level 40 reached. Elite hunter status confirmed.',
    hint: 'Reach Hunter Level 40.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Mastery',
    icon: 'Crown'
  },
  {
    id: 'frag_052',
    number: 52,
    name: 'The 60-Day Iron Line',
    description: 'Two months of daily discipline without hesitation.',
    hint: 'Reach a 60-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_053',
    number: 53,
    name: 'Centurion of Workouts',
    description: 'One hundred workout sessions logged. Your body is forged.',
    hint: 'Log 100 total workout sessions.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Strength',
    icon: 'Dumbbell'
  },
  {
    id: 'frag_054',
    number: 54,
    name: 'The 1,000 Pushup Monument',
    description: 'A thousand pushups logged. Physical fatigue is no longer an excuse.',
    hint: 'Accumulate 1,000 total pushups.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Strength',
    icon: 'Activity'
  },
  {
    id: 'frag_055',
    number: 55,
    name: 'Archivist of Life',
    description: 'Recording daily reflections and life milestones.',
    hint: 'Save 10 daily reflection entries in the Life Calendar archive.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Legacy',
    icon: 'BookOpen'
  },
  {
    id: 'frag_056',
    number: 56,
    name: 'The 100km Strider',
    description: 'One hundred kilometers logged across all terrains.',
    hint: 'Accumulate 100 total km distance in running/walking.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Strength',
    icon: 'Navigation'
  },
  {
    id: 'frag_057',
    number: 57,
    name: 'Monarch’s Relic Crate',
    description: 'Unlocking a Legendary S-Rank Chest in the Vault.',
    hint: 'Open an Epic or Legendary Mystery Crate.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Mastery',
    icon: 'Gem'
  },
  {
    id: 'frag_058',
    number: 58,
    name: 'HSC Practice Exam Ace',
    description: 'Completing a full timed past exam paper simulation.',
    hint: 'Log a past exam timed practice session.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Knowledge',
    icon: 'FileText'
  },
  {
    id: 'frag_059',
    number: 59,
    name: 'Five Boss Trophies',
    description: 'Five Sunday Dungeon Bosses conquered.',
    hint: 'Defeat 5 weekly boss battles.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Mastery',
    icon: 'ShieldCheck'
  },
  {
    id: 'frag_060',
    number: 60,
    name: 'The 75-Day Protocol',
    description: 'Seventy-five days of pure uncompromising daily grit.',
    hint: 'Attain a 75-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Epic',
    category: 'Discipline',
    icon: 'Target'
  },

  // --- SPIRIT & INNER MASTERY (#061 - #075) ---
  {
    id: 'frag_061',
    number: 61,
    name: 'Quran Khatmah Trail',
    description: 'Reading through thirty juz of divine revelation.',
    hint: 'Log 30 days of consistent Quran reading.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Spirit',
    icon: 'Book'
  },
  {
    id: 'frag_062',
    number: 62,
    name: 'Ten Thousand Coins',
    description: 'An immense treasury amassed without skipping a single quest.',
    hint: 'Earn 10,000 total Gold Coins in the system.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Mastery',
    icon: 'Coins'
  },
  {
    id: 'frag_063',
    number: 63,
    name: 'Rank S Hunter Ascension',
    description: 'Reaching Hunter Level 50. You stand among the top percentile.',
    hint: 'Reach Hunter Level 50.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Mastery',
    icon: 'Crown'
  },
  {
    id: 'frag_064',
    number: 64,
    name: 'The 90-Day Century Quarter',
    description: 'Three continuous months of daily progress.',
    hint: 'Attain a 90-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_065',
    number: 65,
    name: '10,000 Calories Vaporized',
    description: 'Ten thousand calories incinerated through physical fury.',
    hint: 'Accumulate 10,000 total calories burned.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Strength',
    icon: 'Activity'
  },
  {
    id: 'frag_066',
    number: 66,
    name: 'The 500 Pullup Milestone',
    description: 'Half a thousand pullups. Back muscles forged of steel cables.',
    hint: 'Accumulate 500 cumulative pullups.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Strength',
    icon: 'ArrowUp'
  },
  {
    id: 'frag_067',
    number: 67,
    name: 'Master of Three Sciences',
    description: 'Physics, Chemistry, and Math syllabi conquered simultaneously.',
    hint: 'Log at least 20 study sessions in all 3 STEM subjects.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Knowledge',
    icon: 'Cpu'
  },
  {
    id: 'frag_068',
    number: 68,
    name: '1,000 Study Hours',
    description: '60,000 minutes dedicated to high-order cognitive supremacy.',
    hint: 'Accumulate 1,000 total study/focus hours logged.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Knowledge',
    icon: 'Clock'
  },
  {
    id: 'frag_069',
    number: 69,
    name: 'Emerald Matrix Sovereign',
    description: 'Channeling the high-density terminal cyber aesthetic.',
    hint: 'Equip the Emerald Matrix theme.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'Grid'
  },
  {
    id: 'frag_070',
    number: 70,
    name: 'Crimson Knight Sovereign',
    description: 'Walking the halls cloaked in tactical blood-red aura.',
    hint: 'Equip the Crimson Protocol theme or Crimson Knight frame.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'Shield'
  },
  {
    id: 'frag_071',
    number: 71,
    name: 'Commander of Gold',
    description: 'Adorning your terminal in regal auric gold.',
    hint: 'Equip the Gold Commander theme or Commander Aegis frame.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'Award'
  },
  {
    id: 'frag_072',
    number: 72,
    name: 'Frost Spectre',
    description: 'Sub-zero polar night aesthetic embraced.',
    hint: 'Equip the Arctic Ghost theme.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'Snowflake'
  },
  {
    id: 'frag_073',
    number: 73,
    name: 'Stealth Obsidian',
    description: 'The minimalist obsidian elite shroud activated.',
    hint: 'Equip the Obsidian Elite theme.',
    discoveryDate: null,
    rarity: 'Rare',
    category: 'Mastery',
    icon: 'EyeOff'
  },
  {
    id: 'frag_074',
    number: 74,
    name: 'The 100-Day Centurion',
    description: 'One hundred consecutive days. A lifestyle permanently altered.',
    hint: 'Attain a 100-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_075',
    number: 75,
    name: 'Ten Dungeon Raids',
    description: 'Ten Sunday Boss Battles cleared without mercy.',
    hint: 'Defeat 10 weekly boss battles.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Swords'
  },

  // --- MYTHIC ASCENSION (#076 - #090) ---
  {
    id: 'frag_076',
    number: 76,
    name: 'Rank SS Hunter Vanguard',
    description: 'Reaching Hunter Level 70. National hunters begin to seek your counsel.',
    hint: 'Reach Hunter Level 70.',
    discoveryDate: null,
    rarity: 'Legendary',
    category: 'Mastery',
    icon: 'Sparkles'
  },
  {
    id: 'frag_077',
    number: 77,
    name: '2,500 Pushups Conquered',
    description: 'An army of repetitions behind every punch and strike.',
    hint: 'Accumulate 2,500 total pushups.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Activity'
  },
  {
    id: 'frag_078',
    number: 78,
    name: '250 Kilometers Strider',
    description: 'A quarter of a thousand kilometers traversed on foot.',
    hint: 'Accumulate 250 km in running/walking.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Navigation'
  },
  {
    id: 'frag_079',
    number: 79,
    name: 'The 120-Day Discipline Core',
    description: 'Four months of absolute consistency.',
    hint: 'Attain a 120-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Zap'
  },
  {
    id: 'frag_080',
    number: 80,
    name: 'Eighty Fragments Synchronized',
    description: 'Eighty system fragments assembled. The origin frequency hums.',
    hint: 'Collect 80 total System Fragments.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Legacy',
    icon: 'CheckSquare'
  },
  {
    id: 'frag_081',
    number: 81,
    name: 'The 150-Day Awakening',
    description: 'Five months of relentless execution.',
    hint: 'Attain a 150-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_082',
    number: 82,
    name: '200 Workouts Completed',
    description: 'Two hundred workouts logged. Peak physiological transformation.',
    hint: 'Log 200 total workout sessions.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Dumbbell'
  },
  {
    id: 'frag_083',
    number: 83,
    name: 'Rank SSS Sovereign',
    description: 'Reaching Hunter Level 85. The peak of mortal hunter power.',
    hint: 'Reach Hunter Level 85.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Crown'
  },
  {
    id: 'frag_084',
    number: 84,
    name: '5,000 Pushups Apex',
    description: 'Five thousand pushups logged. Your upper body is living armor.',
    hint: 'Accumulate 5,000 total pushups.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Crosshair'
  },
  {
    id: 'frag_085',
    number: 85,
    name: '1,000 Pullups Master',
    description: 'One thousand pullups conquered against gravity.',
    hint: 'Accumulate 1,000 total pullups.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'ArrowUpCircle'
  },
  {
    id: 'frag_086',
    number: 86,
    name: '500 Kilometers Highway',
    description: 'Half a thousand kilometers running across cities and trails.',
    hint: 'Accumulate 500 total kilometers in running logs.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Compass'
  },
  {
    id: 'frag_087',
    number: 87,
    name: 'Twenty Dungeon Bosses Fallen',
    description: 'Twenty Sunday raids conquered without a single defeat.',
    hint: 'Defeat 20 weekly boss battles.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Swords'
  },
  {
    id: 'frag_088',
    number: 88,
    name: 'The 180-Day Half Year',
    description: 'Half a solar year without breaking the covenant of daily growth.',
    hint: 'Attain a 180-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_089',
    number: 89,
    name: 'National Level Hunter',
    description: 'Reaching Hunter Level 100. Power capable of altering landscapes.',
    hint: 'Reach Hunter Level 100.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Star'
  },
  {
    id: 'frag_090',
    number: 90,
    name: 'Ninety System Fragments Assembled',
    description: 'The final seals are beginning to fracture.',
    hint: 'Collect 90 total System Fragments.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Legacy',
    icon: 'Cpu'
  },

  // --- THE FINAL MONARCH ASCENSION (#091 - #100) ---
  {
    id: 'frag_091',
    number: 91,
    name: 'The 200-Day Citadel',
    description: 'Two hundred continuous days of sovereign self-mastery.',
    hint: 'Attain a 200-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'ShieldCheck'
  },
  {
    id: 'frag_092',
    number: 92,
    name: 'Thirty Boss Victories',
    description: 'Thirty weekly raid bosses shattered.',
    hint: 'Defeat 30 weekly boss battles.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Swords'
  },
  {
    id: 'frag_093',
    number: 93,
    name: '10,000 Pushups Godspeed',
    description: 'Ten thousand pushups logged. Physical fatigue has been deleted.',
    hint: 'Accumulate 10,000 total pushups.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Crosshair'
  },
  {
    id: 'frag_094',
    number: 94,
    name: '1,000 Kilometers Ultra',
    description: 'One thousand kilometers conquered on foot.',
    hint: 'Accumulate 1,000 total km distance in running.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Strength',
    icon: 'Navigation'
  },
  {
    id: 'frag_095',
    number: 95,
    name: 'Monarch Rank Ascension',
    description: 'Reaching Hunter Level 120. A Monarch among mortals.',
    hint: 'Reach Hunter Level 120.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Crown'
  },
  {
    id: 'frag_096',
    number: 96,
    name: 'The 250-Day Sentinel',
    description: 'Two hundred and fifty continuous days of unbroken discipline.',
    hint: 'Attain a 250-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Shield'
  },
  {
    id: 'frag_097',
    number: 97,
    name: 'Shadow Monarch Ascension',
    description: 'Reaching Hunter Level 140. Absolute mastery of the shadow realm.',
    hint: 'Reach Hunter Level 140.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Mastery',
    icon: 'Sparkles'
  },
  {
    id: 'frag_098',
    number: 98,
    name: 'The 300-Day Horizon',
    description: 'Three hundred days of total discipline.',
    hint: 'Attain a 300-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Flame'
  },
  {
    id: 'frag_099',
    number: 99,
    name: 'The 365-Day Solar Monument',
    description: 'A full unbroken calendar year of daily quest completions.',
    hint: 'Attain a 365-day daily quest streak.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Discipline',
    icon: 'Sun'
  },
  {
    id: 'frag_100',
    number: 100,
    name: 'The Origin Key',
    description: 'The final fragment that bridges reality and the system’s infinite potential.',
    hint: 'Discovered when your total fragments collected reaches 99.',
    discoveryDate: null,
    rarity: 'Mythic',
    category: 'Legacy',
    icon: 'Key'
  }
];

// Helper to evaluate and unlock fragments based on application state
export function evaluateSystemFragments(state: AppState): {
  newlyDiscovered: SystemFragment[];
  updatedFragments: SystemFragment[];
} {
  const currentFragments = state.systemFragments && state.systemFragments.length === 100
    ? state.systemFragments
    : INITIAL_SYSTEM_FRAGMENTS.map(f => {
        const existing = state.systemFragments?.find(ef => ef.number === f.number);
        return existing || f;
      });

  const todayStr = new Date().toISOString().split('T')[0];
  const newlyDiscovered: SystemFragment[] = [];

  // Metrics
  const level = state.character?.level || 1;
  const coins = state.character?.coins || 0;
  const currentStreak = state.streak?.currentStreak || 0;
  const longestStreak = state.streak?.longestStreak || currentStreak;
  const maxStreak = Math.max(currentStreak, longestStreak);
  const totalWorkouts = state.fitnessLogs?.length || 0;
  const totalPushups = state.fitnessLogs?.reduce((sum, l) => sum + (l.pushups || 0), 0) || 0;
  const totalPullups = state.fitnessLogs?.reduce((sum, l) => sum + (l.pullups || 0), 0) || 0;
  const totalSquats = state.fitnessLogs?.reduce((sum, l) => sum + (l.squats || 0), 0) || 0;
  const totalKm = state.fitnessLogs?.reduce((sum, l) => sum + (l.runKm || 0), 0) || 0;
  const totalCalories = state.fitnessLogs?.reduce((sum, l) => sum + (l.calories || 0), 0) || 0;
  const totalLearningMinutes = state.learningLogs?.reduce((sum, l) => sum + (l.durationMinutes || 0), 0) || 0;
  const totalLearningHours = totalLearningMinutes / 60;
  const hasDefeatedBoss = state.bossBattle?.completed || false;
  const hasCompletedQuest = state.quests?.some(q => q.completed) || false;
  const founderClaimed = state.founderClaimed || false;
  const equippedFrame = state.character?.equippedFrame;
  const themeMode = state.settings?.themeMode;

  const currentUnlockedCount = currentFragments.filter(f => f.discoveryDate !== null).length;

  const updatedFragments = currentFragments.map(frag => {
    if (frag.discoveryDate !== null) return frag; // already discovered

    let shouldUnlock = false;

    switch (frag.number) {
      case 1: // Genesis Seed
        shouldUnlock = founderClaimed;
        break;
      case 2: // Iron Initiation
        shouldUnlock = totalWorkouts >= 1;
        break;
      case 3: // The First Spark
        shouldUnlock = hasCompletedQuest;
        break;
      case 4: // Sanctuary of Fajr
        shouldUnlock = (state.faithLogs?.some(l => l.prayers?.fajr)) || false;
        break;
      case 5: // Focus Protocol α
        shouldUnlock = totalLearningMinutes >= 25;
        break;
      case 6: // Century Pushups
        shouldUnlock = totalPushups >= 100;
        break;
      case 7: // Unbroken Orbit (7-day streak)
        shouldUnlock = maxStreak >= 7;
        break;
      case 8: // Sentry Breaker
        shouldUnlock = hasDefeatedBoss;
        break;
      case 9: // Five Pillars Pillar
        shouldUnlock = (state.faithLogs?.some(l => l.prayers?.fajr && l.prayers?.dhuhr && l.prayers?.asr && l.prayers?.maghrib && l.prayers?.isha)) || false;
        break;
      case 10: // The First Tome
        shouldUnlock = totalLearningMinutes >= 100;
        break;
      case 12: // The Scholar Matrix
        shouldUnlock = totalLearningMinutes >= 500;
        break;
      case 13: // Commerce Engine
        shouldUnlock = coins >= 1000;
        break;
      case 14: // Fortitude of Fourteen
        shouldUnlock = maxStreak >= 14;
        break;
      case 15: // Sprint of Ten Kilometers
        shouldUnlock = totalKm >= 10;
        break;
      case 18: // Level 10
        shouldUnlock = level >= 10;
        break;
      case 20: // Mortal Horizon (Life calendar configured)
        shouldUnlock = !!state.lifeCalendarSettings;
        break;
      case 21: // Century Squats
        shouldUnlock = totalSquats >= 100;
        break;
      case 25: // 25-day streak
        shouldUnlock = maxStreak >= 25;
        break;
      case 26: // 50 pullups
        shouldUnlock = totalPullups >= 50;
        break;
      case 29: // Vault theme
        shouldUnlock = themeMode !== 'dark-cyber' && themeMode !== 'neon-blue' && themeMode !== 'monarch-purple';
        break;
      case 30: // 30-day streak
        shouldUnlock = maxStreak >= 30;
        break;
      case 31: // 3,000 calories
        shouldUnlock = totalCalories >= 3000;
        break;
      case 32: // 50 workouts
        shouldUnlock = totalWorkouts >= 50;
        break;
      case 33: // 100 study hours
        shouldUnlock = totalLearningHours >= 100;
        break;
      case 34: // 5,000 coins
        shouldUnlock = coins >= 5000;
        break;
      case 35: // Level 20
        shouldUnlock = level >= 20;
        break;
      case 37: // 42 km
        shouldUnlock = totalKm >= 42;
        break;
      case 39: // Profile frame equipped
        shouldUnlock = !!equippedFrame && equippedFrame !== 'frame_default';
        break;
      case 44: // 500 pushups
        shouldUnlock = totalPushups >= 500;
        break;
      case 45: // 45-day streak
        shouldUnlock = maxStreak >= 45;
        break;
      case 49: // 200 pullups
        shouldUnlock = totalPullups >= 200;
        break;
      case 50: // 50 fragments collected
        shouldUnlock = currentUnlockedCount >= 49;
        break;
      case 51: // Level 40
        shouldUnlock = level >= 40;
        break;
      case 52: // 60-day streak
        shouldUnlock = maxStreak >= 60;
        break;
      case 53: // 100 workouts
        shouldUnlock = totalWorkouts >= 100;
        break;
      case 54: // 1,000 pushups
        shouldUnlock = totalPushups >= 1000;
        break;
      case 56: // 100 km
        shouldUnlock = totalKm >= 100;
        break;
      case 60: // 75-day streak
        shouldUnlock = maxStreak >= 75;
        break;
      case 62: // 10,000 coins
        shouldUnlock = coins >= 10000;
        break;
      case 63: // Level 50
        shouldUnlock = level >= 50;
        break;
      case 64: // 90-day streak
        shouldUnlock = maxStreak >= 90;
        break;
      case 65: // 10,000 calories
        shouldUnlock = totalCalories >= 10000;
        break;
      case 66: // 500 pullups
        shouldUnlock = totalPullups >= 500;
        break;
      case 68: // 1,000 study hours
        shouldUnlock = totalLearningHours >= 1000;
        break;
      case 69: // Emerald Matrix
        shouldUnlock = themeMode === 'emerald-matrix';
        break;
      case 70: // Crimson Protocol
        shouldUnlock = themeMode === 'crimson-protocol' || equippedFrame === 'frame_crimson_knight';
        break;
      case 71: // Gold Commander
        shouldUnlock = themeMode === 'gold-commander' || equippedFrame === 'frame_commander';
        break;
      case 72: // Arctic Ghost
        shouldUnlock = themeMode === 'arctic-ghost';
        break;
      case 73: // Obsidian Elite
        shouldUnlock = themeMode === 'obsidian-elite';
        break;
      case 74: // 100-day streak
        shouldUnlock = maxStreak >= 100;
        break;
      case 76: // Level 70
        shouldUnlock = level >= 70;
        break;
      case 77: // 2,500 pushups
        shouldUnlock = totalPushups >= 2500;
        break;
      case 78: // 250 km
        shouldUnlock = totalKm >= 250;
        break;
      case 79: // 120-day streak
        shouldUnlock = maxStreak >= 120;
        break;
      case 80: // 80 fragments collected
        shouldUnlock = currentUnlockedCount >= 79;
        break;
      case 81: // 150-day streak
        shouldUnlock = maxStreak >= 150;
        break;
      case 82: // 200 workouts
        shouldUnlock = totalWorkouts >= 200;
        break;
      case 83: // Level 85
        shouldUnlock = level >= 85;
        break;
      case 84: // 5,000 pushups
        shouldUnlock = totalPushups >= 5000;
        break;
      case 85: // 1,000 pullups
        shouldUnlock = totalPullups >= 1000;
        break;
      case 86: // 500 km
        shouldUnlock = totalKm >= 500;
        break;
      case 88: // 180-day streak
        shouldUnlock = maxStreak >= 180;
        break;
      case 89: // Level 100
        shouldUnlock = level >= 100;
        break;
      case 90: // 90 fragments collected
        shouldUnlock = currentUnlockedCount >= 89;
        break;
      case 91: // 200-day streak
        shouldUnlock = maxStreak >= 200;
        break;
      case 93: // 10,000 pushups
        shouldUnlock = totalPushups >= 10000;
        break;
      case 94: // 1,000 km
        shouldUnlock = totalKm >= 1000;
        break;
      case 95: // Level 120
        shouldUnlock = level >= 120;
        break;
      case 96: // 250-day streak
        shouldUnlock = maxStreak >= 250;
        break;
      case 97: // Level 140
        shouldUnlock = level >= 140;
        break;
      case 98: // 300-day streak
        shouldUnlock = maxStreak >= 300;
        break;
      case 99: // 365-day streak
        shouldUnlock = maxStreak >= 365;
        break;
      case 100: // Origin Key
        shouldUnlock = currentUnlockedCount >= 99;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlockedFrag: SystemFragment = {
        ...frag,
        discoveryDate: todayStr
      };
      newlyDiscovered.push(unlockedFrag);
      return unlockedFrag;
    }

    return frag;
  });

  return {
    newlyDiscovered,
    updatedFragments
  };
}
