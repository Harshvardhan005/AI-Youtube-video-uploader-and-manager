import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, Search,
  Lightbulb, Zap, Video, BarChart3,
} from 'lucide-react';
import { PageHeader, Tabs, formatNumber } from '@/components/ui';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Mock Data ───

interface Trend {
  id: string;
  topic: string;
  category: string;
  growthPct: number;
  interest: number; // 0–100
}

const mockTrends: Trend[] = [
  { id: 't1', topic: 'AI Code Agents', category: 'Technology', growthPct: 142, interest: 95 },
  { id: 't2', topic: 'Elden Ring DLC #2', category: 'Gaming', growthPct: 89, interest: 88 },
  { id: 't3', topic: 'Spatial Computing Apps', category: 'Technology', growthPct: 67, interest: 72 },
  { id: 't4', topic: 'Lo-Fi Study Beats Live', category: 'Entertainment', growthPct: 34, interest: 65 },
  { id: 't5', topic: 'Micro-Credentials vs Degrees', category: 'Education', growthPct: 58, interest: 80 },
  { id: 't6', topic: 'Smart Ring Showdown', category: 'Technology', growthPct: 76, interest: 83 },
  { id: 't7', topic: 'Morning Routine Hacks 2027', category: 'Lifestyle', growthPct: 29, interest: 55 },
  { id: 't8', topic: 'Indie Game Hidden Gems', category: 'Gaming', growthPct: 45, interest: 61 },
];

const categories = ['All', 'Technology', 'Gaming', 'Entertainment', 'Education', 'Lifestyle'];

const generate30DayData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    'AI Code Agents': Math.floor(40 + i * 1.8 + Math.sin(i * 0.6) * 10 + Math.random() * 8),
    'Elden Ring DLC #2': Math.floor(20 + Math.max(0, (i - 15) * 4) + Math.random() * 12),
    'Smart Ring Showdown': Math.floor(30 + i * 1.2 + Math.cos(i * 0.4) * 8 + Math.random() * 6),
  }));

const trendChartData = generate30DayData();

interface ContentOpp {
  id: string;
  title: string;
  estimatedViews: string;
  competition: 'Low' | 'Medium' | 'High';
  reasoning: string;
}

const contentOpportunities: ContentOpp[] = [
  { id: 'o1', title: '5 AI Code Agents That Replace Junior Devs', estimatedViews: '80K–150K', competition: 'Medium', reasoning: 'Trending topic with high search volume; medium competition leaves room for unique angles.' },
  { id: 'o2', title: 'I Tried Every Smart Ring — Here\'s the Best', estimatedViews: '120K–250K', competition: 'Low', reasoning: 'Very few comprehensive comparison videos exist; high purchase intent drives watch time.' },
  { id: 'o3', title: 'Are Micro-Credentials Worth It in 2027?', estimatedViews: '50K–90K', competition: 'Low', reasoning: 'Education niche with passionate audience; low competition and rising search interest.' },
  { id: 'o4', title: 'Elden Ring DLC #2 — Everything We Know', estimatedViews: '200K–500K', competition: 'High', reasoning: 'Massive search demand; first-mover advantage is key — publish within 48 hours of announcement.' },
  { id: 'o5', title: 'Build a Spatial Computing App in 30 Minutes', estimatedViews: '60K–110K', competition: 'Low', reasoning: 'Tutorial gap: many concept videos exist but very few step-by-step builds.' },
];

const keywordResults = [
  { keyword: 'ai code agent', searches: '246K', competition: 'Medium', suggestedTitle: 'Best AI Code Agents Compared (2027)' },
  { keyword: 'smart ring review', searches: '189K', competition: 'Low', suggestedTitle: 'Smart Ring Buyer\'s Guide — Every Option Tested' },
  { keyword: 'elden ring dlc 2 release', searches: '410K', competition: 'High', suggestedTitle: 'Elden Ring DLC 2 Release Date & Trailer Breakdown' },
  { keyword: 'spatial computing tutorial', searches: '74K', competition: 'Low', suggestedTitle: 'Your First Spatial Computing App — Beginner Guide' },
  { keyword: 'micro credentials vs degree', searches: '132K', competition: 'Low', suggestedTitle: 'Micro-Credentials vs College Degree: What Employers Want' },
];

// ─── Component ───

