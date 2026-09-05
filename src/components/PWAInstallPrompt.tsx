import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Copy,
  Share2,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playSound } from '../utils/sound';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'sidebar' | 'settings';
  soundEnabled?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  soundEnabled = true
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed in standalone mode
  if (isInstalled || justInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>INSTALLED AS ANDROID APP</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    playSound('click', soundEnabled);
    if (isInstallable) {
      const success = await install();
      if (success) {
        playSound('reward', soundEnabled);
        setJustInstalled(true);
        return;
      }
    }
    // If not directly installable via prompt (or prompt declined), show the guide modal
    setShowModal(true);
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          id="pwa-install-sidebar-btn"
          onClick={handleClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition-transform">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-left">
              <span className="block font-bold leading-tight">Install on Android</span>
              <span className="block text-[9px] text-zinc-400">PWA Native App</span>
            </div>
          </div>
          <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {showModal && (
          <AndroidInstallModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onDirectInstall={handleClick}
            isInstallable={isInstallable}
            soundEnabled={soundEnabled}
          />
        )}
      </>
    );
  }

  if (variant === 'settings') {
    return (
      <>
        <div className="p-4 rounded-xl bg-[#0d1522] border border-cyan-500/20 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-2">
                  Android Installation
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Standalone
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Install this app on your Android device for fullscreen immersion, zero browser bars, and offline access.
                </p>
              </div>
            </div>
            <button
              onClick={handleClick}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isInstallable ? 'Install App' : 'Guide & Install'}
            </button>
          </div>
        </div>

        {showModal && (
          <AndroidInstallModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onDirectInstall={handleClick}
            isInstallable={isInstallable}
            soundEnabled={soundEnabled}
          />
        )}
      </>
    );
  }

  // Compact header button
  return (
    <>
      <button
        id="pwa-install-header-btn"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-[11px] font-mono font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.1)]"
        title="Install Solo Leveling RPG on Android"
      >
        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
        <span>Install App</span>
      </button>

      {showModal && (
        <AndroidInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDirectInstall={handleClick}
          isInstallable={isInstallable}
          soundEnabled={soundEnabled}
        />
      )}
    </>
  );
};

export const PWAInstallBanner: React.FC<{ soundEnabled?: boolean }> = ({ soundEnabled = true }) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Suppress if already installed or dismissed this session
  if (isInstalled || dismissed) return null;

  const handleInstallClick = async () => {
    playSound('click', soundEnabled);
    if (isInstallable) {
      const success = await install();
      if (success) {
        playSound('reward', soundEnabled);
        setDismissed(true);
        return;
      }
    }
    setShowModal(true);
  };

  return (
    <>
      <div
        id="pwa-install-floating-banner"
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-[#0d1624]/95 border border-cyan-500/40 rounded-xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.15)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                Install on Android
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </h4>
              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  setDismissed(true);
                }}
                className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Add the Solo Leveling System directly to your Android home screen for fullscreen gaming & offline support.
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-mono font-bold transition-all shadow-[0_0_10px_rgba(0,229,255,0.25)] cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>{isInstallable ? 'Install Now' : 'How to Install'}</span>
              </button>
              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  setShowModal(true);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-[11px] font-mono font-medium transition-colors cursor-pointer"
              >
                Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AndroidInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDirectInstall={handleInstallClick}
          isInstallable={isInstallable}
          soundEnabled={soundEnabled}
        />
      )}
    </>
  );
};

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectInstall: () => void;
  isInstallable: boolean;
  soundEnabled: boolean;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  onDirectInstall,
  isInstallable,
  soundEnabled
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'features'>('android');

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      playSound('reward', soundEnabled);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    playSound('click', soundEnabled);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Solo Leveling RPG System',
          text: 'Turn habits into Hunter attributes with Solo Leveling System!',
          url: currentUrl
        });
      } catch {
        // Share cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      id="android-install-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0b121e] border border-cyan-500/40 rounded-2xl p-6 text-zinc-200 shadow-[0_0_40px_rgba(0,229,255,0.15)] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#101b2e] border border-cyan-500/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <img src={`${import.meta.env.BASE_URL}pwa-192x192.png`} alt="Solo Leveling Icon" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-black text-sm tracking-wide text-zinc-100 uppercase">
                  Solo Leveling RPG
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ANDROID PWA
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">System v1.4 • Native App Capability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-[#101929] rounded-lg border border-cyan-500/20 text-xs font-mono">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'android'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install Steps</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'features'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>App Features</span>
          </button>
        </div>

        {activeTab === 'android' ? (
          <div className="space-y-4">
            {isInstallable ? (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Instant Installation Ready</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your browser supports direct installation. Tap below to prompt Android to install the Solo Leveling app icon to your home launcher.
                </p>
                <button
                  onClick={onDirectInstall}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Execute Android Install</span>
                </button>
              </div>
            ) : null}

            {/* Android Browser Manual Instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>How to Install on Android (Chrome / Edge / Brave):</span>
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#111c30] border border-cyan-500/10">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div className="text-zinc-300">
                    Open this app in <strong className="text-cyan-300">Google Chrome</strong> or your preferred Android browser.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#111c30] border border-cyan-500/10">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div className="text-zinc-300">
                    Tap the browser menu <strong className="text-cyan-300">(⋮ 3 dots)</strong> in the top-right corner.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#111c30] border border-cyan-500/10">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div className="text-zinc-300">
                    Tap <strong className="text-cyan-300">"Install app"</strong> or <strong className="text-cyan-300">"Add to Home screen"</strong> and confirm.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Share / URL Actions */}
            <div className="pt-2 border-t border-cyan-500/20 flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-2 px-3 rounded-lg bg-[#101b2e] hover:bg-[#162540] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share App</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 py-2 px-3 rounded-lg bg-[#101b2e] hover:bg-[#162540] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Feature benefits */
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#111c30] border border-cyan-500/15 space-y-1">
              <div className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Standalone Fullscreen HUD</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Renders like a dedicated Android native application without browser URL address bars, tab switchers, or navigation distractions.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111c30] border border-cyan-500/15 space-y-1">
              <div className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Offline Cache & Persistence</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Service workers precache critical assets and fonts. Quests, stats, inventory, and streaks function seamlessly even without cellular data.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111c30] border border-cyan-500/15 space-y-1">
              <div className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Instant Android Launcher Icon</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Equipped with maskable adaptive icons that fit perfectly into Samsung OneUI, Pixel launcher, and third-party Android icon packs.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
