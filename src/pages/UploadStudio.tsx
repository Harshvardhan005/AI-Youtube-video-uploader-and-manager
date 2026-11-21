import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar, formatBytes, formatDuration, timeAgo, EmptyState } from '@/components/ui';
import {
  Upload,
  CloudUpload,
  Brain,
  Sparkles,
  Image,
  Shield,
  Loader,
  CheckCircle,
  Rocket,
  Eye,
  Pause,
  RotateCcw,
  Trash2,
  FileVideo,
  Play,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Pipeline Stage Definition ───
interface PipelineStage {
  id: string;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  status: 'pending' | 'active' | 'completed';
}

const makePipelineStages = (): PipelineStage[] => [
  { id: 'analyze',   icon: <Brain size={20} />,       label: 'Analyzing Content',    subtitle: 'Identifying topic, audience, language',    status: 'pending' },
  { id: 'metadata',  icon: <Sparkles size={20} />,    label: 'Generating Metadata',   subtitle: 'Creating titles, descriptions, tags',      status: 'pending' },
  { id: 'thumbnail', icon: <Image size={20} />,       label: 'Generating Thumbnail',  subtitle: 'AI-designed click-worthy thumbnail',       status: 'pending' },
  { id: 'copyright', icon: <Shield size={20} />,      label: 'Copyright Screening',   subtitle: 'Checking audio and video content',         status: 'pending' },
  { id: 'upload',    icon: <Upload size={20} />,      label: 'Uploading to YouTube',  subtitle: 'Uploading as private',                     status: 'pending' },
  { id: 'process',   icon: <Loader size={20} />,      label: 'Processing',            subtitle: 'Waiting for YouTube processing',            status: 'pending' },
  { id: 'final',     icon: <CheckCircle size={20} />, label: 'Final Check',           subtitle: 'Verifying copyright status',                status: 'pending' },
  { id: 'ready',     icon: <Rocket size={20} />,      label: 'Ready to Publish',      subtitle: 'Scheduled or published per your rules',     status: 'pending' },
];

// ─── Upload Studio Page ───
const UploadStudio: React.FC = () => {
  const { videos, channels, addVideo, addNotification, setCurrentPage } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(makePipelineStages());
  const [selectedFileName, setSelectedFileName] = useState('');

  // Simulated pipeline progression
  useEffect(() => {
    if (!showPipeline) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    pipelineStages.forEach((_, index) => {
      // Mark stage as active
      timers.push(
        setTimeout(() => {
          setPipelineStages((prev) =>
            prev.map((s, i) =>
              i === index ? { ...s, status: 'active' as const } : s
            )
          );
        }, index * 2200 + 400)
      );

      // Mark stage as completed
      timers.push(
        setTimeout(() => {
          setPipelineStages((prev) =>
            prev.map((s, i) =>
              i === index ? { ...s, status: 'completed' as const } : s
            )
          );
        }, (index + 1) * 2200)
      );
    });

    // On full completion, add a mock video
    timers.push(
      setTimeout(() => {
        const defaultChannel = channels.find((c) => c.isDefault) || channels[0];
        if (defaultChannel) {
          addVideo({
            id: `v-new-${Date.now()}`,
            title: selectedFileName.replace(/\.[^.]+$/, '') || 'Untitled Video',
            description: 'AI-generated description pending...',
            tags: ['auto-generated'],
            status: 'processing',
            channelId: defaultChannel.id,
            channelName: defaultChannel.name,
            thumbnail: '',
            progress: 68,
            publishDate: '',
            visibility: 'private',
            copyrightStatus: 'pending',
            views: 0,
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
            fileSize: 2_400_000_000,
            duration: 1200,
            category: 'Science & Technology',
            language: 'en',
          });
          addNotification({
            type: 'success',
            title: 'Upload Complete',
            message: `"${selectedFileName}" has been processed and added to the queue`,
          });
        }
      }, pipelineStages.length * 2200 + 800)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPipeline]);

  const handleFileSelect = useCallback(() => {
    const fakeNames = [
      'Ultimate Guide to Rust Programming.mp4',
      'Behind the Scenes - Studio Tour.mov',
      'Top 10 Productivity Hacks 2027.mp4',
    ];
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    setSelectedFileName(name);
    setPipelineStages(makePipelineStages());
    setShowPipeline(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect();
    },
    [handleFileSelect]
  );

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(() => {
    handleFileSelect();
  }, [handleFileSelect]);

  const closePipeline = useCallback(() => {
    setShowPipeline(false);
    setPipelineStages(makePipelineStages());
    setSelectedFileName('');
  }, []);

  // ─── Status-to-color mapping for queue progress bars ───
  const progressColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'scheduled':
        return 'green';
      case 'uploading':
      case 'processing':
        return 'blue';
      case 'copyright-check':
      case 'analyzing':
      case 'generating':
        return 'purple';
      case 'failed':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        icon={<Upload size={24} />}
        title="Upload Studio"
        subtitle="Drop your finished video — AI handles the rest"
      />

      {/* ─── Drag & Drop Zone ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-2xl border-dashed border-2 transition-all duration-500 overflow-hidden ${
            isDragOver
              ? 'border-neon-blue/60 bg-neon-blue/[0.06]'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
          }`}
          style={{ minHeight: 260 }}
        >
          {/* Gradient glow on hover / drag */}
          <div
            className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
              isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}
            style={{
              background:
                'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.08) 100%)',
            }}
          />

          {/* Animated border gradient on hover */}
          <div
            className={`absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-500 ${
              isDragOver ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background:
                'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: 2,
              borderRadius: 'inherit',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6 text-center">
            <motion.div
              animate={isDragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mb-6"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-30"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(59,130,246,0.5), rgba(139,92,246,0.3), transparent)',
                  }}
                />
                <CloudUpload
                  size={64}
                  className={`relative transition-colors duration-300 ${
                    isDragOver ? 'text-neon-blue' : 'text-dark-300'
                  }`}
                />
              </div>
            </motion.div>

            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your video here
            </h3>
            <p className="text-dark-300 text-sm">
              or click to browse • MP4, MOV, MKV, AVI up to 128 GB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.mov,.mkv,.avi"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </motion.div>

      {/* ─── Upload Pipeline Visualization ─── */}
      <AnimatePresence>
        {showPipeline && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileVideo size={20} className="text-neon-blue" />
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {selectedFileName}
                    </h3>
                    <p className="text-dark-400 text-xs">
                      Pipeline in progress…
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePipeline}
                  className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Stepper */}
              <div className="relative ml-4">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/[0.06]" />

                <div className="space-y-1">
                  {pipelineStages.map((stage, idx) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.35 }}
                      className="relative flex items-start gap-4 py-3"
                    >
                      {/* Icon circle */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-[30px] h-[30px] rounded-full border transition-all duration-500 ${
                          stage.status === 'completed'
                            ? 'bg-neon-green/20 border-neon-green/40 text-neon-green'
                            : stage.status === 'active'
                            ? 'bg-neon-blue/20 border-neon-blue/40 text-neon-blue'
                            : 'bg-white/[0.04] border-white/[0.08] text-dark-400'
                        }`}
                      >
                        {stage.status === 'active' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          >
                            <Loader size={16} />
                          </motion.div>
                        ) : stage.status === 'completed' ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="scale-[0.8]">{stage.icon}</span>
                        )}

                        {/* Active glow */}
                        {stage.status === 'active' && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{
                              boxShadow: '0 0 16px rgba(59,130,246,0.5)',
                            }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p
                          className={`text-sm font-medium transition-colors duration-300 ${
                            stage.status === 'completed'
                              ? 'text-neon-green'
                              : stage.status === 'active'
                              ? 'text-white'
                              : 'text-dark-300'
                          }`}
                        >
                          {stage.label}
                        </p>
                        <p className="text-xs text-dark-400 mt-0.5">
                          {stage.subtitle}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="pt-1">
                        {stage.status === 'completed' && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-neon-green font-medium"
                          >
                            Done
                          </motion.span>
                        )}
                        {stage.status === 'active' && (
                          <span className="text-xs text-neon-blue font-medium animate-pulse">
                            Running…
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Upload Queue ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upload Queue</h2>
          <span className="text-dark-400 text-sm">
            {videos.length} video{videos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {videos.length === 0 ? (
          <EmptyState
            icon={<FileVideo size={48} />}
            title="No uploads yet"
            description="Drop a video above to start the AI-powered upload pipeline"
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {videos.map((video, idx) => {
                const channel = channels.find(
                  (c) => c.id === video.channelId
                );
                return (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="glass-panel p-4 rounded-xl flex items-center gap-4 group"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="w-28 h-16 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Play size={16} className="text-dark-400" />
                          <span className="text-[10px] text-dark-500">
                            {formatDuration(video.duration)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {video.title}
                        </h4>
                        <StatusBadge status={video.status} />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-dark-400 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-dark-300">
                          {channel?.name || video.channelName}
                        </span>
                        <span>{formatBytes(video.fileSize)}</span>
                        <span>{timeAgo(video.createdAt)}</span>
                      </div>

                      <ProgressBar
                        progress={video.progress}
                        color={progressColor(video.status)}
                      />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <button
                        title="View"
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title={
                          video.status === 'paused' ? 'Resume' : 'Pause'
                        }
                        className="p-2 rounded-lg text-dark-400 hover:text-neon-orange hover:bg-neon-orange/[0.06] transition-colors"
                      >
                        <Pause size={16} />
                      </button>
                      <button
                        title="Retry"
                        className="p-2 rounded-lg text-dark-400 hover:text-neon-cyan hover:bg-neon-cyan/[0.06] transition-colors"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        title="Remove"
                        className="p-2 rounded-lg text-dark-400 hover:text-neon-red hover:bg-neon-red/[0.06] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UploadStudio;
