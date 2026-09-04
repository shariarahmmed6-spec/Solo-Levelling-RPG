import React, { useState } from 'react';
import { FitnessLog, LearningLog, BusinessLog, FaithLog, Character } from '../types';
import { playSound } from '../utils/sound';
import {
  Activity,
  BookOpen,
  TrendingUp,
  Compass,
  Plus,
  Dumbbell,
  Clock,
  Coins,
  MapPin,
  Calendar,
  Layers,
  Upload,
  CheckCircle,
  Trash2
} from 'lucide-react';

interface TrackersProps {
  onLogFitness: (log: Omit<FitnessLog, 'date'>) => void;
  onLogLearning: (log: Omit<LearningLog, 'id' | 'date'>) => void;
  onLogBusiness: (log: Omit<BusinessLog, 'id' | 'date'>) => void;
  onLogFaith: (log: Omit<FaithLog, 'date'>) => void;
  fitnessLogs: FitnessLog[];
  learningLogs: LearningLog[];
  businessLogs: BusinessLog[];
  faithLogs: FaithLog[];
  character: Character;
  soundEnabled: boolean;
}

const ISLAMIC_REMINDERS = [
  "Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.",
  "Indeed, with hardship comes ease. (Quran 94:6)",
  "The most beloved deeds to Allah are those that are most consistent, even if they are small.",
  "He who treads a path in search of knowledge, Allah will direct him to a path of Paradise.",
  "Verily, in the remembrance of Allah do hearts find rest. (Quran 13:28)"
];

