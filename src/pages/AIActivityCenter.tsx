import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Activity, Cpu, CheckCircle, XCircle, Loader,
  Clock, Zap, TrendingUp, Calendar, BarChart3, Lightbulb,
  Target, Users, ThumbsUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, AICoreOrb, StatusBadge, timeAgo } from '@/components/ui';

type FilterType = 'All' | 'Running' | 'Completed' | 'Failed';

const aiInsights = [
  {
    id: 'ins-1',
    icon: <Clock size={20} />,
    title: 'Best Posting Times',
    detail: 'Videos posted between 2 PM – 5 PM EST get 38% more impressions in the first hour.',
    color: 'text-neon-blue',
    borderColor: 'border-neon-blue/20',
  },
  {
    id: 'ins-2',
    icon: <TrendingUp size={20} />,
    title: 'Top-Performing Title Pattern',
    detail: 'Titles with a number + power word ("7 Secrets", "5 Hacks") average 2.4× higher CTR.',
    color: 'text-neon-purple',
    borderColor: 'border-neon-purple/20',
  },
  {
    id: 'ins-3',
    icon: <Users size={20} />,
    title: 'Audience Preference',
    detail: 'Your viewers engage 52% more with tutorials (10-15 min) vs. short-form clips.',
    color: 'text-neon-cyan',
    borderColor: 'border-neon-cyan/20',
  },
  {
    id: 'ins-4',
    icon: <ThumbsUp size={20} />,
    title: 'Thumbnail Insight',
    detail: 'Thumbnails featuring close-up faces with contrasting backgrounds boost CTR by 27%.',
    color: 'text-neon-green',
    borderColor: 'border-neon-green/20',
  },
  {
    id: 'ins-5',
    icon: <Target size={20} />,
    title: 'Tag Strategy',
    detail: 'Using 8-12 tags mixing broad + niche keywords yields the best discoverability score.',
    color: 'text-neon-orange',
    borderColor: 'border-neon-orange/20',
  },
];

const AIActivityCenter: React.FC = () => {
  const { aiActivities, videos } = useStore();
  const [filter, setFilter] = useState<FilterType>('All');

  const filters: FilterType[] = ['All', 'Running', 'Completed', 'Failed'];

  const filteredActivities = useMemo(() => {
    if (filter === 'All') return aiActivities;
    return aiActivities.filter(
      (a) => a.status === filter.toLowerCase(),
    );
  }, [aiActivities, filter]);

  const runningTasks = aiActivities.filter((a) => a.status === 'running');
  const completedToday = aiActivities.filter((a) => {
    const ts = new Date(a.timestamp);
    const now = new Date();
    return a.status === 'completed' && ts.toDateString() === now.toDateString();
  });
  const totalCompleted = aiActivities.filter((a) => a.status === 'completed').length;
  const totalFailed = aiActivities.filter((a) => a.status === 'failed').length;
  const successRate = totalCompleted + totalFailed > 0
    ? Math.round((totalCompleted / (totalCompleted + totalFailed)) * 100)
    : 100;

  const getVideoTitle = (videoId?: string) => {
    if (!videoId) return null;
    return videos.find((v) => v.id === videoId)?.title;
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader size={16} className="text-neon-cyan animate-spin" />;
      case 'completed':
        return <CheckCircle size={16} className="text-neon-green" />;
      case 'failed':
        return <XCircle size={16} className="text-neon-red" />;
      default:
        return <Activity size={16} className="text-dark-300" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        icon={<Brain size={24} />}
        title="AI Activity Center"
        subtitle="Monitor all autonomous AI operations"
      />

      {/* AI Core Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8"
      >
        <div className="flex flex-col items-center text-center">
          <AICoreOrb size={140} className="mb-6" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" />
            <span className="text-lg font-semibold text-white">AI Engine Active</span>
          </div>
          <p className="text-dark-300 text-sm mb-8">All systems operational — processing autonomously</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl">
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-neon-cyan mb-1">{runningTasks.length}</div>
              <div className="text-dark-300 text-xs font-medium">Tasks Running</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-neon-green mb-1">{completedToday.length}</div>
              <div className="text-dark-300 text-xs font-medium">Completed Today</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-neon-purple mb-1">{successRate}%</div>
              <div className="text-dark-300 text-xs font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity size={18} className="text-neon-blue" />
              Activity Timeline
            </h2>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filter === f
                      ? 'bg-white/[0.1] text-white'
                      : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/30 via-neon-purple/20 to-transparent" />

            <AnimatePresence mode="popLayout">
              {filteredActivities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-8 ml-10 text-center"
                >
                  <Activity size={32} className="text-dark-400 mx-auto mb-3" />
                  <p className="text-dark-300 text-sm">No activities match this filter</p>
                </motion.div>
              ) : (
                filteredActivities.map((activity, index) => {
                  const videoTitle = getVideoTitle(activity.videoId);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative pl-12 pb-4"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-3 top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activity.status === 'running'
                          ? 'border-neon-cyan bg-neon-cyan/20 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : activity.status === 'completed'
                          ? 'border-neon-green bg-neon-green/20'
                          : 'border-neon-red bg-neon-red/20'
                      }`}>
                        {activity.status === 'running' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        )}
                      </div>

                      <div className="glass-panel-hover p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-dark-400">{timeAgo(activity.timestamp)}</span>
                              <StatusBadge status={activity.status} />
                            </div>
                            <div className="text-white font-semibold text-sm">{activity.action}</div>
                            <p className="text-dark-300 text-xs mt-1">{activity.details}</p>
                            {videoTitle && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <BarChart3 size={12} className="text-neon-purple" />
                                <span className="text-xs text-neon-purple/80">{videoTitle}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1">{statusIcon(activity.status)}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Active Processes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-5"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Cpu size={16} className="text-neon-cyan" />
              Active Processes
            </h3>
            {runningTasks.length === 0 ? (
              <p className="text-dark-400 text-xs text-center py-4">No active processes</p>
            ) : (
              <div className="space-y-3">
                {runningTasks.map((task) => (
                  <div key={task.id} className="glass-panel p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-xs font-medium truncate">{task.action}</span>
                      <Loader size={14} className="text-neon-cyan animate-spin flex-shrink-0" />
                    </div>
                    <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full"
                        initial={{ width: '20%' }}
                        animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                    <p className="text-dark-400 text-[10px] mt-1.5 truncate">{task.details}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* AI Memory / Learning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel p-5"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Lightbulb size={16} className="text-neon-purple" />
              AI Memory & Learning
            </h3>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                  className={`glass-panel p-3 border-l-2 ${insight.borderColor}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 ${insight.color} flex-shrink-0`}>{insight.icon}</div>
                    <div>
                      <div className="text-white text-xs font-semibold mb-0.5">{insight.title}</div>
                      <p className="text-dark-300 text-[11px] leading-relaxed">{insight.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIActivityCenter;
