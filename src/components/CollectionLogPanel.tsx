"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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
  const [search, setSearch] = useState("");
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [showEmpty, setShowEmpty] = useState(false);

  const { syncedPages, emptyPages } = useMemo(() => {
    const synced: [string, ClogPage][] = [];
    const empty: [string, ClogPage][] = [];
    Object.entries(collectionLog)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, page]) => {
        if (page.items && page.items.length > 0) {
          synced.push([name, page]);
        } else {
          empty.push([name, page]);
        }
      });
    return { syncedPages: synced, emptyPages: empty };
  }, [collectionLog]);

  const pages = showEmpty ? [...syncedPages, ...emptyPages] : syncedPages;

  // Build flat list of all items for search suggestions
  const allItems = useMemo(() => {
    const items: { pageName: string; itemName: string; itemId: number; obtained: boolean }[] = [];
    pages.forEach(([name, page]) => {
      page.items?.forEach((item) => {
        items.push({ pageName: name, itemName: item.name, itemId: item.itemId, obtained: item.obtained });
      });
    });
    return items;
  }, [pages]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    // Search both page names and item names
    const pageMatches = pages
      .filter(([name]) => name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(([name]) => ({ type: "page" as const, pageName: name, label: name }));
    const itemMatches = allItems
      .filter((i) => i.itemName.toLowerCase().includes(q))
      .slice(0, 5)
      .map((i) => ({ type: "item" as const, pageName: i.pageName, label: `${i.itemName}`, sublabel: i.pageName }));
    return [...pageMatches, ...itemMatches].slice(0, 8);
  }, [search, pages, allItems]);

  const selectResult = useCallback((pageName: string, itemName?: string) => {
    setSearch("");
    setExpandedPage(pageName);
    if (itemName) {
      setHighlightedItem(`${pageName}:${itemName}`);
      setTimeout(() => setHighlightedItem(null), 2500);
    }
    // Scroll to the page after a tick so it expands first
    requestAnimationFrame(() => {
      const el = pageRefs.current[pageName];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

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
          label={`Items Obtained — ${totalObtained} / ${totalItems}`}
          value={totalObtained}
          max={totalItems}
          color="bg-green-500"
          showPercentage
        />
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
            placeholder="Search pages or items..."
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
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => selectResult(s.pageName, s.type === "item" ? s.label : undefined)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
              >
                <span>{s.label}</span>
                {s.type === "item" && "sublabel" in s && (
                  <span className="text-xs text-gray-400">{s.sublabel}</span>
                )}
                {s.type === "page" && (
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Page</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info about syncing */}
      {emptyPages.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {syncedPages.length} pages synced &middot; {emptyPages.length} awaiting in-game visit
          </p>
          <button
            onClick={() => setShowEmpty(!showEmpty)}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            {showEmpty ? "Hide unsynced" : "Show all"}
          </button>
        </div>
      )}

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
              ref={(el) => { pageRefs.current[name] = el; }}
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
                        className={`glass-light flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-500 ${
                          highlightedItem === `${name}:${item.name}`
                            ? "ring-2 ring-osrs-gold/70 shadow-lg shadow-osrs-gold/20"
                            : ""
                        } ${
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
                            item.obtained ? "text-green-300" : "text-gray-300/70"
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
