import React, { useState } from 'react';
import { Character } from '../types';
import { playSound } from '../utils/sound';
import {
  Activity,
  Zap,
  Shield,
  Brain,
  Flame,
  User,
  BookOpen,
  Compass,
  Heart,
  TrendingUp,
  Info
} from 'lucide-react';

interface StatsViewProps {
  character: Character;
  soundEnabled: boolean;
}

const STAT_INFO: {
  [key in keyof Character['stats']]: {
    label: string;
    description: string;
    habits: string[];
    icon: any;
    color: string;
  };
} = {
  Strength: {
    label: 'Strength',
    description: 'Governs physical power, resistance training, and lean muscle mass.',
    habits: ['Pushups, pullups, squats', 'Gym workouts', 'High protein whole nutrition'],
    icon: Activity,
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/5'
  },
  Agility: {
    label: 'Agility',
    description: 'Represents speed, reaction, cardiovascular fitness, and active health.',
    habits: ['Outdoor running & jogging', 'Cycling & sprint intervals', 'Flexibility & stretching'],
    icon: Zap,
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
  },
  Endurance: {
    label: 'Endurance',
    description: 'Increases VO2 max, physical stamina, and persistent endurance output.',
    habits: ['Planks / Core exercises', 'HIIT cardio sessions', 'Stamina building metrics'],
    icon: Shield,
    color: 'border-amber-500/30 text-amber-500 bg-amber-500/5'
  },
  Intelligence: {
    label: 'Intelligence',
    description: 'Reflects logical problem solving, critical comprehension, and mathematical focus.',
    habits: ['Educational reading', 'Brain training / chess', 'Coding / engineering work'],
    icon: Brain,
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/5'
  },
  Discipline: {
    label: 'Discipline',
    description: 'Measures consistency, Pomodoro focus duration, and routine maintenance.',
    habits: ['Diaphragmatic breathing exercises', 'Early rising metrics', 'Social media restriction blocks'],
    icon: Flame,
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/5'
  },
  Charisma: {
    label: 'Charisma',
    description: 'Improves communication skills, networking capability, and visual presence.',
    habits: ['Public speaking / voice work', 'Acts of kindness & support', 'Sleek professional styling'],
    icon: User,
    color: 'border-pink-500/30 text-pink-400 bg-pink-500/5'
  },
  Knowledge: {
    label: 'Knowledge',
    description: 'Represents certification, technical skills, languages, and expertise.',
    habits: ['Completing video training courses', 'Studying language metrics', 'Tutorial guides / books'],
    icon: BookOpen,
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
  },
  Faith: {
    label: 'Faith',
    description: 'Nurtures spiritual alignment, tranquility, prayer, and ethical guidelines.',
    habits: ['Performing 5 daily prayers', 'Quran study with translation', 'Morning/Evening dhikr sessions'],
    icon: Compass,
    color: 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
  },
  Vitality: {
    label: 'Vitality',
    description: 'Governs biological cellular recovery, deep sleep, and hydration.',
    habits: ['Drinking 3L water daily', 'Sleeping 8 solid hours', 'Organic meals & digestion health'],
    icon: Heart,
    color: 'border-teal-500/30 text-teal-400 bg-teal-500/5'
  },
  Business: {
    label: 'Business',
    description: 'Nurtures financial planning, creator pipeline results, client outreach, and income.',
    habits: ['Productivity output milestones', 'Revenue-generating outreach', 'Product & marketing deep-work'],
    icon: TrendingUp,
    color: 'border-orange-500/30 text-orange-500 bg-orange-500/5'
  }
};

export default function StatsView({ character, soundEnabled }: StatsViewProps) {
  const [selectedStat, setSelectedStat] = useState<keyof Character['stats'] | null>(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HUD Header */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-xs font-bold text-zinc-100 uppercase tracking-widest font-mono">
              PERSONAL ATTRIBUTES MATRIX
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
              Review real-time neurological and physiological status metrics. Click any module to reveal supportive routines and telemetry triggers.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-[#101726] border border-cyan-500/10 rounded-xl text-xs font-mono text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select card to view telemetry</span>
          </div>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(character.stats) as Array<keyof Character['stats']>).map((statKey) => {
          const info = STAT_INFO[statKey];
          const statProgress = character.stats[statKey];
          const IconComponent = info.icon;
          const pct = Math.min(100, (statProgress.xp / statProgress.xpNeeded) * 100);
          const isSelected = selectedStat === statKey;

          return (
            <div
              key={statKey}
              onClick={() => {
                setSelectedStat(isSelected ? null : statKey);
                playSound('click', soundEnabled);
              }}
              className={`bg-[#111B2D] border rounded-[14px] p-5 hover:bg-[#111B2D]/85 cursor-pointer transition-all duration-150 relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.03)]'
                  : 'border-cyan-500/10 shadow-sm'
              }`}
            >
              {/* Top Row: Icon + Level */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${info.color} shrink-0`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono font-bold text-zinc-200 tracking-wider text-xs uppercase">
                    {info.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">GRADE LEVEL</span>
                  <span className="text-xs font-mono font-bold text-zinc-100">LVL {statProgress.level}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-[#101726] rounded-full border border-cyan-500/5 overflow-hidden p-px flex items-center">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>PROGRESS TO NEXT RATING</span>
                  <span>{statProgress.xp} / {statProgress.xpNeeded} XP</span>
                </div>
              </div>

              {/* Description & habit info inside selected */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-cyan-500/10 space-y-3 animate-fadeIn">
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                    {info.description}
                  </p>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.1em] block font-bold">SUPPORTED ROUTINES & TRIGGERS:</span>
                    <ul className="space-y-1">
                      {info.habits.map((habit, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-300 font-normal">
                          <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
                          <span className="font-sans">{habit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
