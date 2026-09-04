import React, { useState } from 'react';
import { Character } from '../types';
import { playSound } from '../utils/sound';
import { Sparkles, Trophy, Shield, Brain, Heart, TrendingUp } from 'lucide-react';

interface CharacterCreatorProps {
  onAwaken: (character: Character) => void;
  soundEnabled: boolean;
}

const AVATAR_CLASSES = [
  {
    id: 'creator',
    name: 'Digital Creator',
    color: '#a855f7', // purple
    description: 'Blueprint tailored for product creators, software builders, designers, and video authors.',
    icon: Sparkles
  },
  {
    id: 'sentry',
    name: 'Disciplined Professional',
    color: '#ef4444', // red
    description: 'Blueprint emphasizing daily routine execution, physical endurance, and consistency logs.',
    icon: Shield
  },
  {
    id: 'mage',
    name: 'Strategic Engineer',
    color: '#3b82f6', // blue
    description: 'Blueprint maximizing technical reading, computer code building, logic, and research tasks.',
    icon: Brain
  },
  {
    id: 'paladin',
    name: 'Mindful Practitioner',
    color: '#eab308', // gold/yellow
    description: 'Blueprint for core spiritual balance, regular prayers, meditation, and mental health.',
    icon: Heart
  },
  {
    id: 'assassin',
    name: 'Agile Scholar',
    color: '#10b981', // green
    description: 'Blueprint optimized for rapid academic study, sports stamina, and workflow speed.',
    icon: Trophy
  },
  {
    id: 'merchant',
    name: 'Business Strategist',
    color: '#f97316', // orange
    description: 'Blueprint prioritizing revenue projects, client prospecting, and commercial growth.',
    icon: TrendingUp
  }
];

export default function CharacterCreator({ onAwaken, soundEnabled }: CharacterCreatorProps) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(AVATAR_CLASSES[0]);
  const [error, setError] = useState('');

  const handleAwakening = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name to initialize your profile.');
      playSound('failure', soundEnabled);
      return;
    }

    const initialCharacter: Character = {
      name: name.trim(),
      avatar: selectedClass.id,
      level: 1,
      rank: 'Rank E',
      xp: 0,
      xpNeeded: 100,
      hp: 100,
      maxHp: 100,
      energy: 50,
      maxEnergy: 50,
      coins: 200, // Starter coins
      activeTitle: 'The Practitioner',
      titles: ['The Practitioner', 'Novice Builder'],
      stats: {
        Strength: { level: 1, xp: 0, xpNeeded: 50 },
        Agility: { level: 1, xp: 0, xpNeeded: 50 },
        Endurance: { level: 1, xp: 0, xpNeeded: 50 },
        Intelligence: { level: 1, xp: 0, xpNeeded: 50 },
        Discipline: { level: 1, xp: 0, xpNeeded: 50 },
        Charisma: { level: 1, xp: 0, xpNeeded: 50 },
        Knowledge: { level: 1, xp: 0, xpNeeded: 50 },
        Faith: { level: 1, xp: 0, xpNeeded: 50 },
        Vitality: { level: 1, xp: 0, xpNeeded: 50 },
        Business: { level: 1, xp: 0, xpNeeded: 50 }
      }
    };

    playSound('levelUp', soundEnabled);
    onAwaken(initialCharacter);
  };

  const SelectedIcon = selectedClass.icon;

  return (
    <div className="min-h-screen bg-[#090D18] text-zinc-100 flex flex-col justify-center items-center px-4 py-8 font-sans relative overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,254,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.03)_1px,transparent_1px)] bg-[size:5rem_5rem]" />

      <div className="relative w-full max-w-xl bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 md:p-8 shadow-2xl">
        {/* Holographic Header Bar */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 mb-6 border-b border-cyan-500/10 pb-4">
          <span>WORKSPACE SETUP WIZARD</span>
          <span className="text-cyan-400 flex items-center gap-1 font-bold">● SYSTEM ONLINE</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xs md:text-sm font-bold tracking-widest text-zinc-100 uppercase font-mono">
            PROFILE INITIALIZATION
          </h1>
          <p className="text-zinc-400 text-xs mt-2.5 max-w-sm mx-auto font-sans leading-relaxed font-normal">
            Configure your personal profile and select a workspace blueprint to calibrate the productivity environment.
          </p>
        </div>

        <form onSubmit={handleAwakening} className="space-y-6">
          {/* Name input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
              PRACTITIONER NAME / CODENAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 16));
                setError('');
              }}
              placeholder="ENTER IDENTIFIER"
              className="w-full bg-[#101726] border border-cyan-500/10 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/30 font-mono text-xs transition duration-150 uppercase tracking-widest"
            />
            {error && <p className="text-red-400 text-xs font-mono uppercase tracking-wider">{error}</p>}
          </div>

          {/* Class Select */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
              SELECT ACTIVE FOCUS BLUEPRINT
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVATAR_CLASSES.map((cls) => {
                const isSelected = selectedClass.id === cls.id;
                const ClsIcon = cls.icon;

                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => {
                      setSelectedClass(cls);
                      playSound('click', soundEnabled);
                    }}
                    className={`flex flex-col items-center justify-center p-4 bg-[#101726]/40 border rounded-xl hover:bg-[#101726]/80 cursor-pointer transition-all duration-150 group relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-500/30 bg-[#101726] shadow-[0_0_10px_rgba(0,242,254,0.05)]'
                        : 'border-cyan-500/5'
                    }`}
                  >
                    <div className={`mb-2 transition-colors ${isSelected ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                      <ClsIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${isSelected ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}>
                      {cls.name.split(' ')[1] || cls.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class Description Card */}
          <div className="p-4 rounded-xl bg-[#101726]/60 border border-cyan-500/10 transition-all duration-150 flex gap-4 items-center">
            <div className="p-2.5 rounded-lg bg-[#111B2D] border border-cyan-500/10 text-cyan-400 shrink-0">
              <SelectedIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-mono uppercase text-zinc-200 tracking-wider">
                {selectedClass.name} Blueprint
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans font-normal">
                {selectedClass.description}
              </p>
            </div>
          </div>

          {/* Awaken Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer text-center transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)]"
          >
            CREATE MY ENVIRONMENT
          </button>
        </form>
      </div>
    </div>
  );
}
