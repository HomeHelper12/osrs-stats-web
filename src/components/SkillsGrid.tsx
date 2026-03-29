"use client";

import { SkillData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";

interface SkillsGridProps {
  skills: Record<string, SkillData>;
}

const SKILL_ORDER: string[][] = [
  ["Attack", "Hitpoints", "Mining"],
  ["Strength", "Agility", "Smithing"],
  ["Defence", "Herblore", "Fishing"],
  ["Ranged", "Thieving", "Cooking"],
  ["Prayer", "Crafting", "Firemaking"],
  ["Magic", "Fletching", "Woodcutting"],
  ["Runecraft", "Slayer", "Farming"],
  ["Construction", "Hunter"],
];

function getSkillIconUrl(name: string): string {
  const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return `https://oldschool.runescape.wiki/images/${formatted}_icon.png`;
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Calculate total level
  const totalLevel = Object.values(skills).reduce(
    (sum, s) => sum + (s.level || 0),
    0
  );

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Skills
      </h2>
      <div className="grid grid-cols-3 gap-1.5">
        {SKILL_ORDER.flat().map((skillName) => {
          const key = skillName.toLowerCase();
          const skill = skills[key];
          const level = skill?.level ?? 1;
          const xp = skill?.xp ?? 0;
          const isMaxed = level >= 99;

          return (
            <div
              key={skillName}
              className={`relative flex items-center gap-2 rounded-lg border bg-gray-800/60 px-2 py-1.5 transition-colors hover:bg-gray-800 ${
                isMaxed
                  ? "skill-maxed border-osrs-gold/50"
                  : "border-gray-700/50"
              }`}
              onMouseEnter={() => setHoveredSkill(skillName)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getSkillIconUrl(skillName)}
                alt={skillName}
                width={18}
                height={18}
                className="flex-shrink-0"
              />
              <span className="flex-1 truncate text-xs text-gray-400">
                {skillName}
              </span>
              <span
                className={`text-sm font-bold ${
                  isMaxed ? "text-osrs-gold" : "text-gray-100"
                }`}
              >
                {level}
              </span>

              {hoveredSkill === skillName && (
                <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-950 px-2 py-1 text-xs text-gray-300 shadow-lg border border-gray-700 whitespace-nowrap">
                  {formatNumber(xp)} XP
                </div>
              )}
            </div>
          );
        })}

        {/* Total cell */}
        <div className="flex items-center justify-between rounded-lg border border-osrs-gold/30 bg-gray-800/60 px-2 py-1.5">
          <span className="text-xs font-semibold text-osrs-gold">Total</span>
          <span className="text-sm font-bold text-osrs-gold">
            {formatNumber(totalLevel)}
          </span>
        </div>
      </div>
    </section>
  );
}
