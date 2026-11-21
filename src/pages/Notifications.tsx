import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertTriangle, XCircle, Info, Shield,
  CheckCheck,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, timeAgo } from '@/components/ui';

type NotifFilter = 'All' | 'Unread' | 'Success' | 'Warnings' | 'Errors';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; borderColor: string; bgColor: string }> = {
  success: {
    icon: <CheckCircle size={20} />,
    color: 'text-neon-green',
    borderColor: 'border-l-neon-green',
    bgColor: 'shadow-[inset_0_0_30px_rgba(34,197,94,0.03)]',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    color: 'text-neon-orange',
    borderColor: 'border-l-neon-orange',
    bgColor: 'shadow-[inset_0_0_30px_rgba(249,115,22,0.03)]',
  },
  error: {
    icon: <XCircle size={20} />,
    color: 'text-neon-red',
    borderColor: 'border-l-neon-red',
    bgColor: 'shadow-[inset_0_0_30px_rgba(239,68,68,0.03)]',
  },
  info: {
    icon: <Info size={20} />,
    color: 'text-neon-blue',
    borderColor: 'border-l-neon-blue',
    bgColor: 'shadow-[inset_0_0_30px_rgba(59,130,246,0.03)]',
  },
  copyright: {
    icon: <Shield size={20} />,
    color: 'text-neon-purple',
    borderColor: 'border-l-neon-purple',
    bgColor: 'shadow-[inset_0_0_30px_rgba(139,92,246,0.03)]',
  },
};

const filterToType: Record<NotifFilter, string | null> = {
  All: null,
  Unread: 'unread',
  Success: 'success',
  Warnings: 'warning',
  Errors: 'error',
};

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [filter, setFilter] = useState<NotifFilter>('All');

  const filters: NotifFilter[] = ['All', 'Unread', 'Success', 'Warnings', 'Errors'];

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'Unread':
        return notifications.filter((n) => !n.read);
      case 'Success':
        return notifications.filter((n) => n.type === 'success');
      case 'Warnings':
        return notifications.filter((n) => n.type === 'warning' || n.type === 'copyright');
      case 'Errors':
        return notifications.filter((n) => n.type === 'error');
      default:
        return notifications;
    }
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={<Bell size={24} />}
        title="Notifications"
        subtitle="Stay updated on all activity"
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="glass-button flex items-center gap-2 text-sm"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
          ) : undefined
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit"
      >
        {filters.map((f) => {
          const count =
            f === 'Unread'
              ? unreadCount
              : f === 'All'
              ? notifications.length
              : f === 'Success'
              ? notifications.filter((n) => n.type === 'success').length
              : f === 'Warnings'
              ? notifications.filter((n) => n.type === 'warning' || n.type === 'copyright').length
              : notifications.filter((n) => n.type === 'error').length;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-white/[0.1] text-white'
                  : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {f}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === f ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-dark-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Notification List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-16 flex flex-col items-center justify-center text-center"
            >
              <div className="p-4 rounded-full bg-white/[0.04] mb-4">
                <Bell size={40} className="text-dark-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
              <p className="text-dark-400 text-sm">No notifications to show right now.</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const config = typeConfig[notification.type] || typeConfig.info;
              const isUnread = !notification.read;

              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <button
                    onClick={() => markNotificationRead(notification.id)}
                    className={`w-full text-left glass-panel-hover p-4 border-l-[3px] transition-all duration-300 ${
                      config.borderColor
                    } ${
                      isUnread
                        ? `bg-white/[0.05] ${config.bgColor}`
                        : 'bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type icon */}
                      <div className={`mt-0.5 flex-shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`font-semibold text-sm ${isUnread ? 'text-white' : 'text-dark-200'}`}>
                            {notification.title}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed ${isUnread ? 'text-dark-200' : 'text-dark-400'}`}>
                          {notification.message}
                        </p>
                        <span className="text-dark-500 text-[11px] mt-1.5 inline-block">
                          {timeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
