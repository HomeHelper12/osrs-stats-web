"use client";

import { DeathEntry } from "@/lib/types";
import { formatValue, relativeTime } from "@/lib/utils";

interface DeathLogProps {
  deaths: DeathEntry[];
}

export default function DeathLog({ deaths }: DeathLogProps) {
  const entries = deaths.slice(0, 50);

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-red-400">
          Death Log
        </h2>
        <p className="text-sm text-gray-500">No deaths recorded.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-red-900/30 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-red-400">
        Death Log
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Location</th>
              <th className="px-3 py-2 text-right font-medium">Value Lost</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-800/30 ${
                  idx % 2 === 0 ? "bg-red-950/10" : ""
                }`}
              >
                <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                  {entry.timestamp ? relativeTime(entry.timestamp) : "--"}
                </td>
                <td className="px-3 py-2 text-gray-300">
                  {entry.location ?? "Unknown"}
                </td>
                <td className="px-3 py-2 text-right font-medium text-red-400">
                  {entry.valueLost != null && entry.valueLost > 0
                    ? formatValue(entry.valueLost)
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
