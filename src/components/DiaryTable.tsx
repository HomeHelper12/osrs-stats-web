"use client";

import { useMemo } from "react";
import { DiaryData } from "@/lib/types";

interface DiaryTableProps {
  diaries: DiaryData[];
}

const TIERS = [
  { key: "easyComplete" as const, label: "Easy", color: "text-green-400" },
  { key: "mediumComplete" as const, label: "Medium", color: "text-blue-400" },
  { key: "hardComplete" as const, label: "Hard", color: "text-purple-400" },
  { key: "eliteComplete" as const, label: "Elite", color: "text-yellow-400" },
];

export default function DiaryTable({ diaries }: DiaryTableProps) {
  const sorted = useMemo(
    () => [...diaries].sort((a, b) => a.area.localeCompare(b.area)),
    [diaries]
  );

  const totalComplete = sorted.filter(
    (d) => d.easyComplete && d.mediumComplete && d.hardComplete && d.eliteComplete
  ).length;

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-bold text-gray-100 tracking-wide">
          Achievement Diaries
        </h2>
        <span className="text-xs text-gray-500">
          {totalComplete}/{sorted.length} areas complete
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Area
              </th>
              {TIERS.map((tier) => (
                <th
                  key={tier.key}
                  className={`px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider ${tier.color}`}
                >
                  {tier.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((diary) => {
              const allComplete =
                diary.easyComplete &&
                diary.mediumComplete &&
                diary.hardComplete &&
                diary.eliteComplete;

              return (
                <tr
                  key={diary.area}
                  className={`border-b border-white/5 transition-colors ${
                    allComplete
                      ? "bg-green-500/8 hover:bg-green-500/12"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {allComplete && (
                        <span className="text-osrs-gold text-xs">&#9733;</span>
                      )}
                      <span
                        className={`font-medium ${
                          allComplete ? "text-green-300" : "text-gray-300"
                        }`}
                      >
                        {diary.area}
                      </span>
                    </div>
                  </td>
                  {TIERS.map((tier) => {
                    const complete = diary[tier.key];
                    return (
                      <td key={tier.key} className="px-4 py-2.5 text-center">
                        {complete ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500/60">
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
