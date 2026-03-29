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

const RANK_ACCENTS = [
  "border-l-yellow-400",
  "border-l-gray-300",
  "border-l-amber-600",
];

export default function BossGrid({ bosses }: BossGridProps) {
  const entries = Object.entries(bosses)
    .filter(([key]) => !key.startsWith("clue:"))
    .filter(([, data]) => data.killCount > 0)
    .sort(([, a], [, b]) => b.killCount - a.killCount);

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
          Boss Kill Counts
        </h2>
        <p className="text-sm text-gray-500">No boss kills recorded.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Boss Kill Counts
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(([key, data], index) => (
          <div
            key={key}
            className={`rounded-lg border border-gray-700/50 bg-gray-800/60 p-3 ${
              index < 3 ? `border-l-4 ${RANK_ACCENTS[index]}` : ""
            }`}
          >
            <p className="truncate text-sm font-medium text-gray-300">
              {formatBossName(key)}
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-100">
              {formatNumber(data.killCount)}
            </p>
            <div className="mt-1 flex gap-3 text-xs text-gray-500">
              {data.personalBest != null && (
                <span>PB: {data.personalBest}s</span>
              )}
              {data.rank != null && <span>Rank: {formatNumber(data.rank)}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
