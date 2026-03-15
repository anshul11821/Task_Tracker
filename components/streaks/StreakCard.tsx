

interface StreakCardProps {
  label: string;
  color: string;
  current: number;
  best: number;
  icon?: string;
}

export default function StreakCard({ label, color, current, best, icon }: StreakCardProps) {
  return (
    <div className="glass-card p-5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="font-semibold font-sora text-white/80">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider font-sora mb-1">
            Current
          </p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold font-mono" style={{ color }}>
              {current}
            </span>
            <span className="text-xs text-white/30 mb-1 font-sora">days</span>
          </div>
          {current > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-brand-green">🔥 Active</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider font-sora mb-1">
            Best
          </p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold font-mono text-white/60">
              {best}
            </span>
            <span className="text-xs text-white/30 mb-1 font-sora">days</span>
          </div>
        </div>
      </div>
      <div className="mt-4 h-1.5 bg-dark-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: best > 0 ? `${Math.min((current / best) * 100, 100)}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }}
        />
      </div>
    </div>
  );
}
