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

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-gray-400">
            {showPercentage
              ? `${percentage.toFixed(1)}%`
              : `${value.toLocaleString()} / ${max.toLocaleString()}`}
          </span>
        </div>
      )}
      <div
        className={`relative overflow-hidden rounded-full bg-gray-800 shadow-inner ${height}`}
      >
        <div
          className={`progress-bar-fill absolute inset-y-0 left-0 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-100 drop-shadow">
          {showPercentage
            ? `${percentage.toFixed(1)}%`
            : `${value.toLocaleString()} / ${max.toLocaleString()}`}
        </div>
      </div>
    </div>
  );
}
