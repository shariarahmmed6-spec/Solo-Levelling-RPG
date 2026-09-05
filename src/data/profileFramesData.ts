import { ProfileFrame } from '../types';

export const ALL_PROFILE_FRAMES: ProfileFrame[] = [
  {
    id: 'frame_default',
    name: 'Standard Operative',
    description: 'Standard issue tactical HUD frame for all awakening hunters.',
    rarity: 'common',
    unlockType: 'default',
    unlockRequirement: 'Available by default',
    borderStyle: 'border border-cyan-500/30 rounded-xl',
    glowColor: 'rgba(0, 242, 254, 0.2)'
  },
  {
    id: 'frame_bronze',
    name: 'Bronze Vanguard',
    description: 'Forged from hardened bronze alloy. Awarded to hunters proving their initial resolve.',
    rarity: 'common',
    unlockType: 'level',
    requiredLevel: 5,
    unlockRequirement: 'Reach Level 5 or acquire for 200 Coins',
    coinCost: 200,
    borderStyle: 'border-2 border-amber-600/80 shadow-[0_0_12px_rgba(217,119,6,0.3)] rounded-xl',
    glowColor: 'rgba(217, 119, 6, 0.4)'
  },
  {
    id: 'frame_emerald',
    name: 'Cyber Emerald',
    description: 'High-frequency jade matrix with integrated bio-synthetic telemetry circuitry.',
    rarity: 'rare',
    unlockType: 'coins',
    unlockRequirement: 'Acquire for 500 Coins or obtain from Rare Crate',
    coinCost: 500,
    borderStyle: 'border-2 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.5)] rounded-xl',
    glowColor: 'rgba(16, 185, 129, 0.5)'
  },
  {
    id: 'frame_cyber_blue',
    name: 'Neon Blue Sentry',
    description: 'Supercharged neon blue flux capacitor casing with dual-corner bracket notches.',
    rarity: 'rare',
    unlockType: 'crate',
    unlockRequirement: 'Unlocked from Rare Mystery Crate or 600 Coins',
    coinCost: 600,
    borderStyle: 'border-2 border-cyan-400 shadow-[0_0_18px_rgba(0,242,254,0.6)] rounded-xl',
    glowColor: 'rgba(0, 242, 254, 0.6)'
  },
  {
    id: 'frame_crimson_knight',
    name: 'Crimson Knight',
    description: 'Blood-red obsidian carbon weave worn by elite dungeon strike forces.',
    rarity: 'epic',
    unlockType: 'coins',
    unlockRequirement: 'Acquire for 800 Coins or obtain from Epic Mystery Crate',
    coinCost: 800,
    borderStyle: 'border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] rounded-xl',
    glowColor: 'rgba(239, 68, 68, 0.6)'
  },
  {
    id: 'frame_commander',
    name: 'Commander Aegis',
    description: 'Regal golden double-bezel frame decorated with imperial commander honors.',
    rarity: 'epic',
    unlockType: 'level',
    requiredLevel: 20,
    unlockRequirement: 'Reach Hunter Level 20 or acquire for 1,200 Coins',
    coinCost: 1200,
    borderStyle: 'border-2 border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.65)] rounded-xl',
    glowColor: 'rgba(245, 158, 11, 0.65)'
  },
  {
    id: 'frame_legendary',
    name: 'Monarch Void Aura',
    description: 'Forged from concentrated shadow essence. Whispers with sovereign monarch authority.',
    rarity: 'legendary',
    unlockType: 'streak',
    requiredStreak: 30,
    unlockRequirement: 'Maintain a 30-Day Daily Streak or obtain from Legendary Crate',
    animated: true,
    borderStyle: 'border-2 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] animate-frame-pulse rounded-xl',
    glowColor: 'rgba(168, 85, 247, 0.7)'
  },
  {
    id: 'frame_founder',
    name: 'Founder Vanguard 001',
    description: 'Limited edition legacy frame commemorating early pioneers of the ARISE System.',
    rarity: 'legendary',
    unlockType: 'founder',
    unlockRequirement: 'Claim the secret Founder Collection',
    animated: true,
    borderStyle: 'border-2 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-frame-pulse rounded-xl',
    glowColor: 'rgba(251, 191, 36, 0.8)'
  },
  {
    id: 'frame_origin',
    name: 'Origin Protocol Sovereign',
    description: 'The supreme mythic frame of the Universe. Emits radiant prismatic chromatic shifts.',
    rarity: 'mythic',
    unlockType: 'fragments',
    unlockRequirement: 'Collect all 100 System Fragments (#001 to #100)',
    animated: true,
    borderStyle: 'border-2 border-cyan-300 shadow-[0_0_30px_rgba(56,189,248,0.9)] animate-chromatic animate-frame-pulse rounded-xl',
    glowColor: 'rgba(56, 189, 248, 0.9)'
  },
  {
    id: 'frame_eternal',
    name: 'Eternal Tree Sovereign',
    description: 'The transcendent cosmic frame of the fully awakened Eternal Tree. Luminous celestial boughs pulse with immortal life.',
    rarity: 'mythic',
    unlockType: 'founder',
    unlockRequirement: 'Awaken the Eternal Tree and uncover all 5 Hidden Relics',
    animated: true,
    borderStyle: 'border-2 border-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.9)] animate-frame-pulse rounded-xl',
    glowColor: 'rgba(52, 211, 153, 0.9)'
  }
];

export function getFrameById(id?: string): ProfileFrame {
  return ALL_PROFILE_FRAMES.find(f => f.id === id) || ALL_PROFILE_FRAMES[0];
}
