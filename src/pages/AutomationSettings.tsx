import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings2, AlertTriangle, Shield, ShieldCheck, ShieldAlert,
  Image, Bell, Mail, Monitor, Eye, Upload, Clock, Globe,
  FolderOpen, Pause, Play, CheckCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, ToggleSwitch, StatusBadge, timeAgo } from '@/components/ui';

const youtubeCategories = [
  'Science & Technology', 'Gaming', 'Entertainment', 'Education',
  'People & Blogs', 'Music', 'Film & Animation', 'News & Politics',
  'Howto & Style', 'Comedy', 'Sports', 'Autos & Vehicles',
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'hi', label: 'Hindi' },
  { value: 'zh', label: 'Chinese' },
];

const hours = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${i.toString().padStart(2, '0')}:00`,
}));

const copyrightPolicies = [
  {
    id: 'strict' as const,
    icon: <ShieldCheck size={24} />,
    title: 'Strict',
    description: 'Block any video with potential copyright issues. Maximum safety — never risk a strike.',
    color: 'text-neon-green',
    border: 'border-neon-green/30',
    bg: 'bg-neon-green/5',
  },
  {
    id: 'moderate' as const,
    icon: <Shield size={24} />,
    title: 'Moderate',
    description: 'Warn on potential issues but allow publishing with low-risk claims. Good balance.',
    color: 'text-neon-blue',
    border: 'border-neon-blue/30',
    bg: 'bg-neon-blue/5',
  },
  {
    id: 'permissive' as const,
    icon: <ShieldAlert size={24} />,
    title: 'Permissive',
    description: 'Publish unless a hard block is detected. Higher risk but fewer delays.',
    color: 'text-neon-orange',
    border: 'border-neon-orange/30',
    bg: 'bg-neon-orange/5',
  },
];

const mockAuditLog = [
  { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), video: 'Next-Gen AI Tools You Need in 2027', channel: 'TechVision Pro', action: 'Published', status: 'success' as const },
  { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), video: 'Building a Smart Home from Scratch', channel: 'TechVision Pro', action: 'Upload Started', status: 'running' as const },
  { id: 3, timestamp: new Date(Date.now() - 10800000).toISOString(), video: 'Epic Boss Fight Compilation', channel: 'Gaming Universe', action: 'Copyright Hold', status: 'warning' as const },
  { id: 4, timestamp: new Date(Date.now() - 14400000).toISOString(), video: 'Morning Routine That Changed My Life', channel: 'Daily Vlogs', action: 'Scheduled', status: 'scheduled' as const },
  { id: 5, timestamp: new Date(Date.now() - 86400000).toISOString(), video: 'React Tips & Tricks 2027', channel: 'TechVision Pro', action: 'Published', status: 'success' as const },
  { id: 6, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), video: 'Top 10 Indie Games', channel: 'Gaming Universe', action: 'Published', status: 'success' as const },
  { id: 7, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), video: 'Weekend Vlog: Mountain Hike', channel: 'Daily Vlogs', action: 'Published', status: 'success' as const },
  { id: 8, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), video: 'AI Art Generation Guide', channel: 'TechVision Pro', action: 'Failed Upload', status: 'failed' as const },
  { id: 9, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), video: 'Speedrun Challenge Pt.3', channel: 'Gaming Universe', action: 'Published', status: 'success' as const },
  { id: 10, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), video: 'Coffee Shop Tour Tokyo', channel: 'Daily Vlogs', action: 'Published', status: 'success' as const },
];

const AutomationSettings: React.FC = () => {
  const { automation, updateAutomation } = useStore();
  const [thumbnailStyle, setThumbnailStyle] = useState('cinematic');

  const [eventToggles, setEventToggles] = useState({
    onPublish: true,
    onCopyrightWarning: true,
    onUploadFail: true,
    onScheduledPost: false,
    onMilestone: true,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Settings2 size={24} />}
        title="Automation Settings"
        subtitle="Configure your autonomous publishing rules"
      />

      {/* Autopilot Master Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`glass-panel p-6 border ${automation.autopilotEnabled ? 'border-neon-green/20' : 'border-white/[0.06]'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${automation.autopilotEnabled ? 'bg-neon-green/10' : 'bg-white/[0.04]'}`}>
              {automation.autopilotEnabled ? <Play size={24} className="text-neon-green" /> : <Pause size={24} className="text-dark-300" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Autopilot Master Control</h2>
              <p className="text-dark-300 text-sm mt-0.5">
                When enabled, AutoTube AI will analyze, optimize, and publish videos automatically based on your rules below.
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={automation.autopilotEnabled}
            onChange={(v) => updateAutomation({ autopilotEnabled: v })}
          />
        </div>
        {automation.autopilotEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex items-center gap-2 text-neon-green text-sm"
          >
            <CheckCircle size={16} />
            <span>Autopilot is active — videos will be published autonomously</span>
          </motion.div>
        )}
      </motion.div>

      {/* Global Emergency Pause */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <button
          onClick={() => updateAutomation({ globalPause: !automation.globalPause })}
          className={`w-full glass-panel p-5 flex items-center justify-center gap-3 transition-all duration-300 ${
            automation.globalPause
              ? 'border-neon-red/40 bg-neon-red/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
              : 'border-neon-red/10 hover:border-neon-red/30 hover:bg-neon-red/5'
          }`}
        >
          <AlertTriangle size={22} className="text-neon-red" />
          <span className="text-neon-red font-bold text-lg">
            {automation.globalPause ? '⏸ Publishing Paused — Click to Resume' : 'Emergency Pause All Publishing'}
          </span>
        </button>
      </motion.div>

      {/* Publishing Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
          <Upload size={18} className="text-neon-blue" />
          Publishing Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Visibility */}
          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <Eye size={14} className="inline mr-1.5 -mt-0.5" />
              Default Visibility
            </label>
            <select
              value={automation.defaultVisibility}
              onChange={(e) => updateAutomation({ defaultVisibility: e.target.value as any })}
              className="glass-input"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Max Uploads Per Day */}
          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <Upload size={14} className="inline mr-1.5 -mt-0.5" />
              Max Uploads Per Day
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={automation.maxUploadsPerDay}
              onChange={(e) => updateAutomation({ maxUploadsPerDay: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
              className="glass-input"
            />
          </div>

          {/* Allowed Publishing Hours */}
          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
              Publish Window — Start
            </label>
            <select
              value={automation.allowedHoursStart}
              onChange={(e) => updateAutomation({ allowedHoursStart: parseInt(e.target.value) })}
              className="glass-input"
            >
              {hours.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
              Publish Window — End
            </label>
            <select
              value={automation.allowedHoursEnd}
              onChange={(e) => updateAutomation({ allowedHoursEnd: parseInt(e.target.value) })}
              className="glass-input"
            >
              {hours.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          {/* Default Language */}
          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <Globe size={14} className="inline mr-1.5 -mt-0.5" />
              Default Language
            </label>
            <select
              value={automation.defaultLanguage}
              onChange={(e) => updateAutomation({ defaultLanguage: e.target.value })}
              className="glass-input"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Default Category */}
          <div>
            <label className="text-sm text-dark-200 font-medium block mb-2">
              <FolderOpen size={14} className="inline mr-1.5 -mt-0.5" />
              Default Category
            </label>
            <select
              value={automation.defaultCategory}
              onChange={(e) => updateAutomation({ defaultCategory: e.target.value })}
              className="glass-input"
            >
              {youtubeCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Copyright Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-panel p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
          <Shield size={18} className="text-neon-purple" />
          Copyright Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {copyrightPolicies.map((policy) => (
            <button
              key={policy.id}
              onClick={() => updateAutomation({ copyrightPolicy: policy.id })}
              className={`glass-panel p-5 text-left transition-all duration-300 ${
                automation.copyrightPolicy === policy.id
                  ? `${policy.border} ${policy.bg} shadow-lg`
                  : 'border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className={`mb-3 ${automation.copyrightPolicy === policy.id ? policy.color : 'text-dark-300'}`}>
                {policy.icon}
              </div>
              <div className={`font-semibold mb-1 ${automation.copyrightPolicy === policy.id ? 'text-white' : 'text-dark-200'}`}>
                {policy.title}
              </div>
              <p className="text-dark-400 text-xs leading-relaxed">{policy.description}</p>
              {automation.copyrightPolicy === policy.id && (
                <div className={`mt-3 text-xs font-medium ${policy.color} flex items-center gap-1`}>
                  <CheckCircle size={12} /> Active
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Thumbnail Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
          <Image size={18} className="text-neon-cyan" />
          Thumbnail Settings
        </h3>
        <div className="space-y-5">
          <ToggleSwitch
            enabled={automation.thumbnailAutoGenerate}
            onChange={(v) => updateAutomation({ thumbnailAutoGenerate: v })}
            label="Auto-Generate Thumbnails"
            description="AI will create eye-catching thumbnails for every uploaded video"
          />
          {automation.thumbnailAutoGenerate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="text-sm text-dark-200 font-medium block mb-2">Style Preference</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['cinematic', 'bold-text', 'minimal', 'vibrant'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setThumbnailStyle(style)}
                    className={`glass-panel p-3 text-center text-xs font-medium transition-all duration-200 ${
                      thumbnailStyle === style
                        ? 'border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan'
                        : 'text-dark-300 hover:text-white hover:border-white/[0.12]'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="glass-panel p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
          <Bell size={18} className="text-neon-orange" />
          Notification Preferences
        </h3>

        <div className="space-y-4 mb-6">
          <ToggleSwitch
            enabled={automation.desktopNotifications}
            onChange={(v) => updateAutomation({ desktopNotifications: v })}
            label="Desktop Notifications"
            description="Show system notifications for important events"
          />
          <ToggleSwitch
            enabled={automation.emailNotifications}
            onChange={(v) => updateAutomation({ emailNotifications: v })}
            label="Email Notifications"
            description="Receive email summaries of publishing activity"
          />
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <div className="text-sm text-dark-200 font-medium mb-3">Per-Event Notifications</div>
          <div className="space-y-3">
            <ToggleSwitch
              enabled={eventToggles.onPublish}
              onChange={(v) => setEventToggles((s) => ({ ...s, onPublish: v }))}
              label="Video Published"
              description="When a video goes live on YouTube"
            />
            <ToggleSwitch
              enabled={eventToggles.onCopyrightWarning}
              onChange={(v) => setEventToggles((s) => ({ ...s, onCopyrightWarning: v }))}
              label="Copyright Warning"
              description="When a potential copyright issue is detected"
            />
            <ToggleSwitch
              enabled={eventToggles.onUploadFail}
              onChange={(v) => setEventToggles((s) => ({ ...s, onUploadFail: v }))}
              label="Upload Failed"
              description="When an upload or processing step fails"
            />
            <ToggleSwitch
              enabled={eventToggles.onScheduledPost}
              onChange={(v) => setEventToggles((s) => ({ ...s, onScheduledPost: v }))}
              label="Scheduled Post Reminder"
              description="30 minutes before a scheduled video goes live"
            />
            <ToggleSwitch
              enabled={eventToggles.onMilestone}
              onChange={(v) => setEventToggles((s) => ({ ...s, onMilestone: v }))}
              label="Milestone Reached"
              description="When a video hits a view or subscriber milestone"
            />
          </div>
        </div>
      </motion.div>

      {/* Publishing Audit Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
          <Monitor size={18} className="text-neon-green" />
          Publishing Audit Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-dark-300 text-xs font-medium pb-3 pr-4">Time</th>
                <th className="text-dark-300 text-xs font-medium pb-3 pr-4">Video</th>
                <th className="text-dark-300 text-xs font-medium pb-3 pr-4">Channel</th>
                <th className="text-dark-300 text-xs font-medium pb-3 pr-4">Action</th>
                <th className="text-dark-300 text-xs font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLog.map((entry) => (
                <tr key={entry.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-dark-400 text-xs whitespace-nowrap">{timeAgo(entry.timestamp)}</td>
                  <td className="py-3 pr-4 text-white text-xs font-medium max-w-[200px] truncate">{entry.video}</td>
                  <td className="py-3 pr-4 text-dark-300 text-xs whitespace-nowrap">{entry.channel}</td>
                  <td className="py-3 pr-4 text-dark-200 text-xs">{entry.action}</td>
                  <td className="py-3"><StatusBadge status={entry.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationSettings;
