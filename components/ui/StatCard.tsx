interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, subtitle, icon, color = "#a78bfa", trend }: StatCardProps) {
  return (
    <div className="glass-card p-5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider font-sora">
          {title}
        </span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span
          className="text-3xl font-bold font-mono"
          style={{ color }}
        >
          {value}
        </span>
        {trend && (
          <span className={`text-sm mb-1 ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/30"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-white/30 mt-2 font-sora">{subtitle}</p>
      )}
      <div
        className="h-0.5 mt-4 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </div>
  );
}
