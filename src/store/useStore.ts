import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ─── Types ───
export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  totalVideos: number;
  isDefault: boolean;
  connected: boolean;
  lastSync: string;
}

export interface VideoUpload {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'analyzing' | 'generating' | 'copyright-check' | 'uploading' | 'processing' | 'scheduled' | 'published' | 'failed' | 'paused' | 'private';
  channelId: string;
  channelName: string;
  thumbnail: string;
  progress: number;
  publishDate: string;
  visibility: 'public' | 'private' | 'unlisted' | 'scheduled';
  copyrightStatus: 'pending' | 'clear' | 'warning' | 'claim' | 'blocked';
  copyrightDetails?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  fileSize: number;
  duration: number;
  category: string;
  language: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'copyright';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  videoId?: string;
  channelId?: string;
  action?: string;
}

export interface AutomationSettings {
  autopilotEnabled: boolean;
  defaultVisibility: 'public' | 'private' | 'unlisted' | 'scheduled';
  maxUploadsPerDay: number;
  allowedHoursStart: number;
  allowedHoursEnd: number;
  defaultLanguage: string;
  defaultCategory: string;
  copyrightPolicy: 'strict' | 'moderate' | 'permissive';
  thumbnailAutoGenerate: boolean;
  globalPause: boolean;
  emailNotifications: boolean;
  desktopNotifications: boolean;
}

export interface AnalyticsData {
  date: string;
  views: number;
  watchTime: number;
  subscribers: number;
  likes: number;
  comments: number;
  impressions: number;
  ctr: number;
  avgViewDuration: number;
  revenue: number;
}

interface AppState {
  // Navigation
  sidebarCollapsed: boolean;
  currentPage: string;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;

  // Channels
  channels: YouTubeChannel[];
  addChannel: (channel: YouTubeChannel) => void;
  removeChannel: (id: string) => void;
  setDefaultChannel: (id: string) => void;

  // Videos
  videos: VideoUpload[];
  addVideo: (video: VideoUpload) => void;
  updateVideo: (id: string, updates: Partial<VideoUpload>) => void;
  removeVideo: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Automation
  automation: AutomationSettings;
  updateAutomation: (updates: Partial<AutomationSettings>) => void;

  // Analytics
  analyticsData: AnalyticsData[];

  // AI Activity
  aiActivities: Array<{
    id: string;
    action: string;
    details: string;
    timestamp: string;
    status: 'running' | 'completed' | 'failed';
    videoId?: string;
  }>;
}

// ─── Mock Data ───
const mockChannels: YouTubeChannel[] = [
  {
    id: 'ch-1',
    name: 'TechVision Pro',
    handle: '@techvisionpro',
    avatar: '',
    subscribers: 284000,
    totalVideos: 342,
    isDefault: true,
    connected: true,
    lastSync: new Date().toISOString(),
  },
  {
    id: 'ch-2',
    name: 'Gaming Universe',
    handle: '@gaminguniv',
    avatar: '',
    subscribers: 156000,
    totalVideos: 528,
    isDefault: false,
    connected: true,
    lastSync: new Date().toISOString(),
  },
  {
    id: 'ch-3',
    name: 'Daily Vlogs',
    handle: '@dailyvlogslife',
    avatar: '',
    subscribers: 92300,
    totalVideos: 189,
    isDefault: false,
    connected: true,
    lastSync: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockVideos: VideoUpload[] = [
  {
    id: 'v-1', title: 'Next-Gen AI Tools You Need in 2027', description: 'Exploring the most powerful AI tools...', tags: ['AI', 'technology', 'tools'],
    status: 'published', channelId: 'ch-1', channelName: 'TechVision Pro', thumbnail: '', progress: 100,
    publishDate: new Date(Date.now() - 86400000 * 2).toISOString(), visibility: 'public', copyrightStatus: 'clear',
    youtubeId: 'abc123', youtubeUrl: 'https://youtube.com/watch?v=abc123', views: 45200, likes: 3100, comments: 428,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), fileSize: 1824000000, duration: 912, category: 'Science & Technology', language: 'en',
  },
  {
    id: 'v-2', title: 'Building a Smart Home from Scratch', description: 'Complete guide to home automation...', tags: ['smart home', 'IoT', 'automation'],
    status: 'processing', channelId: 'ch-1', channelName: 'TechVision Pro', thumbnail: '', progress: 72,
    publishDate: new Date(Date.now() + 86400000).toISOString(), visibility: 'scheduled', copyrightStatus: 'pending',
    views: 0, likes: 0, comments: 0, createdAt: new Date().toISOString(), fileSize: 2340000000, duration: 1480, category: 'Science & Technology', language: 'en',
  },
  {
    id: 'v-3', title: 'Epic Boss Fight Compilation', description: 'The hardest boss fights in gaming history...', tags: ['gaming', 'boss fights', 'compilation'],
    status: 'copyright-check', channelId: 'ch-2', channelName: 'Gaming Universe', thumbnail: '', progress: 45,
    publishDate: '', visibility: 'private', copyrightStatus: 'warning', copyrightDetails: 'Potential match: Background music at 3:42-5:18',
    views: 0, likes: 0, comments: 0, createdAt: new Date().toISOString(), fileSize: 3200000000, duration: 2100, category: 'Gaming', language: 'en',
  },
  {
    id: 'v-4', title: 'Morning Routine That Changed My Life', description: 'My productivity morning routine...', tags: ['vlog', 'morning routine', 'productivity'],
    status: 'scheduled', channelId: 'ch-3', channelName: 'Daily Vlogs', thumbnail: '', progress: 100,
    publishDate: new Date(Date.now() + 86400000 * 3).toISOString(), visibility: 'scheduled', copyrightStatus: 'clear',
    views: 0, likes: 0, comments: 0, createdAt: new Date(Date.now() - 86400000).toISOString(), fileSize: 1500000000, duration: 785, category: 'People & Blogs', language: 'en',
  },
];

const generateAnalytics = (): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const base = 1000 + Math.sin(i * 0.3) * 500;
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(base + Math.random() * 800),
      watchTime: Math.floor((base * 4.2) + Math.random() * 2000),
      subscribers: Math.floor(20 + Math.random() * 60),
      likes: Math.floor(base * 0.08 + Math.random() * 50),
      comments: Math.floor(base * 0.02 + Math.random() * 20),
      impressions: Math.floor(base * 8 + Math.random() * 3000),
      ctr: parseFloat((3 + Math.random() * 7).toFixed(1)),
      avgViewDuration: Math.floor(180 + Math.random() * 240),
      revenue: parseFloat((base * 0.004 + Math.random() * 5).toFixed(2)),
    });
  }
  return data;
};

