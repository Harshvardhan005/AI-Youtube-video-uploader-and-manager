import React, { lazy, Suspense } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TitleBar } from './components/layout/TitleBar';
import { AnimatedBackground } from './components/ui';
import { useStore } from './store/useStore';

// Lazy-load all pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UploadStudio = lazy(() => import('./pages/UploadStudio'));
const AIMetadataStudio = lazy(() => import('./pages/AIMetadataStudio'));
const ThumbnailStudio = lazy(() => import('./pages/ThumbnailStudio'));
const PublishingCalendar = lazy(() => import('./pages/PublishingCalendar'));
const YouTubeChannels = lazy(() => import('./pages/YouTubeChannels'));
const StudioAnalytics = lazy(() => import('./pages/StudioAnalytics'));
const CopyrightSafety = lazy(() => import('./pages/CopyrightSafety'));
const CompetitorIntel = lazy(() => import('./pages/CompetitorIntel'));
const TrendResearch = lazy(() => import('./pages/TrendResearch'));
const AIActivityCenter = lazy(() => import('./pages/AIActivityCenter'));
const AutomationSettings = lazy(() => import('./pages/AutomationSettings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const SettingsPage = lazy(() => import('./pages/Settings'));

const pageMap: Record<string, React.LazyExoticComponent<React.FC>> = {
  dashboard: Dashboard,
  upload: UploadStudio,
  metadata: AIMetadataStudio,
  thumbnail: ThumbnailStudio,
  calendar: PublishingCalendar,
  channels: YouTubeChannels,
  analytics: StudioAnalytics,
  copyright: CopyrightSafety,
  competitors: CompetitorIntel,
  trends: TrendResearch,
  'ai-activity': AIActivityCenter,
  automation: AutomationSettings,
  notifications: Notifications,
  settings: SettingsPage,
};

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-neon-blue/30 border-t-neon-blue animate-spin" />
      <span className="text-sm text-dark-300">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const { currentPage } = useStore();
  const PageComponent = pageMap[currentPage] || Dashboard;

  return (
    <div className="h-screen flex flex-col bg-dark-950 relative overflow-hidden">
      <AnimatedBackground />
      <TitleBar />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-full">
            <Suspense fallback={<PageLoader />}>
              <PageComponent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
