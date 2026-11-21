import React, { useState } from 'react';
import { PageHeader, ToggleSwitch, Tabs, ProgressBar } from '@/components/ui';
import {
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Save,
  Zap,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  ExternalLink,
  Bug,
  Lightbulb,
  BookOpen,
  Github,
  CheckCircle,
  XCircle,
  HardDrive,
  FolderOpen,
  Globe,
  Monitor,
  Palette,
  Database,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Local state types ───
interface ApiKeyState {
  googleClientId: string;
  googleClientSecret: string;
  geminiApiKey: string;
  showGoogleSecret: boolean;
  showGeminiKey: boolean;
  googleStatus: 'connected' | 'disconnected';
  geminiStatus: 'connected' | 'disconnected';
}

interface GeneralSettings {
  language: string;
  exportDirectory: string;
  startMinimized: boolean;
  startWithWindows: boolean;
  autoUpdate: boolean;
  syncFrequency: string;
}

interface AppearanceSettings {
  theme: 'dark' | 'darker' | 'midnight';
  accentColor: string;
  enableAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoCollapseSidebar: boolean;
}

// ─── Constants ───
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
  { value: 'pt', label: 'Português' },
  { value: 'hi', label: 'हिन्दी' },
];

const SYNC_FREQUENCIES = [
  { value: 'hourly', label: 'Every Hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual Only' },
];

const THEMES: { key: 'dark' | 'darker' | 'midnight'; label: string; colors: string[] }[] = [
  { key: 'dark', label: 'Dark', colors: ['#1e1e2e', '#2d2d3f', '#3b82f6'] },
  { key: 'darker', label: 'Darker', colors: ['#0f0f1a', '#1a1a2e', '#8b5cf6'] },
  { key: 'midnight', label: 'Midnight', colors: ['#060612', '#0d0d20', '#06b6d4'] },
];

const ACCENT_COLORS = [
  { name: 'blue', value: '#3b82f6' },
  { name: 'purple', value: '#8b5cf6' },
  { name: 'cyan', value: '#06b6d4' },
  { name: 'green', value: '#22c55e' },
  { name: 'pink', value: '#ec4899' },
  { name: 'orange', value: '#f97316' },
];

const FONT_SIZES: { key: 'small' | 'medium' | 'large'; label: string }[] = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' },
];

const STORAGE_DATA = [
  { label: 'Cache', size: 234, max: 512, color: 'from-neon-blue to-neon-cyan' },
  { label: 'Analytics', size: 128, max: 512, color: 'from-neon-purple to-neon-pink' },
  { label: 'Thumbnails', size: 89, max: 512, color: 'from-neon-green to-neon-cyan' },
];

const TECH_STACK = [
  'React 18 + TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Zustand',
  'Vite',
  'YouTube Data API v3',
  'Google Gemini API',
];

const TABS = ['General', 'API Keys', 'Appearance', 'Data', 'About'];

