import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Eye, Clock, Users, ShieldCheck, Sparkles, TrendingUp,
  Calendar, Play, CheckCircle2, Youtube, ArrowUpRight, BarChart3,
  Shield, Brain, Video, Bell, ChevronRight, Activity, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '@/store/useStore';
import {
  StatCard, StatusBadge, ProgressBar, AICoreOrb, formatNumber,
  formatDuration, formatBytes, timeAgo, PageHeader
} from '@/components/ui';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-900/95 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs text-dark-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-neon-blue">
          {payload[0].value.toLocaleString()} views
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const { channels, videos, analyticsData, notifications, aiActivities, setCurrentPage } = useStore();

  // Aggregate stats
  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0) + 124800;
  const totalSubs = channels.reduce((acc, c) => acc + c.subscribers, 0);
  const totalPublished = videos.filter((v) => v.status === 'published').length;
  const activeChannelsCount = channels.filter((c) => c.connected).length;
  const copyrightClearCount = videos.filter((v) => v.copyrightStatus === 'clear').length;
  const copyrightRate = videos.length > 0 ? Math.round((copyrightClearCount / videos.length) * 100) : 100;
  const totalWatchHours = 1420;

  const recentVideos = videos.slice(0, 4);
  const recentActivities = aiActivities.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-[1700px] mx-auto pb-10"
    >
      {/* Hero Banner with AI Core */}
      <motion.div
        variants={itemVariants}
        className="glass-panel relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-dark-900/90 via-dark-850/80 to-dark-900/90 border border-white/[0.08]"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-radial from-neon-blue/15 via-neon-purple/10 to-transparent pointer-events-none blur-2xl" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <AICoreOrb size={95} className="shrink-0 drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  Autopilot Operational
                </span>
                <span className="text-xs text-dark-300">
                  YouTube Partner API v3 • Content Shield Active
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                AutoTube <span className="gradient-text">Command Center</span>
              </h1>
              <p className="text-dark-200 text-sm md:text-base mt-1.5 max-w-2xl leading-relaxed">
                Autonomous publishing engine active. Upload finalized video assets to let AI handle content analysis, SEO generation, thumbnail rendering, copyright screening, and scheduled publishing.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setCurrentPage('upload')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-neon-blue/20 transition-all duration-300 active:scale-95"
            >
              <Upload size={18} />
              <span>Upload Video</span>
            </button>
            <button
              onClick={() => setCurrentPage('ai-activity')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white font-medium transition-all duration-300 active:scale-95"
            >
              <Brain size={18} className="text-neon-cyan" />
              <span>AI Activity</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <StatCard
          icon={<Eye size={20} className="text-neon-blue" />}
          label="Total Channel Views"
          value={formatNumber(totalViews)}
          change="+18.4% this month"
          changeType="positive"
          color="blue"
        />
        <StatCard
          icon={<Clock size={20} className="text-neon-purple" />}
          label="Watch Time (Hours)"
          value={formatNumber(totalWatchHours)}
          change="+12.8% vs last week"
          changeType="positive"
          color="purple"
        />
        <StatCard
          icon={<Users size={20} className="text-neon-cyan" />}
          label="Total Subscribers"
          value={formatNumber(totalSubs)}
          change="+2,840 new"
          changeType="positive"
          color="cyan"
        />
        <StatCard
          icon={<Video size={20} className="text-neon-green" />}
          label="Videos Published"
          value={totalPublished}
          change="3 scheduled"
          changeType="neutral"
          color="green"
        />
        <StatCard
          icon={<Youtube size={20} className="text-neon-orange" />}
          label="Connected Channels"
          value={activeChannelsCount}
          change="All Synced"
          changeType="positive"
          color="orange"
        />
        <StatCard
          icon={<ShieldCheck size={20} className="text-emerald-400" />}
          label="Copyright Safety Rate"
          value={`${copyrightRate}%`}
          change="1 scan warning"
          changeType="neutral"
          color="pink"
        />
      </motion.div>

      {/* Main Graph & AI Activity Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-neon-blue" />
                Audience Growth & Velocity
              </h2>
              <p className="text-xs text-dark-300 mt-0.5">Aggregated daily impressions and views across connected channels</p>
            </div>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="text-xs text-neon-blue hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              Full Analytics <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  stroke="#475569"
                  fontSize={11}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#475569"
                  fontSize={11}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time AI Activity Feed */}
        <div className="glass-panel p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain size={20} className="text-neon-purple" />
                Autonomous Engine Log
              </h2>
              <span className="text-[10px] uppercase font-bold text-neon-cyan px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
                Live
              </span>
            </div>
            <p className="text-xs text-dark-300 mb-4">Latest autonomous actions executed by AutoTube agents</p>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Zap size={12} className="text-neon-blue" />
                      {act.action}
                    </span>
                    <StatusBadge status={act.status} className="text-[10px] py-0 px-2" />
                  </div>
                  <p className="text-xs text-dark-200 line-clamp-1">{act.details}</p>
                  <span className="text-[10px] text-dark-400 mt-1 block">{timeAgo(act.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('ai-activity')}
            className="w-full mt-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-dark-200 hover:text-white transition-all text-center"
          >
            Open AI Activity Center →
          </button>
        </div>
      </motion.div>

      {/* Quick Launchpad Buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentPage('upload')}
          className="glass-panel p-4 flex items-center gap-3.5 hover:border-neon-blue/40 hover:bg-neon-blue/5 transition-all group text-left"
        >
          <div className="p-2.5 rounded-xl bg-neon-blue/10 text-neon-blue group-hover:scale-110 transition-transform">
            <Upload size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Upload Video</div>
            <div className="text-xs text-dark-300">Automated ingestion</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentPage('copyright')}
          className="glass-panel p-4 flex items-center gap-3.5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group text-left"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Safety Center</div>
            <div className="text-xs text-dark-300">Copyright & claims</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentPage('calendar')}
          className="glass-panel p-4 flex items-center gap-3.5 hover:border-neon-purple/40 hover:bg-neon-purple/5 transition-all group text-left"
        >
          <div className="p-2.5 rounded-xl bg-neon-purple/10 text-neon-purple group-hover:scale-110 transition-transform">
            <Calendar size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Publishing Pipeline</div>
            <div className="text-xs text-dark-300">Schedule & timeline</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentPage('channels')}
          className="glass-panel p-4 flex items-center gap-3.5 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all group text-left"
        >
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan group-hover:scale-110 transition-transform">
            <Youtube size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Channels & Rules</div>
            <div className="text-xs text-dark-300">Google OAuth & Studio</div>
          </div>
        </button>
      </motion.div>

      {/* Recent Videos & Connected Channels */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pipeline Videos */}
        <div className="lg:col-span-2 glass-panel p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Video size={20} className="text-neon-cyan" />
                Active Publishing Queue
              </h2>
              <p className="text-xs text-dark-300">Autonomous video pipeline stages and live status</p>
            </div>
            <button
              onClick={() => setCurrentPage('upload')}
              className="text-xs text-neon-blue hover:text-blue-400 font-medium flex items-center gap-1"
            >
              View Studio <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-16 h-10 rounded-lg bg-dark-700 border border-white/10 flex items-center justify-center shrink-0 text-dark-300 font-mono text-[10px] relative overflow-hidden">
                    <Play size={16} className="text-white/60" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">{video.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-dark-300 mt-0.5">
                      <span className="text-neon-blue">{video.channelName}</span>
                      <span>•</span>
                      <span>{formatDuration(video.duration)}</span>
                      <span>•</span>
                      <span>{formatBytes(video.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="w-24">
                    <div className="flex justify-between text-[10px] text-dark-300 mb-1">
                      <span>Progress</span>
                      <span>{video.progress}%</span>
                    </div>
                    <ProgressBar progress={video.progress} color={video.status === 'published' ? 'green' : 'blue'} />
                  </div>
                  <StatusBadge status={video.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Channels Overview */}
        <div className="glass-panel p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Youtube size={20} className="text-red-500" />
                Connected Channels
              </h2>
              <p className="text-xs text-dark-300">Managed via YouTube Partner OAuth</p>
            </div>
            <button
              onClick={() => setCurrentPage('channels')}
              className="text-xs text-neon-blue hover:text-blue-400 font-medium"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3.5">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center font-bold text-xs text-white">
                      {channel.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {channel.name}
                        {channel.isDefault && (
                          <span className="text-[9px] bg-neon-blue/20 text-neon-blue px-1.5 py-0.2 rounded font-medium">Default</span>
                        )}
                      </div>
                      <div className="text-[11px] text-dark-400">{channel.handle}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-neon-green" title="Connected" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-dark-300 pt-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-dark-400">Subscribers: </span>
                    <span className="font-semibold text-white">{formatNumber(channel.subscribers)}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Videos: </span>
                    <span className="font-semibold text-white">{channel.totalVideos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          {unreadNotifications.length > 0 && (
            <div className="mt-5 p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-neon-blue mb-1">
                <Bell size={13} />
                <span>Notice: {unreadNotifications[0].title}</span>
              </div>
              <p className="text-[11px] text-dark-300 line-clamp-2">
                {unreadNotifications[0].message}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
