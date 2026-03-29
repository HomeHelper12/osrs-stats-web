"use client";

import { BossData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface BossGridProps {
  bosses: Record<string, BossData>;
}

function formatBossName(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const RANK_BORDER_COLORS = [
  "rgba(234, 179, 8, 0.7)",   // gold
  "rgba(192, 192, 192, 0.6)", // silver
  "rgba(180, 120, 60, 0.6)",  // bronze
];

export default function BossGrid({ bosses }: BossGridProps) {
  const entries = Object.entries(bosses)
    .filter(([key]) => !key.startsWith("clue:"))
    .filter(([, data]) => data.killCount > 0)
    .sort(([, a], [, b]) => b.killCount - a.killCount);

  if (entries.length === 0) {
    return (
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <h2 className="mb-4 border-b border-white/[0.06] pb-2 text-lg font-bold text-gray-100">
          Boss Kill Counts
        </h2>
        <p className="text-sm text-gray-500">No boss kills recorded.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      <h2 className="mb-4 border-b border-white/[0.06] pb-2 text-lg font-bold text-gray-100">
        Boss Kill Counts
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(([key, data], index) => (
          <div
            key={key}
            className="glass-card rounded-lg p-3"
            style={
              index < 3
                ? {
                    borderLeft: `3px solid ${RANK_BORDER_COLORS[index]}`,
                    boxShadow: `inset 3px 0 12px -4px ${RANK_BORDER_COLORS[index]}`,
                  }
                : undefined
            }
          >
            {/* Boss name */}
            <p className="truncate text-sm font-medium text-gray-300">
              {formatBossName(key)}
            </p>

            {/* Kill count - large */}
            <p className="mt-1 text-2xl font-bold text-gray-100 tabular-nums">
              {formatNumber(data.killCount)}
            </p>

            {/* Rank & PB */}
            <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-500">
              {data.rank != null && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">Rank</span>
                  <span className="text-gray-400 tabular-nums">
                    {formatNumber(data.rank)}
                  </span>
                </span>
              )}
              {data.personalBest != null && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">PB</span>
                  <span className="text-gray-400 tabular-nums">
                    {data.personalBest}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
