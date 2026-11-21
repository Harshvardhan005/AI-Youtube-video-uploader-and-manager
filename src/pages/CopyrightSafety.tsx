import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar, Tabs, formatDuration, timeAgo, ToggleSwitch } from '@/components/ui';
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, CheckCircle2, Clock, Music,
  Eye, Video, FileText, Image, Plus, Trash2, Search, ExternalLink, Lock, Unlock, XCircle,
  Activity, BarChart3, ChevronRight, Info, Volume2, Film, Type, Gauge,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Mock scan data ───
interface ScanProgress {
  audioProgress: number;
  audioStatus: string;
  videoProgress: number;
  videoStatus: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MatchEntry {
  type: 'audio' | 'visual' | 'text';
  startTime: number;
  endTime: number;
  confidence: number;
  source: string;
  verified: boolean;
}

const scanData: Record<string, ScanProgress> = {
  'v-1': { audioProgress: 100, audioStatus: 'Scan complete — no matches', videoProgress: 100, videoStatus: 'Scan complete — no matches', riskLevel: 'low' },
  'v-2': { audioProgress: 68, audioStatus: 'Scanning audio tracks...', videoProgress: 34, videoStatus: 'Analyzing visual content...', riskLevel: 'low' },
  'v-3': { audioProgress: 100, audioStatus: 'Potential match detected', videoProgress: 82, videoStatus: 'Analyzing visual content...', riskLevel: 'high' },
  'v-4': { audioProgress: 100, audioStatus: 'Scan complete — no matches', videoProgress: 100, videoStatus: 'Scan complete — no matches', riskLevel: 'low' },
};

const matchData: Record<string, MatchEntry[]> = {
  'v-3': [
    { type: 'audio', startTime: 222, endTime: 318, confidence: 87, source: '"Battle Symphony" — Licensed BGM Pack', verified: false },
    { type: 'audio', startTime: 1140, endTime: 1260, confidence: 42, source: 'Unknown orchestral arrangement', verified: false },
    { type: 'visual', startTime: 540, endTime: 555, confidence: 23, source: 'Game cinematic cutscene (Fair Use likely)', verified: false },
  ],
  'v-1': [],
  'v-2': [
    { type: 'audio', startTime: 45, endTime: 72, confidence: 18, source: 'Ambient stock music — likely licensed', verified: false },
  ],
  'v-4': [],
};

interface LicensedAsset {
  id: string;
  name: string;
  type: 'music' | 'image' | 'video-clip' | 'sound-effect';
  license: string;
  expiry: string;
}

const initialAssets: LicensedAsset[] = [
  { id: 'la-1', name: 'Cinematic Ambient Pack Vol.3', type: 'music', license: 'Royalty-Free Commercial', expiry: '2027-06-15' },
  { id: 'la-2', name: 'Tech HUD Overlay Kit', type: 'video-clip', license: 'Extended Commercial', expiry: '2027-12-01' },
  { id: 'la-3', name: 'UI Click & Swoosh SFX', type: 'sound-effect', license: 'Royalty-Free', expiry: '2028-01-10' },
  { id: 'la-4', name: 'Abstract Gradient Backgrounds', type: 'image', license: 'Standard License', expiry: '2027-03-22' },
];

// ─── Helpers ───
const riskColors: Record<string, string> = {
  low: 'text-neon-green',
  medium: 'text-neon-orange',
  high: 'text-neon-red',
};
const riskBg: Record<string, string> = {
  low: 'bg-neon-green/10 border-neon-green/20',
  medium: 'bg-neon-orange/10 border-neon-orange/20',
  high: 'bg-neon-red/10 border-neon-red/20',
};
const riskIcons: Record<string, React.ReactNode> = {
  low: <ShieldCheck className="w-5 h-5" />,
  medium: <ShieldAlert className="w-5 h-5" />,
  high: <ShieldX className="w-5 h-5" />,
};
const typeIcons: Record<string, React.ReactNode> = {
  music: <Music className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  'video-clip': <Film className="w-4 h-4" />,
  'sound-effect': <Volume2 className="w-4 h-4" />,
};
const typeBadgeColors: Record<string, string> = {
  music: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
  image: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
  'video-clip': 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
  'sound-effect': 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
};
const matchTypeIcons: Record<string, React.ReactNode> = {
  audio: <Volume2 className="w-4 h-4" />,
  visual: <Eye className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
};

const formatTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const anim = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08 },
});

