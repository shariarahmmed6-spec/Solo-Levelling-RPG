import React, { useState, useMemo } from 'react';
import {
  LegacyTreeData,
  LegacyMilestone,
  LegacyRelic,
  TreeStage,
  SeasonMode
} from '../../types';
import {
  BRANCH_CATEGORIES,
  getCurrentSeason
} from '../../data/legacyTreeData';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Calendar,
  Layers,
  Play,
  Gem,
  Coins,
  Shield,
  Sun,
  Flame,
  BookOpen,
  Palette,
  HeartPulse,
  Info
} from 'lucide-react';

interface LegacyTreeCanvasProps {
  treeData: LegacyTreeData;
  activeCalendarDays: string[]; // dates operator checked in / earned XP
  selectedRelic: LegacyRelic | null;
  onSelectRelic: (relic: LegacyRelic) => void;
  onSelectMilestone?: (milestone: LegacyMilestone) => void;
  soundEnabled: boolean;
  onTriggerGrowthAnimation?: () => void;
  animatingBranchCategory?: string | null;
}

type ViewMode = 'full' | 'canopy' | 'roots';

export const LegacyTreeCanvas: React.FC<LegacyTreeCanvasProps> = ({
  treeData,
  activeCalendarDays,
  onSelectRelic,
  onTriggerGrowthAnimation,
  animatingBranchCategory
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [hoveredNode, setHoveredNode] = useState<{ date: string; index: number; x: number; y: number } | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  // Determine current season
  const activeSeason = useMemo(() => {
    if (!treeData.seasonalEnabled) return 'summer';
    if (treeData.seasonMode === 'auto') return getCurrentSeason();
    return treeData.seasonMode;
  }, [treeData.seasonalEnabled, treeData.seasonMode]);

  // Stage details
  const stage = treeData.stage;
  const isSeed = stage === 'seed';
  const isSprout = stage === 'sprout';
  const isEternal = stage === 'eternal_tree' || treeData.isEternalAwakened;

  // Count milestones unlocked per category (0 to 4)
  const categoryProgress = useMemo(() => {
    const counts: Record<string, number> = {
      education: 0,
      fitness: 0,
      faith: 0,
      career: 0,
      creativity: 0,
      health: 0,
      discipline: 0
    };
    treeData.milestones.forEach(m => {
      if (m.unlocked) {
        counts[m.category] = (counts[m.category] || 0) + 1;
      }
    });
    return counts;
  }, [treeData.milestones]);

  // Season colors
  const seasonTheme = useMemo(() => {
    switch (activeSeason) {
      case 'spring':
        return {
          leafColor1: '#86EFAC',
          leafColor2: '#34D399',
          bloomColor: '#F472B6',
          label: 'Spring • Awakening & Renewal'
        };
      case 'summer':
        return {
          leafColor1: '#22C55E',
          leafColor2: '#10B981',
          bloomColor: '#38BDF8',
          label: 'Summer • Radiant Full Canopy'
        };
      case 'autumn':
        return {
          leafColor1: '#F59E0B',
          leafColor2: '#D97706',
          bloomColor: '#EF4444',
          label: 'Autumn • Golden Harvest'
        };
      case 'winter':
        return {
          leafColor1: '#94A3B8',
          leafColor2: '#38BDF8',
          bloomColor: '#E0F2FE',
          label: 'Winter • Crystalline Core'
        };
    }
  }, [activeSeason]);

  // Subterranean root coordinates derived deterministically from active calendar days
  const rootNodes = useMemo(() => {
    const days = [...activeCalendarDays].sort();
    const count = Math.max(days.length, 1);
    const nodes: { date: string; x: number; y: number; depthMeters: number; tier: number }[] = [];

    // Root coordinate generator spanning y=670 to y=1050, x=150 to x=850
    days.forEach((day, i) => {
      // Stratified spreading
      const progress = (i + 1) / count;
      const angle = (Math.sin(i * 1.35) * 0.85); // -0.85 to +0.85 radians
      const depthY = 670 + progress * 340 + (Math.cos(i * 2.1) * 20);
      const spreadX = 500 + angle * (180 + progress * 240) + (Math.sin(i * 3.7) * 45);

      const depthMeters = Math.round(1 + progress * 120);
      const tier = depthMeters < 15 ? 1 : depthMeters < 50 ? 2 : depthMeters < 90 ? 3 : 4;

      nodes.push({
        date: day,
        x: Math.max(120, Math.min(880, spreadX)),
        y: Math.max(665, Math.min(1060, depthY)),
        depthMeters,
        tier
      });
    });

    return nodes;
  }, [activeCalendarDays]);

  // ViewBox dynamic shifting based on viewMode
  const viewBox = useMemo(() => {
    if (viewMode === 'canopy') return '100 80 800 600';
    if (viewMode === 'roots') return '100 580 800 520';
    return '0 0 1000 1100';
  }, [viewMode]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#090E1A] via-[#0C1220] to-[#070B14] border border-cyan-500/15 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#101726]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 text-[11px] font-mono shadow-lg">
          <div className={`w-2 h-2 rounded-full ${isEternal ? 'bg-purple-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-zinc-300 font-semibold tracking-wide uppercase">
            {stage.replace('_', ' ')}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400">{seasonTheme.label}</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#101726]/90 backdrop-blur-md p-1 rounded-xl border border-cyan-500/20 shadow-lg">
          <button
            onClick={() => setViewMode('canopy')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              viewMode === 'canopy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CANOPY
          </button>
          <button
            onClick={() => setViewMode('roots')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              viewMode === 'roots'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ROOTS
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              viewMode === 'full'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            PANORAMIC
          </button>

          {onTriggerGrowthAnimation && (
            <button
              onClick={onTriggerGrowthAnimation}
              title="Watch growth energy pulse"
              className="ml-1 p-1 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Play className="w-2.5 h-2.5 fill-cyan-400" />
              <span>SURGE</span>
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={viewBox}
        className="w-full h-auto max-h-[750px] transition-all duration-700 select-none"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.03))' }}
      >
        <defs>
          {/* Trunk & Bark Gradients */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#131B2A" />
            <stop offset="35%" stopColor="#25354D" />
            <stop offset="65%" stopColor="#1E2A3E" />
            <stop offset="100%" stopColor="#0F1622" />
          </linearGradient>

          <linearGradient id="trunkEnergy" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.9" />
          </linearGradient>

          {/* Subterranean Soil Gradient */}
          <linearGradient id="soilLayers" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A2232" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#131A26" />
            <stop offset="60%" stopColor="#0D111A" />
            <stop offset="100%" stopColor="#06090F" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="strongGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="celestialBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Sky Particles */}
        <g opacity="0.6">
          <circle cx="200" cy="180" r="1.5" fill="#38BDF8" className="animate-pulse" />
          <circle cx="340" cy="120" r="2" fill="#FDE047" opacity="0.8" />
          <circle cx="750" cy="150" r="1.5" fill="#C084FC" className="animate-pulse" />
          <circle cx="820" cy="280" r="2" fill="#34D399" opacity="0.6" />
          <circle cx="630" cy="90" r="2.5" fill="#FBBF24" opacity="0.7" />
          <circle cx="150" cy="360" r="1.5" fill="#00F2FE" />
          <circle cx="870" cy="420" r="2" fill="#F472B6" opacity="0.5" />
        </g>

        {/* ========================================================================= */}
        {/* SUBTERRANEAN SECTION (y >= 650) — ROOTS & LIFE CALENDAR CONSISTENCY METAPHOR */}
        {/* ========================================================================= */}
        <g id="subterranean-world">
          {/* Subterranean Soil Bed */}
          <path
            d="M 0 650 Q 250 635, 500 645 T 1000 650 L 1000 1100 L 0 1100 Z"
            fill="url(#soilLayers)"
          />

          {/* Geological Strata Dividing Lines */}
          <path
            d="M 0 740 Q 500 730, 1000 745"
            stroke="#202C3F"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            fill="none"
            opacity="0.5"
          />
          <text x="30" y="735" fill="#64748B" fontSize="9" fontFamily="monospace" letterSpacing="1">
            STRATA I: FERTILIZED TOPSOIL (DAYS 1-14)
          </text>

          <path
            d="M 0 850 Q 480 860, 1000 845"
            stroke="#1B2433"
            strokeWidth="1.5"
            strokeDasharray="8 10"
            fill="none"
            opacity="0.5"
          />
          <text x="30" y="845" fill="#475569" fontSize="9" fontFamily="monospace" letterSpacing="1">
            STRATA II: COMPRESSED IRON ROCK (DAYS 15-45)
          </text>

          <path
            d="M 0 960 Q 520 950, 1000 965"
            stroke="#151C28"
            strokeWidth="1.5"
            strokeDasharray="10 12"
            fill="none"
            opacity="0.5"
          />
          <text x="30" y="955" fill="#334155" fontSize="9" fontFamily="monospace" letterSpacing="1">
            STRATA III: CRYSTAL BEDROCK OF SOVEREIGNTY (DAYS 46+)
          </text>

          {/* Root Network (Underground Mycelium) */}
          <g id="root-network">
            {/* Primary Taproots radiating from bottom of trunk (500, 650) */}
            <path
              d="M 480 650 Q 460 720, 390 790 T 260 920 T 180 1020"
              stroke="#38BDF8"
              strokeWidth={Math.max(2, categoryProgress.discipline * 1.5)}
              strokeOpacity="0.45"
              fill="none"
            />
            <path
              d="M 520 650 Q 540 730, 610 810 T 740 930 T 820 1030"
              stroke="#38BDF8"
              strokeWidth={Math.max(2, categoryProgress.discipline * 1.5)}
              strokeOpacity="0.45"
              fill="none"
            />
            <path
              d="M 500 650 Q 505 760, 495 870 T 500 1060"
              stroke="#00F2FE"
              strokeWidth={Math.max(3, categoryProgress.discipline * 2)}
              strokeOpacity="0.65"
              fill="none"
              filter="url(#glow)"
            />
            <path
              d="M 490 690 Q 420 740, 330 790 T 200 860"
              stroke="#10B981"
              strokeWidth="1.8"
              strokeOpacity="0.35"
              fill="none"
            />
            <path
              d="M 510 710 Q 590 760, 670 820 T 800 880"
              stroke="#10B981"
              strokeWidth="1.8"
              strokeOpacity="0.35"
              fill="none"
            />

            {/* Subterranean Calendar Nodes */}
            {rootNodes.map((node, idx) => {
              const isHovered = hoveredNode?.date === node.date;
              return (
                <g
                  key={node.date + idx}
                  className="cursor-pointer transition-transform duration-300 hover:scale-125"
                  onMouseEnter={() => setHoveredNode({ date: node.date, index: idx, x: node.x, y: node.y })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 6 : 3.5}
                    fill={node.tier === 4 ? '#A855F7' : node.tier === 3 ? '#38BDF8' : '#34D399'}
                    opacity={isHovered ? 1 : 0.85}
                    filter={isHovered ? 'url(#glow)' : undefined}
                  />
                  {/* Subtle radiating pulse for latest active day */}
                  {idx === rootNodes.length - 1 && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="9"
                      fill="none"
                      stroke="#00F2FE"
                      strokeWidth="1"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Root Metaphor Badge */}
          <g transform="translate(500, 1075)">
            <rect
              x="-180"
              y="-14"
              width="360"
              height="26"
              rx="13"
              fill="#0E1624"
              stroke="#38BDF8"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
            <text
              textAnchor="middle"
              y="4"
              fill="#94A3B8"
              fontSize="10"
              fontFamily="monospace"
              letterSpacing="1"
            >
              UNDERGROUND NETWORK: {rootNodes.length} DAYS CONSISTENT
            </text>
          </g>
        </g>

        {/* Horizon / Soil Surface Mound */}
        <g id="ground-surface">
          <path
            d="M 0 650 Q 250 635, 500 645 T 1000 650 L 1000 656 L 0 656 Z"
            fill="#27364D"
          />
          {/* Surface Moss & Energy Rim */}
          <path
            d="M 120 648 Q 300 638, 500 644 T 880 648"
            stroke="#10B981"
            strokeWidth="3"
            strokeOpacity="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 380 644 Q 500 640, 620 644"
            stroke="#00F2FE"
            strokeWidth="2"
            strokeOpacity="0.8"
            fill="none"
            filter="url(#glow)"
          />
        </g>

        {/* ========================================================================= */}
        {/* CANOPY & TRUNK (y <= 650) — LIVING TREE EVOLUTION & VISIBLE BRANCHES */}
        {/* ========================================================================= */}
        {isSeed ? (
          /* STAGE 1: THE SEED RESTING IN FERTILE DARK SOIL */
          <g id="seed-stage" transform="translate(500, 638)">
            {/* Glowing Sacred Halo */}
            <circle cx="0" cy="-6" r="38" fill="none" stroke="#00F2FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" className="animate-spin" />
            <circle cx="0" cy="-6" r="24" fill="#00F2FE" fillOpacity="0.08" filter="url(#glow)" />
            <circle cx="0" cy="-6" r="14" fill="#38BDF8" fillOpacity="0.15" />

            {/* The Seed */}
            <ellipse
              cx="0"
              cy="-6"
              rx="9"
              ry="13"
              fill="url(#trunkEnergy)"
              stroke="#FDE047"
              strokeWidth="1.5"
              filter="url(#glow)"
              className="animate-pulse"
            />
            {/* Tiny First Golden Spore */}
            <circle cx="0" cy="-18" r="2.5" fill="#FDE047" />

            {/* Emotional Typography */}
            <text
              textAnchor="middle"
              y="-55"
              fill="#F8FAFC"
              fontSize="16"
              fontWeight="bold"
              letterSpacing="2"
              fontFamily="sans-serif"
            >
              THE SEED OF AWAKENING
            </text>
            <text
              textAnchor="middle"
              y="-36"
              fill="#38BDF8"
              fontSize="11"
              fontFamily="monospace"
              letterSpacing="1"
            >
              "Every legacy begins with a single choice."
            </text>
          </g>
        ) : isSprout ? (
          /* STAGE 2: SMALL SPROUT (Tender dual leaves pushing through earth) */
          <g id="sprout-stage" transform="translate(500, 642)">
            {/* Stem */}
            <path
              d="M 0 0 Q -2 -35, 0 -65"
              stroke="url(#trunkEnergy)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            {/* Left Leaf */}
            <path
              d="M 0 -60 Q -30 -75, -25 -50 Q -10 -45, 0 -58"
              fill="#34D399"
              stroke="#86EFAC"
              strokeWidth="1.2"
              filter="url(#glow)"
            />
            {/* Right Leaf */}
            <path
              d="M 0 -64 Q 30 -80, 25 -54 Q 10 -48, 0 -62"
              fill="#00F2FE"
              stroke="#67E8F9"
              strokeWidth="1.2"
              filter="url(#glow)"
            />
            {/* Crown Spore */}
            <circle cx="0" cy="-68" r="3" fill="#FDE047" filter="url(#glow)" />
          </g>
        ) : (
          /* STAGES 3–7: LIVING EXPANDING TREE WITH 6 BRANCH CATEGORIES */
          <g id="living-tree-body">
            {/* Central Majestic Trunk */}
            <g id="trunk">
              {/* Trunk Silhouette */}
              <path
                d="M 430 648
                   C 460 550, 450 450, 465 380
                   C 475 320, 480 270, 500 220
                   C 520 270, 525 320, 535 380
                   C 550 450, 540 550, 570 648
                   Z"
                fill="url(#trunkGrad)"
                stroke="#2C3D57"
                strokeWidth="1.5"
              />

              {/* Glowing Internal Vein of Life Energy */}
              <path
                d="M 500 645
                   C 485 530, 515 420, 495 340
                   C 485 290, 505 250, 500 220"
                stroke="url(#trunkEnergy)"
                strokeWidth={isEternal ? 6 : 3.5}
                strokeLinecap="round"
                fill="none"
                filter={isEternal ? 'url(#celestialBloom)' : 'url(#glow)'}
                opacity="0.85"
                className="animate-pulse"
              />
            </g>

            {/* ======================================================== */}
            {/* 1. KNOWLEDGE BRANCH (Education - Cyan) — Left High */}
            {/* ======================================================== */}
            {categoryProgress.education > 0 && (
              <g
                id="branch-education"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('education')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                {/* Branch Stem */}
                <path
                  d="M 475 350
                     C 410 330, 340 300, 270 240
                     C 230 200, 200 170, 160 150"
                  stroke="#00F2FE"
                  strokeWidth={categoryProgress.education * 2.2}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                  opacity={animatingBranchCategory === 'education' ? 1 : 0.85}
                />
                {/* Sub-twigs */}
                {categoryProgress.education >= 2 && (
                  <path
                    d="M 330 295 C 290 260, 260 220, 230 200"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {categoryProgress.education >= 3 && (
                  <path
                    d="M 230 210 C 200 190, 180 150, 150 120"
                    stroke="#38BDF8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {/* Foliage Clusters */}
                <circle cx="270" cy="235" r={16 + categoryProgress.education * 3} fill="#00F2FE" fillOpacity="0.25" filter="url(#glow)" />
                <circle cx="210" cy="180" r={14 + categoryProgress.education * 3} fill="#38BDF8" fillOpacity="0.3" />
                <circle cx="155" cy="145" r={12 + categoryProgress.education * 3} fill={seasonTheme.leafColor1} fillOpacity="0.4" />
              </g>
            )}

            {/* ======================================================== */}
            {/* 2. STRENGTH BRANCH (Fitness - Crimson) — Right High */}
            {/* ======================================================== */}
            {categoryProgress.fitness > 0 && (
              <g
                id="branch-fitness"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('fitness')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                {/* Branch Stem */}
                <path
                  d="M 525 350
                     C 590 330, 660 300, 730 240
                     C 770 200, 800 170, 840 150"
                  stroke="#EF4444"
                  strokeWidth={categoryProgress.fitness * 2.2}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                  opacity={animatingBranchCategory === 'fitness' ? 1 : 0.85}
                />
                {/* Sub-twigs */}
                {categoryProgress.fitness >= 2 && (
                  <path
                    d="M 670 295 C 710 260, 740 220, 770 200"
                    stroke="#F87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {categoryProgress.fitness >= 3 && (
                  <path
                    d="M 770 210 C 800 190, 820 150, 850 120"
                    stroke="#F87171"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {/* Foliage Clusters */}
                <circle cx="730" cy="235" r={16 + categoryProgress.fitness * 3} fill="#EF4444" fillOpacity="0.25" filter="url(#glow)" />
                <circle cx="790" cy="180" r={14 + categoryProgress.fitness * 3} fill="#F87171" fillOpacity="0.3" />
                <circle cx="845" cy="145" r={12 + categoryProgress.fitness * 3} fill={seasonTheme.leafColor1} fillOpacity="0.4" />
              </g>
            )}

            {/* ======================================================== */}
            {/* 3. LIGHT BRANCH (Faith - Radiant Solar Gold) — Crown Apex */}
            {/* ======================================================== */}
            {categoryProgress.faith > 0 && (
              <g
                id="branch-faith"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('faith')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                {/* Crown Spire */}
                <path
                  d="M 500 220
                     C 490 170, 510 130, 500 70"
                  stroke="#FDE047"
                  strokeWidth={categoryProgress.faith * 2.4}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                />
                {/* Solar Flares / Tendrils */}
                {categoryProgress.faith >= 2 && (
                  <path
                    d="M 498 160 C 460 130, 440 90, 430 60"
                    stroke="#FEF08A"
                    strokeWidth="2"
                    fill="none"
                  />
                )}
                {categoryProgress.faith >= 3 && (
                  <path
                    d="M 502 160 C 540 130, 560 90, 570 60"
                    stroke="#FEF08A"
                    strokeWidth="2"
                    fill="none"
                  />
                )}
                {/* Celestial Halo */}
                <circle cx="500" cy="70" r={18 + categoryProgress.faith * 4} fill="#FDE047" fillOpacity="0.25" filter="url(#strongGlow)" />
                <circle cx="500" cy="70" r="8" fill="#FFFBEB" filter="url(#glow)" />
              </g>
            )}

            {/* ======================================================== */}
            {/* 4. PROSPERITY BRANCH (Career - Amber Gold) — Left Lower */}
            {/* ======================================================== */}
            {categoryProgress.career > 0 && (
              <g
                id="branch-career"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('career')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <path
                  d="M 460 450
                     C 380 440, 310 430, 240 400
                     C 190 380, 150 350, 110 320"
                  stroke="#F59E0B"
                  strokeWidth={categoryProgress.career * 2}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                />
                {categoryProgress.career >= 2 && (
                  <path d="M 290 425 C 240 430, 190 415, 140 400" stroke="#FBBF24" strokeWidth="2" fill="none" />
                )}
                {/* Golden Leaves */}
                <circle cx="230" cy="400" r={14 + categoryProgress.career * 2.5} fill="#F59E0B" fillOpacity="0.3" />
                <circle cx="120" cy="325" r={12 + categoryProgress.career * 2.5} fill="#FCD34D" fillOpacity="0.35" filter="url(#glow)" />
              </g>
            )}

            {/* ======================================================== */}
            {/* 5. INSPIRATION BRANCH (Creativity - Amethyst) — Right Lower */}
            {/* ======================================================== */}
            {categoryProgress.creativity > 0 && (
              <g
                id="branch-creativity"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('creativity')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <path
                  d="M 540 450
                     C 620 440, 690 430, 760 400
                     C 810 380, 850 350, 890 320"
                  stroke="#A855F7"
                  strokeWidth={categoryProgress.creativity * 2}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                />
                {categoryProgress.creativity >= 2 && (
                  <path d="M 710 425 C 760 430, 810 415, 860 400" stroke="#C084FC" strokeWidth="2" fill="none" />
                )}
                <circle cx="770" cy="400" r={14 + categoryProgress.creativity * 2.5} fill="#A855F7" fillOpacity="0.3" />
                <circle cx="880" cy="325" r={12 + categoryProgress.creativity * 2.5} fill="#E9D5FF" fillOpacity="0.35" filter="url(#glow)" />
              </g>
            )}

            {/* ======================================================== */}
            {/* 6. VITALITY BRANCH (Health - Emerald) — Mid Center / Heart */}
            {/* ======================================================== */}
            {categoryProgress.health > 0 && (
              <g
                id="branch-health"
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBranch('health')}
                onMouseLeave={() => setHoveredBranch(null)}
              >
                <path
                  d="M 485 410
                     C 430 400, 390 360, 350 330
                     C 310 300, 280 260, 250 220"
                  stroke="#10B981"
                  strokeWidth={categoryProgress.health * 1.8}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                />
                <circle cx="340" cy="325" r={12 + categoryProgress.health * 2.5} fill="#10B981" fillOpacity="0.35" />
                <circle cx="260" cy="230" r={10 + categoryProgress.health * 2.5} fill="#34D399" fillOpacity="0.4" />
              </g>
            )}

            {/* ======================================================== */}
            {/* HIDDEN LEGACY RELICS EMBEDDED ON BRANCHES */}
            {/* ======================================================== */}
            <g id="hidden-relics-on-tree">
              {treeData.relics.map(relic => {
                if (!relic.unlocked) return null;

                // Fixed branch anchors for each relic
                let rx = 500;
                let ry = 250;
                if (relic.id === 'crystal_fruit') {
                  rx = 180;
                  ry = 160;
                } else if (relic.id === 'golden_leaf') {
                  rx = 130;
                  ry = 340;
                } else if (relic.id === 'ancient_rune') {
                  rx = 500;
                  ry = 65;
                } else if (relic.id === 'shadow_seed') {
                  rx = 820;
                  ry = 160;
                } else if (relic.id === 'eternal_bloom') {
                  rx = 500;
                  ry = 635; // Root collar
                }

                return (
                  <g
                    key={relic.id}
                    transform={`translate(${rx}, ${ry})`}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => onSelectRelic(relic)}
                  >
                    <circle cx="0" cy="0" r="15" fill={relic.color} fillOpacity="0.25" filter="url(#glow)" className="animate-ping" />
                    <circle cx="0" cy="0" r="10" fill="#0E1624" stroke={relic.color} strokeWidth="2" filter="url(#glow)" />
                    <circle cx="0" cy="0" r="4.5" fill={relic.color} />
                  </g>
                );
              })}
            </g>
          </g>
        )}
      </svg>

      {/* Interactive Tooltip on Root Hover */}
      {hoveredNode && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#101726]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/30 shadow-2xl flex items-center gap-3 z-30 pointer-events-none animate-fadeIn">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <div className="text-[11px] font-mono">
            <div className="text-zinc-200 font-bold">Anchor Node: {hoveredNode.date}</div>
            <div className="text-cyan-400 text-[10px]">
              Subterranean Depth: ~{hoveredNode.depthMeters}m (Life Calendar Record #{hoveredNode.index + 1})
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tooltip on Branch Hover */}
      {hoveredBranch && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#101726]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/30 shadow-2xl z-30 pointer-events-none animate-fadeIn">
          <div className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
            {BRANCH_CATEGORIES[hoveredBranch as keyof typeof BRANCH_CATEGORIES]?.branchName}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">
            Tier {categoryProgress[hoveredBranch] || 0} / 4 • {BRANCH_CATEGORIES[hoveredBranch as keyof typeof BRANCH_CATEGORIES]?.description}
          </div>
        </div>
      )}
    </div>
  );
};
