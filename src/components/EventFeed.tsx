"use client";

import { AccountEvent } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface EventFeedProps {
  events: AccountEvent[];
}

const EVENT_COLORS: Record<string, { dot: string; glow: string }> = {
  LEVEL_UP: { dot: "bg-green-400", glow: "shadow-green-400/40" },
  LOOT_DROP: { dot: "bg-yellow-400", glow: "shadow-yellow-400/40" },
  DEATH: { dot: "bg-red-500", glow: "shadow-red-500/40" },
  NEW_CLOG_ITEM: { dot: "bg-orange-400", glow: "shadow-orange-400/40" },
  PET_OBTAINED: { dot: "bg-cyan-400", glow: "shadow-cyan-400/40" },
  QUEST_COMPLETE: { dot: "bg-blue-400", glow: "shadow-blue-400/40" },
  BOSS_KC: { dot: "bg-gray-400", glow: "shadow-gray-400/40" },
  PERSONAL_BEST: { dot: "bg-purple-400", glow: "shadow-purple-400/40" },
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

const EVENT_TEXT_COLORS: Record<string, string> = {
  LEVEL_UP: "text-green-400",
  LOOT_DROP: "text-yellow-400",
  DEATH: "text-red-400",
  NEW_CLOG_ITEM: "text-orange-400",
  PET_OBTAINED: "text-cyan-400",
  QUEST_COMPLETE: "text-blue-400",
  BOSS_KC: "text-gray-400",
  PERSONAL_BEST: "text-purple-400",
};

export default function EventFeed({ events }: EventFeedProps) {
  const entries = events.slice(0, 50);

  if (entries.length === 0) {
    return (
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <div className="mb-5 border-b border-white/10 pb-3">
          <h2 className="text-lg font-bold text-gray-100 tracking-wide">
            Recent Events
          </h2>
        </div>
        <div className="glass-light rounded-xl py-8 text-center">
          <p className="text-sm text-gray-500">No events recorded yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold text-gray-100 tracking-wide">
          Recent Events
        </h2>
        <span className="text-xs text-gray-500">{entries.length} events</span>
      </div>

      {/* Timeline */}
      <div className="max-h-[28rem] overflow-y-auto pr-1">
        {entries.map((event, idx) => {
          const colors = EVENT_COLORS[event.type] || {
            dot: "bg-gray-500",
            glow: "shadow-gray-500/40",
          };
          const label = EVENT_LABELS[event.type] || event.type;
          const textColor = EVENT_TEXT_COLORS[event.type] || "text-gray-400";
          const isLast = idx === entries.length - 1;

          return (
            <div key={idx} className="flex gap-4">
              {/* Timeline rail */}
              <div className="relative flex flex-col items-center">
                {/* Dot with glow */}
                <div
                  className={`relative z-10 mt-1.5 h-3 w-3 flex-shrink-0 rounded-full ${colors.dot} shadow-[0_0_8px] ${colors.glow}`}
                />
                {/* Connector line */}
                {!isLast && (
                  <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />
                )}
              </div>

              {/* Event content */}
              <div className="glass-card flex-1 mb-2 rounded-xl px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${textColor}`}>
                    {label}
                  </span>
                  <span className="text-[11px] text-gray-600">
                    {event.timestamp ? relativeTime(event.timestamp) : "--"}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-gray-300">
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
