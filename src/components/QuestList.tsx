"use client";

import { useState, useMemo } from "react";
import { QuestData } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface QuestListProps {
  quests: QuestData[];
  questPoints: number | null;
}

type QuestGroup = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";

const GROUP_CONFIG: Record<
  QuestGroup,
  { label: string; dotColor: string; textColor: string; bgTint: string }
> = {
  COMPLETED: {
    label: "Completed",
    dotColor: "bg-green-400",
    textColor: "text-green-400",
    bgTint: "bg-green-500/5",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dotColor: "bg-yellow-400",
    textColor: "text-yellow-400",
    bgTint: "bg-yellow-500/5",
  },
  NOT_STARTED: {
    label: "Not Started",
    dotColor: "bg-gray-500",
    textColor: "text-gray-500",
    bgTint: "bg-gray-500/5",
  },
};

export default function QuestList({ quests, questPoints }: QuestListProps) {
  const [expandedSection, setExpandedSection] = useState<QuestGroup | null>(
    "COMPLETED"
  );

  const grouped = useMemo(() => {
    const result: Record<QuestGroup, QuestData[]> = {
      COMPLETED: [],
      IN_PROGRESS: [],
      NOT_STARTED: [],
    };

    quests.forEach((quest) => {
      const status = (quest.status ?? "NOT_STARTED") as QuestGroup;
      if (result[status]) {
        result[status].push(quest);
      } else {
        result.NOT_STARTED.push(quest);
      }
    });

    Object.values(result).forEach((arr) =>
      arr.sort((a, b) => a.name.localeCompare(b.name))
    );

    return result;
  }, [quests]);

  const questsCompleted = grouped.COMPLETED.length;
  const questsTotal = quests.length;

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold text-gray-100 tracking-wide">
          Quests
        </h2>
        <div className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-osrs-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-osrs-gold">
            {questPoints ?? 0}
          </span>
          <span className="text-xs text-gray-500">QP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <ProgressBar
          label="Quest Completion"
          value={questsCompleted}
          max={questsTotal}
          color="bg-green-500"
        />
      </div>

      {/* Quest groups */}
      <div className="space-y-2">
        {(Object.keys(grouped) as QuestGroup[]).map((group) => {
          const config = GROUP_CONFIG[group];
          const items = grouped[group];
          const isExpanded = expandedSection === group;

          return (
            <div key={group} className="glass-card rounded-xl overflow-hidden">
              {/* Group header */}
              <button
                onClick={() =>
                  setExpandedSection(isExpanded ? null : group)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`} />
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{items.length}</span>
                  <svg
                    className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4l8 6-8 6V4z" />
                  </svg>
                </div>
              </button>

              {/* Quest list */}
              {isExpanded && items.length > 0 && (
                <div className="max-h-72 overflow-y-auto border-t border-white/5 animate-fade-in">
                  {items.map((quest) => (
                    <div
                      key={quest.name}
                      className={`flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/[0.02] ${config.bgTint}`}
                    >
                      <span className="text-gray-300">{quest.name}</span>
                      <span className="glass-light rounded-md px-2 py-0.5 text-xs text-gray-500">
                        {quest.questPoints ?? 0} QP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
