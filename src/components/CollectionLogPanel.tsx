"use client";

import { useState } from "react";
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

  const pages = Object.entries(collectionLog).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const pagesWithDetails = pages.filter(
    ([, page]) => page.items && page.items.length > 0
  ).length;

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Collection Log
      </h2>

      <div className="mb-4">
        <ProgressBar
          label="Items Obtained"
          value={totalObtained}
          max={totalItems}
          color="bg-green-600"
          showPercentage
        />
      </div>

      <p className="mb-3 text-xs text-gray-500">
        {pagesWithDetails} pages with details
      </p>

      <div className="max-h-96 space-y-1 overflow-y-auto pr-1">
        {pages.map(([name, page]) => {
          const obtained = page.items
            ? page.items.filter((i) => i.obtained).length
            : 0;
          const total = page.items ? page.items.length : 0;
          const isExpanded = expandedPage === name;

          return (
            <div key={name} className="rounded-lg border border-gray-700/30">
              <button
                onClick={() => setExpandedPage(isExpanded ? null : name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-800/50 transition-colors rounded-lg"
              >
                <span className="text-gray-300">{name}</span>
                <span className="text-xs text-gray-500">
                  {obtained}/{total}
                </span>
              </button>

              {isExpanded && page.items && page.items.length > 0 && (
                <div className="border-t border-gray-800 px-3 py-2">
                  <div className="flex flex-wrap gap-1.5">
                    {page.items.map((item, idx) => (
                      <span
                        key={idx}
                        className={`rounded px-2 py-0.5 text-xs ${
                          item.obtained
                            ? "bg-green-900/40 text-green-400"
                            : "bg-gray-800/60 text-gray-600"
                        }`}
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
