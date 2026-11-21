import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ChevronDown, Check, RotateCcw, X, Plus, Hash,
  TrendingUp, FileText, Tag, Globe, BarChart3, Wand2, Copy,
} from 'lucide-react';
import { PageHeader, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

// ─── Mock Generated Metadata ───
interface TitleVariant {
  id: string;
  text: string;
  seoScore: number;
}

const makeTitles = (base: string): TitleVariant[] => [
  { id: 't1', text: `${base} — Ultimate Guide 2027`, seoScore: 94 },
  { id: 't2', text: `Why ${base} Changes Everything`, seoScore: 88 },
  { id: 't3', text: `${base}: What Nobody Tells You`, seoScore: 91 },
  { id: 't4', text: `I Tried ${base} for 30 Days — Here's What Happened`, seoScore: 86 },
  { id: 't5', text: `The Truth About ${base} (Must Watch)`, seoScore: 82 },
];

const YOUTUBE_CATEGORIES = [
  'Film & Animation', 'Autos & Vehicles', 'Music', 'Pets & Animals',
  'Sports', 'Short Movies', 'Travel & Events', 'Gaming', 'Videoblogging',
  'People & Blogs', 'Comedy', 'Entertainment', 'News & Politics',
  'Howto & Style', 'Education', 'Science & Technology', 'Nonprofits & Activism',
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
  'tips', 'guide', 'best', 'top10', 'explained', 'react',
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

// ─── Component ───
const AIMetadataStudio: React.FC = () => {
  const { videos, updateVideo } = useStore();

  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('en');
  const [appliedTitle, setAppliedTitle] = useState('');
  const [descVersion, setDescVersion] = useState(0);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === selectedVideoId), [videos, selectedVideoId]);

  const titleVariants = useMemo(
    () => (selectedVideo ? makeTitles(selectedVideo.title.split(' ').slice(0, 3).join(' ')) : []),
    [selectedVideo],
  );

  // Auto-populate fields when a video is selected
  const handleSelectVideo = (id: string) => {
    const v = videos.find((vid) => vid.id === id);
    if (!v) return;
    setSelectedVideoId(id);
    setDropdownOpen(false);
    setDescriptionText(
      v.description +
        '\n\n🔔 Subscribe for more content like this!\n👍 Like & Share if you found this helpful\n\n' +
        '#' + v.tags.join(' #'),
    );
    setTags([...v.tags]);
    setCategory(v.category);
    setLanguage(v.language);
    setAppliedTitle('');
    setDescVersion((p) => p + 1);
  };

  const handleAddTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((p) => [...p, t]);
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => setTags((p) => p.filter((x) => x !== tag));

  const handleRegenerate = () => {
    if (!selectedVideo) return;
    setDescriptionText(
      `[AI-regenerated v${descVersion + 1}] ` +
        selectedVideo.description +
        '\n\n📌 Key Takeaways:\n• Point 1\n• Point 2\n• Point 3\n\n🔗 Links mentioned in this video:\n— Coming soon\n\n' +
        '#' + tags.join(' #'),
    );
    setDescVersion((p) => p + 1);
  };

  const handleApply = () => {
    if (!selectedVideo) return;
    updateVideo(selectedVideo.id, {
      title: appliedTitle || selectedVideo.title,
      description: descriptionText,
      tags,
      category,
      language,
    });
  };

  // ─── SEO Score Calculation ───
  const titleScore = useMemo(() => {
    if (!appliedTitle && !selectedVideo) return 0;
    const t = appliedTitle || selectedVideo?.title || '';
    let s = 50;
    if (t.length >= 40 && t.length <= 70) s += 25;
    else if (t.length > 20) s += 10;
    if (/[0-9]/.test(t)) s += 10;
    if (/[—\-|:]/.test(t)) s += 5;
    if (t.length > 0) s += 10;
    return Math.min(100, s);
  }, [appliedTitle, selectedVideo]);

  const descScore = useMemo(() => {
    let s = 30;
    if (descriptionText.length > 100) s += 20;
    if (descriptionText.length > 300) s += 15;
    if (descriptionText.includes('#')) s += 15;
    if (descriptionText.includes('\n')) s += 10;
    if (descriptionText.length > 0) s += 10;
    return Math.min(100, s);
  }, [descriptionText]);

  const tagsScore = useMemo(() => {
    let s = 20;
    if (tags.length >= 3) s += 20;
    if (tags.length >= 5) s += 20;
    if (tags.length >= 8) s += 15;
    if (tags.some((t) => t.length > 10)) s += 10;
    if (tags.length > 0) s += 15;
    return Math.min(100, s);
  }, [tags]);

  const overallSeo = Math.round((titleScore + descScore + tagsScore) / 3);

  const scoreColor = (s: number) => (s >= 80 ? 'green' : s >= 60 ? 'blue' : s >= 40 ? 'orange' : 'orange');

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={<Sparkles size={22} />}
        title="AI Metadata Studio"
        subtitle="AI-generated titles, descriptions, tags and hashtags"
      />

      {/* Video Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-panel p-4"
      >
        <label className="text-sm text-dark-300 mb-2 block">Select a video to optimize</label>
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
            {/* ── Title Variants ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 size={18} className="text-neon-purple" />
                <h2 className="text-lg font-semibold text-white">Title Variants</h2>
                <span className="ml-auto text-xs text-dark-400">AI-generated • SEO-optimized</span>
              </div>
              <div className="space-y-3">
                {titleVariants.map((tv, i) => (
                  <motion.div
                    key={tv.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.06 }}
                    className={`glass-panel p-4 flex items-center gap-4 ${
                      appliedTitle === tv.text ? 'border-neon-blue/40 bg-neon-blue/[0.04]' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{tv.text}</p>
                      <p className="text-xs text-dark-400 mt-1">{tv.text.length} characters</p>
                    </div>
                    <CircularProgress score={tv.seoScore} />
                    <button
                      onClick={() => setAppliedTitle(tv.text)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        appliedTitle === tv.text
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                          : 'bg-white/[0.06] text-dark-200 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'
                      }`}
                    >
                      {appliedTitle === tv.text ? <Check size={14} /> : <Copy size={14} />}
                      {appliedTitle === tv.text ? 'Selected' : 'Use This'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Description Editor ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-neon-cyan" />
                <h2 className="text-lg font-semibold text-white">Description Editor</h2>
                <button
                  onClick={handleRegenerate}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-dark-200 hover:bg-white/[0.1] hover:text-white transition-colors"
                >
                  <RotateCcw size={14} /> Regenerate
                </button>
              </div>
              <textarea
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                rows={8}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-dark-400 resize-y focus:outline-none focus:border-neon-blue/40 transition-colors"
                placeholder="AI-generated description will appear here…"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-dark-400">
                <span>{descriptionText.length} characters</span>
                <span>Recommended: 200-500 characters</span>
              </div>
            </motion.div>

            {/* ── Tags & Hashtags ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={18} className="text-neon-orange" />
                <h2 className="text-lg font-semibold text-white">Tags & Hashtags</h2>
              </div>

              {/* Current tags */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[36px]">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-medium"
                    >
                      <Hash size={12} />
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-white transition-colors">
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add tag input */}
              <div className="flex gap-2 mb-4">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag…"
                  className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-neon-blue/40 transition-colors"
                />
                <button
                  onClick={handleAddTag}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-sm font-medium hover:bg-neon-purple/30 transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* Suggested tags */}
              <div>
                <p className="text-xs text-dark-400 mb-2">Suggested tags</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.filter((s) => !tags.includes(s)).map((s) => (
                    <button
                      key={s}
                      onClick={() => setTags((p) => [...p, s])}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-dark-300 hover:text-white hover:border-neon-blue/30 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Category & Language ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-neon-green" />
                <h2 className="text-lg font-semibold text-white">Category & Language</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-dark-300 mb-1.5 block">YouTube Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/40 transition-colors appearance-none"
                  >
                    <option value="" className="bg-dark-800">Select category…</option>
                    {YOUTUBE_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-dark-800">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-dark-300 mb-1.5 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/40 transition-colors appearance-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code} className="bg-dark-800">{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* ── SEO Score ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={18} className="text-neon-blue" />
                <h2 className="text-lg font-semibold text-white">SEO Score</h2>
              </div>
              <div className="flex items-center gap-6 mb-6">
                <CircularProgress score={overallSeo} size={72} />
                <div>
                  <p className="text-2xl font-bold text-white">{overallSeo}<span className="text-sm text-dark-400 font-normal"> / 100</span></p>
                  <p className="text-sm text-dark-300">
                    {overallSeo >= 80 ? 'Excellent — ready to publish!' : overallSeo >= 60 ? 'Good — small improvements possible' : 'Needs work — optimize further'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Title Score', value: titleScore, icon: <TrendingUp size={14} /> },
                  { label: 'Description Score', value: descScore, icon: <FileText size={14} /> },
                  { label: 'Tags Score', value: tagsScore, icon: <Tag size={14} /> },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-2 text-sm text-dark-200">
                        {item.icon} {item.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{item.value}%</span>
                    </div>
                    <ProgressBar progress={item.value} color={scoreColor(item.value)} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Apply Button ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}>
              <button
                onClick={handleApply}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={18} /> Apply to Video
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMetadataStudio;
