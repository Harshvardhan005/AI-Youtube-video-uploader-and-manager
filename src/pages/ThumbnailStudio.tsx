import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon, ChevronDown, Check, Monitor, Smartphone,
  Type, Palette, LayoutGrid, Sparkles, Trophy, Lightbulb,
} from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { useStore } from '@/store/useStore';

// ─── Thumbnail concept data ───
interface ThumbnailConcept {
  id: string;
  label: string;
  gradient: string;
  overlayText: string;
  overlaySubtext: string;
  ctr: number;
  style: string;
}

const makeThumbnails = (title: string): ThumbnailConcept[] => {
  const shortTitle = title.split(' ').slice(0, 4).join(' ');
  return [
    {
      id: 'th-1',
      label: 'Bold Impact',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      overlayText: shortTitle.toUpperCase(),
      overlaySubtext: 'MUST WATCH',
      ctr: 8.4,
      style: 'bold',
    },
    {
      id: 'th-2',
      label: 'Clean Minimal',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      overlayText: shortTitle,
      overlaySubtext: 'New Video',
      ctr: 7.1,
      style: 'minimal',
    },
    {
      id: 'th-3',
      label: 'Neon Pop',
      gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #f12711 100%)',
      overlayText: shortTitle.toUpperCase(),
      overlaySubtext: '🔥 TRENDING',
      ctr: 9.2,
      style: 'neon',
    },
    {
      id: 'th-4',
      label: 'Dark Cinematic',
      gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)',
      overlayText: shortTitle,
      overlaySubtext: 'Watch Now →',
      ctr: 6.8,
      style: 'cinematic',
    },
  ];
};

const FONT_STYLES = ['Impact', 'Montserrat Bold', 'Bebas Neue', 'Oswald', 'Poppins Bold'];
const COLOR_PALETTES = [
  { name: 'Electric', colors: ['#3b82f6', '#8b5cf6', '#06b6d4'] },
  { name: 'Sunset', colors: ['#f97316', '#ef4444', '#eab308'] },
  { name: 'Nature', colors: ['#22c55e', '#14b8a6', '#06b6d4'] },
  { name: 'Mono', colors: ['#ffffff', '#a1a1aa', '#3f3f46'] },
  { name: 'Candy', colors: ['#ec4899', '#a855f7', '#6366f1'] },
  { name: 'Fire', colors: ['#dc2626', '#f97316', '#fbbf24'] },
];
const LAYOUT_OPTIONS = ['Center Focus', 'Left Aligned', 'Split Frame', 'Bottom Bar'];

