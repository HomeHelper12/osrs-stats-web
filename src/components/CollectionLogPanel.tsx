"use client";

import { useState, useMemo } from "react";
import { ClogPage } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface CollectionLogPanelProps {
  collectionLog: Record<string, ClogPage>;
  totalObtained: number;
  totalItems: number;
}

export default function CollectionLogPanel({
  collectionLog,
  totalObtained,
  totalItems,
}: CollectionLogPanelProps) {
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  const pages = useMemo(
    () =>
      Object.entries(collectionLog).sort(([a], [b]) => a.localeCompare(b)),
    [collectionLog]
  );

  const pagesWithDetails = pages.filter(
    ([, page]) => page.items && page.items.length > 0
  ).length;

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold text-gray-100 tracking-wide">
          Collection Log
        </h2>
        <span className="text-xs text-gray-500">
          {pagesWithDetails} pages synced
        </span>
      </div>

      {/* Overall progress */}
      <div className="mb-5">
        <ProgressBar
          label="Items Obtained"
          value={totalObtained}
          max={totalItems}
          color="bg-green-500"
          showPercentage
        />
      </div>

      {/* Page list */}
      <div className="max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
        {pages.map(([name, page]) => {
          const obtained = page.items
            ? page.items.filter((i) => i.obtained).length
            : 0;
          const total = page.items ? page.items.length : 0;
          const isExpanded = expandedPage === name;
          const allObtained = total > 0 && obtained === total;

          return (
            <div
              key={name}
              className={`glass-card rounded-xl overflow-hidden ${
                allObtained ? "gold-glow" : ""
              }`}
            >
              {/* Expandable header */}
              <button
                onClick={() => setExpandedPage(isExpanded ? null : name)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4l8 6-8 6V4z" />
                  </svg>
                  <span className="text-sm text-gray-200">{name}</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    allObtained ? "text-osrs-gold" : "text-gray-500"
                  }`}
                >
                  {obtained}/{total}
                </span>
              </button>

              {/* Expanded item grid */}
              {isExpanded && page.items && page.items.length > 0 && (
                <div className="border-t border-white/5 px-4 py-3 animate-fade-in">
                  {/* Kill counts */}
                  {page.killCounts && page.killCounts.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {page.killCounts.map((kc, i) => (
                        <span
                          key={i}
                          className="glass-light rounded-md px-2 py-0.5 text-xs text-gray-400"
                        >
                          {kc}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Item grid with icons */}
                  <div className="flex flex-wrap gap-2">
                    {page.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`glass-light flex items-center gap-1.5 rounded-lg px-2 py-1.5 ${
                          item.obtained
                            ? "border border-green-500/20 bg-green-900/15"
                            : "border border-white/5"
                        }`}
                        title={
                          item.obtained
                            ? `${item.name} x${item.quantity}`
                            : `${item.name} (not obtained)`
                        }
                      >
                        {/* Item icon */}
                        <img
                          src={`https://static.runelite.net/cache/item/icon/${item.itemId}.png`}
                          alt={item.name}
                          width={24}
                          height={24}
                          className={`item-icon ${item.obtained ? "" : "grayscale opacity-60"}`}
                          loading="lazy"
                        />
                        <span
                          className={`text-xs leading-tight ${
                            item.obtained ? "text-green-300" : "text-gray-400"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.obtained && item.quantity > 1 && (
                          <span className="text-[10px] text-green-500/70">
                            x{item.quantity.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Synced at */}
                  {page.syncedAt && (
                    <p className="mt-3 text-[10px] text-gray-600">
                      Synced: {new Date(page.syncedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
