"use client";

interface ProgressBarProps {
  label?: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
  height?: string;
}

export default function ProgressBar({
  label,
  value,
  max,
  color = "bg-osrs-gold",
  showPercentage = false,
  height = "h-5",
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  // Derive a glow color from the Tailwind bg class name
  const glowColor = color.includes("gold")
    ? "rgba(212, 160, 23, 0.5)"
    : color.includes("green")
      ? "rgba(74, 222, 128, 0.5)"
      : color.includes("blue")
        ? "rgba(96, 165, 250, 0.5)"
        : color.includes("red")
          ? "rgba(248, 113, 113, 0.5)"
          : "rgba(212, 160, 23, 0.5)";

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-gray-300 font-medium">{label}</span>
          <span className="text-gray-400 tabular-nums">
            {showPercentage
              ? `${percentage.toFixed(1)}%`
              : `${value.toLocaleString()} / ${max.toLocaleString()}`}
          </span>
        </div>
      )}
      <div
        className={`glass-light relative overflow-hidden rounded-full ${height}`}
      >
        {/* Animated fill */}
        <div
          className={`progress-bar-fill absolute inset-y-0 left-0 rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 12px ${glowColor}, 0 0 4px ${glowColor}`,
          }}
        />

        {/* Subtle shimmer overlay on the fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-20"
          style={{
            width: `${percentage}%`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {showPercentage
            ? `${percentage.toFixed(1)}%`
            : `${value.toLocaleString()} / ${max.toLocaleString()}`}
        </div>
      </div>
    </div>
  );
}