const mockNotifications: AppNotification[] = [
  { id: 'n-1', type: 'success', title: 'Video Published', message: '"Next-Gen AI Tools" is now live on TechVision Pro', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false, videoId: 'v-1' },
  { id: 'n-2', type: 'copyright', title: 'Copyright Warning', message: 'Potential copyrighted music detected in "Epic Boss Fight Compilation" at 3:42-5:18', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, videoId: 'v-3' },
  { id: 'n-3', type: 'info', title: 'Video Scheduled', message: '"Morning Routine" scheduled for publication on ' + new Date(Date.now() + 86400000 * 3).toLocaleDateString(), timestamp: new Date(Date.now() - 1800000).toISOString(), read: false, videoId: 'v-4' },
  { id: 'n-4', type: 'info', title: 'Processing Started', message: '"Building a Smart Home" is being processed by YouTube', timestamp: new Date(Date.now() - 900000).toISOString(), read: true, videoId: 'v-2' },
  { id: 'n-5', type: 'warning', title: 'Analytics Update', message: 'TechVision Pro gained 1,240 subscribers this week — up 23% from last week', timestamp: new Date(Date.now() - 43200000).toISOString(), read: true },
];

// ─── Store ───
export const useStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  currentPage: 'dashboard',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),

  channels: mockChannels,
  addChannel: (channel) => set((s) => ({ channels: [...s.channels, channel] })),
  removeChannel: (id) => set((s) => ({ channels: s.channels.filter((c) => c.id !== id) })),
  setDefaultChannel: (id) => set((s) => ({
    channels: s.channels.map((c) => ({ ...c, isDefault: c.id === id })),
  })),

  videos: mockVideos,
  addVideo: (video) => set((s) => ({ videos: [video, ...s.videos] })),
  updateVideo: (id, updates) => set((s) => ({
    videos: s.videos.map((v) => v.id === id ? { ...v, ...updates } : v),
  })),
  removeVideo: (id) => set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),

  notifications: mockNotifications,
  addNotification: (n) => set((s) => ({
    notifications: [{ ...n, id: uuidv4(), timestamp: new Date().toISOString(), read: false }, ...s.notifications],
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),
  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  automation: {
    autopilotEnabled: true,
    defaultVisibility: 'public',
    maxUploadsPerDay: 3,
    allowedHoursStart: 8,
    allowedHoursEnd: 22,
    defaultLanguage: 'en',
    defaultCategory: 'Science & Technology',
    copyrightPolicy: 'strict',
    thumbnailAutoGenerate: true,
    globalPause: false,
    emailNotifications: true,
    desktopNotifications: true,
  },
  updateAutomation: (updates) => set((s) => ({
    automation: { ...s.automation, ...updates },
  })),

  analyticsData: generateAnalytics(),

  aiActivities: [
    { id: 'ai-1', action: 'Content Analysis', details: 'Analyzing "Building a Smart Home" — identifying topic, audience, and category', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'running', videoId: 'v-2' },
    { id: 'ai-2', action: 'Title Generation', details: 'Generated 5 SEO-optimized title variants for "Next-Gen AI Tools"', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'completed', videoId: 'v-1' },
    { id: 'ai-3', action: 'Copyright Screening', details: 'Detected potential music match in "Epic Boss Fight Compilation" at 3:42', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'completed', videoId: 'v-3' },
    { id: 'ai-4', action: 'Thumbnail Generation', details: 'Created 3 thumbnail variants for "Morning Routine"', timestamp: new Date(Date.now() - 5400000).toISOString(), status: 'completed', videoId: 'v-4' },
    { id: 'ai-5', action: 'Trend Analysis', details: 'Identified 12 trending topics in Science & Technology category', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'completed' },
  ],
}));

export default useStore;
