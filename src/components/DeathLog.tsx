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
      <section className="glass rounded-2xl p-6 animate-fade-in" style={{ borderColor: "rgba(239, 68, 68, 0.15)" }}>
        <h2 className="mb-4 border-b border-white/10 pb-2 text-lg font-bold text-red-400">
          Death Log
        </h2>
        <p className="text-sm text-gray-500">No deaths recorded.</p>
      </section>
    );
  }

  return (
    <section
      className="glass rounded-2xl p-6 animate-fade-in"
      style={{ borderColor: "rgba(239, 68, 68, 0.15)" }}
    >
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Death Log
        </h2>
        <span className="text-xs text-gray-500">
          {entries.length} death{entries.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Location</th>
              <th className="px-3 py-2 text-right font-medium">Value Lost</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={idx}
                className={`border-b border-white/5 transition-colors hover:bg-red-500/[0.04] ${
                  idx % 2 === 0 ? "bg-red-500/[0.02]" : ""
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
