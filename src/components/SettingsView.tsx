import React, { useState } from 'react';
import { AppState, Character, LifeCalendarSettings } from '../types';
import { playSound } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  Shield,
  Volume2,
  VolumeX,
  FileDown,
  FileUp,
  RefreshCw,
  Lock,
  KeyRound,
  Check,
  Calendar,
  Palette,
  Eye,
  BookOpen,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallPrompt';
import { ProfileAvatar, DEFAULT_ARISE_AVATAR } from './ProfileAvatar';
import { ImageCropModal } from './identity/ImageCropModal';

interface SettingsViewProps {
  settings: AppState['settings'];
  character: Character | null;
  onUpdateSettings: (newSettings: Partial<AppState['settings']>) => void;
  onResetProgress: () => void;
  onImportState: (importedState: AppState) => void;
  fullState: AppState;
  soundEnabled: boolean;
  onUpdateLifeCalendarSettings: (newSettings: Partial<LifeCalendarSettings>) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
}

export default function SettingsView({
  settings,
  character,
  onUpdateSettings,
  onResetProgress,
  onImportState,
  fullState,
  soundEnabled,
  onUpdateLifeCalendarSettings,
  onUpdateAvatar
}: SettingsViewProps) {
  const { theme: activeTheme, setTheme } = useTheme();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // System Identity photo management state
  const [selectedRawImage, setSelectedRawImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isAvatarScanning, setIsAvatarScanning] = useState(false);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isCustomAvatar =
    character?.avatar &&
    character.avatar !== DEFAULT_ARISE_AVATAR &&
    !['creator', 'sentry', 'mage', 'paladin', 'assassin', 'merchant'].includes(character.avatar);

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
    if (onUpdateAvatar) {
      onUpdateAvatar(croppedDataUrl);
    }
    setIsAvatarScanning(true);
    setShowScanConfirmation(true);
    playSound('achievement', soundEnabled);

    setTimeout(() => {
      setIsAvatarScanning(false);
    }, 900);

    setTimeout(() => {
      setShowScanConfirmation(false);
    }, 2400);
  };

  const handleRemoveAvatar = () => {
    playSound('click', soundEnabled);
    if (onUpdateAvatar) {
      onUpdateAvatar(DEFAULT_ARISE_AVATAR);
    }
  };

  const handleRestoreDefaultAvatar = () => {
    playSound('click', soundEnabled);
    if (onUpdateAvatar) {
      onUpdateAvatar(DEFAULT_ARISE_AVATAR);
    }
  };

  // Sound toggle
  const handleSoundToggle = () => {
    const nextVal = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextVal });
    playSound('click', nextVal);
  };

  // Secure PIN configuration
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || isNaN(Number(pinInput))) {
      setPinError('PIN must be exactly 4 numeric digits.');
      playSound('failure', soundEnabled);
      return;
    }
    onUpdateSettings({ pinLock: pinInput });
    setPinInput('');
    setPinError('');
    setShowPinConfirm(true);
    playSound('achievement', soundEnabled);
    setTimeout(() => setShowPinConfirm(false), 2000);
  };

  const handleRemovePin = () => {
    onUpdateSettings({ pinLock: '' });
    playSound('click', soundEnabled);
  };

  // Export state to JSON file
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(fullState, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workspace_backup_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      playSound('achievement', soundEnabled);
    } catch (err) {
      console.error('Backup failed', err);
    }
  };

  // Export completed logs to CSV
  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Category,Amount Logged,Date\n';
      
      // Map XP History
      Object.keys(fullState.xpHistory).forEach(date => {
        csvContent += `XP Earned,${fullState.xpHistory[date]} XP,${date}\n`;
      });

      // Map Fitness
      fullState.fitnessLogs.forEach(log => {
        csvContent += `Fitness reps,${log.pushups + log.pullups + log.squats} reps,${log.date}\n`;
      });

      // Map Learning
      fullState.learningLogs.forEach(log => {
        csvContent += `Learning mins,${log.durationMinutes} mins,${log.date}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `productivity_history_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      playSound('achievement', soundEnabled);
    } catch (err) {
      console.error('CSV export failed', err);
    }
  };

  // Restore state from file selection
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.character) {
          onImportState(parsed);
          playSound('levelUp', soundEnabled);
        } else {
          alert('Invalid JSON workspace structure.');
          playSound('failure', soundEnabled);
        }
      } catch (err) {
        alert('Failed to read backup file.');
        playSound('failure', soundEnabled);
      }
    };
    reader.readAsText(file);
  };

  // Export life history chronicle
  const handleExportLifeHistory = () => {
    try {
      const reflections = fullState.lifeReflections || {};
      const archive = fullState.lifeHistoryArchive || {};
      let chronicleText = "=========================================\n";
      chronicleText += "         LIFETIME ARCHIVE CHRONICLE      \n";
      chronicleText += "=========================================\n\n";
      
      Object.keys(archive).sort().forEach(date => {
        const log = archive[date];
        chronicleText += `DATE: ${date}\n`;
        if (log.reflection) {
          chronicleText += `REFLECTION: "${log.reflection}"\n`;
        }
        if (log.completedQuests && log.completedQuests.length > 0) {
          chronicleText += `QUESTS COMPLETED:\n`;
          log.completedQuests.forEach(q => {
            chronicleText += `  - [✓] ${q.text} (+${q.xpReward} XP)\n`;
          });
        }
        if (log.studyHours > 0) {
          chronicleText += `STUDY DURATION: ${log.studyHours} hours\n`;
        }
        if (log.workout) {
          chronicleText += `WORKOUT STATS: Pushups: ${log.workout.pushups}, Pullups: ${log.workout.pullups}, Squats: ${log.workout.squats}, Run: ${log.workout.runKm} km\n`;
        }
        chronicleText += "-----------------------------------------\n";
      });

      const blob = new Blob([chronicleText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `life_chronicle_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      playSound('achievement', soundEnabled);
    } catch (err) {
      console.error('Chronicle export failed', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title banner */}
      <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm relative">
        <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-widest flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          SYSTEM CONFIGURATION CONTROL
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-1.5 font-normal">
          Update sound preferences, configure security passcodes, export workspace logs, and manage offline data archives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ========================================================================= */}
        {/* EDIT SYSTEM IDENTITY CARD */}
        {/* ========================================================================= */}
        <div className="md:col-span-2 bg-[#111B2D] border border-cyan-500/15 rounded-[14px] p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/10 pb-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                Edit System Identity
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Manage your biometric profile portrait and tactical System Identity. Updates across all views.
              </p>
            </div>
            {isCustomAvatar ? (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                CUSTOM BIOMETRIC REGISTERED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-400 bg-[#101726] border border-cyan-500/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
                DEFAULT ARISE IDENTITY
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[#101726]/70 border border-cyan-500/10">
            {/* Live Profile Avatar with Scan & Glow */}
            <div className="relative shrink-0">
              <ProfileAvatar
                character={character}
                size="lg"
                showLevelBadge={true}
                isScanning={isAvatarScanning}
                isClickable={true}
                onClick={() => fileInputRef.current?.click()}
              />
            </div>

            {/* Operator Info & HUD Scan Toast */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{character?.name || 'Operator'}</h4>
                <p className="text-xs font-mono text-cyan-400/80">
                  {character?.rank || 'Rank E'} • Level {character?.level || 1}
                </p>
              </div>

              {showScanConfirmation && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,229,255,0.4)] animate-in fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SYSTEM IDENTITY REGISTERED</span>
                </div>
              )}

              {/* Action Buttons: Change Photo, Remove Photo, Restore Default Avatar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    playSound('click', soundEnabled);
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <ImageIcon className="w-4 h-4 text-black" />
                  <span>Change Photo</span>
                </button>

                {isCustomAvatar ? (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-2 rounded-xl bg-[#090e1a] hover:bg-[#0f172a] border border-cyan-500/20 text-zinc-300 hover:text-rose-300 font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Remove Photo</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestoreDefaultAvatar}
                    className="px-3.5 py-2 rounded-xl bg-[#090e1a] hover:bg-[#0f172a] border border-cyan-500/20 text-zinc-400 hover:text-zinc-200 font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Restore Default Avatar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Core settings form */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 space-y-6 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> GENERAL PARAMETERS
          </h3>

          {/* Sound Trigger Toggle */}
          <div className="flex justify-between items-center p-4 bg-[#101726] border border-cyan-500/10 rounded-[14px]">
            <div>
              <h4 className="text-xs font-bold font-mono uppercase text-zinc-200">System Sound FX</h4>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">Play dynamic audio alerts upon task completion</p>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                settings.soundEnabled
                  ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                  : 'bg-[#101726]/60 border-cyan-500/5 text-zinc-600'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>
          </div>

          {/* Theme Preset Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">VISUAL LAYOUT PRESET</label>
              <span className="text-[9px] font-mono text-cyan-400 uppercase font-semibold">Active: {activeTheme.replace('-', ' ')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {([
                { id: 'dark-cyber', label: 'Dark Cyber', desc: 'Deep Navy & Cyan' },
                { id: 'neon-blue', label: 'Neon Blue', desc: 'Obsidian & Blue' },
                { id: 'monarch-purple', label: 'Monarch Purple', desc: 'Void & Purple' }
              ] as const).map((preset) => {
                const isActive = activeTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setTheme(preset.id);
                      onUpdateSettings({ themeMode: preset.id });
                      playSound('click', soundEnabled);
                    }}
                    className={`py-3 px-2 border rounded-xl font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-[0_0_12px_rgba(0,242,254,0.25)] scale-[1.02]'
                        : 'bg-[#101726] border-cyan-500/10 text-zinc-400 hover:text-zinc-200 hover:border-cyan-500/25'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider leading-tight">{preset.label}</span>
                      <span className={`text-[8px] font-mono tracking-tight lowercase ${isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
                        {preset.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security / PIN Panel */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> CONSOLE SECURITY LOCK
          </h3>

          {settings.pinLock ? (
            <div className="p-4 bg-cyan-950/5 border border-cyan-500/15 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">4-Digit PIN Security Active</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                The workspace is secure. This passcode is required on application startup to unlock your logs and statistics.
              </p>
              <button
                onClick={handleRemovePin}
                className="px-3 py-1.5 bg-red-950/10 border border-red-900/20 hover:border-red-500 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Disable Security PIN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSavePin} className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
                Protect your dashboard metrics by configuring a secure 4-digit local entrance PIN.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="password"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinError('');
                  }}
                  placeholder="0000"
                  className="bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-sm font-mono w-32 tracking-widest text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Enable Lock
                </button>
              </div>

              {pinError && <p className="text-red-400 text-[10px] font-mono uppercase tracking-wider">{pinError}</p>}
              {showPinConfirm && (
                <div className="text-cyan-400 text-xs font-mono flex items-center gap-1 animate-fadeIn uppercase tracking-wider font-bold">
                  <Check className="w-3.5 h-3.5" /> Passcode Saved Successfully!
                </div>
              )}
            </form>
          )}
        </div>

        {/* Local Storage Offloading Backups */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <FileDown className="w-4 h-4 text-cyan-400" /> EXPORT & DATA ARCHIVE
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
            Download raw progress and accomplishment records. Back them up locally or port them directly to secondary browsers.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={handleExportJSON}
              disabled={!character}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-200 rounded-xl cursor-pointer transition-colors disabled:opacity-40 font-mono font-bold uppercase tracking-wider"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!character}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-200 rounded-xl cursor-pointer transition-colors disabled:opacity-40 font-mono font-bold uppercase tracking-wider"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Import JSON Form */}
          <div className="space-y-1.5 pt-2">
            <span className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">RESTORE WORKSPACE ENVIRONMENT</span>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-cyan-500/10 hover:border-cyan-500/25 bg-[#101726]/20 hover:bg-[#101726]/40 rounded-xl cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors font-mono uppercase tracking-wider text-xs font-bold">
              <FileUp className="w-4 h-4 text-cyan-400" />
              <span>Upload Backup File</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Life Calendar Parameters Card */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 space-y-4 shadow-sm md:col-span-2">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> LIFE CALENDAR PARAMETERS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lifespan & Date of Birth */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">EXPECTED LIFESPAN (YEARS)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={fullState.lifeCalendarSettings?.expectedLifespanYears || 60}
                    onChange={(e) => {
                      onUpdateLifeCalendarSettings({ expectedLifespanYears: parseInt(e.target.value) });
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono font-bold text-cyan-400 w-16 text-right">{(fullState.lifeCalendarSettings?.expectedLifespanYears || 60)} YRS</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">PRACTITIONER DATE OF BIRTH</label>
                <input
                  type="date"
                  value={fullState.lifeCalendarSettings?.birthDate || '2007-04-17'}
                  onChange={(e) => {
                    onUpdateLifeCalendarSettings({ birthDate: e.target.value });
                  }}
                  className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                />
              </div>
            </div>

            {/* Colors, Display Toggles & Chronicle Export */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">CALENDAR COLOR THEME</label>
                <div className="flex gap-2">
                  {(['cyan', 'emerald', 'amber', 'blue', 'rose'] as const).map((color) => {
                    const isSelected = (fullState.lifeCalendarSettings?.themeColor || 'cyan') === color;
                    const colorMap = {
                      cyan: 'bg-cyan-500 border-cyan-400',
                      emerald: 'bg-emerald-500 border-emerald-400',
                      amber: 'bg-amber-500 border-amber-400',
                      blue: 'bg-blue-500 border-blue-400',
                      rose: 'bg-rose-500 border-rose-400'
                    };
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          onUpdateLifeCalendarSettings({ themeColor: color });
                        }}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                          isSelected ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        } ${colorMap[color]}`}
                        title={color.toUpperCase()}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={fullState.lifeCalendarSettings?.showStats !== false}
                    onChange={(e) => {
                      onUpdateLifeCalendarSettings({ showStats: e.target.checked });
                    }}
                    className="rounded border-cyan-500/20 text-cyan-500 focus:ring-0 bg-[#101726]"
                  />
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">SHOW STATISTICS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={fullState.lifeCalendarSettings?.showMotivations !== false}
                    onChange={(e) => {
                      onUpdateLifeCalendarSettings({ showMotivations: e.target.checked });
                    }}
                    className="rounded border-cyan-500/20 text-cyan-500 focus:ring-0 bg-[#101726]"
                  />
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">SHOW DIRECTIVES</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExportLifeHistory}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-[#101726] hover:bg-[#101726]/80 border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-200 rounded-xl cursor-pointer transition-colors text-xs font-mono font-bold uppercase tracking-wider"
                >
                  <FileDown className="w-4 h-4 text-cyan-400" />
                  <span>Download Life Chronicle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Android PWA Installation */}
        <PWAInstallButton variant="settings" soundEnabled={soundEnabled} />

        {/* Hard Reset System Progress */}
        <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-red-400" /> TELEMETRY PURGE ZONE
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed font-sans font-normal">
            Permanently clear all task counts, unboxing statistics, level progressions, and customized titles. This reset is instant and completely irreversible.
          </p>

          {resetConfirm ? (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-red-400 font-mono font-bold uppercase animate-pulse">Confirm delete of all metrics?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setResetConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                >
                  Yes, Erase Environment
                </button>
                <button
                  onClick={() => {
                    setResetConfirm(false);
                    playSound('click', soundEnabled);
                  }}
                  className="px-4 py-2 bg-[#101726] border border-cyan-500/10 hover:border-cyan-500/20 text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setResetConfirm(true);
                playSound('failure', soundEnabled);
              }}
              className="w-full py-2.5 bg-red-950/10 border border-red-900/30 hover:border-red-500 hover:bg-red-950/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
            >
              Reset Entire Workspace
            </button>
          )}
        </div>
      </div>

      {/* Hidden Native File Input for Gallery Photo Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {/* Circular Image Crop Modal */}
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
