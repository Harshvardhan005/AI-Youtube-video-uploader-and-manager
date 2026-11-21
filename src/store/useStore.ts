import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { YouTubeService, YouTubeChannelProfile } from '@/services/youtube';
import { AIService, GeneratedMetadata } from '@/services/ai';

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
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
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
  file?: File; // in-memory reference to live file
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

export interface ApiKeys {
  googleClientId: string;
  googleClientSecret: string;
  geminiApiKey: string;
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

  // API Credentials
  apiKeys: ApiKeys;
  updateApiKeys: (keys: Partial<ApiKeys>) => void;

  // Channels
  channels: YouTubeChannel[];
  addChannel: (channel: YouTubeChannel) => void;
  removeChannel: (id: string) => void;
  setDefaultChannel: (id: string) => void;
  syncChannel: (channelId: string) => Promise<void>;

  // Videos
  videos: VideoUpload[];
  addVideo: (video: VideoUpload) => void;
  updateVideo: (id: string, updates: Partial<VideoUpload>) => void;
  removeVideo: (id: string) => void;

  // Real Upload Execution
  executeUpload: (videoId: string, file: File) => Promise<boolean>;

  // AI Generation
  generateAIEnhancement: (videoId: string) => Promise<GeneratedMetadata | null>;

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

// ─── Persistent Store with Real API Execution ───
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      currentPage: 'dashboard',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCurrentPage: (page) => set({ currentPage: page }),

      apiKeys: {
        googleClientId: '',
        googleClientSecret: '',
        geminiApiKey: '',
      },
      updateApiKeys: (keys) => set((s) => ({ apiKeys: { ...s.apiKeys, ...keys } })),

      channels: [
        {
          id: 'ch-sample',
          name: 'My YouTube Channel',
          handle: '@mychannel',
          avatar: '',
          subscribers: 0,
          totalVideos: 0,
          isDefault: true,
          connected: false,
          lastSync: new Date().toISOString(),
        },
      ],
      addChannel: (channel) => set((s) => ({ channels: [...s.channels.filter(c => c.id !== 'ch-sample'), channel] })),
      removeChannel: (id) => set((s) => ({ channels: s.channels.filter((c) => c.id !== id) })),
      setDefaultChannel: (id) => set((s) => ({
        channels: s.channels.map((c) => ({ ...c, isDefault: c.id === id })),
      })),

      syncChannel: async (channelId: string) => {
        const channel = get().channels.find((c) => c.id === channelId);
        if (!channel || !channel.accessToken) return;

        try {
          const profile = await YouTubeService.fetchMyChannel(channel.accessToken);
          set((s) => ({
            channels: s.channels.map((c) =>
              c.id === channelId
                ? {
                    ...c,
                    name: profile.name,
                    handle: profile.handle,
                    avatar: profile.avatar,
                    subscribers: profile.subscribers,
                    totalVideos: profile.totalVideos,
                    lastSync: new Date().toISOString(),
                    connected: true,
                  }
                : c
            ),
          }));
          get().addNotification({
            type: 'success',
            title: 'Channel Synced',
            message: `Synced ${profile.name} with live YouTube statistics!`,
            channelId,
          });
        } catch (err: any) {
          console.error('Error syncing channel:', err);
          get().addNotification({
            type: 'error',
            title: 'Channel Sync Failed',
            message: err.message || 'Could not reach YouTube Data API.',
            channelId,
          });
        }
      },

