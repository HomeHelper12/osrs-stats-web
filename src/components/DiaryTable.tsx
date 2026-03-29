"use client";

import { DiaryData } from "@/lib/types";

interface DiaryTableProps {
  diaries: DiaryData[];
}

const TIERS = ["easy", "medium", "hard", "elite"] as const;

export default function DiaryTable({ diaries }: DiaryTableProps) {
  const sorted = [...diaries].sort((a, b) => a.area.localeCompare(b.area));

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Achievement Diaries
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="px-3 py-2 text-left font-medium">Area</th>
              {TIERS.map((tier) => (
                <th
                  key={tier}
                  className="px-3 py-2 text-center font-medium capitalize"
                >
                  {tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((diary) => {
              const allComplete = TIERS.every(
                (tier) => diary[tier] === "COMPLETE"
              );

              return (
                <tr
                  key={diary.area}
                  className={`border-b border-gray-800/50 ${
                    allComplete ? "bg-green-950/20" : ""
                  }`}
                >
                  <td className="px-3 py-2 text-gray-300">{diary.area}</td>
                  {TIERS.map((tier) => {
                    const complete = diary[tier] === "COMPLETE";
                    return (
                      <td key={tier} className="px-3 py-2 text-center">
                        {complete ? (
                          <span className="text-green-400 font-bold">
                            &#10003;
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">
                            &#10007;
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