// ─── Component ───
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General');

  // General settings state
  const [general, setGeneral] = useState<GeneralSettings>({
    language: 'en',
    exportDirectory: 'C:\\Users\\User\\Documents\\AutoTube Exports',
    startMinimized: false,
    startWithWindows: true,
    autoUpdate: true,
    syncFrequency: 'daily',
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyState>({
    googleClientId: '',
    googleClientSecret: '',
    geminiApiKey: '',
    showGoogleSecret: false,
    showGeminiKey: false,
    googleStatus: 'disconnected',
    geminiStatus: 'disconnected',
  });

  // Appearance state
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'dark',
    accentColor: 'blue',
    enableAnimations: true,
    fontSize: 'medium',
    autoCollapseSidebar: true,
  });

  // Data management state
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // ─── Handlers ───
  const handleTestGoogle = () => {
    setApiKeys((s) => ({ ...s, googleStatus: s.googleClientId && s.googleClientSecret ? 'connected' : 'disconnected' }));
  };
  const handleTestGemini = () => {
    setApiKeys((s) => ({ ...s, geminiStatus: s.geminiApiKey ? 'connected' : 'disconnected' }));
  };

  // ─── Tab Icon ───
  const tabIcon = (tab: string) => {
    switch (tab) {
      case 'General': return <Globe className="w-4 h-4" />;
      case 'API Keys': return <Zap className="w-4 h-4" />;
      case 'Appearance': return <Palette className="w-4 h-4" />;
      case 'Data': return <Database className="w-4 h-4" />;
      case 'About': return <Info className="w-4 h-4" />;
      default: return null;
    }
  };

  // ─── Render Tabs ───
  const renderGeneralTab = () => (
    <motion.div
      key="general"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Language */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="w-5 h-5 text-neon-blue" />
          <h3 className="text-white font-semibold">Language & Region</h3>
        </div>
        <div>
          <label className="text-sm text-dark-200 mb-2 block">Application Language</label>
          <select
            value={general.language}
            onChange={(e) => setGeneral((s) => ({ ...s, language: e.target.value }))}
            className="glass-input appearance-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-dark-800 text-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Directory */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <FolderOpen className="w-5 h-5 text-neon-purple" />
          <h3 className="text-white font-semibold">File Management</h3>
        </div>
        <div>
          <label className="text-sm text-dark-200 mb-2 block">Default Download / Export Directory</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={general.exportDirectory}
              onChange={(e) => setGeneral((s) => ({ ...s, exportDirectory: e.target.value }))}
              className="glass-input flex-1 font-mono text-sm"
            />
            <button className="glass-button whitespace-nowrap flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Browse
            </button>
          </div>
        </div>
      </div>

      {/* Startup Behavior */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <Monitor className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-white font-semibold">Startup Behavior</h3>
        </div>
        <div className="space-y-5">
          <ToggleSwitch
            enabled={general.startMinimized}
            onChange={(v) => setGeneral((s) => ({ ...s, startMinimized: v }))}
            label="Start minimized"
            description="Launch the app minimized to system tray"
          />
          <ToggleSwitch
            enabled={general.startWithWindows}
            onChange={(v) => setGeneral((s) => ({ ...s, startWithWindows: v }))}
            label="Start with Windows"
            description="Automatically launch when your computer starts"
          />
          <ToggleSwitch
            enabled={general.autoUpdate}
            onChange={(v) => setGeneral((s) => ({ ...s, autoUpdate: v }))}
            label="Auto-update"
            description="Automatically download and install updates"
          />
        </div>
      </div>

      {/* Sync Frequency */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <HardDrive className="w-5 h-5 text-neon-green" />
          <h3 className="text-white font-semibold">Data Sync</h3>
        </div>
        <div>
          <label className="text-sm text-dark-200 mb-2 block">Sync Frequency</label>
          <select
            value={general.syncFrequency}
            onChange={(e) => setGeneral((s) => ({ ...s, syncFrequency: e.target.value }))}
            className="glass-input appearance-none cursor-pointer"
          >
            {SYNC_FREQUENCIES.map((freq) => (
              <option key={freq.value} value={freq.value} className="bg-dark-800 text-white">
                {freq.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderApiKeysTab = () => (
    <motion.div
      key="apikeys"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Google API Credentials */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-blue/10">
              <Globe className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Google API Credentials</h3>
              <p className="text-xs text-dark-300 mt-0.5">Required for YouTube Data API access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apiKeys.googleStatus === 'connected' ? (
              <span className="flex items-center gap-1.5 text-neon-green text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Connected ✓
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-dark-300 text-sm">
                <XCircle className="w-4 h-4" /> Not Connected
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-dark-200 mb-2 block">Client ID</label>
            <input
              type="text"
              value={apiKeys.googleClientId}
              onChange={(e) => setApiKeys((s) => ({ ...s, googleClientId: e.target.value }))}
              placeholder="Enter your Google Client ID"
              className="glass-input font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-dark-200 mb-2 block">Client Secret</label>
            <div className="relative">
              <input
                type={apiKeys.showGoogleSecret ? 'text' : 'password'}
                value={apiKeys.googleClientSecret}
                onChange={(e) => setApiKeys((s) => ({ ...s, googleClientSecret: e.target.value }))}
                placeholder="Enter your Google Client Secret"
                className="glass-input font-mono text-sm pr-12"
              />
              <button
                onClick={() => setApiKeys((s) => ({ ...s, showGoogleSecret: !s.showGoogleSecret }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors"
              >
                {apiKeys.showGoogleSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="glass-button flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={handleTestGoogle}
              className="glass-button flex items-center gap-2 text-sm hover:border-neon-blue/40"
            >
              <Zap className="w-4 h-4 text-neon-blue" /> Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Gemini API Key */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-purple/10">
              <Zap className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Gemini API Key</h3>
              <p className="text-xs text-dark-300 mt-0.5">Powers AI features — metadata, thumbnails, analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apiKeys.geminiStatus === 'connected' ? (
              <span className="flex items-center gap-1.5 text-neon-green text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Connected ✓
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-dark-300 text-sm">
                <XCircle className="w-4 h-4" /> Not Connected
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-dark-200 mb-2 block">API Key</label>
            <div className="relative">
              <input
                type={apiKeys.showGeminiKey ? 'text' : 'password'}
                value={apiKeys.geminiApiKey}
                onChange={(e) => setApiKeys((s) => ({ ...s, geminiApiKey: e.target.value }))}
                placeholder="Enter your Gemini API Key"
                className="glass-input font-mono text-sm pr-12"
              />
              <button
                onClick={() => setApiKeys((s) => ({ ...s, showGeminiKey: !s.showGeminiKey }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors"
              >
                {apiKeys.showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="glass-button flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={handleTestGemini}
              className="glass-button flex items-center gap-2 text-sm hover:border-neon-purple/40"
            >
              <Zap className="w-4 h-4 text-neon-purple" /> Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-panel p-4 border-neon-blue/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
          <p className="text-sm text-dark-200">
            API keys are stored locally and never shared. They are only used to authenticate with the respective services
            on your behalf. We recommend using restricted API keys with minimal required scopes.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderAppearanceTab = () => (
    <motion.div
      key="appearance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Theme Selector */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <Palette className="w-5 h-5 text-neon-purple" />
          <h3 className="text-white font-semibold">Theme</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.key}
              onClick={() => setAppearance((s) => ({ ...s, theme: theme.key }))}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                appearance.theme === theme.key
                  ? 'border-neon-blue bg-white/[0.06] shadow-lg shadow-neon-blue/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              }`}
            >
              {/* Mini color preview */}
              <div className="flex gap-1.5 mb-3 justify-center">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-white">{theme.label}</span>
              {appearance.theme === theme.key && (
                <motion.div
                  layoutId="theme-check"
                  className="absolute top-2 right-2"
                >
                  <CheckCircle className="w-4 h-4 text-neon-blue" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple" />
          <h3 className="text-white font-semibold">Accent Color</h3>
        </div>
        <div className="flex gap-4">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setAppearance((s) => ({ ...s, accentColor: color.name }))}
              className="relative group"
            >
              <div
                className={`w-10 h-10 rounded-full transition-all duration-200 ${
                  appearance.accentColor === color.name
                    ? 'ring-2 ring-offset-2 ring-offset-dark-900 scale-110'
                    : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor: color.value,
                  ringColor: color.value,
                  boxShadow: appearance.accentColor === color.name ? `0 0 20px ${color.value}40` : 'none',
                }}
              />
              {appearance.accentColor === color.name && (
                <motion.div
                  layoutId="color-check"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 text-white drop-shadow-lg" />
                </motion.div>
              )}
              <span className="text-xs text-dark-300 mt-2 block capitalize">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="glass-panel p-6">
        <div className="space-y-5">
          <ToggleSwitch
            enabled={appearance.enableAnimations}
            onChange={(v) => setAppearance((s) => ({ ...s, enableAnimations: v }))}
            label="Enable animations"
            description="Respects system reduced-motion preferences when disabled"
          />
        </div>
      </div>

      {/* Font Size */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-white font-semibold">Font Size</h3>
        </div>
        <div className="flex gap-3">
          {FONT_SIZES.map((size) => (
            <button
              key={size.key}
              onClick={() => setAppearance((s) => ({ ...s, fontSize: size.key }))}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                appearance.fontSize === size.key
                  ? 'bg-white/[0.1] border-neon-blue/40 text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-dark-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="glass-panel p-6">
        <ToggleSwitch
          enabled={appearance.autoCollapseSidebar}
          onChange={(v) => setAppearance((s) => ({ ...s, autoCollapseSidebar: v }))}
          label="Auto-collapse sidebar on small screens"
          description="Automatically collapses the navigation sidebar on viewports below 1024px"
        />
      </div>
    </motion.div>
  );

  const renderDataTab = () => (
    <motion.div
      key="data"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Export / Import */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <Database className="w-5 h-5 text-neon-blue" />
          <h3 className="text-white font-semibold">Data Management</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="glass-panel-hover p-4 flex items-center gap-4 text-left">
            <div className="p-2.5 rounded-xl bg-neon-blue/10">
              <Download className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Export Data</div>
              <div className="text-xs text-dark-300 mt-0.5">Export all settings and history</div>
            </div>
          </button>
          <button className="glass-panel-hover p-4 flex items-center gap-4 text-left">
            <div className="p-2.5 rounded-xl bg-neon-purple/10">
              <Upload className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Import Data</div>
              <div className="text-xs text-dark-300 mt-0.5">Restore from a backup file</div>
            </div>
          </button>
        </div>
      </div>

      {/* Cache & Reset */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <Trash2 className="w-5 h-5 text-neon-orange" />
          <h3 className="text-white font-semibold">Cache & Reset</h3>
        </div>
        <div className="space-y-4">
          {/* Clear Cache */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Clear Cache</div>
              <div className="text-xs text-dark-300 mt-0.5">Remove temporary files and cached data</div>
            </div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neon-orange">Are you sure?</span>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg bg-neon-orange/10 border border-neon-orange/20 text-neon-orange text-xs font-medium hover:bg-neon-orange/20 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-dark-200 text-xs hover:bg-white/[0.08] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="glass-button text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <div className="border-t border-white/[0.06]" />

          {/* Reset to Defaults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Reset to Defaults</div>
              <div className="text-xs text-dark-300 mt-0.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-neon-red" />
                This will erase all custom settings permanently
              </div>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neon-red">This cannot be undone!</span>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs font-medium hover:bg-neon-red/20 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-dark-200 text-xs hover:bg-white/[0.08] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-4 py-2 rounded-xl bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm font-medium hover:bg-neon-red/20 transition-all duration-200 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5">
          <HardDrive className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-white font-semibold">Storage Usage</h3>
        </div>
        <div className="space-y-5">
          {STORAGE_DATA.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-200">{item.label}</span>
                <span className="text-xs text-dark-300 font-mono">{item.size} MB / {item.max} MB</span>
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.size / item.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Total Used</span>
              <span className="text-sm text-dark-200 font-mono">
                {STORAGE_DATA.reduce((acc, s) => acc + s.size, 0)} MB / {STORAGE_DATA[0].max} MB
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAboutTab = () => (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* App Info */}
      <div className="glass-panel p-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                boxShadow: '0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(59,130,246,0.15)',
              }}
            >
              <span className="text-white drop-shadow-lg">AT</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">AutoTube AI</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4">
            <span className="text-xs text-dark-200">Version</span>
            <span className="text-xs font-mono text-neon-blue">1.0.0</span>
          </div>
          <p className="text-dark-300 text-sm max-w-md">
            Upload your finished video. AutoTube AI handles the rest — safely.
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="glass-panel p-6">
        <h3 className="text-white font-semibold mb-4">Links</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen, label: 'Documentation', color: 'text-neon-blue' },
            { icon: Github, label: 'GitHub', color: 'text-white' },
            { icon: Bug, label: 'Report Bug', color: 'text-neon-red' },
            { icon: Lightbulb, label: 'Feature Request', color: 'text-neon-green' },
          ].map((link) => (
            <button
              key={link.label}
              className="glass-panel-hover p-3 flex items-center gap-3 text-left"
            >
              <link.icon className={`w-4 h-4 ${link.color}`} />
              <span className="text-sm text-dark-200 hover:text-white transition-colors">{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-dark-400 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-panel p-6">
        <h3 className="text-white font-semibold mb-4">Credits & Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-dark-200 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* License */}
      <div className="glass-panel p-6">
        <h3 className="text-white font-semibold mb-3">License</h3>
        <p className="text-sm text-dark-300">
          MIT License © 2027 AutoTube AI. Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files, to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
          of the Software.
        </p>
      </div>
    </motion.div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'General': return renderGeneralTab();
      case 'API Keys': return renderApiKeysTab();
      case 'Appearance': return renderAppearanceTab();
      case 'Data': return renderDataTab();
      case 'About': return renderAboutTab();
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title="Settings"
          subtitle="Application preferences and configuration"
          icon={<SettingsIcon className="w-6 h-6" />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </motion.div>

      <AnimatePresence mode="wait">
        {renderActiveTab()}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
