import React, { useState } from 'react';
import { Calendar, HelpCircle, Flame } from 'lucide-react';

interface CalendarHeatmapProps {
  xpHistory: { [date: string]: number };
  currentStreak: number;
  longestStreak: number;
}

export default function CalendarHeatmap({ xpHistory, currentStreak, longestStreak }: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; xp: number } | null>(null);

  // Helper to generate list of past 12 weeks (84 days) leading to today
  const generateGridDays = () => {
    const days = [];
    const today = new Date();
    
    // We want the grid to end on today. So we subtract 83 days to find the start.
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      days.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        xp: xpHistory[dateStr] || 0
      });
    }
    return days;
  };

  const gridDays = generateGridDays();

  // Color selection based on XP earned (GitHub / Notion Style)
  const getHeatmapColor = (xp: number) => {
    if (xp === 0) return 'bg-[#101726] border-cyan-500/5';
    if (xp < 25) return 'bg-cyan-950/20 border border-cyan-500/10 text-cyan-300';
    if (xp < 50) return 'bg-cyan-800/40 border border-cyan-700/30 text-cyan-200';
    if (xp < 100) return 'bg-cyan-600/70 border border-cyan-500/45 text-cyan-100';
    return 'bg-cyan-500 border border-cyan-400 text-zinc-950';
  };

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current streak */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-500 rounded-xl shrink-0">
            <Flame className="w-5 h-5 fill-amber-500/10" />
          </div>
          <div className="text-xs">
            <span className="text-zinc-500 uppercase text-[9px] tracking-widest block font-bold font-mono">CURRENT STREAK</span>
            <span className="text-sm font-bold text-amber-500 uppercase font-mono">{currentStreak} DAYS CONTINUOUS</span>
          </div>
        </div>

        {/* Longest streak */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-zinc-500 uppercase text-[9px] tracking-widest block font-bold font-mono">LONGEST RECORDED</span>
            <span className="text-sm font-bold text-cyan-400 uppercase font-mono">{longestStreak} DAYS STREAK</span>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 flex flex-col justify-center text-xs gap-1.5">
          <span className="text-zinc-500 uppercase text-[9px] tracking-widest block font-bold font-mono">GROWTH INTENSITY</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[9px] font-mono uppercase">LESS</span>
            <span className="w-3.5 h-3.5 rounded bg-[#101726] border border-cyan-500/5" />
            <span className="w-3.5 h-3.5 rounded bg-cyan-950/20 border border-cyan-500/10" />
            <span className="w-3.5 h-3.5 rounded bg-cyan-800/40 border border-cyan-700/30" />
            <span className="w-3.5 h-3.5 rounded bg-cyan-600/70 border border-cyan-500/45" />
            <span className="w-3.5 h-3.5 rounded bg-cyan-500" />
            <span className="text-zinc-500 text-[9px] font-mono uppercase">MORE</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative overflow-hidden">
        <h3 className="text-xs font-bold text-zinc-300 uppercase mb-4 flex items-center gap-2 font-mono tracking-widest">
          <Calendar className="w-4 h-4 text-cyan-400" />
          84-DAY CONSISTENCY MATRIX
        </h3>

        {/* Heatmap Grid Container */}
        <div className="relative">
          <div className="flex flex-wrap gap-1.5 justify-start">
            {gridDays.map((day) => (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-5 h-5 rounded border cursor-crosshair transition-all duration-150 hover:scale-110 hover:z-10 ${getHeatmapColor(day.xp)}`}
              />
            ))}
          </div>

          {/* Hover Status Box */}
          <div className="h-10 mt-4 border-t border-cyan-500/5 pt-3 flex items-center justify-between">
            {hoveredDay ? (
              <div className="text-xs text-zinc-300 animate-fadeIn font-mono">
                <span className="text-cyan-400 font-bold uppercase">{hoveredDay.formattedDate}</span>
                <span className="text-zinc-600 mx-2">|</span>
                <span className="text-cyan-400 font-bold uppercase">+{hoveredDay.xp} XP Contribution</span>
              </div>
            ) : (
              <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" /> Hover or tap matrix cells to review historic efforts.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
