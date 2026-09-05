import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="system-offline-banner"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-lg bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs font-mono shadow-2xl backdrop-blur-md animate-pulse"
    >
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>[ SYSTEM OFFLINE ] Local Cache & Stats Active</span>
    </div>
  );
};
