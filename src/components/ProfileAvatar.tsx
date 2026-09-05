import React from 'react';
import { Character } from '../types';
import { getFrameById } from '../data/profileFramesData';
import { Sparkles, Shield, Crown, Camera } from 'lucide-react';

export const DEFAULT_ARISE_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=512&auto=format&fit=crop&q=80';

export interface ProfileAvatarProps {
  character?: Character | null;
  avatar?: string;
  equippedFrame?: string;
  level?: number;
  rank?: string;
  frameId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showRankBadge?: boolean;
  showLevelBadge?: boolean;
  className?: string;
  isScanning?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  character,
  avatar,
  equippedFrame,
  level,
  rank,
  frameId,
  size = 'md',
  showRankBadge = false,
  showLevelBadge = false,
  className = '',
  isScanning = false,
  isClickable = false,
  onClick
}) => {
  const activeFrameId = frameId || equippedFrame || character?.equippedFrame || 'frame_default';
  const frame = getFrameById(activeFrameId);

  // Effective character values with fallbacks
  const effectiveLevel = level !== undefined ? level : character?.level ?? 1;
  const effectiveRank = rank || character?.rank || 'Rank E';
  const effectiveAvatar = avatar || character?.avatar;

  // Size dimensions
  const dimensions = {
    xs: 'w-8 h-8 text-[10px]',
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-xl',
    '2xl': 'w-36 h-36 text-2xl'
  }[size];

  const badgeDimensions = {
    xs: 'text-[8px] px-1 py-0.2 -bottom-1',
    sm: 'text-[9px] px-1 py-0.5 -bottom-1',
    md: 'text-[10px] px-1.5 py-0.5 -bottom-2',
    lg: 'text-xs px-2 py-0.5 -bottom-2.5',
    xl: 'text-xs px-2.5 py-1 -bottom-3',
    '2xl': 'text-sm px-3 py-1 -bottom-3.5'
  }[size];

  const rankBadgeText = effectiveRank ? effectiveRank.replace('Rank ', '') : 'E';

  // Resolve avatar URL (custom data URL, web URL, or default ARISE portrait)
  const resolvedAvatarUrl = React.useMemo(() => {
    if (!effectiveAvatar) return DEFAULT_ARISE_AVATAR;
    if (
      effectiveAvatar.startsWith('data:image/') ||
      effectiveAvatar.startsWith('http://') ||
      effectiveAvatar.startsWith('https://') ||
      effectiveAvatar.startsWith('blob:')
    ) {
      return effectiveAvatar;
    }
    // For old placeholder class names (creator, sentry, etc.)
    return DEFAULT_ARISE_AVATAR;
  }, [effectiveAvatar]);

  const shouldShowBadge = showRankBadge || showLevelBadge;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        onClick || isClickable ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Outer Glow for Legendary / Mythic or Active Scanning */}
      {(frame.rarity === 'legendary' || frame.rarity === 'mythic' || isScanning) && (
        <div
          className={`absolute -inset-1 rounded-2xl transition-all duration-300 pointer-events-none ${
            isScanning
              ? 'opacity-100 blur-md bg-cyan-400/50 scale-105'
              : 'opacity-75 blur-sm animate-pulse'
          }`}
          style={{ background: isScanning ? 'rgba(0, 242, 254, 0.6)' : frame.glowColor }}
        />
      )}

      {/* Frame Container */}
      <div
        className={`relative overflow-hidden ${dimensions} ${frame.borderStyle} bg-[#090D18] flex items-center justify-center transition-all duration-300 rounded-xl ${
          isScanning ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_#00f2fe]' : ''
        } ${onClick || isClickable ? 'group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]' : ''}`}
        title={`${frame.name} (${frame.rarity.toUpperCase()})`}
      >
        <img
          src={resolvedAvatarUrl}
          alt={character?.name || 'Hunter Avatar'}
          className="w-full h-full object-cover rounded-lg select-none transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_ARISE_AVATAR;
          }}
        />

        {/* Tactical Corner Brackets Overlay for Epic+ */}
        {(frame.rarity === 'epic' || frame.rarity === 'legendary' || frame.rarity === 'mythic') && (
          <>
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t-2 border-l-2 border-white/70 pointer-events-none" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t-2 border-r-2 border-white/70 pointer-events-none" />
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b-2 border-l-2 border-white/70 pointer-events-none" />
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b-2 border-r-2 border-white/70 pointer-events-none" />
          </>
        )}

        {/* Animated scanline shimmer */}
        {frame.animated && !isScanning && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none animate-laser-sweep" />
        )}

        {/* Active HUD Scan Effect (Laser line sweeps top-to-bottom) */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {/* Moving Laser Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00f2fe,0_0_4px_#ffffff] animate-hud-scan" />
            {/* Holographic Blue Tint */}
            <div className="absolute inset-0 bg-cyan-500/15" />
          </div>
        )}

        {/* Quick Camera hover icon for clickable avatars */}
        {(isClickable || onClick) && !isScanning && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 z-10 pointer-events-none">
            <Camera className="w-3.5 h-3.5 text-cyan-300 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Rank or Level Badge at Bottom */}
      {shouldShowBadge && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${badgeDimensions} rounded-full font-mono font-bold tracking-wider uppercase border border-cyan-500/40 bg-[#090D18] text-cyan-400 shadow-lg flex items-center gap-1 z-10 whitespace-nowrap`}
        >
          {showLevelBadge ? (
            <>
              {effectiveLevel >= 100 ? (
                <Crown className="w-2.5 h-2.5 text-amber-400" />
              ) : effectiveLevel >= 50 ? (
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              ) : (
                <Shield className="w-2.5 h-2.5 text-cyan-500" />
              )}
              <span>LV.{effectiveLevel}</span>
            </>
          ) : (
            <>
              <span>{rankBadgeText}</span>
              <span className="text-zinc-500">•</span>
              <span>LV.{effectiveLevel}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