const categoryColors: Record<string, string> = {
  Technology: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
  Gaming: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
  Entertainment: 'bg-neon-pink/10 text-neon-pink border-neon-pink/20',
  Education: 'bg-neon-green/10 text-neon-green border-neon-green/20',
  Lifestyle: 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
};

const competitionColor: Record<string, string> = {
  Low: 'text-neon-green',
  Medium: 'text-neon-orange',
  High: 'text-neon-red',
};

const TrendResearch: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [kwSearch, setKwSearch] = useState('');

  const filteredTrends = activeCategory === 'All'
    ? mockTrends
    : mockTrends.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        icon={<TrendingUp size={22} />}
        title="Trend Research"
        subtitle="Discover trending topics and content opportunities"
      />

      {/* ── Category Filter ── */}
      <Tabs tabs={categories} active={activeCategory} onChange={setActiveCategory} />

      {/* ── Trending Now ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-neon-orange" /> Trending Now
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTrends.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-panel p-4 flex flex-col justify-between gap-3"
            >
              <div>
                <p className="text-white font-semibold text-sm leading-tight mb-2">{t.topic}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[t.category] || 'text-dark-300 border-dark-400/20 bg-dark-400/10'}`}>
                  {t.category}
                </span>
              </div>

              {/* Growth */}
              <div className="flex items-center gap-1">
                {t.growthPct >= 0 ? (
                  <ArrowUpRight size={14} className="text-neon-green" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
                <span className={`text-sm font-bold ${t.growthPct >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  +{t.growthPct}%
                </span>
              </div>

              {/* Interest bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-dark-300">Interest</span>
                  <span className="text-[10px] text-dark-200">{t.interest}%</span>
                </div>
                <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                    style={{ width: `${t.interest}%` }}
                  />
                </div>
              </div>

              <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-white/[0.06] text-xs text-white hover:from-neon-blue/20 hover:to-neon-purple/20 transition-all flex items-center justify-center gap-1.5">
                <Video size={12} /> Create Video
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trend Analysis Chart ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-neon-blue" /> Trend Analysis — Interest Over Time
        </h2>
        <div className="glass-panel p-5">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendChartData}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }} />
              <Area type="monotone" dataKey="AI Code Agents" stroke="#3b82f6" strokeWidth={2} fill="url(#gradBlue)" />
              <Area type="monotone" dataKey="Elden Ring DLC #2" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradPurple)" />
              <Area type="monotone" dataKey="Smart Ring Showdown" stroke="#06b6d4" strokeWidth={2} fill="url(#gradCyan)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-0.5 rounded bg-blue-500 inline-block" /> AI Code Agents</span>
            <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-0.5 rounded bg-purple-500 inline-block" /> Elden Ring DLC #2</span>
            <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-0.5 rounded bg-cyan-500 inline-block" /> Smart Ring Showdown</span>
          </div>
        </div>
      </motion.section>

      {/* ── Content Opportunities ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={18} className="text-neon-orange" /> Content Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {contentOpportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + idx * 0.07 }}
              className="glass-panel p-5 space-y-3"
            >
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-neon-purple mt-0.5 shrink-0" />
                <p className="text-white font-semibold text-sm leading-snug">{opp.title}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-dark-300">Est. Views: <span className="text-white font-medium">{opp.estimatedViews}</span></span>
                <span className="text-dark-300">Competition: <span className={`font-medium ${competitionColor[opp.competition]}`}>{opp.competition}</span></span>
              </div>
              <p className="text-dark-400 text-xs leading-relaxed">{opp.reasoning}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Keyword Research ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Search size={18} className="text-neon-cyan" /> Keyword Research
        </h2>

        <div className="mb-4">
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              value={kwSearch}
              onChange={(e) => setKwSearch(e.target.value)}
              placeholder="Search keywords…"
              className="glass-input pl-10"
            />
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Keyword</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Monthly Searches</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Competition</th>
                  <th className="text-left text-dark-300 font-medium px-5 py-3">Suggested Title</th>
                </tr>
              </thead>
              <tbody>
                {keywordResults
                  .filter((kw) => !kwSearch || kw.keyword.toLowerCase().includes(kwSearch.toLowerCase()))
                  .map((kw, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-white font-medium">{kw.keyword}</td>
                      <td className="px-5 py-3 text-dark-200">{kw.searches}</td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${competitionColor[kw.competition]}`}>{kw.competition}</span>
                      </td>
                      <td className="px-5 py-3 text-dark-300 italic">{kw.suggestedTitle}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TrendResearch;
