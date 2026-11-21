import React, { useState } from 'react';
import { Youtube, Star, RefreshCw, Unlink, BarChart3, Plus, Wifi, WifiOff, Settings2, ChevronDown, KeyRound, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, YouTubeChannel } from '@/store/useStore';
import { PageHeader, StatusBadge, ToggleSwitch, formatNumber, timeAgo } from '@/components/ui';
import { YouTubeService } from '@/services/youtube';

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

export const YouTubeChannels: React.FC = () => {
  const { channels, addChannel, setDefaultChannel, removeChannel, syncChannel, apiKeys, addNotification, setCurrentPage } = useStore();
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [expandedRules, setExpandedRules] = useState<string | null>(null);

  // Connect Channel Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const [clientId, setClientId] = useState(apiKeys.googleClientId || '');
  const [clientSecret, setClientSecret] = useState(apiKeys.googleClientSecret || '');
  const [authCode, setAuthCode] = useState('');
  const [directToken, setDirectToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncing((s) => ({ ...s, [id]: true }));
    await syncChannel(id);
    setSyncing((s) => ({ ...s, [id]: false }));
  };

  const handleOpenGoogleConsent = () => {
    if (!clientId.trim()) {
      setConnectError('Please enter your Google Client ID first (from Google Cloud Console).');
      return;
    }
    const authUrl = YouTubeService.getAuthUrl(clientId.trim());
    window.open(authUrl, '_blank', 'width=600,height=700');
  };

  const handleConnectWithCode = async () => {
    setConnectError(null);
    setIsSubmitting(true);

    try {
      if (authMethod === 'oauth') {
        if (!authCode.trim()) {
          throw new Error('Please enter the authorization code from Google.');
        }
        if (!clientId.trim() || !clientSecret.trim()) {
          throw new Error('Both Client ID and Client Secret are required.');
        }

        const tokens = await YouTubeService.exchangeCodeForTokens({
          code: authCode.trim(),
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
        });

        const profile = await YouTubeService.fetchMyChannel(tokens.accessToken);

        const newChannel: YouTubeChannel = {
          id: profile.id,
          name: profile.name,
          handle: profile.handle,
          avatar: profile.avatar,
          subscribers: profile.subscribers,
          totalVideos: profile.totalVideos,
          isDefault: channels.length === 0,
          connected: true,
          lastSync: new Date().toISOString(),
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        };

        addChannel(newChannel);
        addNotification({
          type: 'success',
          title: 'YouTube Channel Linked',
          message: `Successfully connected ${profile.name} with official Google OAuth!`,
          channelId: profile.id,
        });

        setIsConnectModalOpen(false);
        setAuthCode('');
      } else {
        // Direct Access Token
        if (!directToken.trim()) {
          throw new Error('Please paste your OAuth access token.');
        }

        const profile = await YouTubeService.fetchMyChannel(directToken.trim());

        const newChannel: YouTubeChannel = {
          id: profile.id,
          name: profile.name,
          handle: profile.handle,
          avatar: profile.avatar,
          subscribers: profile.subscribers,
          totalVideos: profile.totalVideos,
          isDefault: channels.length === 0,
          connected: true,
          lastSync: new Date().toISOString(),
          accessToken: directToken.trim(),
          expiresAt: Date.now() + 3600 * 1000,
        };

        addChannel(newChannel);
        addNotification({
          type: 'success',
          title: 'YouTube Channel Linked',
          message: `Successfully connected ${profile.name}!`,
          channelId: profile.id,
        });

        setIsConnectModalOpen(false);
        setDirectToken('');
      }
    } catch (err: any) {
      console.error('Error connecting channel:', err);
      setConnectError(err.message || 'Failed to authenticate channel with YouTube API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto pb-12">
      <PageHeader
        icon={<Youtube size={22} />}
        title="YouTube Channels"
        subtitle="Manage connected YouTube accounts, official Google OAuth credentials & per-channel automation rules."
        actions={
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-neon-blue text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Connect YouTube Channel</span>
          </button>
        }
      />

      {/* ── Channel Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {channels.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass-panel p-5 relative overflow-hidden group"
            >
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              />

              <div className="relative z-10 space-y-4">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  {ch.avatar ? (
                    <img src={ch.avatar} alt={ch.name} className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0 shadow-lg" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shrink-0 shadow-lg`}>
                      <span className="text-white text-sm font-bold">{initials(ch.name)}</span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{ch.name}</h3>
                      {ch.isDefault && (
                        <Star size={14} className="text-neon-orange fill-neon-orange shrink-0" title="Default publishing channel" />
                      )}
                    </div>
                    <p className="text-xs text-dark-400 truncate">{ch.handle}</p>
                  </div>

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
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${ch.connected ? 'bg-neon-green animate-pulse' : 'bg-neon-red'}`} />
                    <span className="text-[11px] text-dark-300">
                      OAuth {ch.connected ? 'Active (YouTube API v3)' : 'Requires Authentication'}
                    </span>
                  </div>
                  {!ch.connected && (
                    <button
                      onClick={() => setIsConnectModalOpen(true)}
                      className="text-[11px] text-neon-blue hover:underline font-medium"
                    >
                      Authenticate →
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
                    onClick={() => setCurrentPage('analytics')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neon-blue hover:text-neon-cyan bg-neon-blue/[0.06] hover:bg-neon-blue/[0.12] transition-colors"
                  >
                    <BarChart3 size={12} />
                    Analytics
                  </button>
                  <button
                    onClick={() => removeChannel(ch.id)}
                    className="ml-auto p-1.5 rounded-lg text-dark-400 hover:text-neon-red hover:bg-neon-red/[0.08] transition-colors"
                    title="Disconnect Channel"
                  >
                    <Unlink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Connect New Channel Card ── */}
          <motion.div
            onClick={() => setIsConnectModalOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel border-dashed border-2 border-white/10 hover:border-red-500/40 p-5 flex flex-col items-center justify-center text-center min-h-[260px] group transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-neon-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Youtube size={28} className="text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Connect YouTube Channel</h3>
            <p className="text-xs text-dark-400 mb-4 max-w-[220px]">
              Authorize via official Google OAuth 2.0 to automate uploads & analytics
            </p>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-neon-blue text-white text-xs font-semibold shadow-md">
              <Plus size={14} />
              Connect with Google
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Connect YouTube Channel Modal ── */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel p-6 max-w-xl w-full border border-white/15 bg-dark-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
                    <Youtube size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Connect YouTube Channel</h3>
                    <p className="text-xs text-dark-300">Authorize official YouTube Data API v3 access</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="p-1.5 rounded-lg text-dark-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {connectError && (
                <div className="p-3 mb-4 rounded-xl bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs">
                  {connectError}
                </div>
              )}

              {/* Tabs for method */}
              <div className="flex rounded-lg bg-dark-950 p-1 mb-5 border border-white/5">
                <button
                  onClick={() => setAuthMethod('oauth')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    authMethod === 'oauth' ? 'bg-white/10 text-white shadow' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Google OAuth 2.0 (Recommended)
                </button>
                <button
                  onClick={() => setAuthMethod('token')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    authMethod === 'token' ? 'bg-white/10 text-white shadow' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Direct Access Token
                </button>
              </div>

              {authMethod === 'oauth' ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-dark-200 font-medium block mb-1.5">Google Client ID</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="e.g. 123456789-xxxxxx.apps.googleusercontent.com"
                      className="glass-input font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-dark-200 font-medium block mb-1.5">Google Client Secret</label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="Enter Client Secret from Google Cloud Console"
                      className="glass-input font-mono text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/15 text-dark-300 space-y-2">
                    <p className="font-semibold text-white">How to connect:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                      <li>Enter your Client ID & Secret above.</li>
                      <li>Click the button below to open Google's account selection in your browser.</li>
                      <li>Sign in, grant YouTube permissions, and copy the authorization code.</li>
                    </ol>
                    <button
                      type="button"
                      onClick={handleOpenGoogleConsent}
                      className="w-full mt-2 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>1. Open Google Sign-In Window</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>

                  <div>
                    <label className="text-dark-200 font-medium block mb-1.5">Paste Authorization Code</label>
                    <input
                      type="text"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      placeholder="Paste 4/0A... authorization code here"
                      className="glass-input font-mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-dark-200 font-medium block mb-1.5">YouTube OAuth Access Token</label>
                    <textarea
                      value={directToken}
                      onChange={(e) => setDirectToken(e.target.value)}
                      placeholder="Paste Bearer ya29... token here"
                      rows={4}
                      className="glass-input font-mono text-xs resize-none"
                    />
                    <p className="text-[11px] text-dark-400 mt-1">
                      Token with scopes: <code className="text-neon-cyan">youtube.upload, youtube.readonly</code>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-dark-300 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConnectWithCode}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-neon-blue text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Authorize & Link Channel</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeChannels;
