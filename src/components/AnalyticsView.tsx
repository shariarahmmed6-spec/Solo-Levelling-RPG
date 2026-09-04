import React from 'react';
import { Character } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface AnalyticsViewProps {
  character: Character;
  xpHistory: { [date: string]: number };
}

export default function AnalyticsView({ character, xpHistory }: AnalyticsViewProps) {
  // 1. Generate 7-day XP data
  const generateSevenDayXpData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateShort = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

      data.push({
        label: `${dayLabel} (${dateShort})`,
        XP: xpHistory[dateStr] || 0
      });
    }
    return data;
  };

  const xpChartData = generateSevenDayXpData();

  // 2. Generate Stat levels data
  const generateStatRadarData = () => {
    return Object.keys(character.stats).map((key) => {
      const stat = character.stats[key as keyof Character['stats']];
      return {
        subject: key,
        Level: stat.level,
        fullMark: 100 // Scale maximum reference
      };
    });
  };

  const radarData = generateStatRadarData();

  // Calculate consistency metrics
  const totalWeeklyXp = xpChartData.reduce((acc, curr) => acc + curr.XP, 0);
  const avgDailyXp = Math.round(totalWeeklyXp / 7);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HUD Header */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest">
            PERFORMANCE ANALYTICS & TELEMETRY
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
            Review data and telemetry regarding your capability progression and overall daily milestones.
          </p>
        </div>

        <div className="flex gap-4 shrink-0 text-xs font-mono">
          <div className="p-3 bg-[#101726] border border-cyan-500/10 rounded-xl">
            <span className="text-zinc-500 uppercase block tracking-wider text-[8px] font-bold">7-DAY CUMULATIVE GROWTH</span>
            <span className="text-sm font-bold text-cyan-400">+{totalWeeklyXp} XP</span>
          </div>
          <div className="p-3 bg-[#101726] border border-cyan-500/10 rounded-xl">
            <span className="text-zinc-500 uppercase block tracking-wider text-[8px] font-bold">DAILY SPRINT VELOCITY</span>
            <span className="text-sm font-bold text-cyan-400">+{avgDailyXp} XP / Day</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Attribute Polygon */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase flex items-center gap-2 font-mono tracking-widest">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              ATTRIBUTE BALANCE ASSESSMENT
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">A visual radar indicating balance across different functional routines</p>
          </div>

          <div className="h-80 w-full flex items-center justify-center relative select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(0, 242, 254, 0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'monospace' }} />
                <Radar
                  name={character.name}
                  dataKey="Level"
                  stroke="#00F2FE"
                  fill="#00F2FE"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day XP Velocity */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase flex items-center gap-2 font-mono tracking-widest">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              PRODUCTIVITY ACCELERATION
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">Active daily progress points registered across the last 7 sessions</p>
          </div>

          <div className="h-80 w-full select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 242, 254, 0.05)" />
                <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111B2D',
                    borderColor: 'rgba(0, 242, 254, 0.15)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#f4f4f5'
                  }}
                />
                  <Area
                    type="monotone"
                    dataKey="XP"
                    stroke="#00F2FE"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorXp)"
                  />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
