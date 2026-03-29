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
  EASY: "bg-green-600",
  MEDIUM: "bg-blue-600",
  HARD: "bg-purple-600",
  ELITE: "bg-yellow-600",
  MASTER: "bg-red-600",
  GRANDMASTER: "bg-cyan-500",
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

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Combat Achievements
      </h2>

      <div className="space-y-3">
        {TIER_ORDER.map((tier) => {
          const data = combatAchievements[tier.key];
          if (!data) return null;

          return (
            <ProgressBar
              key={tier.key}
              label={tier.label}
              value={data.completed}
              max={data.total}
              color={TIER_COLORS[tier.key] || "bg-gray-600"}
            />
          );
        })}
      </div>

      <div className="mt-4 border-t border-gray-800 pt-3 text-center">
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
