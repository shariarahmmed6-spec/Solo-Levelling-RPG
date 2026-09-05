import React, { useState, useEffect, useRef } from 'react';
import { UserGoal, Mission } from '../types';
import { playSound } from '../utils/sound';
import {
  detectCategory,
  generateMissionName,
  createPersonalizedMission,
  getCategoryIcon,
  GoalCategory
} from '../utils/aiMissions';
import {
  ShieldCheck,
  Cpu,
  Terminal,
  CheckCircle2,
  ChevronRight,
  User,
  Calendar,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Clock,
  Camera
} from 'lucide-react';
import { ImageCropModal } from './identity/ImageCropModal';
import { DEFAULT_ARISE_AVATAR } from './ProfileAvatar';

interface SystemInitializationProps {
  onInitialize: (
    data: {
      name: string;
      birthDate: string;
      age: number;
      avatar?: string;
      goals: UserGoal[];
      missions: Mission[];
    },
    isNewUnlock?: boolean
  ) => void;
  soundEnabled: boolean;
}

// Age calculation helper
export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const dob = new Date(birthDateString);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// Preset suggestions for Screen 2
const GOAL_SUGGESTIONS = [
  'Build Muscle',
  'Get Better Grades',
  'Earn Money',
  'Learn Programming',
  'Read More Books',
  'Pray Consistently',
  'Start a Business',
  'Improve Discipline'
];

