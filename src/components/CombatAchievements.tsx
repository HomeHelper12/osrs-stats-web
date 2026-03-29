"use client";

import { CombatAchievementData } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface CombatAchievementsProps {
  combatAchievements: Record<string, CombatAchievementData>;
}

const TIER_ORDER = [
  "easy",
  "medium",
  "hard",
  "elite",
  "master",
  "grandmaster",
] as const;

const TIER_COLORS: Record<string, string> = {
  easy: "bg-green-600",
  medium: "bg-blue-600",
  hard: "bg-purple-600",
  elite: "bg-yellow-600",
  master: "bg-red-600",
  grandmaster: "bg-cyan-500",
};

export default function CombatAchievements({
  combatAchievements,
}: CombatAchievementsProps) {
  let totalCompleted = 0;
  let totalAll = 0;

  TIER_ORDER.forEach((tier) => {
    const data = combatAchievements[tier];
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
          const data = combatAchievements[tier];
          if (!data) return null;

          return (
            <ProgressBar
              key={tier}
              label={tier.charAt(0).toUpperCase() + tier.slice(1)}
              value={data.completed}
              max={data.total}
              color={TIER_COLORS[tier] || "bg-gray-600"}
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
