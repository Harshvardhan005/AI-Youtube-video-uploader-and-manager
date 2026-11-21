import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Search, Eye, Trash2, Plus, TrendingUp, TrendingDown, ExternalLink, BarChart3, Video } from 'lucide-react';
import { PageHeader, formatNumber } from '@/components/ui';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

// ─── Mock Data ───

const sparklineData = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    w: i,
    v: Math.floor(3000 + Math.sin(i * 0.8 + seed) * 1500 + Math.random() * 800),
  }));

interface Competitor {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  subscribers: number;
  uploadFrequency: string;
  avgViews: number;
  growthPct: number;
  sparkline: { w: number; v: number }[];
}

const mockCompetitors: Competitor[] = [
  {
    id: 'c1',
    name: 'FutureTech Daily',
    initials: 'FT',
    gradient: 'from-blue-500 to-cyan-400',
    subscribers: 412000,
    uploadFrequency: '3 videos/week',
    avgViews: 38200,
    growthPct: 12.4,
    sparkline: sparklineData(1),
  },
  {
    id: 'c2',
    name: 'ByteSize Reviews',
    initials: 'BR',
    gradient: 'from-purple-500 to-pink-400',
    subscribers: 289000,
    uploadFrequency: '5 videos/week',
    avgViews: 24500,
    growthPct: 8.7,
    sparkline: sparklineData(2),
  },
  {
    id: 'c3',
    name: 'GadgetGuru',
    initials: 'GG',
    gradient: 'from-orange-500 to-yellow-400',
    subscribers: 745000,
    uploadFrequency: '2 videos/week',
    avgViews: 92100,
    growthPct: -2.1,
    sparkline: sparklineData(3),
  },
];

const gapAnalysis = [
  { topic: 'AI Code Assistants Comparison', competitors: ['FutureTech Daily', 'ByteSize Reviews'], yourCoverage: 'None', score: 94 },
  { topic: 'Smart Ring Reviews 2027', competitors: ['GadgetGuru'], yourCoverage: 'None', score: 87 },
  { topic: 'Linux Gaming Performance', competitors: ['ByteSize Reviews', 'GadgetGuru'], yourCoverage: 'None', score: 82 },
  { topic: 'Raspberry Pi 6 Projects', competitors: ['FutureTech Daily'], yourCoverage: 'None', score: 76 },
  { topic: 'EV Battery Tech Explained', competitors: ['FutureTech Daily', 'GadgetGuru'], yourCoverage: 'None', score: 71 },
];

const compPerformance = [
  { name: 'You', avgViews: 45200 },
  { name: 'FutureTech Daily', avgViews: 38200 },
  { name: 'ByteSize Reviews', avgViews: 24500 },
  { name: 'GadgetGuru', avgViews: 92100 },
];

const recentCompetitorUploads = [
  { id: 'ru1', channel: 'FutureTech Daily', title: 'GPT-5 First Look — Is It Worth the Hype?', views: 64300, timeAgo: '2h ago' },
  { id: 'ru2', channel: 'GadgetGuru', title: 'The $200 Laptop That Does Everything', views: 128400, timeAgo: '5h ago' },
  { id: 'ru3', channel: 'ByteSize Reviews', title: 'Best Budget Monitors 2027', views: 18900, timeAgo: '8h ago' },
  { id: 'ru4', channel: 'FutureTech Daily', title: 'How I Automated My Entire Workflow', views: 42100, timeAgo: '1d ago' },
  { id: 'ru5', channel: 'GadgetGuru', title: 'Apple Vision Pro 3 — Hands On', views: 215000, timeAgo: '1d ago' },
];

// ─── Component ───

const CompetitorIntel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        icon={<Swords size={22} />}
        title="Competitor Intelligence"
        subtitle="Research public competitors and find content opportunities"
      />

      {/* ── Tracked Competitors ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Tracked Competitors</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockCompetitors.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-5 space-y-4"
            >
              {/* Top row */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{c.name}</p>
                  <p className="text-dark-300 text-xs">{formatNumber(c.subscribers)} subscribers</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                  {c.uploadFrequency}
                </span>
                <span className="text-xs text-dark-300">
                  Avg {formatNumber(c.avgViews)} views
                </span>
              </div>

              {/* Sparkline */}
              <div className="h-[50px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={c.sparkline}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={c.growthPct >= 0 ? '#22c55e' : '#ef4444'}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Growth */}
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1 text-sm font-medium ${c.growthPct >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {c.growthPct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {c.growthPct >= 0 ? '+' : ''}{c.growthPct}% growth
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button className="glass-button text-xs flex-1 flex items-center justify-center gap-1.5">
                  <Eye size={13} /> View Analysis
                </button>
                <button className="glass-button text-xs px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Add Competitor ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Add Competitor</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by channel name or URL..."
              className="glass-input pl-10"
            />
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
            <Plus size={16} /> Track
          </button>
        </div>
      </motion.section>

      {/* ── Content Gap Analysis ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Content Gap Analysis</h2>
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Topic</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Competitor Coverage</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Your Coverage</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Opportunity Score</th>
                </tr>
              </thead>
              <tbody>
                {gapAnalysis.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{row.topic}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {row.competitors.map((c) => (
                          <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-red-400 text-xs">{row.yourCoverage}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-cyan"
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                        <span className="text-neon-green text-xs font-medium">{row.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ── Comparative Performance ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-neon-blue" /> Comparative Performance
        </h2>
        <div className="glass-panel p-5">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={compPerformance} barSize={40}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatNumber(v)} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                formatter={(v: number) => [formatNumber(v), 'Avg Views']}
              />
              <Bar dataKey="avgViews" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* ── Recent Competitor Uploads ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Video size={18} className="text-neon-cyan" /> Recent Competitor Uploads
        </h2>
        <div className="space-y-3">
          {recentCompetitorUploads.map((v) => (
            <div key={v.id} className="glass-panel-hover p-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium truncate">{v.title}</p>
                <p className="text-dark-300 text-xs mt-0.5">{v.channel} • {v.timeAgo}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-dark-200 text-sm flex items-center gap-1">
                  <Eye size={13} /> {formatNumber(v.views)}
                </span>
                <button className="text-dark-400 hover:text-neon-blue transition-colors">
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default CompetitorIntel;
