import React, { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clock, Sparkles, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, timeAgo } from '@/components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const OPTIMAL_SLOTS = [
  { hour: 9, label: '9:00 AM', reason: 'Morning peak engagement' },
  { hour: 14, label: '2:00 PM', reason: 'Post-lunch viewership surge' },
  { hour: 17, label: '5:00 PM', reason: 'After-work / school traffic' },
  { hour: 20, label: '8:00 PM', reason: 'Prime-time — highest CTR' },
];

const channelColors: Record<string, string> = {
  'ch-1': 'bg-neon-blue',
  'ch-2': 'bg-neon-purple',
  'ch-3': 'bg-neon-green',
};

const PublishingCalendar: React.FC = () => {
  const { videos, setCurrentPage } = useStore();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [currentMonth, currentYear]);

  // Map dates to videos
  const videosByDate = useMemo(() => {
    const map: Record<string, typeof videos> = {};
    videos.forEach((v) => {
      if (!v.publishDate) return;
      const d = new Date(v.publishDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(v);
    });
    return map;
  }, [videos]);

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const upcomingVideos = useMemo(() => {
    return [...videos]
      .filter((v) => v.publishDate && new Date(v.publishDate).getTime() >= Date.now() - 86400000 * 2)
      .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
      .slice(0, 8);
  }, [videos]);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<CalendarDays size={22} />}
        title="Publishing Calendar"
        subtitle="Schedule and track your publishing pipeline"
        actions={
          <button
            onClick={() => setCurrentPage('upload')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-200"
          >
            <Plus size={16} />
            Schedule New
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ── Calendar Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel p-5"
        >
          {/* Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/[0.06] text-dark-300 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">{monthLabel}</h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/[0.06] text-dark-300 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-dark-400 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-white/[0.01]" />;
              }

              const dateKey = `${currentYear}-${currentMonth}-${day}`;
              const dayVideos = videosByDate[dateKey] || [];
              const todayHighlight = isToday(day);

              return (
                <motion.div
                  key={`day-${day}`}
                  whileHover={{ scale: 1.04 }}
                  className={`aspect-square rounded-lg p-1.5 flex flex-col items-center transition-colors cursor-default ${
                    todayHighlight
                      ? 'border border-neon-blue shadow-[0_0_12px_rgba(59,130,246,0.25)] bg-neon-blue/[0.06]'
                      : 'glass-panel hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      todayHighlight ? 'text-neon-blue' : 'text-dark-200'
                    }`}
                  >
                    {day}
                  </span>
                  {dayVideos.length > 0 && (
                    <div className="flex gap-0.5 mt-auto mb-0.5 flex-wrap justify-center">
                      {dayVideos.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className={`w-1.5 h-1.5 rounded-full ${channelColors[v.channelId] || 'bg-neon-blue'}`}
                          title={v.title}
                        />
                      ))}
                      {dayVideos.length > 3 && (
                        <span className="text-[8px] text-dark-300">+{dayVideos.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-dark-400">Channels:</span>
            {Object.entries(channelColors).map(([id, color]) => {
              const ch = useStore.getState().channels.find((c) => c.id === id);
              return ch ? (
                <div key={id} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs text-dark-300">{ch.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </motion.div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel p-5"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Video size={15} className="text-neon-blue" />
              Upcoming
            </h3>

            {upcomingVideos.length === 0 ? (
              <p className="text-xs text-dark-400 text-center py-6">No upcoming scheduled videos</p>
            ) : (
              <div className="space-y-3">
                {upcomingVideos.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <span className="text-sm font-medium text-white leading-tight truncate">{v.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-dark-400">
                        {v.publishDate
                          ? new Date(v.publishDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </span>
                      <span className="text-[11px] text-dark-400">
                        {v.publishDate
                          ? new Date(v.publishDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${channelColors[v.channelId] || 'bg-neon-blue'}`}
                      />
                      <span className="text-[11px] text-dark-300">{v.channelName}</span>
                      <StatusBadge status={v.status} className="ml-auto" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Optimal Schedule Slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-panel p-5"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Sparkles size={15} className="text-neon-green" />
              AI Recommended Slots
            </h3>
            <div className="space-y-2">
              {OPTIMAL_SLOTS.map((slot) => (
                <div
                  key={slot.hour}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-neon-green/[0.04] border border-neon-green/[0.08] hover:bg-neon-green/[0.07] transition-colors"
                >
                  <Clock size={14} className="text-neon-green shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-white block">{slot.label}</span>
                    <span className="text-[11px] text-dark-400">{slot.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublishingCalendar;
