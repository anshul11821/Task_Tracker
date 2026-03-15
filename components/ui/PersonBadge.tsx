interface PersonBadgeProps {
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export default function PersonBadge({ label, color, size = "md" }: PersonBadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium font-sora
        ${sizes[size]}
      `}
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
