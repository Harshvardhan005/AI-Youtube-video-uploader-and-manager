import React, { useCallback, useEffect, useRef } from 'react';

// ─── Animated Background ───
export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      const time = prefersReducedMotion ? 0 : Date.now() * 0.0001;
      const offsetX = (time * 30) % gridSize;
      const offsetY = (time * 30) % gridSize;

      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Particles
      if (!prefersReducedMotion) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

// ─── AI Core Orb ───
export const AICoreOrb: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = '' }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full animate-spin-slow opacity-20"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
          filter: 'blur(20px)',
        }}
      />
      <div className="absolute inset-2 rounded-full animate-pulse-slow opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
        }}
      />
      {/* Core sphere */}
      <div className="absolute inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(59,130,246,0.6), rgba(139,92,246,0.4), rgba(6,182,212,0.3))',
          boxShadow: '0 0 40px rgba(139,92,246,0.3), inset 0 0 30px rgba(59,130,246,0.2)',
        }}
      />
      {/* Inner highlight */}
      <div className="absolute rounded-full"
        style={{
          top: '20%', left: '25%', width: '25%', height: '20%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.3), transparent)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
};

// ─── Stat Card ───
export const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}> = ({ icon, label, value, change, changeType = 'neutral', color = 'blue' }) => {
  const colorMap: Record<string, string> = {
    blue: 'from-neon-blue/20 to-transparent',
    purple: 'from-neon-purple/20 to-transparent',
    cyan: 'from-neon-cyan/20 to-transparent',
    green: 'from-neon-green/20 to-transparent',
    orange: 'from-neon-orange/20 to-transparent',
    pink: 'from-neon-pink/20 to-transparent',
  };
  const changeColor = changeType === 'positive' ? 'text-neon-green' : changeType === 'negative' ? 'text-neon-red' : 'text-dark-200';

  return (
    <div className="stat-card">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-radial ${colorMap[color] || colorMap.blue} opacity-50 -translate-y-1/2 translate-x-1/4`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-dark-200 text-sm font-medium">{label}</span>
          <div className="text-dark-300">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {change && (
          <div className={`text-sm font-medium ${changeColor}`}>{change}</div>
        )}
      </div>
    </div>
  );
};

// ─── Status Badge ───
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const styles: Record<string, string> = {
    published: 'bg-neon-green/10 text-neon-green border-neon-green/20',
    scheduled: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    processing: 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
    uploading: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
    analyzing: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
    generating: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
    'copyright-check': 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
    failed: 'bg-neon-red/10 text-neon-red border-neon-red/20',
    paused: 'bg-dark-300/10 text-dark-200 border-dark-400/20',
    private: 'bg-dark-400/10 text-dark-200 border-dark-400/20',
    clear: 'bg-neon-green/10 text-neon-green border-neon-green/20',
    warning: 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
    claim: 'bg-neon-red/10 text-neon-red border-neon-red/20',
    blocked: 'bg-neon-red/10 text-neon-red border-neon-red/20',
    pending: 'bg-dark-300/10 text-dark-200 border-dark-400/20',
    running: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
    completed: 'bg-neon-green/10 text-neon-green border-neon-green/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending} ${className}`}>
      {status === 'copyright-check' ? 'Copyright Check' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Progress Bar ───
export const ProgressBar: React.FC<{ progress: number; color?: string; className?: string }> = ({ progress, color = 'blue', className = '' }) => {
  const colors: Record<string, string> = {
    blue: 'from-neon-blue to-neon-cyan',
    purple: 'from-neon-purple to-neon-pink',
    green: 'from-neon-green to-neon-cyan',
    orange: 'from-neon-orange to-neon-red',
  };
  return (
    <div className={`w-full h-1.5 bg-dark-700 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full bg-gradient-to-r ${colors[color] || colors.blue} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

// ─── Empty State ───
export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-dark-400 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-dark-300 text-sm max-w-md mb-6">{description}</p>
    {action}
  </div>
);

// ─── Page Header ───
export const PageHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode; actions?: React.ReactNode }> = ({ title, subtitle, icon, actions }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      {icon && <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border border-white/[0.06] text-neon-blue">{icon}</div>}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-dark-300 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

// ─── Tabs ───
export const Tabs: React.FC<{ tabs: string[]; active: string; onChange: (tab: string) => void }> = ({ tabs, active, onChange }) => (
  <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          active === tab
            ? 'bg-white/[0.1] text-white shadow-sm'
            : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

// ─── Toggle Switch ───
export const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (v: boolean) => void; label?: string; description?: string }> = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      {label && <div className="text-sm font-medium text-white">{label}</div>}
      {description && <div className="text-xs text-dark-300 mt-0.5">{description}</div>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-neon-blue' : 'bg-dark-600'
      }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  </div>
);

// ─── Helper: format bytes ───
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

// ─── Helper: format duration ───
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Helper: format number ───
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ─── Helper: time ago ───
export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString();
}
