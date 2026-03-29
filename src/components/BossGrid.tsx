"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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

/** Convert boss name to OSRS Wiki image URL */
function bossImageUrl(name: string): string {
  const wikiName = name.replace(/ /g, "_");
  return `https://oldschool.runescape.wiki/images/${encodeURIComponent(wikiName)}.png`;
}

/** Fallback component for boss images that fail to load */
function BossIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg glass-light text-lg font-bold text-gray-500">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={bossImageUrl(name)}
      alt={name}
      width={48}
      height={48}
      className="h-12 w-12 shrink-0 rounded-lg object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const RANK_BORDER_COLORS = [
  "rgba(234, 179, 8, 0.7)",   // gold
  "rgba(192, 192, 192, 0.6)", // silver
  "rgba(180, 120, 60, 0.6)",  // bronze
];

export default function BossGrid({ bosses }: BossGridProps) {
  const [search, setSearch] = useState("");
  const [highlightedBoss, setHighlightedBoss] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const entries = useMemo(
    () =>
      Object.entries(bosses)
        .filter(([key]) => !key.startsWith("clue:"))
        .filter(([, data]) => data.killCount > 0)
        .sort(([, a], [, b]) => b.killCount - a.killCount),
    [bosses]
  );

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return entries
      .filter(([key]) => formatBossName(key).toLowerCase().includes(q))
      .slice(0, 6)
      .map(([key]) => ({ key, label: formatBossName(key) }));
  }, [search, entries]);

  const selectBoss = useCallback((key: string) => {
    setSearch("");
    setHighlightedBoss(key);
    const el = cardRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => setHighlightedBoss(null), 2500);
  }, []);

  if (entries.length === 0) {
    return (
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <h2 className="mb-4 border-b border-white/[0.06] pb-2 text-lg font-bold text-gray-100">
          Boss Kill Counts
        </h2>
        <p className="text-sm text-gray-500">No boss kills recorded.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h2 className="text-lg font-bold text-gray-100">Boss Kill Counts</h2>
        <span className="text-xs text-gray-500">{entries.length} bosses</span>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <div className="glass-light flex items-center gap-2 rounded-xl px-3 py-2">
          <svg className="h-4 w-4 shrink-0 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bosses..."
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-300">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl overflow-hidden shadow-xl border border-white/10" style={{ background: "rgba(15, 15, 20, 0.95)", backdropFilter: "blur(16px)" }}>
            {suggestions.map((s) => (
              <button
                key={s.key}
                onClick={() => selectBoss(s.key)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
              >
                <BossIcon name={s.key} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(([key, data], index) => (
          <div
            key={key}
            ref={(el) => { cardRefs.current[key] = el; }}
            className={`glass-card rounded-lg p-3 transition-all duration-500 ${
              highlightedBoss === key ? "ring-2 ring-osrs-gold/70 shadow-lg shadow-osrs-gold/20" : ""
            }`}
            style={
              index < 3
                ? {
                    borderLeft: `3px solid ${RANK_BORDER_COLORS[index]}`,
                    boxShadow: `inset 3px 0 12px -4px ${RANK_BORDER_COLORS[index]}`,
                  }
                : undefined
            }
          >
            <div className="flex items-start gap-3">
              {/* Boss image */}
              <BossIcon name={key} />

              <div className="min-w-0 flex-1">
                {/* Boss name */}
                <p className="truncate text-sm font-medium text-gray-300">
                  {formatBossName(key)}
                </p>

                {/* Kill count */}
                <p className="mt-0.5 text-2xl font-bold text-gray-100 tabular-nums">
                  {formatNumber(data.killCount)}
                </p>
              </div>
            </div>

            {/* Rank & PB */}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              {data.rank != null && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">Rank</span>
                  <span className="text-gray-400 tabular-nums">
                    {formatNumber(data.rank)}
                  </span>
                </span>
              )}
              {data.personalBest != null && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">PB</span>
                  <span className="text-gray-400 tabular-nums">
                    {data.personalBest}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
