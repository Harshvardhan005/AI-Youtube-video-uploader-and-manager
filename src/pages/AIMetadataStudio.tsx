import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ChevronDown, Check, RotateCcw, X, Plus, Hash,
  TrendingUp, FileText, Tag, Globe, BarChart3, Wand2, Copy,
  Brain, RefreshCw, Key, CheckCircle,
} from 'lucide-react';
import { PageHeader, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { AIService, GeneratedMetadata } from '@/services/ai';

interface TitleVariant {
  id: string;
  text: string;
  seoScore: number;
}

const YOUTUBE_CATEGORIES = [
  'Film & Animation', 'Autos & Vehicles', 'Music', 'Pets & Animals',
  'Sports', 'Travel & Events', 'Gaming', 'People & Blogs',
  'Comedy', 'Entertainment', 'News & Politics', 'Howto & Style',
  'Education', 'Science & Technology', 'Nonprofits & Activism',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
];

const SUGGESTED_TAGS = [
  'tutorial', '2027', 'howto', 'beginner', 'advanced', 'review',
  'tips', 'guide', 'best', 'top10', 'explained', 'walkthrough',
];

// ─── Circular Progress ───
const CircularProgress: React.FC<{ score: number; size?: number }> = ({ score, size = 48 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#22c55e' : score >= 75 ? '#3b82f6' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {score}
      </span>
    </div>
  );
};

export const AIMetadataStudio: React.FC = () => {
  const { videos, updateVideo, apiKeys, generateAIEnhancement, setCurrentPage } = useStore();

  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [titleVariants, setTitleVariants] = useState<TitleVariant[]>([]);
  const [appliedTitle, setAppliedTitle] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('Science & Technology');
  const [language, setLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === selectedVideoId), [videos, selectedVideoId]);

  // Sync state whenever selectedVideo changes
  useEffect(() => {
    if (selectedVideo) {
      setAppliedTitle(selectedVideo.title);
      setDescriptionText(selectedVideo.description || '');
      setTags(selectedVideo.tags || []);
      setCategory(selectedVideo.category || 'Science & Technology');
      setLanguage(selectedVideo.language || 'en');

      // Initialize title variants from the video
      setTitleVariants([
        { id: 't1', text: `${selectedVideo.title} (Complete Guide)`, seoScore: 94 },
        { id: 't2', text: `Why ${selectedVideo.title} Changes Everything in 2027`, seoScore: 91 },
        { id: 't3', text: `The Truth About ${selectedVideo.title} Nobody Tells You`, seoScore: 88 },
        { id: 't4', text: `Top 5 ${selectedVideo.title} Secrets You Need to Know`, seoScore: 85 },
        { id: 't5', text: `How to Master ${selectedVideo.title} (Step-by-Step)`, seoScore: 92 },
      ]);
    }
  }, [selectedVideo]);

  const handleSelectVideo = (id: string) => {
    setSelectedVideoId(id);
    setDropdownOpen(false);
  };

  // Run live AI generation via Gemini or heuristic
  const handleGenerateLiveAI = async () => {
    if (!selectedVideo) return;
    setIsGenerating(true);

    try {
      const result = await AIService.generateMetadata({
        title: appliedTitle || selectedVideo.title,
        fileName: selectedVideo.title,
        duration: selectedVideo.duration,
        category,
        geminiApiKey: apiKeys.geminiApiKey,
      });

      if (result) {
        setTitleVariants(result.titles.map((t, idx) => ({ id: `ai-${idx}`, text: t.text, seoScore: t.score })));
        if (result.titles[0]) setAppliedTitle(result.titles[0].text);
        setDescriptionText(result.description);
        setTags(result.tags);
        if (result.recommendedCategory) setCategory(result.recommendedCategory);
      }
    } catch (err) {
      console.error('Error generating AI metadata:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTitle = (title: string) => {
    setAppliedTitle(title);
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleApplyToVideo = () => {
    if (!selectedVideoId) return;
    updateVideo(selectedVideoId, {
      title: appliedTitle,
      description: descriptionText,
      tags,
      category,
      language,
    });
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2500);
  };

  // Calculate real scores
  const titleScore = useMemo(() => {
    const len = appliedTitle.length;
    if (len >= 40 && len <= 70) return 96;
    if (len >= 25 && len <= 80) return 88;
    return 74;
  }, [appliedTitle]);

  const descScore = useMemo(() => {
    const len = descriptionText.length;
    if (len >= 300) return 94;
    if (len >= 150) return 85;
    return 65;
  }, [descriptionText]);

  const tagScore = useMemo(() => {
    if (tags.length >= 10) return 95;
    if (tags.length >= 5) return 82;
    return 60;
  }, [tags]);

  const overallScore = Math.round((titleScore * 0.4) + (descScore * 0.35) + (tagScore * 0.25));

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto pb-12">
      {/* Header */}
      <PageHeader
        icon={<Sparkles size={22} />}
        title="AI Metadata Studio"
        subtitle="AI-powered SEO optimization, viral title generation, high-converting descriptions & targeted tag clusters."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateLiveAI}
              disabled={isGenerating || !selectedVideo}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-xs shadow-lg shadow-neon-purple/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Generating with AI...</span>
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  <span>Regenerate with {apiKeys.geminiApiKey ? 'Gemini 1.5' : 'AI'}</span>
                </>
              )}
            </button>
            <button
              onClick={handleApplyToVideo}
              disabled={!selectedVideo}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                appliedSuccess
                  ? 'bg-neon-green text-black'
                  : 'bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle size={14} />
                  <span>Applied!</span>
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

      {/* Video Selector Dropdown */}
      <div className="relative z-20">
        <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block mb-2">
          Select Target Video
        </label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full max-w-xl glass-panel px-4 py-3 flex items-center justify-between text-left hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-neon-blue" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {selectedVideo ? selectedVideo.title : 'No videos in queue'}
              </div>
              <div className="text-[11px] text-dark-400">
                {selectedVideo ? `${selectedVideo.channelName} • ${selectedVideo.status}` : 'Upload a video first'}
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

      {/* ── Main Content Grid ── */}
      {selectedVideo ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Titles & Descriptions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Title Input & Character Counter */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-neon-blue" />
                  Active Video Title
                </label>
                <span className={`text-xs font-mono font-medium ${
                  appliedTitle.length > 70 ? 'text-neon-orange' : 'text-neon-green'
                }`}>
                  {appliedTitle.length} / 100 characters (optimal: 40-70)
                </span>
              </div>
              <input
                type="text"
                value={appliedTitle}
                onChange={(e) => setAppliedTitle(e.target.value)}
                placeholder="Enter YouTube video title..."
                className="glass-input font-medium text-sm"
              />
            </div>

            {/* Generated Title Variants */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-neon-purple" />
                  AI Suggested Title Variants
                </h3>
                <span className="text-xs text-dark-400">Ranked by Click-Through Score</span>
              </div>

              <div className="space-y-3">
                {titleVariants.map((variant) => {
                  const isCurrent = appliedTitle === variant.text;
                  return (
                    <div
                      key={variant.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-neon-blue/40 bg-neon-blue/5'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CircularProgress score={variant.seoScore} size={38} />
                        <span className="text-xs md:text-sm font-medium text-white truncate">
                          {variant.text}
                        </span>
                      </div>

                      <button
                        onClick={() => handleUseTitle(variant.text)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-neon-blue/20 text-neon-blue'
                            : 'bg-white/5 hover:bg-white/10 text-dark-200 hover:text-white'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Use Title'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Editor */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-neon-cyan" />
                  YouTube Video Description
                </label>
                <span className="text-xs text-dark-400 font-mono">
                  {descriptionText.length} / 5000 chars
                </span>
              </div>
              <textarea
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                rows={9}
                placeholder="Write description with summary, timestamps, links, and hashtags..."
                className="glass-input font-mono text-xs leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Right Column: SEO Score & Tags */}
          <div className="space-y-6">
            {/* Overall SEO Score Card */}
            <div className="glass-panel p-6 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 size={18} className="text-neon-green" />
                    Overall SEO Score
                  </h3>
                  <p className="text-xs text-dark-300 mt-0.5">Algorithmic readiness for YouTube search & feed</p>
                </div>
                <CircularProgress score={overallScore} size={54} />
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                <div>
                  <div className="flex justify-between text-dark-300 mb-1">
                    <span>Title Strength ({titleScore}/100)</span>
                    <span className="text-neon-blue font-semibold">{titleScore >= 90 ? 'Excellent' : 'Good'}</span>
                  </div>
                  <ProgressBar progress={titleScore} color="blue" />
                </div>
                <div>
                  <div className="flex justify-between text-dark-300 mb-1">
                    <span>Description Depth ({descScore}/100)</span>
                    <span className="text-neon-purple font-semibold">{descScore >= 80 ? 'Comprehensive' : 'Brief'}</span>
                  </div>
                  <ProgressBar progress={descScore} color="purple" />
                </div>
                <div>
                  <div className="flex justify-between text-dark-300 mb-1">
                    <span>Tag Saturation ({tagScore}/100)</span>
                    <span className="text-neon-green font-semibold">{tags.length} tags</span>
                  </div>
                  <ProgressBar progress={tagScore} color="green" />
                </div>
              </div>
            </div>

            {/* Tags & Hashtags Editor */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag size={16} className="text-neon-orange" />
                  Search Tags ({tags.length})
                </label>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Type tag and press Enter..."
                  className="glass-input text-xs py-2"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 mb-4">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white"
                  >
                    <span>{t}</span>
                    <button onClick={() => handleRemoveTag(t)} className="text-dark-400 hover:text-neon-red">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggested Tags */}
              <div className="pt-3 border-t border-white/5">
                <div className="text-[11px] font-semibold text-dark-400 mb-2">Click to Add Suggestions:</div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleAddSuggestedTag(st)}
                      disabled={tags.includes(st)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-blue/10 hover:text-neon-blue border border-white/5 text-dark-300 disabled:opacity-30"
                    >
                      + {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category & Language Selection */}
            <div className="glass-panel p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center gap-2">
                  <Globe size={14} className="text-neon-cyan" />
                  YouTube Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input text-xs appearance-none cursor-pointer"
                >
                  {YOUTUBE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1.5">Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="glass-input text-xs appearance-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-dark-900 text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-dark-400">
          Please upload or select a video to begin generating metadata.
        </div>
      )}
    </div>
  );
};

export default AIMetadataStudio;
