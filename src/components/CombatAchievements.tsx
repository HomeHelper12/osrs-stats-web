"use client";

import { CombatAchievementData } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface CombatAchievementsProps {
  combatAchievements: Record<string, CombatAchievementData>;
}

// Java stores tiers with UPPERCASE keys: EASY, MEDIUM, HARD, etc.
const TIER_ORDER = [
  { key: "EASY", label: "Easy" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HARD", label: "Hard" },
  { key: "ELITE", label: "Elite" },
  { key: "MASTER", label: "Master" },
  { key: "GRANDMASTER", label: "Grandmaster" },
] as const;

const TIER_COLORS: Record<string, string> = {
  EASY: "bg-green-500",
  MEDIUM: "bg-blue-500",
  HARD: "bg-purple-500",
  ELITE: "bg-yellow-500",
  MASTER: "bg-red-500",
  GRANDMASTER: "bg-cyan-400",
};

const TIER_DOT_COLORS: Record<string, string> = {
  EASY: "bg-green-400",
  MEDIUM: "bg-blue-400",
  HARD: "bg-purple-400",
  ELITE: "bg-yellow-400",
  MASTER: "bg-red-400",
  GRANDMASTER: "bg-cyan-300",
};

export default function CombatAchievements({
  combatAchievements,
}: CombatAchievementsProps) {
  let totalCompleted = 0;
  let totalAll = 0;

  TIER_ORDER.forEach((tier) => {
    const data = combatAchievements[tier.key];
    if (data) {
      totalCompleted += data.completed;
      totalAll += data.total;
    }
  });

  const overallPercentage =
    totalAll > 0 ? ((totalCompleted / totalAll) * 100).toFixed(1) : "0";

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold text-gray-100 tracking-wide">
          Combat Achievements
        </h2>
        <span className="text-xs text-gray-400">
          {overallPercentage}% overall
        </span>
      </div>

      {/* Tier progress bars */}
      <div className="space-y-4">
        {TIER_ORDER.map((tier) => {
          const data = combatAchievements[tier.key];
          if (!data) return null;

          const pct =
            data.total > 0
              ? ((data.completed / data.total) * 100).toFixed(1)
              : "0";
          const isComplete = data.completed === data.total && data.total > 0;

          return (
            <div
              key={tier.key}
              className={`glass-card rounded-xl p-3 ${
                isComplete ? "gold-glow" : ""
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      TIER_DOT_COLORS[tier.key] || "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-200">
                    {tier.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {data.completed}/{data.total} ({pct}%)
                </span>
              </div>
              <ProgressBar
                value={data.completed}
                max={data.total}
                color={TIER_COLORS[tier.key] || "bg-gray-600"}
                height="h-3"
              />
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="mt-5 glass-light rounded-xl px-4 py-3 text-center">
        <span className="text-sm text-gray-400">
          Total:{" "}
          <span className="font-bold text-gray-100">
            {totalCompleted.toLocaleString()}
          </span>{" "}
          / {totalAll.toLocaleString()}
        </span>
      </div>
    </section>
  );
}
