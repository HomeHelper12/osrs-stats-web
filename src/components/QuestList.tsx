"use client";

import { useState } from "react";
import { QuestData } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface QuestListProps {
  quests: QuestData[];
  questPoints: number | null;
}

// Java uses "COMPLETED", map to our display groups
type QuestGroup = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";

const GROUP_CONFIG: Record<
  QuestGroup,
  { label: string; color: string; textColor: string }
> = {
  COMPLETED: {
    label: "Completed",
    color: "bg-green-900/30",
    textColor: "text-green-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-900/30",
    textColor: "text-yellow-400",
  },
  NOT_STARTED: {
    label: "Not Started",
    color: "bg-gray-800/30",
    textColor: "text-gray-500",
  },
};

export default function QuestList({ quests, questPoints }: QuestListProps) {
  const [expandedSection, setExpandedSection] = useState<QuestGroup | null>(
    "COMPLETED"
  );

  const grouped: Record<QuestGroup, QuestData[]> = {
    COMPLETED: [],
    IN_PROGRESS: [],
    NOT_STARTED: [],
  };

  quests.forEach((quest) => {
    // Java QuestData uses "status" field with values COMPLETED, IN_PROGRESS, NOT_STARTED
    const status = (quest.status ?? "NOT_STARTED") as QuestGroup;
    if (grouped[status]) {
      grouped[status].push(quest);
    } else {
      grouped.NOT_STARTED.push(quest);
    }
  });

  // Sort each group alphabetically
  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => a.name.localeCompare(b.name))
  );

  const questsCompleted = grouped.COMPLETED.length;
  const questsTotal = quests.length;

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Quests
      </h2>

      <div className="mb-3 flex items-center gap-4">
        <span className="text-sm text-gray-400">
          Quest Points:{" "}
          <span className="font-bold text-osrs-gold">
            {questPoints ?? 0}
          </span>
        </span>
      </div>

      <div className="mb-4">
        <ProgressBar
          label="Quest Completion"
          value={questsCompleted}
          max={questsTotal}
          color="bg-green-600"
        />
      </div>

      <div className="space-y-2">
        {(Object.keys(grouped) as QuestGroup[]).map((group) => {
          const config = GROUP_CONFIG[group];
          const items = grouped[group];
          const isExpanded = expandedSection === group;

          return (
            <div key={group} className="rounded-lg border border-gray-700/30">
              <button
                onClick={() =>
                  setExpandedSection(isExpanded ? null : group)
                }
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-800/50 transition-colors rounded-lg"
              >
                <span className={`text-sm font-medium ${config.textColor}`}>
                  {config.label}
                </span>
                <span className="text-xs text-gray-500">{items.length}</span>
              </button>

              {isExpanded && items.length > 0 && (
                <div className="max-h-64 overflow-y-auto border-t border-gray-800">
                  {items.map((quest) => (
                    <div
                      key={quest.name}
                      className={`flex items-center justify-between px-4 py-1.5 text-sm ${config.color}`}
                    >
                      <span className="text-gray-300">{quest.name}</span>
                      <span className="text-xs text-gray-500">
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