export default function Trackers({
  onLogFitness,
  onLogLearning,
  onLogBusiness,
  onLogFaith,
  fitnessLogs,
  learningLogs,
  businessLogs,
  faithLogs,
  character,
  soundEnabled
}: TrackersProps) {
  const [activeTab, setActiveTab] = useState<'fitness' | 'learning' | 'business' | 'faith'>('fitness');

  // Fitness State
  const [pushups, setPushups] = useState(0);
  const [pullups, setPullups] = useState(0);
  const [squats, setSquats] = useState(0);
  const [runKm, setRunKm] = useState(0);
  const [runMins, setRunMins] = useState(0);
  const [weight, setWeight] = useState(70);
  const [bodyFat, setBodyFat] = useState(15);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Learning State
  const [learnType, setLearnType] = useState<'book' | 'course' | 'video' | 'other'>('book');
  const [learnTitle, setLearnTitle] = useState('');
  const [learnMins, setLearnMins] = useState(30);
  const [learnNotes, setLearnNotes] = useState('');

  // Business State
  const [bizHours, setBizHours] = useState(1);
  const [bizIncome, setBizIncome] = useState(0);
  const [bizProject, setBizProject] = useState('');
  const [bizTasks, setBizTasks] = useState(0);

  // Faith State
  const [prayers, setPrayers] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  });
  const [quranPages, setQuranPages] = useState(0);
  const [dhikrCount, setDhikrCount] = useState(0);
  const [activeDhikrWord, setActiveDhikrWord] = useState('SubhanAllah');

  // Tactile Dhikr Tapping Counter
  const handleDhikrTap = () => {
    setDhikrCount(prev => prev + 1);
    playSound('click', soundEnabled);
  };

  // Log fitness
  const handleFitnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogFitness({
      pushups,
      pullups,
      squats,
      runKm,
      runMinutes: runMins,
      calories: Math.round((runKm * 60) + (pushups + pullups + squats) * 0.4),
      weight,
      bodyFat,
      notes: 'Logged via Fitness Dashboard.',
      photoUrl: photoUrl || undefined
    });
    // reset
    setPushups(0);
    setPullups(0);
    setSquats(0);
    setRunKm(0);
    setRunMins(0);
    playSound('achievement', soundEnabled);
  };

  // Log learning
  const handleLearningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnTitle.trim()) return;
    onLogLearning({
      type: learnType,
      title: learnTitle.trim(),
      durationMinutes: learnMins,
      progressPercent: 100,
      notes: learnNotes.trim()
    });
    setLearnTitle('');
    setLearnNotes('');
    playSound('achievement', soundEnabled);
  };

  // Log Business
  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizProject.trim()) return;
    onLogBusiness({
      deepWorkHours: bizHours,
      income: bizIncome,
      clientsCount: bizIncome > 0 ? 1 : 0,
      revenue: bizIncome,
      projectName: bizProject.trim(),
      completedTasksCount: bizTasks
    });
    setBizProject('');
    setBizIncome(0);
    setBizTasks(0);
    playSound('achievement', soundEnabled);
  };

  // Log Faith
  const handleFaithSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogFaith({
      prayers,
      quranPages,
      dhikrCount,
      lastDhikrPhrase: activeDhikrWord
    });
    setQuranPages(0);
    setDhikrCount(0);
    playSound('achievement', soundEnabled);
  };

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      playSound('click', soundEnabled);
    } else {
      setPhotoUrl('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Select bar */}
      <div className="flex border-b border-cyan-500/10 font-mono text-xs overflow-x-auto gap-2 uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab('fitness'); playSound('click', soundEnabled); }}
          className={`flex items-center gap-1.5 px-4 py-3 cursor-pointer border-b-2 font-bold shrink-0 transition-all ${
            activeTab === 'fitness'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Physical Fitness
        </button>
        <button
          onClick={() => { setActiveTab('learning'); playSound('click', soundEnabled); }}
          className={`flex items-center gap-1.5 px-4 py-3 cursor-pointer border-b-2 font-bold shrink-0 transition-all ${
            activeTab === 'learning'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Study & Learning
        </button>
        <button
          onClick={() => { setActiveTab('business'); playSound('click', soundEnabled); }}
          className={`flex items-center gap-1.5 px-4 py-3 cursor-pointer border-b-2 font-bold shrink-0 transition-all ${
            activeTab === 'business'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Business & Income
        </button>
        <button
          onClick={() => { setActiveTab('faith'); playSound('click', soundEnabled); }}
          className={`flex items-center gap-1.5 px-4 py-3 cursor-pointer border-b-2 font-bold shrink-0 transition-all ${
            activeTab === 'faith'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Compass className="w-4 h-4" /> Faith & Devotions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tab Form */}
        <div className="lg:col-span-2 bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-6 shadow-sm h-fit">
          {activeTab === 'fitness' && (
            <form onSubmit={handleFitnessSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/5 pb-3">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Log Daily Fitness Metrics</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Pushups Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={pushups}
                    onChange={(e) => setPushups(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Pullups Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={pullups}
                    onChange={(e) => setPullups(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Squats Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={squats}
                    onChange={(e) => setSquats(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Running distance (KM)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={runKm}
                    onChange={(e) => setRunKm(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Running Duration (Mins)</label>
                  <input
                    type="number"
                    min="0"
                    value={runMins}
                    onChange={(e) => setRunMins(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Current Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
              </div>

              {/* simulated photo uploader */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase block font-bold tracking-wider">Physical progress snapshot</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/20 hover:border-cyan-500/35 p-4 rounded-xl cursor-pointer bg-[#101726] hover:bg-[#101726]/80 transition-colors shrink-0 w-28 h-20 text-zinc-500">
                    <Upload className="w-4 h-4 mb-1 text-cyan-400" />
                    <span className="text-[9px] font-mono font-bold uppercase text-center text-zinc-300">Upload file</span>
                    <input type="file" accept="image/*" onChange={handleSimulatedPhotoUpload} className="hidden" />
                  </label>
                  
                  {photoUrl ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-cyan-500/10">
                      <img src={photoUrl} alt="progress" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black rounded-full text-zinc-400 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-600">No snapshot linked. Optional visual progress backup.</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                Log Fitness Activities
              </button>
            </form>
          )}

          {activeTab === 'learning' && (
            <form onSubmit={handleLearningSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/5 pb-3">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Log Study & Learning Activities</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Knowledge Type</label>
                  <select
                    value={learnType}
                    onChange={(e) => setLearnType(e.target.value as any)}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-cyan-500/30"
                  >
                    <option value="book">Book Reading</option>
                    <option value="course">Video Course</option>
                    <option value="video">Tutorial Video</option>
                    <option value="other">General Study</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Subject Title / Material Name</label>
                  <input
                    type="text"
                    required
                    value={learnTitle}
                    onChange={(e) => setLearnTitle(e.target.value)}
                    placeholder="e.g., Clean Code by Robert Martin"
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={learnMins}
                    onChange={(e) => setLearnMins(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Key Study Notes & Takeaways</label>
                  <input
                    type="text"
                    value={learnNotes}
                    onChange={(e) => setLearnNotes(e.target.value)}
                    placeholder="e.g., Practiced solid principles, completed revision targets."
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                Log Learning Activities
              </button>
            </form>
          )}

          {activeTab === 'business' && (
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/5 pb-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Log Business & Income Milestones</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Project Name</label>
                  <input
                    type="text"
                    required
                    value={bizProject}
                    onChange={(e) => setBizProject(e.target.value)}
                    placeholder="e.g., Client Freelance SaaS App"
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Deep Work Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={bizHours}
                      onChange={(e) => setBizHours(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Tasks Completed</label>
                    <input
                      type="number"
                      min="0"
                      value={bizTasks}
                      onChange={(e) => setBizTasks(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Revenue Valuation Generated (Coins equivalent)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 font-bold">COINS</span>
                  <input
                    type="number"
                    min="0"
                    value={bizIncome}
                    onChange={(e) => setBizIncome(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 pl-16 pr-4 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                Log Business Activities
              </button>
            </form>
          )}

          {activeTab === 'faith' && (
            <form onSubmit={handleFaithSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/5 pb-3">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-zinc-100 font-mono text-xs uppercase tracking-wider">Faith & Spiritual Log</h3>
              </div>

              {/* 5 Prayers Checklist */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">DAILY OBLIGATORY PRAYERS LOG</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prKey) => {
                    const checked = prayers[prKey];
                    return (
                      <button
                        key={prKey}
                        type="button"
                        onClick={() => {
                          setPrayers(prev => ({ ...prev, [prKey]: !prev[prKey] }));
                          playSound('click', soundEnabled);
                        }}
                        className={`py-3 px-2 border rounded-xl font-mono text-xs text-center cursor-pointer transition-all ${
                          checked
                            ? 'bg-cyan-950/20 border-cyan-500 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,242,254,0.05)]'
                            : 'bg-[#101726] border-cyan-500/5 text-zinc-500'
                        }`}
                      >
                        {prKey.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quran & Dhikr parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Quran pages read</label>
                  <input
                    type="number"
                    min="0"
                    value={quranPages}
                    onChange={(e) => setQuranPages(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500/30 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Dhikr Phrase</label>
                  <select
                    value={activeDhikrWord}
                    onChange={(e) => setActiveDhikrWord(e.target.value)}
                    className="w-full bg-[#101726] border border-cyan-500/10 px-3 py-2 rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-cyan-500/30"
                  >
                    <option value="SubhanAllah">SubhanAllah (Glory be to Allah)</option>
                    <option value="Alhamdulillah">Alhamdulillah (Praise be to Allah)</option>
                    <option value="Allahu Akbar">Allahu Akbar (Allah is Greatest)</option>
                    <option value="Astaghfirullah">Astaghfirullah (I seek forgiveness)</option>
                  </select>
                </div>
              </div>

              {/* Tasbih Counter */}
              <div className="bg-[#101726] border border-cyan-500/10 p-5 rounded-xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">TASBIH DIGITAL COUNTER</span>
                
                <button
                  type="button"
                  onClick={handleDhikrTap}
                  className="w-20 h-20 rounded-full bg-[#111B2D] border-2 border-cyan-500/20 hover:border-cyan-500 text-cyan-400 font-mono text-xl font-bold flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.05)] active:scale-95 transition-all"
                >
                  {dhikrCount}
                </button>

                <p className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">{activeDhikrWord}</p>
                <span className="text-[9px] font-mono text-zinc-500">Tap circular button to increment Dhikr beads.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                Log Faith Activities
              </button>
            </form>
          )}
        </div>

        {/* History / Reminders widget */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">CHRONOLOGICAL HISTORY</h3>

          {activeTab === 'faith' ? (
            <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 space-y-4">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block border-b border-cyan-500/10 pb-2">Daily Wisdom & Reminders</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans italic">
                "{ISLAMIC_REMINDERS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % ISLAMIC_REMINDERS.length]}"
              </p>
            </div>
          ) : (
            <div className="bg-[#111B2D] border border-cyan-500/10 rounded-[14px] p-5 space-y-4 max-h-[350px] overflow-y-auto">
              {activeTab === 'fitness' && (
                <div className="space-y-3">
                  {fitnessLogs.length === 0 ? (
                    <span className="text-xs text-zinc-500 font-mono">No fitness sessions recorded in history.</span>
                  ) : (
                    fitnessLogs.map((log, idx) => (
                      <div key={idx} className="bg-[#101726]/60 p-3 rounded-xl border border-cyan-500/5 text-xs font-mono">
                        <div className="flex justify-between text-zinc-500 border-b border-cyan-500/5 pb-1.5 mb-1.5 font-bold">
                          <span>{log.date}</span>
                          <span className="text-cyan-400 font-bold">-{log.calories} CAL</span>
                        </div>
                        <ul className="space-y-1 text-zinc-300">
                          {log.pushups > 0 && <li>✦ Pushups: {log.pushups} reps</li>}
                          {log.pullups > 0 && <li>✦ Pullups: {log.pullups} reps</li>}
                          {log.squats > 0 && <li>✦ Squats: {log.squats} reps</li>}
                          {log.runKm > 0 && <li>✦ Run: {log.runKm} km ({log.runMinutes}m)</li>}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-3">
                  {learningLogs.length === 0 ? (
                    <span className="text-xs text-zinc-500 font-mono">No study logs completed yet.</span>
                  ) : (
                    learningLogs.map((log, idx) => (
                      <div key={idx} className="bg-[#101726]/60 p-3 rounded-xl border border-cyan-500/5 text-xs">
                        <div className="flex justify-between text-zinc-500 border-b border-cyan-500/5 pb-1.5 mb-1.5 font-mono text-[9px] font-bold">
                          <span>{log.date}</span>
                          <span className="text-cyan-400 uppercase font-bold">{log.type}</span>
                        </div>
                        <h4 className="font-bold text-zinc-200 text-xs mb-1 truncate font-sans uppercase tracking-wider">{log.title}</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed italic font-sans">"{log.notes}"</p>
                        <span className="text-[10px] font-mono text-zinc-500 mt-2 block uppercase">Duration: {log.durationMinutes} minutes</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-3">
                  {businessLogs.length === 0 ? (
                    <span className="text-xs text-zinc-500 font-mono">No revenue or tasks recorded.</span>
                  ) : (
                    businessLogs.map((log, idx) => (
                      <div key={idx} className="bg-[#101726]/60 p-3 rounded-xl border border-cyan-500/5 text-xs font-mono">
                        <div className="flex justify-between text-zinc-500 border-b border-cyan-500/5 pb-1.5 mb-1.5 font-bold">
                          <span>{log.date}</span>
                          <span className="text-amber-500">+{log.income} Coins</span>
                        </div>
                        <h4 className="font-bold text-zinc-300 mb-1 truncate uppercase tracking-wider">{log.projectName}</h4>
                        <ul className="space-y-1 text-zinc-400 text-[11px]">
                          <li>✦ Deep work: {log.deepWorkHours} hours</li>
                          <li>✦ Tasks: {log.completedTasksCount} items</li>
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
