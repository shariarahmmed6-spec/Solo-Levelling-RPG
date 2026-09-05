import React, { useState, useRef } from 'react';
import { Character } from '../../types';
import { ProfileAvatar, DEFAULT_ARISE_AVATAR } from '../ProfileAvatar';
import { ImageCropModal } from './ImageCropModal';
import { playSound } from '../../utils/sound';
import {
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  CheckCircle2,
  X,
  Shield,
  Sparkles,
  Cpu
} from 'lucide-react';

interface EditSystemIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onUpdateAvatar: (newAvatar: string) => void;
  soundEnabled?: boolean;
}

export const EditSystemIdentityModal: React.FC<EditSystemIdentityModalProps> = ({
  isOpen,
  onClose,
  character,
  onUpdateAvatar,
  soundEnabled = true
}) => {
  const [selectedRawImage, setSelectedRawImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !character) return null;

  const isCustomAvatar =
    character.avatar &&
    character.avatar !== DEFAULT_ARISE_AVATAR &&
    !['creator', 'sentry', 'mage', 'paladin', 'assassin', 'merchant'].includes(character.avatar);

  // Trigger Android / native file gallery picker
  const handleOpenPicker = () => {
    playSound('click', soundEnabled);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG, PNG, WebP)
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

    // Reset input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  // When crop completes, save photo and trigger HUD scan animation
  const handleCropComplete = (croppedDataUrl: string) => {
    setIsCropOpen(false);
    setSelectedRawImage(null);

    // Trigger HUD scan sequence (0.85s scan + confirmation)
    setIsScanning(true);
    setShowConfirmation(true);
    playSound('achievement', soundEnabled);

    // Persist immediately to global state
    onUpdateAvatar(croppedDataUrl);

    setTimeout(() => {
      setIsScanning(false);
    }, 900);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 2400);
  };

  // Remove photo or restore default avatar
  const handleRestoreDefault = () => {
    playSound('click', soundEnabled);
    onUpdateAvatar(DEFAULT_ARISE_AVATAR);
    setIsScanning(true);
    setShowConfirmation(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <>
      <div
        id="edit-system-identity-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      >
        <div
          id="edit-system-identity-container"
          className="relative w-full max-w-md bg-[#0c1424] border border-cyan-500/25 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,229,255,0.08)] overflow-hidden flex flex-col"
        >
          {/* Hidden Android Native Gallery File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Holographic Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/15 bg-[#0e172a]/80">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
                  Edit System Identity
                </h2>
                <p className="text-[10px] text-cyan-400/80 font-mono">
                  Operator Biometric Photo Calibrator
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-cyan-500/10 transition-all cursor-pointer"
              aria-label="Close Identity Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="p-6 space-y-6">
            {/* Live Profile Avatar with Tactical HUD Frame */}
            <div className="flex flex-col items-center justify-center space-y-3 relative">
              <div className="relative group">
                <ProfileAvatar
                  character={character}
                  size="xl"
                  showRankBadge={true}
                  isScanning={isScanning}
                  className="transition-transform duration-200 group-hover:scale-105"
                />

                {/* Quick Camera Overlay on Tap / Hover */}
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  title="Choose from Gallery"
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 transition-opacity duration-150 cursor-pointer"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Change</span>
                </button>
              </div>

              {/* Identity Status Pill */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10192a] border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{isCustomAvatar ? 'CUSTOM BIOMETRIC REGISTERED' : 'STANDARD ARISE AVATAR'}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">{character.name}</h3>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">
                  {character.rank} • LVL {character.level}
                </p>
              </div>

              {/* HUD Scan Confirmation Badge */}
              {showConfirmation && (
                <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SYSTEM IDENTITY REGISTERED</span>
                </div>
              )}
            </div>

            {/* Tactical Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Change Photo Button */}
              <button
                type="button"
                onClick={handleOpenPicker}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <ImageIcon className="w-4 h-4 text-black" />
                <span>Change Photo</span>
              </button>

              {/* Secondary Actions (Remove / Restore Default) */}
              {isCustomAvatar && (
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#101a2b] hover:bg-[#14223b] border border-cyan-500/20 text-zinc-300 hover:text-white font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Remove Photo & Restore Default</span>
                </button>
              )}

              {!isCustomAvatar && (
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#101a2b] hover:bg-[#14223b] border border-cyan-500/20 text-zinc-400 hover:text-zinc-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Restore Default Avatar</span>
                </button>
              )}
            </div>

            {/* Android / Storage Info Note */}
            <div className="p-3 rounded-xl bg-[#090f1c] border border-cyan-500/10 text-[10px] font-mono text-zinc-400 space-y-1 leading-relaxed">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase">
                <Shield className="w-3 h-3" />
                <span>Encrypted Local Storage</span>
              </div>
              <p>
                Your biometric photo is compressed to 512×512 HD and stored securely inside your local System Identity profile. It updates instantly across all views.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-cyan-500/15 bg-[#0e172a]/60 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Image Crop Modal for newly picked gallery photo */}
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
    </>
  );
};
