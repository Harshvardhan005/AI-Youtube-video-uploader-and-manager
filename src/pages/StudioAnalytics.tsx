import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { PageHeader, StatCard, Tabs, formatNumber, formatDuration } from '@/components/ui';
import {
  BarChart3, Eye, Clock, Users, MousePointerClick, TrendingUp,
  ArrowUpRight, ArrowDownRight, DollarSign, Monitor, Smartphone,
  Tablet, Globe, ThumbsUp, MessageSquare, Play, Film,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';

// ─── Chart colors ───
const COLORS = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  green: '#10b981',
  pink: '#ec4899',
};
const PIE_COLORS = [COLORS.blue, COLORS.purple, COLORS.cyan, COLORS.green, COLORS.pink];

// ─── Custom Tooltip ───
const GlassTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-dark-800/90 backdrop-blur-md border border-white/10 px-4 py-3 shadow-xl">
      <p className="text-xs text-dark-300 mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-dark-200 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Traffic source data ───
const trafficSources = [
  { name: 'Search', value: 32, color: COLORS.blue },
  { name: 'Suggested', value: 28, color: COLORS.purple },
  { name: 'Browse', value: 18, color: COLORS.cyan },
  { name: 'Direct', value: 14, color: COLORS.green },
  { name: 'External', value: 8, color: COLORS.pink },
];

// ─── Demographics data ───
const ageGroups = [
  { group: '13-17', male: 8, female: 6 },
  { group: '18-24', male: 28, female: 22 },
  { group: '25-34', male: 24, female: 18 },
  { group: '35-44', male: 12, female: 10 },
  { group: '45-54', male: 6, female: 4 },
  { group: '55+', male: 3, female: 2 },
];

const deviceTypes = [
  { name: 'Mobile', value: 52, color: COLORS.blue },
  { name: 'Desktop', value: 31, color: COLORS.purple },
  { name: 'Tablet', value: 10, color: COLORS.cyan },
  { name: 'TV', value: 7, color: COLORS.green },
];

const topCountries = [
  { country: 'United States', views: 42000 },
  { country: 'India', views: 28000 },
  { country: 'United Kingdom', views: 15000 },
  { country: 'Germany', views: 9500 },
  { country: 'Brazil', views: 8200 },
];

// ─── Entrance animation ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

// ─── Sort helper ───
type SortKey = 'title' | 'views' | 'likes' | 'comments' | 'duration';
type SortDir = 'asc' | 'desc';