      videos: [],
      addVideo: (video) => set((s) => ({ videos: [video, ...s.videos] })),
      updateVideo: (id, updates) => set((s) => ({
        videos: s.videos.map((v) => (v.id === id ? { ...v, ...updates } : v)),
      })),
      removeVideo: (id) => set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),

      // ─── Real Video Upload to YouTube ───
      executeUpload: async (videoId: string, file: File): Promise<boolean> => {
        const video = get().videos.find((v) => v.id === videoId);
        if (!video) return false;

        const defaultChannel = get().channels.find((c) => c.isDefault) || get().channels[0];
        const accessToken = defaultChannel?.accessToken;

        get().updateVideo(videoId, { status: 'uploading', progress: 5 });

        // If user has connected their real YouTube OAuth token:
        if (accessToken) {
          try {
            get().addNotification({
              type: 'info',
              title: 'Upload Started',
              message: `Uploading "${video.title}" directly to ${defaultChannel.name}...`,
              videoId,
            });

            const uploadResult = await YouTubeService.uploadVideo({
              file,
              metadata: {
                title: video.title,
                description: video.description,
                tags: video.tags,
                privacyStatus: video.visibility === 'public' ? 'public' : 'private',
                publishAt: video.visibility === 'scheduled' ? video.publishDate : undefined,
              },
              accessToken,
              onProgress: (percent) => {
                get().updateVideo(videoId, { progress: percent });
              },
            });

            get().updateVideo(videoId, {
              status: video.visibility === 'scheduled' ? 'scheduled' : 'published',
              progress: 100,
              youtubeId: uploadResult.id,
              youtubeUrl: uploadResult.url,
            });

            get().addNotification({
              type: 'success',
              title: 'Video Live on YouTube!',
              message: `"${video.title}" has been uploaded to YouTube! URL: ${uploadResult.url}`,
              videoId,
              action: uploadResult.url,
            });

            return true;
          } catch (err: any) {
            console.error('Real YouTube upload error:', err);
            get().updateVideo(videoId, { status: 'failed', progress: 0 });
            get().addNotification({
              type: 'error',
              title: 'YouTube Upload Failed',
              message: err.message || 'Failed to upload video to YouTube Data API.',
              videoId,
            });
            return false;
          }
        } else {
          // If OAuth token is not configured yet, simulate full workflow and guide user to Settings
          for (let p = 10; p <= 100; p += 15) {
            await new Promise((r) => setTimeout(r, 400));
            get().updateVideo(videoId, { progress: p });
          }

          get().updateVideo(videoId, {
            status: 'private',
            progress: 100,
            youtubeId: `demo-${Date.now().toString(36)}`,
            youtubeUrl: `https://youtube.com/watch?v=demo-${Date.now().toString(36)}`,
          });

          get().addNotification({
            type: 'info',
            title: 'Upload Staged (Demo Mode)',
            message: `Processed "${video.title}". Connect your YouTube account in Settings > API Keys to upload directly to your channel!`,
            videoId,
          });

          return true;
        }
      },

      // ─── Real AI Generation via Gemini ───
      generateAIEnhancement: async (videoId: string): Promise<GeneratedMetadata | null> => {
        const video = get().videos.find((v) => v.id === videoId);
        if (!video) return null;

        const geminiApiKey = get().apiKeys.geminiApiKey;

        try {
          const generated = await AIService.generateMetadata({
            title: video.title,
            fileName: video.title,
            duration: video.duration || 600,
            category: video.category || 'Science & Technology',
            geminiApiKey,
          });

          get().updateVideo(videoId, {
            title: generated.titles[0]?.text || video.title,
            description: generated.description,
            tags: generated.tags,
            category: generated.recommendedCategory,
          });

          get().addNotification({
            type: 'success',
            title: 'AI Metadata Generated',
            message: `Generated SEO titles, description, and ${generated.tags.length} tags for "${video.title}"!`,
            videoId,
          });

          return generated;
        } catch (err: any) {
          console.error('AI generation error:', err);
          return null;
        }
      },

      notifications: [
        {
          id: 'n-welcome',
          type: 'info',
          title: 'Welcome to AutoTube AI',
          message: 'Upload your finalized video or connect your YouTube channel in Settings to begin autonomous publishing.',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      addNotification: (n) => set((s) => ({
        notifications: [{ ...n, id: uuidv4(), timestamp: new Date().toISOString(), read: false }, ...s.notifications],
      })),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
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
        {
          id: 'ai-init',
          action: 'Engine Ready',
          details: 'AutoTube AI autonomous publishing agents initialized and listening for new uploads.',
          timestamp: new Date().toISOString(),
          status: 'completed',
        },
      ],
    }),
    {
      name: 'autotube_ai_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        channels: state.channels,
        videos: state.videos.map(v => {
          const { file, ...rest } = v; // don't serialize raw File object
          return rest;
        }),
        automation: state.automation,
        notifications: state.notifications,
      }),
    }
  )
);

export default useStore;
