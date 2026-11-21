import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon, ChevronDown, Check, Monitor, Smartphone,
  Type, Palette, LayoutGrid, Sparkles, Trophy, Lightbulb,
  Download, CheckCircle, Wand2,
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
  badge: string;
}

const makeThumbnails = (title: string): ThumbnailConcept[] => {
  const shortTitle = title.split(' ').slice(0, 4).join(' ') || 'NEW VIDEO';
  return [
    {
      id: 'th-1',
      label: 'Bold Impact',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3b82f6 50%, #8b5cf6 100%)',
      overlayText: shortTitle.toUpperCase(),
      overlaySubtext: 'STEP-BY-STEP GUIDE',
      badge: 'MUST WATCH',
      ctr: 9.4,
      style: 'bold',
    },
    {
      id: 'th-2',
      label: 'Curiosity Hook',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 50%, #f97316 100%)',
      overlayText: 'THE TRUTH ABOUT THIS...',
      overlaySubtext: 'WHAT THEY HID FROM YOU',
      badge: '🔥 EXPOSED',
      ctr: 9.8,
      style: 'curiosity',
    },
    {
      id: 'th-3',
      label: 'Neon Contrast',
      gradient: 'linear-gradient(135deg, #022c22 0%, #059669 50%, #06b6d4 100%)',
      overlayText: shortTitle.toUpperCase(),
      overlaySubtext: 'DON’T MISS THIS in 2027',
      badge: 'NEW',
      ctr: 8.9,
      style: 'neon',
    },
    {
      id: 'th-4',
      label: 'Dark Cinematic',
      gradient: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
      overlayText: shortTitle,
      overlaySubtext: 'Complete Masterclass',
      badge: '4K ULTRA',
      ctr: 8.2,
      style: 'cinematic',
    },
  ];
};

const FONT_STYLES = ['Impact', 'Arial Black', 'Trebuchet MS', 'Verdana', 'Georgia'];
const COLOR_PALETTES = [
  { name: 'Electric', primary: '#3b82f6', secondary: '#8b5cf6', text: '#ffffff' },
  { name: 'Fire', primary: '#ef4444', secondary: '#f97316', text: '#ffffff' },
  { name: 'Toxic Gold', primary: '#eab308', secondary: '#84cc16', text: '#000000' },
  { name: 'Neon Cyan', primary: '#06b6d4', secondary: '#10b981', text: '#ffffff' },
];