const ThumbnailStudio: React.FC = () => {
  const { videos } = useStore();

  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState('');
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0]);
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0].name);
  const [selectedLayout, setSelectedLayout] = useState(LAYOUT_OPTIONS[0]);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === selectedVideoId), [videos, selectedVideoId]);

  const thumbnails = useMemo(() => (selectedVideo ? makeThumbnails(selectedVideo.title) : []), [selectedVideo]);

  const activeConcept = useMemo(() => thumbnails.find((t) => t.id === selectedThumb) || thumbnails[0], [thumbnails, selectedThumb]);

  const bestThumb = useMemo(() => {
    if (!thumbnails.length) return null;
    return [...thumbnails].sort((a, b) => b.ctr - a.ctr)[0];
  }, [thumbnails]);

  const handleSelectVideo = (id: string) => {
    const v = videos.find((vid) => vid.id === id);
    if (!v) return;
    setSelectedVideoId(id);
    setDropdownOpen(false);
    setSelectedThumb(null);
    setOverlayText(v.title.split(' ').slice(0, 4).join(' '));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={<ImageIcon size={22} />}
        title="Thumbnail Studio"
        subtitle="AI-generated click-worthy thumbnails"
      />

      {/* Video Selector */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-4">
        <label className="text-sm text-dark-300 mb-2 block">Select a video</label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left text-white hover:bg-white/[0.06] transition-colors"
          >
            <span className={selectedVideo ? 'text-white' : 'text-dark-400'}>
              {selectedVideo ? selectedVideo.title : 'Choose a video…'}
            </span>
            <ChevronDown size={16} className={`text-dark-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute z-30 mt-2 w-full rounded-xl bg-dark-800 border border-white/[0.08] shadow-xl overflow-hidden"
              >
                {videos.map((v) => (
                  <li key={v.id}>
                    <button
                      onClick={() => handleSelectVideo(v.id)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-white/[0.06] transition-colors flex items-center gap-3 ${
                        v.id === selectedVideoId ? 'bg-white/[0.08] text-neon-blue' : 'text-white'
                      }`}
                    >
                      <div className="w-16 h-9 rounded bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{v.title}</p>
                        <p className="text-xs text-dark-400">{v.channelName}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Panels — only when video selected */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            key={selectedVideoId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* ── Thumbnail Grid ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-neon-purple" />
                <h2 className="text-lg font-semibold text-white">AI Thumbnail Concepts</h2>
                <span className="ml-auto text-xs text-dark-400">4 generated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {thumbnails.map((th, i) => (
                  <motion.div
                    key={th.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 + i * 0.08 }}
                    className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      selectedThumb === th.id
                        ? 'border-neon-blue shadow-lg shadow-neon-blue/20'
                        : 'border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                    onClick={() => setSelectedThumb(th.id)}
                  >
                    {/* 16:9 thumbnail card */}
                    <div className="relative aspect-video" style={{ background: th.gradient }}>
                      {/* Overlay text simulating title */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span
                          className="text-white font-extrabold drop-shadow-lg leading-tight"
                          style={{
                            fontSize: th.style === 'bold' || th.style === 'neon' ? '1.1rem' : '0.95rem',
                            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                            letterSpacing: th.style === 'bold' ? '0.05em' : '0',
                          }}
                        >
                          {overlayText || th.overlayText}
                        </span>
                        <span className="text-white/70 text-xs mt-1.5 font-medium tracking-wide">
                          {th.overlaySubtext}
                        </span>
                      </div>

                      {/* Selection badge */}
                      {selectedThumb === th.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      {/* CTR badge */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 backdrop-blur text-xs text-white/80 font-medium">
                        {th.ctr}% CTR est.
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-dark-800">
                      <span className="text-sm text-dark-200 font-medium">{th.label}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedThumb(th.id); }}
                        className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
                          selectedThumb === th.id
                            ? 'bg-neon-blue/20 text-neon-blue'
                            : 'bg-white/[0.06] text-dark-300 hover:text-white'
                        }`}
                      >
                        {selectedThumb === th.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Customization Panel ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-5">
                <Palette size={18} className="text-neon-cyan" />
                <h2 className="text-lg font-semibold text-white">Customization</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Text overlay */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-dark-300 mb-1.5">
                    <Type size={14} /> Text Overlay
                  </label>
                  <input
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Enter overlay text…"
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-neon-blue/40 transition-colors"
                  />
                </div>

                {/* Font style */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-dark-300 mb-1.5">
                    <Type size={14} /> Font Style
                  </label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/40 transition-colors appearance-none"
                  >
                    {FONT_STYLES.map((f) => (
                      <option key={f} value={f} className="bg-dark-800">{f}</option>
                    ))}
                  </select>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-dark-300 mb-2">
                    <Palette size={14} /> Color Palette
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_PALETTES.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPalette(p.name)}
                        className={`flex items-center gap-1 p-1.5 rounded-lg border transition-all ${
                          selectedPalette === p.name
                            ? 'border-neon-blue bg-white/[0.06]'
                            : 'border-white/[0.06] hover:border-white/[0.15]'
                        }`}
                        title={p.name}
                      >
                        {p.colors.map((c) => (
                          <div key={c} className="w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-dark-300 mb-2">
                    <LayoutGrid size={14} /> Layout
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LAYOUT_OPTIONS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setSelectedLayout(l)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          selectedLayout === l
                            ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30'
                            : 'bg-white/[0.04] text-dark-300 border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Preview ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-5">
                <Monitor size={18} className="text-neon-blue" />
                <h2 className="text-lg font-semibold text-white">Preview</h2>
                <span className="ml-auto text-xs text-dark-400">Desktop & Mobile</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Desktop frame */}
                <div>
                  <p className="text-xs text-dark-400 mb-2 flex items-center gap-1.5"><Monitor size={12} /> Desktop</p>
                  <div className="rounded-xl border border-white/[0.1] bg-dark-800 p-2">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-t-lg bg-dark-900/50">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      </div>
                      <div className="flex-1 h-5 rounded bg-dark-700/50 mx-6" />
                    </div>
                    {/* Thumbnail */}
                    <div
                      className="aspect-video rounded-lg relative overflow-hidden"
                      style={{ background: activeConcept?.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-white font-extrabold text-lg drop-shadow-lg" style={{ fontFamily: fontStyle }}>
                          {overlayText || activeConcept?.overlayText || ''}
                        </span>
                        <span className="text-white/60 text-xs mt-1">{activeConcept?.overlaySubtext}</span>
                      </div>
                    </div>
                    {/* Video info mock */}
                    <div className="mt-3 px-1 pb-1">
                      <div className="h-3 w-3/4 rounded bg-white/[0.08] mb-1.5" />
                      <div className="h-2 w-1/2 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                </div>

                {/* Mobile frame */}
                <div>
                  <p className="text-xs text-dark-400 mb-2 flex items-center gap-1.5"><Smartphone size={12} /> Mobile</p>
                  <div className="mx-auto w-56 rounded-3xl border-2 border-white/[0.1] bg-dark-800 p-2 pb-4">
                    {/* Notch */}
                    <div className="mx-auto w-20 h-4 rounded-b-xl bg-dark-900/80 mb-2" />
                    {/* Thumbnail */}
                    <div
                      className="aspect-video rounded-lg relative overflow-hidden mx-1"
                      style={{ background: activeConcept?.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-white font-bold text-xs drop-shadow-lg leading-tight" style={{ fontFamily: fontStyle }}>
                          {overlayText || activeConcept?.overlayText || ''}
                        </span>
                        <span className="text-white/60 mt-0.5" style={{ fontSize: '0.5rem' }}>{activeConcept?.overlaySubtext}</span>
                      </div>
                    </div>
                    {/* Video info mock */}
                    <div className="mt-2 px-2">
                      <div className="h-2 w-3/4 rounded bg-white/[0.08] mb-1" />
                      <div className="h-1.5 w-1/2 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── A/B Test Recommendation ── */}
            {bestThumb && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="glass-panel p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={18} className="text-neon-orange" />
                  <h2 className="text-lg font-semibold text-white">A/B Test Recommendation</h2>
                </div>
                <div className="flex items-start gap-4">
                  {/* Best thumbnail preview */}
                  <div
                    className="w-40 aspect-video rounded-lg flex-shrink-0 relative overflow-hidden border border-neon-green/30"
                    style={{ background: bestThumb.gradient }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-white font-bold text-xs drop-shadow-lg">{bestThumb.overlayText}</span>
                    </div>
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-neon-green/20 border border-neon-green/30 text-neon-green text-[10px] font-bold">
                      BEST
                    </div>
                  </div>
                  {/* Reasoning */}
                  <div className="flex-1 space-y-3">
                    <div className="glass-panel p-3">
                      <p className="text-sm text-white font-medium mb-1">
                        <Lightbulb size={14} className="inline mr-1.5 text-neon-orange" />
                        AI recommends: <span className="text-neon-green">{bestThumb.label}</span>
                      </p>
                      <p className="text-xs text-dark-300 leading-relaxed">
                        Based on analysis of top-performing thumbnails in the <strong>{selectedVideo.category}</strong> category,
                        the "{bestThumb.label}" style shows the highest estimated CTR at <strong>{bestThumb.ctr}%</strong>.
                        High-contrast colors with bold text overlays consistently outperform minimal designs
                        for this content type. The warm color palette triggers urgency and curiosity,
                        driving 15-23% more clicks in A/B tests with similar audiences.
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      {thumbnails.map((t) => (
                        <div key={t.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                          t.id === bestThumb.id ? 'bg-neon-green/10 text-neon-green' : 'bg-white/[0.04] text-dark-400'
                        }`}>
                          <div className="w-3 h-3 rounded" style={{ background: t.gradient }} />
                          {t.ctr}%
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThumbnailStudio;
