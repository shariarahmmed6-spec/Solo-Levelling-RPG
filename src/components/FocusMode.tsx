import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Play, Square, Pause, Flame, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { playSound } from '../utils/sound';

interface FocusModeProps {
  onCompleteSession: (minutes: number, xpEarned: number, coinsEarned: number) => void;
  soundEnabled: boolean;
}

export default function FocusMode({ onCompleteSession, soundEnabled }: FocusModeProps) {
  const [duration, setDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [rewardsCollected, setRewardsCollected] = useState<{ xp: number; coins: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synced state when duration changes
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isRunning, isPaused]);

  // Core countdown ticker
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
    setRewardsCollected(null);
    playSound('click', soundEnabled);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    playSound('click', soundEnabled);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    playSound('failure', soundEnabled);
  };

  const handleFinished = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    
    // Calculate rewards: 2 XP per focus minute, 1 Coin per focus minute
    const xpReward = duration * 2 + 10; // base + bonus
    const coinsReward = duration;

    setRewardsCollected({ xp: xpReward, coins: coinsReward });
    onCompleteSession(duration, xpReward, coinsReward);
    playSound('levelUp', soundEnabled);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const percentLeft = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Block */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative z-10">
          <div>
            <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest">
              DEEP WORK FOCUS CONSOLE
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
              Establish high-intention cognitive focus. Track focused study intervals, exclude distractions, and build persistent mental discipline.
            </p>
          </div>
          
          <div className="flex gap-2 font-mono text-xs">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                disabled={isRunning || isPaused}
                onClick={() => {
                  setDuration(mins);
                  setTimeLeft(mins * 60);
                  playSound('click', soundEnabled);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  duration === mins
                    ? 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-[0_0_10px_rgba(0,242,254,0.1)]'
                    : 'bg-[#101726] border-cyan-500/10 text-zinc-400 hover:text-zinc-200 disabled:opacity-45'
                }`}
              >
                {mins}M
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modern Minimal Circular Dial */}
        <div className="md:col-span-2 bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-8 flex flex-col items-center justify-center min-h-[400px] shadow-inner relative">
          
          {/* Circular Countdown Gauge */}
          <div className="relative w-64 h-64 flex items-center justify-center select-none">
            {/* Background circle SVG track */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#101726" strokeWidth="2.5" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#00F2FE"
                strokeWidth="3"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * percentLeft) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Middle countdown letters */}
            <div className="text-center space-y-1 relative z-10">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase block font-bold">
                {isRunning ? 'INTERVAL ACTIVE' : isPaused ? 'TIMER PAUSED' : 'READY'}
              </span>
              <h1 className="text-5xl font-bold font-mono tracking-tight text-zinc-50">
                {formatTime(timeLeft)}
              </h1>
              {isRunning && (
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold animate-pulse mt-1">
                  SHIELD ACTIVE
                </span>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex gap-4 mt-8 relative z-10">
            {!isRunning && !isPaused && (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.1)] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START FOCUS</span>
              </button>
            )}

            {isRunning && (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#101726] hover:bg-[#101726]/80 text-zinc-200 border border-cyan-500/10 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </button>
            )}

            {isPaused && (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#101726] hover:bg-[#101726]/85 text-zinc-100 border border-cyan-500/10 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                <Play className="w-4 h-4" />
                <span>RESUME</span>
              </button>
            )}

            {(isRunning || isPaused) && (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-950/10 hover:bg-red-950/20 text-red-400 border border-red-900/30 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>CANCEL</span>
              </button>
            )}
          </div>
        </div>

        {/* Shield Status Panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">FOCUS PROTOCOLS</h3>

          {/* Shield Status widget */}
          <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${isRunning ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-zinc-300 font-mono tracking-wider">Intelligent Focus Shield</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                  {isRunning
                    ? 'All external phone alerts and ambient tabs are filtered during this Pomodoro block to maximize memory consolidation.'
                    : 'Focus shield offline. Activate a countdown block to secure cognitive workflow stability.'}
                </p>
              </div>
            </div>

            {/* Active reward prediction info */}
            <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center text-[9px] font-mono tracking-wider">
              <span className="text-zinc-500">ESTIMATED YIELD:</span>
              <span className="text-cyan-400 font-bold">+{duration * 2 + 10} XP / +{duration} Coins</span>
            </div>
          </div>

          {/* Finished Session summary */}
          {isCompleted && rewardsCollected && (
            <div className="bg-cyan-950/10 border border-cyan-500/25 rounded-[14px] p-5 space-y-3 animate-scaleUp">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider font-mono">SESSION COMPLETED</h4>
              </div>
              <p className="text-xs text-zinc-300 leading-normal font-sans font-normal">
                Outstanding concentration. Your focus shields held flawlessly. The productivity rewards have been successfully processed.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20 text-cyan-400 font-bold text-center">
                  +{rewardsCollected.xp} XP
                </div>
                <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20 text-amber-500 font-bold text-center">
                  +{rewardsCollected.coins} COINS
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