export const ThumbnailStudio: React.FC = () => {
  const { videos, updateVideo, addNotification } = useStore();

  const [selectedVideoId, setSelectedVideoId] = useState(videos[0]?.id || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState<string>('th-1');
  const [overlayText, setOverlayText] = useState('');
  const [subText, setSubText] = useState('');
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0]);
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === selectedVideoId), [videos, selectedVideoId]);

  const thumbnails = useMemo(() => (selectedVideo ? makeThumbnails(selectedVideo.title) : []), [selectedVideo]);

  const activeConcept = useMemo(
    () => thumbnails.find((t) => t.id === selectedThumb) || thumbnails[0],
    [thumbnails, selectedThumb]
  );

  const handleSelectVideo = (id: string) => {
    setSelectedVideoId(id);
    setDropdownOpen(false);
    const v = videos.find((vid) => vid.id === id);
    if (v) {
      setOverlayText(v.title.split(' ').slice(0, 4).join(' ').toUpperCase());
      setSubText('MUST WATCH');
    }
  };

  // ─── Real 1280x720 Canvas Generator ───
  const generateCanvas = (callback: (dataUrl: string, blob: Blob) => void) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderElements = () => {
      // 1. Background: Draw captured video keyframe if available, or selected gradient
      if (selectedVideo?.thumbnail && selectedVideo.thumbnail.startsWith('data:image')) {
        const img = new window.Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1280, 720);

          // Dark vignette overlay for readability
          const vignette = ctx.createLinearGradient(0, 0, 1280, 720);
          vignette.addColorStop(0, 'rgba(0,0,0,0.4)');
          vignette.addColorStop(0.5, 'rgba(0,0,0,0.6)');
          vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, 1280, 720);

          drawTextAndBadges();
        };
        img.src = selectedVideo.thumbnail;
      } else {
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        grad.addColorStop(0, selectedPalette.primary);
        grad.addColorStop(0.6, selectedPalette.secondary);
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);

        drawTextAndBadges();
      }
    };

    const drawTextAndBadges = () => {
      // Badge Pill
      const badgeText = activeConcept?.badge || 'WATCH NOW';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = selectedPalette.primary;
      ctx.beginPath();
      ctx.roundRect(80, 100, 260, 56, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, 105, 140);

      // Main Bold Headline Text
      const textToDraw = (overlayText || activeConcept?.overlayText || 'NEW VIDEO').toUpperCase();
      ctx.font = `900 76px "${fontStyle}", Impact, sans-serif`;
      ctx.textAlign = 'left';

      // Drop Shadow & Stroke
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 14;
      ctx.strokeText(textToDraw, 80, 360);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(textToDraw, 80, 360);

      // Subtext
      const sub = subText || activeConcept?.overlaySubtext || 'COMPLETE GUIDE';
      ctx.font = 'bold 44px sans-serif';
      ctx.shadowBlur = 12;
      ctx.fillStyle = selectedPalette.primary;
      ctx.fillText(sub, 80, 440);

      canvas.toBlob((blob) => {
        if (blob) {
          callback(canvas.toDataURL('image/jpeg', 0.95), blob);
        }
      }, 'image/jpeg', 0.95);
    };

    renderElements();
  };

  const handleDownloadThumbnail = () => {
    generateCanvas((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `AutoTube-Thumbnail-${selectedVideo?.id || 'export'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addNotification({
        type: 'success',
        title: 'Thumbnail Exported',
        message: 'Downloaded 1280x720 high-resolution thumbnail JPEG to your computer!',
        videoId: selectedVideoId,
      });
    });
  };

  const handleApplyAsThumbnail = () => {
    if (!selectedVideoId) return;
    generateCanvas((dataUrl) => {
      updateVideo(selectedVideoId, { thumbnail: dataUrl });
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 2500);

      addNotification({
        type: 'success',
        title: 'Thumbnail Updated',
        message: 'Applied custom 1280x720 thumbnail to the video asset!',
        videoId: selectedVideoId,
      });
    });
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto pb-12">
      <PageHeader
        icon={<ImageIcon size={22} />}
        title="Thumbnail Studio"
        subtitle="AI-designed 1280x720 high-CTR thumbnails. Customize typography, keyframe overlays & export directly."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadThumbnail}
              disabled={!selectedVideo}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download size={14} />
              <span>Download 1280x720 Image</span>
            </button>
            <button
              onClick={handleApplyAsThumbnail}
              disabled={!selectedVideo}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                appliedSuccess
                  ? 'bg-neon-green text-black'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-blue/20'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle size={14} />
                  <span>Applied to Video!</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Apply to Video</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Target Video Selector */}
      <div className="relative z-20">
        <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block mb-2">
          Select Video for Thumbnail
        </label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full max-w-xl glass-panel px-4 py-3 flex items-center justify-between text-left hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0">
              <ImageIcon size={16} className="text-neon-purple" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {selectedVideo ? selectedVideo.title : 'No videos in queue'}
              </div>
              <div className="text-[11px] text-dark-400">
                {selectedVideo ? `${selectedVideo.channelName} • Resolution: 1280x720` : 'Upload a video first'}
              </div>
            </div>
          </div>
          <ChevronDown size={18} className={`text-dark-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full max-w-xl glass-panel bg-dark-900/95 border border-white/10 shadow-2xl rounded-xl overflow-hidden py-1">
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => handleSelectVideo(v.id)}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors ${
                  v.id === selectedVideoId ? 'bg-neon-blue/10 text-neon-blue' : 'text-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{v.title}</div>
                  <div className="text-xs text-dark-400">{v.channelName}</div>
                </div>
                {v.id === selectedVideoId && <Check size={16} className="text-neon-blue shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo ? (
        <div className="space-y-8">
          {/* ── Concepts Grid ── */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">AI Thumbnail Compositions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {thumbnails.map((th) => {
                const isSelected = selectedThumb === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setSelectedThumb(th.id)}
                    className={`glass-panel overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-neon-blue shadow-lg shadow-neon-blue/20' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="aspect-video relative p-4 flex flex-col justify-between overflow-hidden"
                      style={{ background: th.gradient }}
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white self-start">
                        {th.badge}
                      </span>
                      <div>
                        <div className="text-sm font-black text-white drop-shadow-md truncate">
                          {overlayText || th.overlayText}
                        </div>
                        <div className="text-[10px] text-white/80 font-medium">
                          {subText || th.overlaySubtext}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-dark-950 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{th.label}</span>
                      <span className="text-[11px] font-bold text-neon-green">{th.ctr}% CTR</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Customization Panel ── */}
          <div className="glass-panel p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Palette size={18} className="text-neon-cyan" />
              Live Customizer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-medium text-dark-300 block mb-1.5 flex items-center gap-1.5">
                  <Type size={14} /> Main Headline Text
                </label>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="e.g. ULTIMATE GUIDE"
                  className="glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-dark-300 block mb-1.5">
                  Sub-heading / Promise
                </label>
                <input
                  type="text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  placeholder="e.g. COMPLETE WALKTHROUGH"
                  className="glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-dark-300 block mb-1.5">Font Style</label>
                <select
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value)}
                  className="glass-input text-xs appearance-none cursor-pointer"
                >
                  {FONT_STYLES.map((f) => (
                    <option key={f} value={f} className="bg-dark-900 text-white">
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Large Desktop & Mobile Previews ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Monitor size={16} className="text-neon-blue" />
                  YouTube Desktop Feed Simulation
                </h4>
                <span className="text-xs font-mono text-dark-400">1280 x 720 (16:9)</span>
              </div>

              <div
                className="aspect-video w-full rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-2xl"
                style={{
                  background: selectedVideo.thumbnail
                    ? `url(${selectedVideo.thumbnail}) center/cover`
                    : activeConcept?.gradient || 'linear-gradient(135deg, #1e1b4b, #06b6d4)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
                <div className="relative z-10">
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-neon-blue text-white shadow">
                    {activeConcept?.badge || 'WATCH NOW'}
                  </span>
                </div>
                <div className="relative z-10">
                  <h2
                    className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                    style={{ fontFamily: fontStyle }}
                  >
                    {(overlayText || activeConcept?.overlayText || 'NEW VIDEO').toUpperCase()}
                  </h2>
                  <p className="text-base font-bold text-neon-blue drop-shadow mt-1">
                    {subText || activeConcept?.overlaySubtext || 'MUST WATCH'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col items-center">
              <h4 className="text-sm font-bold text-white mb-4 self-start flex items-center gap-2">
                <Smartphone size={16} className="text-neon-purple" />
                Mobile Feed Scale
              </h4>

              <div className="w-64 rounded-3xl border-4 border-dark-700 bg-dark-950 p-3 shadow-xl">
                <div className="w-16 h-3 rounded-full bg-dark-800 mx-auto mb-3" />
                <div
                  className="aspect-video rounded-xl p-3 flex flex-col justify-between relative overflow-hidden mb-2"
                  style={{
                    background: selectedVideo.thumbnail
                      ? `url(${selectedVideo.thumbnail}) center/cover`
                      : activeConcept?.gradient || 'linear-gradient(135deg, #1e1b4b, #06b6d4)',
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <span className="relative z-10 text-[8px] font-bold bg-neon-blue text-white px-1.5 py-0.5 rounded self-start">
                    {activeConcept?.badge || 'HD'}
                  </span>
                  <div className="relative z-10">
                    <span className="text-xs font-black text-white drop-shadow leading-tight block truncate">
                      {(overlayText || activeConcept?.overlayText || 'NEW VIDEO').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-3/4 rounded bg-white/10 mb-1" />
                <div className="h-2 w-1/2 rounded bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-dark-400">
          Upload or select a video to generate custom thumbnails.
        </div>
      )}
    </div>
  );
};

export default ThumbnailStudio;
