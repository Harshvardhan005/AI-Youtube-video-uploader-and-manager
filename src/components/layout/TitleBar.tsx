import React from 'react';
import { useStore } from '@/store/useStore';
import { Bell, Search, Minus, Square, X } from 'lucide-react';

export const TitleBar: React.FC = () => {
  const unread = useStore((s) => s.unreadCount());
  const { setCurrentPage } = useStore();
  const isElectron = !!(window as any).electronAPI?.isElectron;

  return (
    <header
      className="h-12 flex items-center justify-between px-4 border-b border-white/[0.06] bg-dark-950/60 backdrop-blur-xl shrink-0 z-50"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search videos, channels, analytics..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-dark-400 focus:outline-none focus:border-neon-blue/40 transition-colors"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {/* AI Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neon-green/5 border border-neon-green/10">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-medium text-neon-green">AI Active</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setCurrentPage('notifications')}
          className="relative p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-red rounded-full text-[9px] font-bold flex items-center justify-center text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Window controls (Electron) */}
        {isElectron && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/[0.06]">
            <button onClick={() => window.electronAPI?.minimize()} className="p-1.5 rounded hover:bg-white/[0.06] text-dark-400 hover:text-white transition-colors"><Minus size={14} /></button>
            <button onClick={() => window.electronAPI?.maximize()} className="p-1.5 rounded hover:bg-white/[0.06] text-dark-400 hover:text-white transition-colors"><Square size={12} /></button>
            <button onClick={() => window.electronAPI?.close()} className="p-1.5 rounded hover:bg-neon-red/20 text-dark-400 hover:text-neon-red transition-colors"><X size={14} /></button>
          </div>
        )}
      </div>
    </header>
  );
};
