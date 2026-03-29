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
  ["Construction", "Hunter", "Sailing"],
];

function getSkillIconUrl(name: string): string {
  return `https://oldschool.runescape.wiki/images/${name}_icon.png`;
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const overall = skills["Overall"];
  const totalLevel = overall
    ? overall.level
    : Object.entries(skills)
        .filter(([k]) => k !== "Overall")
        .reduce((sum, [, s]) => sum + (s.level || 0), 0);

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      <h2 className="mb-4 border-b border-white/[0.06] pb-2 text-lg font-bold text-gray-100">
        Skills
      </h2>

      <div className="grid grid-cols-3 gap-1.5">
        {SKILL_ORDER.flat().map((skillName) => {
          const skill = skills[skillName];
          const level = skill?.level ?? 1;
          const xp = skill?.xp ?? 0;
          const isMaxed = level >= 99;

          return (
            <div
              key={skillName}
              className={`glass-card relative flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                isMaxed ? "gold-glow skill-maxed" : ""
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
                className="item-icon flex-shrink-0"
              />
              <span className="flex-1 truncate text-xs text-gray-400">
                {skillName}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  isMaxed ? "text-osrs-gold" : "text-gray-100"
                }`}
              >
                {level}
              </span>

              {/* XP tooltip */}
              {hoveredSkill === skillName && (
                <div
                  className="glass absolute -top-9 left-1/2 z-20 -translate-x-1/2 rounded-lg px-2.5 py-1 text-xs text-gray-200 whitespace-nowrap"
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {formatNumber(xp)} XP
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[rgba(10,15,20,0.55)] border-r border-b border-white/[0.08]" />
                </div>
              )}
            </div>
          );
        })}

        {/* Total row */}
        <div
          className="glass-card col-span-3 flex items-center justify-between rounded-lg px-3 py-2 mt-1"
          style={{
            borderColor: "rgba(212, 160, 23, 0.25)",
          }}
        >
          <span className="text-sm font-semibold text-osrs-gold">Total</span>
          <span className="text-lg font-bold text-osrs-gold tabular-nums">
            {formatNumber(totalLevel)}
          </span>
        </div>
      </div>
    </section>
  );
}