export default function SystemInitialization({
  onInitialize,
  soundEnabled
}: SystemInitializationProps) {
  // Navigation: 1: Identity -> 2: Goals -> 3: Future Self Scan -> 4: Holographic Profile
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);

  // Screen 1: Identity state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [selectedRawImage, setSelectedRawImage] = useState<string | null>(null);
  const [isPhotoScanning, setIsPhotoScanning] = useState(false);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      alert('Please select a valid image file (JPG, PNG, or WebP).');
      playSound('failure', soundEnabled);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedRawImage(result);
        setIsCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setIsCropOpen(false);
    setSelectedRawImage(null);
    setAvatar(croppedDataUrl);
    setIsPhotoScanning(true);
    setShowScanConfirmation(true);
    playSound('achievement', soundEnabled);

    setTimeout(() => {
      setIsPhotoScanning(false);
    }, 900);

    setTimeout(() => {
      setShowScanConfirmation(false);
    }, 2400);
  };

  // Screen 2: Goals state
  const [goals, setGoals] = useState<UserGoal[]>([
    {
      id: 'g_init_1',
      text: 'Build Muscle',
      category: 'Fitness',
      priority: 1,
      missionName: 'Strength Protocol'
    },
    {
      id: 'g_init_2',
      text: 'Earn Money',
      category: 'Finance',
      priority: 2,
      missionName: 'Income Engine'
    },
    {
      id: 'g_init_3',
      text: 'Learn Programming',
      category: 'Skills',
      priority: 3,
      missionName: 'Code Mastery'
    }
  ]);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Screen 3: Future Self Scan state
  const [scanPhase, setScanPhase] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [scanProgress, setScanProgress] = useState<number>(5);
  const [rotatingProtocolIndex, setRotatingProtocolIndex] = useState(0);

  // Calculated values
  const calculatedAge = birthDate ? calculateAge(birthDate) : 0;
  const isIdentityValid = name.trim().length > 0 && birthDate.trim().length > 0;

  // Generated missions cache
  const generatedMissions = useRef<Mission[]>([]);

  // Rotating system messages for Phase 6
  const protocolMessages = [
    'Creating personalized quests...',
    'Calibrating progression...',
    'Configuring reminders...',
    'Synchronizing Life Calendar...',
    'Activating AI Coach...'
  ];

  // -------------------------------------------------------------
  // Screen 1 Handler: Identity Submission
  // -------------------------------------------------------------
  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIdentityValid) return;
    playSound('click', soundEnabled);
    setCurrentScreen(2);
  };

  // -------------------------------------------------------------
  // Screen 2 Handlers: Goal Management & Priority Drag-and-Drop
  // -------------------------------------------------------------
  const handleAddGoal = (textToAdd: string) => {
    const trimmed = textToAdd.trim();
    if (!trimmed) return;

    // Check if goal already exists
    if (goals.some(g => g.text.toLowerCase() === trimmed.toLowerCase())) {
      setCustomGoalInput('');
      return;
    }

    const detectedCategory = detectCategory(trimmed);
    const missionName = generateMissionName(trimmed, detectedCategory);
    const newGoal: UserGoal = {
      id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      category: detectedCategory,
      priority: goals.length + 1,
      missionName
    };

    setGoals(prev => [...prev, newGoal]);
    setCustomGoalInput('');
    playSound('click', soundEnabled);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => {
      const filtered = prev.filter(g => g.id !== id);
      // Re-assign 1-based priorities
      return filtered.map((g, idx) => ({ ...g, priority: idx + 1 }));
    });
    playSound('click', soundEnabled);
  };

  const handleMoveGoal = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= goals.length) return;

    setGoals(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((g, idx) => ({ ...g, priority: idx + 1 }));
    });
    playSound('click', soundEnabled);
  };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setGoals(prev => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, draggedItem);
      return copy.map((g, idx) => ({ ...g, priority: idx + 1 }));
    });
    setDraggedIndex(null);
    playSound('click', soundEnabled);
  };

  // -------------------------------------------------------------
  // Screen 3 Transition: Start Future Self Scan
  // -------------------------------------------------------------
  const handleStartScan = () => {
    if (goals.length === 0) return;

    // Generate personalized missions
    const missions = goals.map((goal, idx) => createPersonalizedMission(goal, idx));
    generatedMissions.current = missions;

    playSound('click', soundEnabled);
    setCurrentScreen(3);
    setScanPhase(1);
    setScanProgress(5);
  };

  // -------------------------------------------------------------
  // Scan Sequence Timings (Signature 3–5 second experience)
  // -------------------------------------------------------------
  useEffect(() => {
    if (currentScreen !== 3) return;

    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Initializing Neural Scan... (5%) - 0ms
    setScanPhase(1);
    setScanProgress(5);

    // Phase 2: Analyzing Identity... (20%) - 600ms
    timers.push(
      setTimeout(() => {
        setScanPhase(2);
        setScanProgress(20);
        playSound('click', soundEnabled);
      }, 650)
    );

    // Phase 3: Scanning Future Objectives... (45%) - 1350ms
    timers.push(
      setTimeout(() => {
        setScanPhase(3);
        setScanProgress(45);
        playSound('click', soundEnabled);
      }, 1350)
    );

    // Phase 4: Detecting Priority Matrix... (60%) - 2100ms
    timers.push(
      setTimeout(() => {
        setScanPhase(4);
        setScanProgress(60);
        playSound('click', soundEnabled);
      }, 2100)
    );

    // Phase 5: Building Mission Framework... (80%) - 2900ms
    timers.push(
      setTimeout(() => {
        setScanPhase(5);
        setScanProgress(80);
        playSound('click', soundEnabled);
      }, 2900)
    );

    // Phase 6: Generating Daily Protocol... (95%) - 3700ms
    timers.push(
      setTimeout(() => {
        setScanPhase(6);
        setScanProgress(95);
        playSound('click', soundEnabled);
      }, 3700)
    );

    // Final Phase: SYSTEM ONLINE (100%) - 4500ms
    timers.push(
      setTimeout(() => {
        setScanPhase(7);
        setScanProgress(100);
        playSound('reward', soundEnabled);
      }, 4500)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentScreen, soundEnabled]);

  // Rotate Phase 6 protocol messages
  useEffect(() => {
    if (currentScreen === 3 && scanPhase === 6) {
      const interval = setInterval(() => {
        setRotatingProtocolIndex(prev => (prev + 1) % protocolMessages.length);
      }, 220);
      return () => clearInterval(interval);
    }
  }, [currentScreen, scanPhase, protocolMessages.length]);

  const [isUnlocking, setIsUnlocking] = useState(false);

  // -------------------------------------------------------------
  // Enter ARISE -> Phase 1 System Lock (0.2s) -> Handoff to App.tsx
  // -------------------------------------------------------------
  const handleEnterArise = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    playSound('systemUnlock', soundEnabled);

    // Phase 1 (0.2s): Enter ARISE button fades away, screen dims slightly, soft cyan pulse appears in center.
    // At 200ms, hand off to Dashboard with SystemUnlockTransition in Phase 2
    setTimeout(() => {
      onInitialize(
        {
          name: name.trim(),
          birthDate,
          age: calculatedAge,
          avatar: avatar || undefined,
          goals,
          missions: generatedMissions.current
        },
        true
      );
    }, 200);
  };

  return (
    <div
      id="arise-onboarding-container"
      className={`min-h-screen text-zinc-100 flex flex-col justify-center items-center px-4 py-8 font-sans relative overflow-hidden select-none transition-colors duration-200 ${
        isUnlocking ? 'bg-[#040711]' : 'bg-[#070b14]'
      }`}
    >
      {/* Background Subtle Tactical Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* Phase 1 Soft Cyan Pulse in Center (emerges over 0.2s without sudden flash) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none transition-all duration-200 ease-out z-30 ${
          isUnlocking ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      />

      {/* ========================================================================= */}
      {/* SCREEN 1: IDENTITY INITIALIZATION */}
      {/* ========================================================================= */}
      {currentScreen === 1 && (
        <div className="relative w-full max-w-md bg-[#0c1424] border border-cyan-500/20 rounded-2xl p-7 md:p-9 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.08)] backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Holographic Header Bar */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 border-b border-cyan-500/15 pb-4 mb-7">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-400 font-semibold uppercase">TACTICAL SYSTEM HUD</span>
            </div>
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              STAGE 1 / 3
            </span>
          </div>

          {/* Screen Title & Subtitle */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-1 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-base md:text-lg font-mono font-black tracking-[0.2em] text-zinc-100 uppercase">
              SYSTEM INITIALIZATION
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xs mx-auto">
              "Before the system begins tracking your journey, identify yourself."
            </p>
          </div>

          <form onSubmit={handleIdentitySubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="user-name-input"
                className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Name</span>
              </label>
              <div className="relative">
                <input
                  id="user-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={32}
                  autoComplete="off"
                  autoFocus
                  className="w-full bg-[#101b2e] border border-cyan-500/25 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-sans transition-all duration-150 shadow-inner"
                />
              </div>
            </div>

            {/* Date of Birth Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="user-dob-input"
                  className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Date of Birth</span>
                </label>
                {calculatedAge > 0 && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded shadow-sm">
                    Age: {calculatedAge} years
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="user-dob-input"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min="1920-01-01"
                  className="w-full bg-[#101b2e] border border-cyan-500/25 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-mono transition-all duration-150 shadow-inner [color-scheme:dark]"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono leading-tight">
                Used to configure your personal Life Calendar and chronological progression.
              </p>
            </div>

            {/* Profile Photo (Optional) */}
            <div className="space-y-3 pt-2 border-t border-cyan-500/15">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile Photo (Optional)</span>
                </label>
                {avatar ? (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    REGISTERED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">
                    OPTIONAL
                  </span>
                )}
              </div>

              <div className="p-4 bg-[#101b2e]/60 border border-cyan-500/20 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                {/* Circular Avatar Placeholder */}
                <div className="relative shrink-0">
                  <div
                    className={`relative w-20 h-20 rounded-full overflow-hidden border-2 bg-[#090D18] flex items-center justify-center transition-all duration-300 ${
                      isPhotoScanning
                        ? 'border-cyan-400 ring-4 ring-cyan-400/40 shadow-[0_0_30px_#00f2fe]'
                        : avatar
                        ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
                        : 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.08)]'
                    }`}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="System Identity"
                        className="w-full h-full object-cover select-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-cyan-500/60 p-2 text-center select-none">
                        <Camera className="w-6 h-6 mb-1 text-cyan-400/70" />
                        <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-400/80">Avatar</span>
                      </div>
                    )}

                    {/* HUD Scan Effect (0.8s cyan line moving top to bottom + glow) */}
                    {isPhotoScanning && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                        <div className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_#00f2fe,0_0_4px_#ffffff] animate-hud-scan" />
                        <div className="absolute inset-0 bg-cyan-500/20" />
                      </div>
                    )}
                  </div>

                  {/* Registered checkmark icon badge */}
                  {avatar && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Text & Actions */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <h4 className="text-xs text-zinc-100 font-sans font-semibold">
                      Add your System Identity.
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      {avatar
                        ? 'Biometric photograph successfully calibrated.'
                        : 'Upload a portrait from your device or skip to use default.'}
                    </p>
                  </div>

                  {/* Confirmation text overlay */}
                  {showScanConfirmation && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.4)] animate-in fade-in duration-200">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>SYSTEM IDENTITY REGISTERED</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click', soundEnabled);
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{avatar ? 'Change Photo' : 'Choose from Gallery'}</span>
                    </button>

                    {avatar ? (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click', soundEnabled);
                          setAvatar(null);
                        }}
                        className="px-3 py-2 rounded-lg bg-transparent hover:bg-zinc-800/40 text-zinc-400 hover:text-rose-300 font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click', soundEnabled);
                          setAvatar(null);
                        }}
                        className="px-3 py-2 rounded-lg bg-transparent hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Skip for Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                id="initialize-system-submit-btn"
                type="submit"
                disabled={!isIdentityValid}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  isIdentityValid
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(0,229,255,0.35)] active:scale-[0.98]'
                    : 'bg-[#101929] text-zinc-600 border border-cyan-500/10 cursor-not-allowed'
                }`}
              >
                <span>Initialize System</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isIdentityValid ? 'translate-x-0 group-hover:translate-x-1 text-black' : 'text-zinc-600'
                  }`}
                />
              </button>
            </div>
          </form>

          {/* Footer Security Watermark */}
          <div className="mt-8 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-zinc-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/40" />
              <span>SECURE LOCAL ENCRYPTED CLIENT</span>
            </div>
            <span>NODE 01</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: GOAL INITIALIZATION */}
      {/* ========================================================================= */}
      {currentScreen === 2 && (
        <div className="relative w-full max-w-lg bg-[#0c1424] border border-cyan-500/20 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.08)] backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 border-b border-cyan-500/15 pb-3.5 mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-400 font-semibold uppercase">GOAL CALIBRATION</span>
            </div>
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 font-mono">
              STAGE 2 / 3
            </span>
          </div>

          {/* Screen Title & Subtitle */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-lg md:text-xl font-mono font-black tracking-tight text-zinc-100">
              What do you want to become?
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-md mx-auto">
              "Your goals will shape how ARISE behaves. The system will generate missions, quests, reminders, and progression specifically for your journey."
            </p>
          </div>

          {/* Goal Input Field */}
          <div className="space-y-4 mb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddGoal(customGoalInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customGoalInput}
                onChange={(e) => setCustomGoalInput(e.target.value)}
                placeholder="Write a custom goal (e.g. Master React, Run 5km)..."
                maxLength={48}
                className="flex-1 bg-[#101b2e] border border-cyan-500/25 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-sans shadow-inner"
              />
              <button
                type="submit"
                disabled={!customGoalInput.trim()}
                className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  customGoalInput.trim()
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-[#101929] text-zinc-600 border border-cyan-500/10 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </form>

            {/* Suggestions Chips (Pills) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                SUGGESTIONS (TAP TO ADD):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GOAL_SUGGESTIONS.map((sug) => {
                  const alreadyAdded = goals.some(
                    g => g.text.toLowerCase() === sug.toLowerCase()
                  );
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddGoal(sug)}
                      className={`text-[11px] font-sans px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        alreadyAdded
                          ? 'bg-[#101726]/40 border-cyan-500/5 text-zinc-600 cursor-default line-through'
                          : 'bg-[#101b2e] hover:bg-cyan-950/40 border-cyan-500/15 hover:border-cyan-500/30 text-zinc-300 hover:text-cyan-300'
                      }`}
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Goals & Priority Ordering List */}
          <div className="space-y-2 mb-7">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <span>PRIORITY MATRIX (DRAG OR USE ARROWS TO ORDER)</span>
              <span>{goals.length} ACTIVE {goals.length === 1 ? 'GOAL' : 'GOALS'}</span>
            </div>

            {goals.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-cyan-500/15 bg-[#101929]/50 text-center text-xs text-zinc-500 font-mono">
                No goals added yet. Choose from the suggestions above or enter a custom goal.
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {goals.map((goal, idx) => {
                  const isTopPriority = idx === 0;
                  const catIcon = getCategoryIcon(goal.category);

                  return (
                    <div
                      key={goal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all select-none ${
                        isTopPriority
                          ? 'bg-[#122238] border-cyan-500/40 text-zinc-100 shadow-[0_0_15px_rgba(0,229,255,0.12)]'
                          : 'bg-[#101b2e]/90 border-cyan-500/15 text-zinc-300 hover:border-cyan-500/25'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-cyan-400 p-0.5"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <span className="text-base shrink-0">{catIcon}</span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-200 truncate font-sans">
                              {goal.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                            <span className="text-cyan-400/80 bg-cyan-950/50 border border-cyan-500/20 px-1.5 py-0.2 rounded uppercase">
                              {goal.category}
                            </span>
                            <span className="text-zinc-500">
                              → {goal.missionName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {isTopPriority ? (
                          <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
                            #1 PRIORITY
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-500 bg-[#0c1424] border border-cyan-500/10 px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                        )}

                        {/* Reorder controls for accessibility / mobile */}
                        <div className="flex flex-col gap-0.5 ml-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveGoal(idx, 'up')}
                            className="p-1 text-zinc-500 hover:text-cyan-400 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === goals.length - 1}
                            onClick={() => handleMoveGoal(idx, 'down')}
                            className="p-1 text-zinc-500 hover:text-cyan-400 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(goal.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 ml-1 cursor-pointer transition-colors"
                          title="Remove Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            id="begin-future-scan-btn"
            type="button"
            disabled={goals.length === 0}
            onClick={handleStartScan}
            className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              goals.length > 0
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(0,229,255,0.35)] active:scale-[0.98]'
                : 'bg-[#101929] text-zinc-600 border border-cyan-500/10 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Begin Future Scan</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: FUTURE SELF SCAN (SIGNATURE EXPERIENCE) */}
      {/* ========================================================================= */}
      {currentScreen === 3 && (
        <div
          className={`relative w-full max-w-lg bg-[#0c1424] border border-cyan-500/25 rounded-2xl p-7 md:p-9 shadow-[0_0_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,229,255,0.1)] backdrop-blur-md transition-all duration-200 overflow-hidden ${
            isUnlocking
              ? 'opacity-25 scale-[0.99] border-cyan-500/10'
              : scanPhase === 7
              ? 'bg-[#080e1a] shadow-[0_0_70px_rgba(0,229,255,0.18)]'
              : ''
          }`}
        >
          {/* Subtle Scanning Line Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="w-full h-24 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-[scanline_2.4s_ease-in-out_infinite]" />
          </div>

          {/* Header Bar */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 border-b border-cyan-500/15 pb-4 mb-7 relative z-10">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-zinc-300 font-semibold uppercase">FUTURE SELF SCANNER</span>
            </div>
            <span className="text-cyan-400 font-bold font-mono tracking-wider">
              {scanProgress}%
            </span>
          </div>

          {/* Rotating Scanner Ring / Core Command Center */}
          <div className="flex flex-col items-center justify-center my-6 relative z-10">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Rotating Tactical Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-[spin_8s_linear_infinite]" />
              {/* Counter Rotating Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500/20 border-l-transparent animate-[spin_4s_linear_infinite_reverse]" />
              {/* Inner Soft Glowing Core */}
              <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                {scanPhase === 7 ? (
                  <CheckCircle2 className="w-8 h-8 text-cyan-400 animate-in zoom-in-75 duration-300" />
                ) : (
                  <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Phase Content Area */}
          <div className="space-y-5 min-h-[190px] relative z-10 text-center flex flex-col justify-center">
            {/* Phase 1: Initializing Neural Scan... */}
            {scanPhase === 1 && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <h2 className="text-base font-mono font-bold text-cyan-300 uppercase tracking-widest">
                  Initializing Neural Scan...
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Calibrating biometric parameters & quantum life timeline...
                </p>
              </div>
            )}

            {/* Phase 2: Analyzing Identity... */}
            {scanPhase === 2 && (
              <div className="space-y-3 animate-in fade-in duration-200 text-left bg-[#101b2e]/60 border border-cyan-500/20 p-4 rounded-xl">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Analyzing Identity...
                </div>
                <div className="space-y-1.5 text-xs font-mono text-zinc-300 pl-4">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Name Verified: <strong className="text-white">{name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Age Calculated: <strong className="text-white">{calculatedAge} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Timeline Created: <strong className="text-white">Life Calendar Configured</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 3: Scanning Future Objectives... */}
            {scanPhase === 3 && (
              <div className="space-y-3 animate-in fade-in duration-200 text-left bg-[#101b2e]/60 border border-cyan-500/20 p-4 rounded-xl">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Scanning Future Objectives...
                </div>
                <div className="space-y-1.5 text-xs font-mono text-zinc-300 max-h-[110px] overflow-y-auto pl-2">
                  {goals.map((g) => (
                    <div key={g.id} className="flex items-center gap-2 text-cyan-100">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{g.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 4: Detecting Priority Matrix... */}
            {scanPhase === 4 && (
              <div className="space-y-3 animate-in fade-in duration-200 text-center">
                <h2 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Detecting Priority Matrix...
                </h2>
                {/* Subtle Animated Matrix Grid */}
                <div className="grid grid-cols-6 gap-1.5 p-3 rounded-xl bg-[#101b2e]/80 border border-cyan-500/20 max-w-xs mx-auto">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 rounded bg-cyan-950/80 border border-cyan-500/25 flex items-center justify-center text-[9px] font-mono text-cyan-400 animate-pulse"
                      style={{ animationDelay: `${(i % 5) * 120}ms` }}
                    >
                      P{((i % goals.length) + 1)}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Synthesizing neural weights for #{goals[0]?.text}...
                </p>
              </div>
            )}

            {/* Phase 5: Building Mission Framework... */}
            {scanPhase === 5 && (
              <div className="space-y-3 animate-in fade-in duration-200 text-left bg-[#101b2e]/60 border border-cyan-500/20 p-4 rounded-xl">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Building Mission Framework...
                </div>
                <div className="space-y-1.5 text-xs font-mono text-zinc-300 pl-2">
                  {generatedMissions.current.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <span>{m.icon}</span>
                      <span className="font-semibold text-white">{m.name}</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-1 rounded">
                        DEPLOYED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 6: Generating Daily Protocol... */}
            {scanPhase === 6 && (
              <div className="space-y-3 animate-in fade-in duration-200 text-center">
                <h2 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Generating Daily Protocol...
                </h2>
                <div className="p-4 rounded-xl bg-[#101b2e]/90 border border-cyan-500/30 text-xs font-mono text-cyan-200 shadow-inner">
                  <span className="text-cyan-400 font-bold mr-2">›</span>
                  <span className="animate-pulse">{protocolMessages[rotatingProtocolIndex]}</span>
                </div>
              </div>
            )}

            {/* Final Phase: SYSTEM ONLINE */}
            {scanPhase === 7 && (
              <div className="space-y-4 animate-in zoom-in-95 duration-400 text-center py-2">
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-mono font-black tracking-[0.25em] text-white uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]">
                    SYSTEM ONLINE
                  </h1>
                  <p className="text-xs text-cyan-300/80 font-sans italic max-w-xs mx-auto leading-relaxed">
                    "Your future is no longer imagined. It is now being built."
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    id="enter-arise-btn"
                    type="button"
                    onClick={handleEnterArise}
                    disabled={isUnlocking}
                    className={`w-full py-4 rounded-xl font-mono text-xs font-black uppercase tracking-[0.2em] bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_30px_rgba(0,229,255,0.5)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 ${
                      isUnlocking ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'
                    }`}
                  >
                    <span>Enter ARISE</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-4 mt-6 border-t border-cyan-500/15 relative z-10">
            <div className="w-full h-1.5 bg-[#101b2e] rounded-full overflow-hidden border border-cyan-500/20 p-px">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: HOLOGRAPHIC SYSTEM PROFILE (2-SECOND REVEAL) */}
      {/* ========================================================================= */}
      {currentScreen === 4 && (
        <div className="relative w-full max-w-md bg-[#09111f] border-2 border-cyan-400/60 rounded-2xl p-7 shadow-[0_0_70px_rgba(0,229,255,0.35),inset_0_0_30px_rgba(0,229,255,0.1)] backdrop-blur-md transition-all duration-300 animate-in fade-in zoom-in-95 select-none overflow-hidden">
          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.06)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

          {/* Holographic Header */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-cyan-400 border-b border-cyan-500/30 pb-3 mb-6 relative z-10">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              CLASSIFIED SYSTEM REGISTRATION
            </span>
            <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
              STATUS: ONLINE
            </span>
          </div>

          {/* Profile Details */}
          <div className="space-y-4 relative z-10 font-mono">
            <div className="flex items-center gap-4 bg-[#101c30]/90 border border-cyan-500/30 p-4 rounded-xl">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)] shrink-0">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span>{name.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">HUNTER IDENTITY</span>
                <h2 className="text-base font-bold text-white tracking-wide">{name}</h2>
                <div className="flex items-center gap-2 text-xs text-cyan-300">
                  <span>Age {calculatedAge}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-amber-400 font-bold">Level 1</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-cyan-400">Rank E</span>
                </div>
              </div>
            </div>

            {/* Active Missions */}
            <div className="bg-[#101c30]/60 border border-cyan-500/20 p-3.5 rounded-xl space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                ACTIVE MISSIONS INITIALIZED
              </span>
              <div className="space-y-1 text-xs">
                {generatedMissions.current.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <span>{m.icon}</span>
                      <span className="font-semibold">{m.name}</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline status */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#101c30]/40 border border-cyan-500/15">
              <span className="text-zinc-400">Life Timeline</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Initialized
              </span>
            </div>
          </div>

          {/* Holographic Watermark */}
          <div className="mt-6 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[9px] font-mono text-zinc-500 relative z-10">
            <span>ARISE TACTICAL OS</span>
            <span className="text-cyan-400 animate-pulse">SYNCHRONIZING DASHBOARD...</span>
          </div>
        </div>
      )}

      {/* Hidden Native File Input for Gallery Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {/* Image Crop Modal */}
      {selectedRawImage && (
        <ImageCropModal
          imageSrc={selectedRawImage}
          isOpen={isCropOpen}
          onClose={() => {
            setIsCropOpen(false);
            setSelectedRawImage(null);
          }}
          onCropComplete={handleCropComplete}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
}
