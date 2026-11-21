import React, { useState } from 'react';
import { Youtube, Star, RefreshCw, Unlink, BarChart3, Plus, Wifi, WifiOff, Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ToggleSwitch, formatNumber, timeAgo } from '@/components/ui';

const gradients = [
  'from-neon-blue to-neon-purple',
  'from-neon-purple to-neon-pink',
  'from-neon-green to-neon-cyan',
  'from-neon-orange to-neon-red',
  'from-neon-cyan to-neon-blue',
];

const YOUTUBE_CATEGORIES = [
  'Film & Animation', 'Autos & Vehicles', 'Music', 'Pets & Animals',
  'Sports', 'Gaming', 'People & Blogs', 'Comedy',
  'Entertainment', 'News & Politics', 'Howto & Style', 'Education',
  'Science & Technology', 'Nonprofits & Activism',
];

const SCHEDULE_OPTIONS = ['Manual', 'Daily at optimal time', 'Twice a week', 'Weekly', 'Bi-weekly'];

const YouTubeChannels: React.FC = () => {
  const { channels, setDefaultChannel, removeChannel, automation, updateAutomation } = useStore();
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [expandedRules, setExpandedRules] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncing((s) => ({ ...s, [id]: true }));
    setTimeout(() => setSyncing((s) => ({ ...s, [id]: false })), 2000);
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Youtube size={22} />}
        title="YouTube Channels"
        subtitle="Connected channels and account management"
      />

      {/* ── Channel Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {channels.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="glass-panel p-5 relative overflow-hidden group"
            >
              {/* Gradient corner */}
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              />

              <div className="relative z-10 space-y-4">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shrink-0 shadow-lg`}
                  >
                    <span className="text-white text-sm font-bold">{initials(ch.name)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{ch.name}</h3>
                      {ch.isDefault && (
                        <Star size={14} className="text-neon-orange fill-neon-orange shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-dark-400 truncate">{ch.handle}</p>
                  </div>
                  {/* Status */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {ch.connected ? (
                      <Wifi size={13} className="text-neon-green" />
                    ) : (
                      <WifiOff size={13} className="text-neon-red" />
                    )}
                    <StatusBadge status={ch.connected ? 'completed' : 'failed'} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                    <div className="text-sm font-bold text-white">{formatNumber(ch.subscribers)}</div>
                    <div className="text-[10px] text-dark-400 mt-0.5">Subscribers</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                    <div className="text-sm font-bold text-white">{ch.totalVideos}</div>
                    <div className="text-[10px] text-dark-400 mt-0.5">Videos</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                    <div className="text-sm font-bold text-white">{timeAgo(ch.lastSync)}</div>
                    <div className="text-[10px] text-dark-400 mt-0.5">Synced</div>
                  </div>
                </div>

                {/* OAuth status */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div
                    className={`w-2 h-2 rounded-full ${ch.connected ? 'bg-neon-green animate-pulse' : 'bg-neon-red'}`}
                  />
                  <span className="text-[11px] text-dark-300">
                    OAuth {ch.connected ? 'Token Active' : 'Token Expired'}
                  </span>
                  {!ch.connected && (
                    <button className="ml-auto text-[11px] text-neon-blue hover:underline">
                      Re-auth
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {!ch.isDefault && (
                    <button
                      onClick={() => setDefaultChannel(ch.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                    >
                      <Star size={12} />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleSync(ch.id)}
                    disabled={syncing[ch.id]}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={syncing[ch.id] ? 'animate-spin' : ''} />
                    {syncing[ch.id] ? 'Syncing…' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => {/* view analytics */}}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neon-blue hover:text-neon-cyan bg-neon-blue/[0.06] hover:bg-neon-blue/[0.12] transition-colors"
                  >
                    <BarChart3 size={12} />
                    Analytics
                  </button>
                  <button
                    onClick={() => removeChannel(ch.id)}
                    className="ml-auto p-1.5 rounded-lg text-dark-400 hover:text-neon-red hover:bg-neon-red/[0.08] transition-colors"
                    title="Disconnect"
                  >
                    <Unlink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Connect New Channel Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: channels.length * 0.08 }}
            className="glass-panel border-dashed border-2 border-white/10 hover:border-neon-blue/30 p-5 flex flex-col items-center justify-center text-center min-h-[280px] group transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-neon-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Youtube size={28} className="text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Connect a Channel</h3>
            <p className="text-xs text-dark-400 mb-5 max-w-[200px]">
              Link your YouTube channel to start automating uploads
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-neon-blue text-white text-sm font-medium shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all group-hover:scale-105">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Connect with Google
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Channel Rules ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Settings2 size={18} className="text-neon-purple" />
          Channel Rules
        </h2>

        <div className="space-y-3">
          {channels.map((ch, i) => {
            const isExpanded = expandedRules === ch.id;
            return (
              <div key={ch.id} className="glass-panel overflow-hidden">
                {/* Header toggle */}
                <button
                  onClick={() => setExpandedRules(isExpanded ? null : ch.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}
                    >
                      <span className="text-white text-[10px] font-bold">{initials(ch.name)}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{ch.name}</span>
                    {ch.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-orange/10 text-neon-orange border border-neon-orange/20">
                        Default
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-dark-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/[0.04]">
                        <ToggleSwitch
                          enabled={automation.autopilotEnabled}
                          onChange={(v) => updateAutomation({ autopilotEnabled: v })}
                          label="Autopilot Mode"
                          description="Automatically publish videos after all checks pass"
                        />

                        {/* Default Category */}
                        <div>
                          <label className="block text-xs font-medium text-dark-200 mb-1.5">
                            Default Category
                          </label>
                          <select
                            value={automation.defaultCategory}
                            onChange={(e) => updateAutomation({ defaultCategory: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-neon-blue/40"
                          >
                            {YOUTUBE_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-dark-800">
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Publishing Schedule */}
                        <div>
                          <label className="block text-xs font-medium text-dark-200 mb-1.5">
                            Publishing Schedule
                          </label>
                          <select
                            defaultValue="Daily at optimal time"
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-neon-blue/40"
                          >
                            {SCHEDULE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-dark-800">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <ToggleSwitch
                          enabled={automation.thumbnailAutoGenerate}
                          onChange={(v) => updateAutomation({ thumbnailAutoGenerate: v })}
                          label="Auto-generate Thumbnails"
                          description="Let AI create click-worthy thumbnails"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeChannels;