// ─── Component ───
const CopyrightSafety: React.FC = () => {
  const { videos, automation, updateAutomation } = useStore();
  const [activeTab, setActiveTab] = useState('Active Scans');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [licensedAssets, setLicensedAssets] = useState<LicensedAsset[]>(initialAssets);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'music', license: '' });
  const [riskTolerance, setRiskTolerance] = useState<'strict' | 'moderate' | 'permissive'>(automation.copyrightPolicy);
  const [neverAutoPublish, setNeverAutoPublish] = useState(true);
  const [autoActionWarning, setAutoActionWarning] = useState('keep-private');
  const [autoActionClaim, setAutoActionClaim] = useState('block-publish');

  const tabs = ['Active Scans', 'Risk Reports', 'Licensed Assets', 'Settings'];

  const addAsset = () => {
    if (!newAsset.name.trim() || !newAsset.license.trim()) return;
    setLicensedAssets(prev => [...prev, {
      id: `la-${Date.now()}`,
      name: newAsset.name,
      type: newAsset.type as LicensedAsset['type'],
      license: newAsset.license,
      expiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    }]);
    setNewAsset({ name: '', type: 'music', license: '' });
  };

  const removeAsset = (id: string) => setLicensedAssets(prev => prev.filter(a => a.id !== id));

  // ═══════════════════════════════════════════
  //  ACTIVE SCANS TAB
  // ═══════════════════════════════════════════
  const renderActiveScans = () => (
    <div className="space-y-4">
      {videos.map((video, i) => {
        const scan = scanData[video.id] || { audioProgress: 0, audioStatus: 'Queued', videoProgress: 0, videoStatus: 'Queued', riskLevel: 'low' as const };
        const matches = matchData[video.id] || [];
        const isWarning = video.copyrightStatus === 'warning';
        return (
          <motion.div key={video.id} {...anim(i)}
            className={`glass-panel p-5 ${isWarning ? 'border-neon-orange/30 shadow-[0_0_24px_rgba(249,115,22,0.08)]' : ''}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold truncate">{video.title}</h3>
                  <StatusBadge status={video.copyrightStatus} />
                </div>
                <div className="flex items-center gap-3 text-xs text-dark-300">
                  <span>{video.channelName}</span>
                  <span>•</span>
                  <span>{formatDuration(video.duration)}</span>
                  <span>•</span>
                  <span>{timeAgo(video.createdAt)}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${riskBg[scan.riskLevel]}`}>
                <span className={riskColors[scan.riskLevel]}>{riskIcons[scan.riskLevel]}</span>
                <span className={`text-sm font-semibold ${riskColors[scan.riskLevel]}`}>
                  {scan.riskLevel.charAt(0).toUpperCase() + scan.riskLevel.slice(1)} Risk
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm text-dark-200">
                    <Music className="w-3.5 h-3.5" />
                    <span>Audio Analysis</span>
                  </div>
                  <span className="text-xs text-dark-300">{scan.audioProgress}%</span>
                </div>
                <ProgressBar progress={scan.audioProgress} color={scan.audioProgress === 100 ? (matches.some(m => m.type === 'audio') ? 'orange' : 'green') : 'purple'} />
                <p className="text-xs text-dark-400 mt-1">{scan.audioStatus}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm text-dark-200">
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Content Analysis</span>
                  </div>
                  <span className="text-xs text-dark-300">{scan.videoProgress}%</span>
                </div>
                <ProgressBar progress={scan.videoProgress} color={scan.videoProgress === 100 ? 'green' : 'blue'} />
                <p className="text-xs text-dark-400 mt-1">{scan.videoStatus}</p>
              </div>
            </div>

            {/* Copyright details / matches */}
            {video.copyrightDetails && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-neon-orange/5 border border-neon-orange/15 mb-4">
                <AlertTriangle className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-neon-orange font-medium">AI-Detected Potential Match</p>
                  <p className="text-xs text-dark-300 mt-0.5">{video.copyrightDetails}</p>
                </div>
              </div>
            )}

            {matches.length > 0 && (
              <div className="space-y-2 mb-4">
                {matches.map((match, mi) => (
                  <div key={mi} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm">
                    <span className="text-dark-300">{matchTypeIcons[match.type]}</span>
                    <span className="text-dark-200 font-mono text-xs">{formatTimestamp(match.startTime)} – {formatTimestamp(match.endTime)}</span>
                    <span className={`text-xs font-medium ${match.confidence >= 70 ? 'text-neon-red' : match.confidence >= 40 ? 'text-neon-orange' : 'text-neon-green'}`}>{match.confidence}%</span>
                    <span className="text-dark-300 text-xs truncate flex-1">{match.source}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
              <button
                onClick={() => { setActiveTab('Risk Reports'); setSelectedReport(video.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-dark-200 hover:text-white text-xs font-medium transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5" /> View Full Report
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-dark-200 hover:text-white text-xs font-medium transition-colors">
                <Lock className="w-3.5 h-3.5" /> Keep Private
              </button>
              {video.copyrightStatus === 'clear' && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/10 hover:bg-neon-green/20 text-neon-green text-xs font-medium transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Clear for Publishing
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // ═══════════════════════════════════════════
  //  RISK REPORTS TAB
  // ═══════════════════════════════════════════
  const renderRiskReports = () => {
    const reportVideo = selectedReport ? videos.find(v => v.id === selectedReport) : null;
    return (
      <div className="space-y-6">
        {/* Video selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {videos.map(v => (
            <button key={v.id} onClick={() => setSelectedReport(v.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedReport === v.id
                ? 'bg-white/[0.1] text-white border-white/[0.12]'
                : 'bg-white/[0.03] text-dark-300 hover:text-white border-white/[0.04] hover:border-white/[0.08]'}`}
            >
              {v.title}
            </button>
          ))}
        </div>

        {reportVideo ? (
          <motion.div {...anim(0)} className="space-y-5">
            {/* Summary card */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{reportVideo.title}</h3>
                <StatusBadge status={reportVideo.copyrightStatus} />
              </div>

              {/* Timeline visualization */}
              <div className="mb-5">
                <p className="text-sm text-dark-300 mb-2">Flagged Segments Timeline</p>
                <div className="relative h-8 bg-dark-700 rounded-lg overflow-hidden border border-white/[0.04]">
                  {/* Full timeline bar */}
                  <div className="absolute inset-0 bg-neon-green/5" />
                  {/* Flagged segments */}
                  {(matchData[reportVideo.id] || []).map((match, mi) => {
                    const left = (match.startTime / reportVideo.duration) * 100;
                    const width = Math.max(((match.endTime - match.startTime) / reportVideo.duration) * 100, 1);
                    const color = match.type === 'audio' ? 'bg-neon-orange' : match.type === 'visual' ? 'bg-neon-purple' : 'bg-neon-cyan';
                    return (
                      <div key={mi} className={`absolute top-0 h-full ${color} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                        style={{ left: `${left}%`, width: `${width}%`, minWidth: '4px' }}
                        title={`${formatTimestamp(match.startTime)} – ${formatTimestamp(match.endTime)} (${match.confidence}%)`}
                      />
                    );
                  })}
                  {/* Timeline markers */}
                  {[0, 25, 50, 75, 100].map(pct => (
                    <div key={pct} className="absolute top-0 h-full border-l border-white/[0.06]" style={{ left: `${pct}%` }}>
                      <span className="absolute -bottom-5 -translate-x-1/2 text-[10px] text-dark-400">
                        {formatTimestamp(Math.floor((pct / 100) * reportVideo.duration))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-5" />
                {/* Legend */}
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-3 rounded bg-neon-orange/60" /> Audio</span>
                  <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-3 rounded bg-neon-purple/60" /> Visual</span>
                  <span className="flex items-center gap-1.5 text-xs text-dark-300"><span className="w-3 h-3 rounded bg-neon-cyan/60" /> Text/Logo</span>
                </div>
              </div>

              {/* Risk breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {(['audio', 'visual', 'text'] as const).map(type => {
                  const count = (matchData[reportVideo.id] || []).filter(m => m.type === type).length;
                  const icons: Record<string, React.ReactNode> = { audio: <Volume2 className="w-4 h-4" />, visual: <Eye className="w-4 h-4" />, text: <Type className="w-4 h-4" /> };
                  const labels: Record<string, string> = { audio: 'Audio Matches', visual: 'Visual Matches', text: 'Text/Logo Matches' };
                  return (
                    <div key={type} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2 text-dark-300 mb-1">
                        {icons[type]}
                        <span className="text-sm">{labels[type]}</span>
                      </div>
                      <span className="text-xl font-bold text-white">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed match list */}
              {(matchData[reportVideo.id] || []).length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-dark-200">Detected Matches</h4>
                  {(matchData[reportVideo.id] || []).map((match, mi) => (
                    <motion.div key={mi} {...anim(mi)} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-dark-300">{matchTypeIcons[match.type]}</span>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white text-sm font-medium">{match.type.charAt(0).toUpperCase() + match.type.slice(1)} Match</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                AI-Detected Potential Match
                              </span>
                            </div>
                            <p className="text-xs text-dark-300">{match.source}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm text-dark-200">{formatTimestamp(match.startTime)} – {formatTimestamp(match.endTime)}</span>
                          <div className={`text-xs font-medium mt-0.5 ${match.confidence >= 70 ? 'text-neon-red' : match.confidence >= 40 ? 'text-neon-orange' : 'text-neon-green'}`}>
                            {match.confidence}% confidence
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-neon-green/5 border border-neon-green/15">
                  <ShieldCheck className="w-5 h-5 text-neon-green" />
                  <span className="text-sm text-neon-green font-medium">No copyright matches detected — clear for publishing</span>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 mt-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <Info className="w-4 h-4 text-dark-400 shrink-0 mt-0.5" />
                <p className="text-xs text-dark-400">
                  Results labeled "AI-Detected Potential Match" are pre-upload risk estimates. Only Content ID results after uploading are "YouTube Confirmed Claim" determinations.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <BarChart3 className="w-10 h-10 text-dark-400 mx-auto mb-3" />
            <p className="text-dark-300 text-sm">Select a video above to view its detailed risk report</p>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  //  LICENSED ASSETS TAB
  // ═══════════════════════════════════════════
  const renderLicensedAssets = () => (
    <div className="space-y-6">
      {/* Add new asset form */}
      <motion.div {...anim(0)} className="glass-panel p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-neon-blue" /> Add Licensed Asset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text" placeholder="Asset name" value={newAsset.name}
            onChange={e => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-dark-400 focus:outline-none focus:border-neon-blue/40"
          />
          <select
            value={newAsset.type}
            onChange={e => setNewAsset(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-neon-blue/40 [&>option]:bg-dark-800"
          >
            <option value="music">Music</option>
            <option value="image">Image</option>
            <option value="video-clip">Video Clip</option>
            <option value="sound-effect">Sound Effect</option>
          </select>
          <input
            type="text" placeholder="License type" value={newAsset.license}
            onChange={e => setNewAsset(prev => ({ ...prev, license: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-dark-400 focus:outline-none focus:border-neon-blue/40"
          />
          <button onClick={addAsset}
            className="px-4 py-2 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue text-sm font-medium border border-neon-blue/20 transition-colors"
          >
            Add Asset
          </button>
        </div>
      </motion.div>

      {/* Asset list */}
      <div className="space-y-2">
        <AnimatePresence>
          {licensedAssets.map((asset, i) => (
            <motion.div key={asset.id} {...anim(i)} exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-dark-300">
                  {typeIcons[asset.type]}
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">{asset.name}</h4>
                  <p className="text-xs text-dark-400">{asset.license}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeBadgeColors[asset.type]}`}>
                  {typeIcons[asset.type]}
                  {asset.type === 'video-clip' ? 'Video Clip' : asset.type === 'sound-effect' ? 'Sound Effect' : asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                </span>
                <div className="text-right">
                  <p className="text-xs text-dark-300">Expires</p>
                  <p className="text-xs text-dark-200">{new Date(asset.expiry).toLocaleDateString()}</p>
                </div>
                <button onClick={() => removeAsset(asset.id)}
                  className="p-1.5 rounded-lg hover:bg-neon-red/10 text-dark-400 hover:text-neon-red transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  //  SETTINGS TAB
  // ═══════════════════════════════════════════
  const renderSettings = () => (
    <div className="space-y-6">
      {/* Risk tolerance */}
      <motion.div {...anim(0)} className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-neon-blue" />
          <h3 className="text-white font-semibold">Risk Tolerance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['strict', 'moderate', 'permissive'] as const).map(level => {
            const labels: Record<string, string> = {
              strict: 'Block any flagged content — maximum safety',
              moderate: 'Allow low-confidence matches with review',
              permissive: 'Only block confirmed claims',
            };
            const icons: Record<string, React.ReactNode> = {
              strict: <ShieldCheck className="w-5 h-5" />,
              moderate: <ShieldAlert className="w-5 h-5" />,
              permissive: <Unlock className="w-5 h-5" />,
            };
            const isActive = riskTolerance === level;
            return (
              <button key={level}
                onClick={() => { setRiskTolerance(level); updateAutomation({ copyrightPolicy: level }); }}
                className={`p-4 rounded-xl text-left transition-all border ${isActive
                  ? 'bg-neon-blue/10 border-neon-blue/30 shadow-[0_0_16px_rgba(59,130,246,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]'}`}
              >
                <div className={`mb-2 ${isActive ? 'text-neon-blue' : 'text-dark-300'}`}>{icons[level]}</div>
                <p className={`text-sm font-semibold mb-1 ${isActive ? 'text-white' : 'text-dark-200'}`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </p>
                <p className="text-xs text-dark-400">{labels[level]}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Auto-actions */}
      <motion.div {...anim(1)} className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-neon-purple" />
          <h3 className="text-white font-semibold">Auto-Actions</h3>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-sm text-dark-200 mb-2 block">On AI Warning Detected</label>
            <select value={autoActionWarning} onChange={e => setAutoActionWarning(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-neon-blue/40 [&>option]:bg-dark-800"
            >
              <option value="keep-private">Keep video private for review</option>
              <option value="notify">Notify me and continue</option>
              <option value="pause-upload">Pause upload immediately</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-dark-200 mb-2 block">On YouTube Claim Detected</label>
            <select value={autoActionClaim} onChange={e => setAutoActionClaim(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-neon-blue/40 [&>option]:bg-dark-800"
            >
              <option value="block-publish">Block from publishing</option>
              <option value="keep-private">Set to private</option>
              <option value="notify">Notify only — do not change visibility</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Integration placeholders */}
      <motion.div {...anim(2)} className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-white font-semibold">Copyright Detection Integrations</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: 'YouTube Content ID', desc: 'Post-upload verification via YouTube API', status: 'connected' },
            { name: 'Audible Magic', desc: 'Audio fingerprinting service', status: 'not-configured' },
            { name: 'PixMatch Visual', desc: 'Image & scene detection', status: 'not-configured' },
          ].map((svc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div>
                <p className="text-sm text-white font-medium">{svc.name}</p>
                <p className="text-xs text-dark-400">{svc.desc}</p>
              </div>
              {svc.status === 'connected' ? (
                <span className="flex items-center gap-1.5 text-xs text-neon-green font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-dark-200 hover:text-white text-xs font-medium transition-colors">
                  Configure
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Never auto-publish toggle */}
      <motion.div {...anim(3)} className="glass-panel p-5">
        <ToggleSwitch
          enabled={neverAutoPublish}
          onChange={setNeverAutoPublish}
          label="Never auto-publish with unresolved warnings"
          description="Videos with any pending copyright warnings will remain private until manually reviewed and cleared."
        />
      </motion.div>
    </div>
  );

  // ═══════════════════════════════════════════
  //  MAIN RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={<Shield className="w-6 h-6" />}
        title="Copyright Safety Center"
        subtitle="Protect your channel from copyright claims and strikes"
      />

      {/* Disclaimer banner */}
      <motion.div {...anim(0)}
        className="glass-panel p-4 border-neon-orange/20 bg-gradient-to-r from-neon-orange/[0.04] to-transparent"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neon-orange/10 shrink-0">
            <AlertTriangle className="w-5 h-5 text-neon-orange" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neon-orange mb-1">Important Disclaimer</p>
            <p className="text-sm text-dark-200 leading-relaxed">
              Pre-upload AI screening provides risk indicators but cannot guarantee no copyright claims will occur.
              Only YouTube's Content ID system makes definitive determinations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          {activeTab === 'Active Scans' && renderActiveScans()}
          {activeTab === 'Risk Reports' && renderRiskReports()}
          {activeTab === 'Licensed Assets' && renderLicensedAssets()}
          {activeTab === 'Settings' && renderSettings()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CopyrightSafety;
