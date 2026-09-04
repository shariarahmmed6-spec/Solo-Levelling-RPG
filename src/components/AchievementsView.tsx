import React from 'react';
import { Achievement } from '../types';
import { Trophy, Award, Zap, Shield, Flame, BookOpen, Coins, Compass, Activity } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  soundEnabled: boolean;
}

export default function AchievementsView({ achievements, soundEnabled }: AchievementsViewProps) {
  const getIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-5 h-5 ${unlocked ? 'text-cyan-400' : 'text-zinc-600'}`;
    switch (iconName) {
      case 'Zap': return <Zap className={cls} />;
      case 'Flame': return <Flame className={cls} />;
      case 'ShieldAlert': return <Shield className={cls} />;
      case 'Sword': return <Award className={cls} />;
      case 'BookOpen': return <BookOpen className={cls} />;
      case 'Coins': return <Coins className={cls} />;
      case 'Compass': return <Compass className={cls} />;
      case 'Activity': return <Activity className={cls} />;
      default: return <Trophy className={cls} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Achievements Banner */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest">
            OBJECTIVES ACHIEVEMENTS CODEX
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
            Clear specific long-term milestones to earn system coins, title attributes, and progression points.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="bg-[#101726] border border-cyan-500/10 px-4 py-2.5 rounded-xl flex items-center gap-3 shrink-0">
          <Trophy className="w-4.5 h-4.5 text-cyan-400" />
          <div className="text-xs">
            <span className="text-zinc-500 uppercase text-[9px] block tracking-wider font-bold font-mono">COMPLETED ACHIEVEMENTS</span>
            <span className="text-xs font-bold text-zinc-200 font-mono">
              {unlockedCount} <span className="text-zinc-600">/ {achievements.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const pct = Math.min(100, (ach.progressCurrent / ach.progressGoal) * 100);

          return (
            <div
              key={ach.id}
              className={`border p-5 rounded-[14px] flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                ach.unlocked
                  ? 'bg-[#111B2D] border-cyan-500/25 shadow-[0_0_15px_rgba(0,242,254,0.03)]'
                  : 'bg-[#111B2D]/40 border-cyan-500/5 shadow-sm'
              }`}
            >
              {/* Top info row */}
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl border shrink-0 flex items-center justify-center ${
                  ach.unlocked
                    ? 'bg-cyan-500/5 border-cyan-500/20'
                    : 'bg-[#101726] border-cyan-500/5'
                }`}>
                  {getIcon(ach.icon, ach.unlocked)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${ach.unlocked ? 'text-zinc-100' : 'text-zinc-500'}`}>
                      {ach.name}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[8px] font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-bold">
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Coins reward */}
              <div className="mt-5 pt-3 border-t border-cyan-500/5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>PROGRESS ({Math.round(pct)}%)</span>
                  <span>{ach.progressCurrent} / {ach.progressGoal}</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 bg-[#101726] rounded-full overflow-hidden p-px flex items-center border border-cyan-500/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked
                        ? 'bg-cyan-400'
                        : 'bg-zinc-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                    {ach.category} Category
                  </span>
                  <span className="text-[10px] font-mono text-amber-500 font-bold flex items-center gap-1 tracking-wider uppercase">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    +{ach.rewardCoins} COINS
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