const StudioAnalytics: React.FC = () => {
  const { analyticsData, videos, channels } = useStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [videoSort, setVideoSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'views', dir: 'desc' });

  // ─── Computed stats (28‑day) ───
  const stats = useMemo(() => {
    const d = analyticsData;
    const totalViews = d.reduce((s, r) => s + r.views, 0);
    const totalWatchTime = d.reduce((s, r) => s + r.watchTime, 0);
    const avgDuration = d.length ? Math.round(d.reduce((s, r) => s + r.avgViewDuration, 0) / d.length) : 0;
    const netSubs = d.reduce((s, r) => s + r.subscribers, 0);
    const totalImpressions = d.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = d.length ? parseFloat((d.reduce((s, r) => s + r.ctr, 0) / d.length).toFixed(1)) : 0;
    const totalRevenue = d.reduce((s, r) => s + r.revenue, 0);
    return { totalViews, totalWatchTime, avgDuration, netSubs, totalImpressions, avgCtr, totalRevenue };
  }, [analyticsData]);

  // ─── Chart data ───
  const viewsChartData = useMemo(
    () => analyticsData.map((d) => ({ date: d.date.slice(5), views: d.views })),
    [analyticsData],
  );
  const watchTimeChartData = useMemo(
    () => analyticsData.map((d) => ({ date: d.date.slice(5), hours: parseFloat((d.watchTime / 3600).toFixed(1)) })),
    [analyticsData],
  );
  const subsChartData = useMemo(
    () => analyticsData.map((d) => ({ date: d.date.slice(5), subscribers: d.subscribers })),
    [analyticsData],
  );
  const revenueChartData = useMemo(
    () => analyticsData.map((d) => ({ date: d.date.slice(5), revenue: d.revenue })),
    [analyticsData],
  );

  // ─── Sorted videos ───
  const sortedVideos = useMemo(() => {
    const copy = [...videos];
    copy.sort((a, b) => {
      const av = a[videoSort.key];
      const bv = b[videoSort.key];
      if (typeof av === 'string' && typeof bv === 'string') return videoSort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return videoSort.dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return copy;
  }, [videos, videoSort]);

  const handleSort = (key: SortKey) => {
    setVideoSort((p) => ({ key, dir: p.key === key && p.dir === 'desc' ? 'asc' : 'desc' }));
  };

  const sortIcon = (key: SortKey) =>
    videoSort.key === key ? (videoSort.dir === 'desc' ? ' ↓' : ' ↑') : '';

  // ─── Tabs ───
  const tabs = ['Overview', 'Videos', 'Audience', 'Revenue'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={<BarChart3 size={22} />}
        title="YouTube Studio Analytics"
        subtitle="Performance insights powered by real channel data"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-300">Last 28 days</span>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ═══════════════ OVERVIEW ═══════════════ */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Stat cards */}
          <motion.div {...fadeUp(0)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard icon={<Eye size={18} />} label="Views (28d)" value={formatNumber(stats.totalViews)} change="+12.4%" changeType="positive" color="blue" />
            <StatCard icon={<Clock size={18} />} label="Watch Time (hrs)" value={formatNumber(Math.round(stats.totalWatchTime / 3600))} change="+8.1%" changeType="positive" color="purple" />
            <StatCard icon={<Play size={18} />} label="Avg View Duration" value={formatDuration(stats.avgDuration)} change="+3s" changeType="positive" color="cyan" />
            <StatCard icon={<Users size={18} />} label="Subscribers" value={`+${formatNumber(stats.netSubs)}`} change="+22%" changeType="positive" color="green" />
            <StatCard icon={<MousePointerClick size={18} />} label="Impressions" value={formatNumber(stats.totalImpressions)} change="+5.6%" changeType="positive" color="orange" />
            <StatCard icon={<TrendingUp size={18} />} label="CTR %" value={`${stats.avgCtr}%`} change="+0.3%" changeType="positive" color="pink" />
          </motion.div>

          {/* Main views chart */}
          <motion.div {...fadeUp(0.1)} className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-1">Views — Last 30 Days</h3>
            <p className="text-dark-300 text-xs mb-4">Daily view count across all channels</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Area type="monotone" dataKey="views" stroke={COLORS.blue} strokeWidth={2} fill="url(#viewsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Secondary charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Watch Time bar chart */}
            <motion.div {...fadeUp(0.15)} className="glass-panel p-6">
              <h3 className="text-white font-semibold mb-1">Watch Time (Hours)</h3>
              <p className="text-dark-300 text-xs mb-4">Daily watch hours</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={watchTimeChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="hours" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Subscribers line chart */}
            <motion.div {...fadeUp(0.2)} className="glass-panel p-6">
              <h3 className="text-white font-semibold mb-1">Subscribers Gained</h3>
              <p className="text-dark-300 text-xs mb-4">Daily net subscriber growth</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subsChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Line type="monotone" dataKey="subscribers" stroke={COLORS.green} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Traffic Sources */}
          <motion.div {...fadeUp(0.25)} className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-1">Traffic Sources</h3>
            <p className="text-dark-300 text-xs mb-4">Where your viewers come from</p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-56 w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%" cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {trafficSources.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<GlassTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4">
                {trafficSources.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm text-dark-200">{s.name}</span>
                    <span className="text-sm text-white font-semibold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Performing Videos */}
          <motion.div {...fadeUp(0.3)} className="glass-panel p-6 overflow-x-auto">
            <h3 className="text-white font-semibold mb-1">Top Performing Videos</h3>
            <p className="text-dark-300 text-xs mb-4">Ranked by view count</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-dark-300">
                  <th className="py-2 pr-4">Video</th>
                  <th className="py-2 pr-4 text-right">Views</th>
                  <th className="py-2 pr-4 text-right">Watch Time</th>
                  <th className="py-2 pr-4 text-right">Likes</th>
                  <th className="py-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {[...videos]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 8)
                  .map((v) => (
                    <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-9 rounded bg-dark-700 flex items-center justify-center shrink-0">
                            <Film size={14} className="text-dark-400" />
                          </div>
                          <span className="text-white font-medium truncate max-w-xs">{v.title}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-white">{formatNumber(v.views)}</td>
                      <td className="py-3 pr-4 text-right text-dark-200">{formatDuration(v.duration)}</td>
                      <td className="py-3 pr-4 text-right text-dark-200">{formatNumber(v.likes)}</td>
                      <td className="py-3 text-right text-dark-200">
                        {v.views > 0 ? ((v.likes / v.views) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ VIDEOS ═══════════════ */}
      {activeTab === 'Videos' && (
        <motion.div {...fadeUp(0)} className="glass-panel p-6 overflow-x-auto">
          <h3 className="text-white font-semibold mb-4">All Videos — Performance Metrics</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-dark-300 select-none">
                <th className="py-2 pr-4 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                  Title{sortIcon('title')}
                </th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('views')}>
                  Views{sortIcon('views')}
                </th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('likes')}>
                  Likes{sortIcon('likes')}
                </th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('comments')}>
                  Comments{sortIcon('comments')}
                </th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('duration')}>
                  Duration{sortIcon('duration')}
                </th>
                <th className="py-2 pr-4">Channel</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedVideos.map((v) => (
                <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-9 rounded bg-dark-700 flex items-center justify-center shrink-0">
                        <Film size={14} className="text-dark-400" />
                      </div>
                      <span className="text-white font-medium truncate max-w-xs">{v.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-white">{formatNumber(v.views)}</td>
                  <td className="py-3 pr-4 text-right text-dark-200">{formatNumber(v.likes)}</td>
                  <td className="py-3 pr-4 text-right text-dark-200">{formatNumber(v.comments)}</td>
                  <td className="py-3 pr-4 text-right text-dark-200">{formatDuration(v.duration)}</td>
                  <td className="py-3 pr-4 text-dark-300 text-xs">{v.channelName}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      v.status === 'published' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' :
                      v.status === 'scheduled' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20' :
                      v.status === 'processing' ? 'bg-neon-orange/10 text-neon-orange border-neon-orange/20' :
                      v.status === 'copyright-check' ? 'bg-neon-orange/10 text-neon-orange border-neon-orange/20' :
                      'bg-dark-400/10 text-dark-200 border-dark-400/20'
                    }`}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* ═══════════════ AUDIENCE ═══════════════ */}
      {activeTab === 'Audience' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Groups */}
            <motion.div {...fadeUp(0)} className="glass-panel p-6">
              <h3 className="text-white font-semibold mb-1">Age Groups</h3>
              <p className="text-dark-300 text-xs mb-4">Viewer age demographics (%)</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGroups} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="group" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="male" name="Male" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Female" fill={COLORS.pink} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Device Types */}
            <motion.div {...fadeUp(0.05)} className="glass-panel p-6">
              <h3 className="text-white font-semibold mb-1">Device Types</h3>
              <p className="text-dark-300 text-xs mb-4">How viewers watch your content</p>
              <div className="flex items-center gap-6">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deviceTypes} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                        {deviceTypes.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<GlassTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {deviceTypes.map((d) => {
                    const Icon = d.name === 'Mobile' ? Smartphone : d.name === 'Desktop' ? Monitor : d.name === 'Tablet' ? Tablet : Globe;
                    return (
                      <div key={d.name} className="flex items-center gap-2">
                        <Icon size={14} style={{ color: d.color }} />
                        <span className="text-sm text-dark-200">{d.name}</span>
                        <span className="text-sm text-white font-semibold">{d.value}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Geography */}
          <motion.div {...fadeUp(0.1)} className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-1">Top Countries</h3>
            <p className="text-dark-300 text-xs mb-4">Where your viewers are located</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCountries} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fill: '#d1d5db', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar dataKey="views" fill={COLORS.cyan} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ REVENUE ═══════════════ */}
      {activeTab === 'Revenue' && (
        <div className="space-y-6">
          {/* Revenue stat cards */}
          <motion.div {...fadeUp(0)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign size={18} />}
              label="Estimated Earnings (28d)"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              change="+14.2%"
              changeType="positive"
              color="green"
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="RPM"
              value={stats.totalViews > 0 ? `$${((stats.totalRevenue / stats.totalViews) * 1000).toFixed(2)}` : '$0.00'}
              change="+6.1%"
              changeType="positive"
              color="blue"
            />
            <StatCard
              icon={<BarChart3 size={18} />}
              label="CPM"
              value={stats.totalImpressions > 0 ? `$${((stats.totalRevenue / stats.totalImpressions) * 1000).toFixed(2)}` : '$0.00'}
              change="+2.8%"
              changeType="positive"
              color="purple"
            />
            <StatCard
              icon={<Eye size={18} />}
              label="Monetized Playbacks"
              value={formatNumber(Math.round(stats.totalViews * 0.62))}
              change="+10.5%"
              changeType="positive"
              color="cyan"
            />
          </motion.div>

          {/* Revenue trend chart */}
          <motion.div {...fadeUp(0.1)} className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-1">Revenue Trend</h3>
            <p className="text-dark-300 text-xs mb-4">Daily estimated revenue ($)</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<GlassTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.green} strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Estimated earnings card */}
          <motion.div {...fadeUp(0.15)} className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-3">Estimated Earnings Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-dark-300 text-xs mb-1">This Month</p>
                <p className="text-xl font-bold text-neon-green">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-dark-300 text-xs mb-1">Projected Monthly</p>
                <p className="text-xl font-bold text-white">${(stats.totalRevenue * 1.08).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-dark-300 text-xs mb-1">Avg Daily</p>
                <p className="text-xl font-bold text-white">${(stats.totalRevenue / 30).toFixed(2)}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
              <p className="text-xs text-dark-300">
                <span className="text-neon-blue font-medium">Note:</span> Revenue data is estimated and may differ from final YouTube payments. Actual earnings depend on ad rates, viewer geography, and YouTube's revenue share policy. Data typically has a 48–72 hour delay.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudioAnalytics;
