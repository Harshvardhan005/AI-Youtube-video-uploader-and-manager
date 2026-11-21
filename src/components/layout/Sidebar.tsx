import React from 'react';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard, Upload, Sparkles, Image, CalendarDays, Youtube, BarChart3,
  Shield, Swords, TrendingUp, Brain, Settings2, Bell, Settings, ChevronLeft,
  ChevronRight, Zap,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'upload', label: 'Upload Studio', icon: <Upload size={20} />, section: 'Create' },
  { id: 'metadata', label: 'AI Metadata Studio', icon: <Sparkles size={20} /> },
  { id: 'thumbnail', label: 'Thumbnail Studio', icon: <Image size={20} /> },
  { id: 'calendar', label: 'Publishing Calendar', icon: <CalendarDays size={20} />, section: 'Manage' },
  { id: 'channels', label: 'YouTube Channels', icon: <Youtube size={20} /> },
  { id: 'analytics', label: 'Studio Analytics', icon: <BarChart3 size={20} /> },
  { id: 'copyright', label: 'Copyright Safety', icon: <Shield size={20} /> },
  { id: 'competitors', label: 'Competitor Intel', icon: <Swords size={20} />, section: 'Intelligence' },
  { id: 'trends', label: 'Trend Research', icon: <TrendingUp size={20} /> },
  { id: 'ai-activity', label: 'AI Activity Center', icon: <Brain size={20} /> },
  { id: 'automation', label: 'Automation', icon: <Settings2 size={20} />, section: 'System' },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, currentPage, setCurrentPage } = useStore();
  const unread = useStore((s) => s.unreadCount());

  return (
    <aside className={`h-full flex flex-col bg-dark-900/80 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-300 ${
      sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.06] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold gradient-text whitespace-nowrap">AutoTube AI</div>
            <div className="text-[10px] text-dark-400 whitespace-nowrap">Autonomous Publisher</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item, i) => {
          const isActive = currentPage === item.id;
          const showSection = item.section && !sidebarCollapsed;
          const badge = item.id === 'notifications' ? unread : item.badge;

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className={`text-[10px] font-semibold uppercase tracking-wider text-dark-400 px-3 ${i > 0 ? 'pt-5 pb-1' : 'pb-1'}`}>
                  {item.section}
                </div>
              )}
              {!showSection && item.section && i > 0 && <div className="h-px bg-white/[0.04] mx-2 my-2" />}
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-neon-blue to-neon-purple" />
                )}
                <span className={`shrink-0 ${isActive ? 'text-neon-blue' : 'text-dark-400 group-hover:text-dark-200'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="ml-auto text-[10px] font-bold bg-neon-red/20 text-neon-red px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && badge !== undefined && badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/[0.06] shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
