"use client";

import { AccountEvent } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface EventFeedProps {
  events: AccountEvent[];
}

const EVENT_COLORS: Record<string, string> = {
  LEVEL_UP: "bg-green-500",
  LOOT_DROP: "bg-yellow-500",
  DEATH: "bg-red-500",
  NEW_CLOG_ITEM: "bg-orange-500",
  PET_OBTAINED: "bg-cyan-400",
  QUEST_COMPLETE: "bg-blue-500",
  BOSS_KC: "bg-gray-400",
  PERSONAL_BEST: "bg-purple-500",
};

const EVENT_LABELS: Record<string, string> = {
  LEVEL_UP: "Level Up",
  LOOT_DROP: "Loot Drop",
  DEATH: "Death",
  NEW_CLOG_ITEM: "Collection Log",
  PET_OBTAINED: "Pet Obtained",
  QUEST_COMPLETE: "Quest Complete",
  BOSS_KC: "Boss KC",
  PERSONAL_BEST: "Personal Best",
};

export default function EventFeed({ events }: EventFeedProps) {
  const entries = events.slice(0, 50);

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
          Recent Events
        </h2>
        <p className="text-sm text-gray-500">No events recorded.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Recent Events
      </h2>

      <div className="max-h-96 space-y-0 overflow-y-auto pr-1">
        {entries.map((event, idx) => {
          const dotColor = EVENT_COLORS[event.type] || "bg-gray-500";
          const label = EVENT_LABELS[event.type] || event.type;

          return (
            <div key={idx} className="flex gap-3 py-2">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${dotColor}`}
                />
                {idx < entries.length - 1 && (
                  <div className="w-px flex-1 bg-gray-800" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    {label}
                  </span>
                  <span className="text-xs text-gray-600">
                    {event.timestamp ? relativeTime(event.timestamp) : "--"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-300">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
