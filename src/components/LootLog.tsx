"use client";

import { LootEntry } from "@/lib/types";
import { formatValue, relativeTime } from "@/lib/utils";

interface LootLogProps {
  lootLog: LootEntry[];
}

export default function LootLog({ lootLog }: LootLogProps) {
  const entries = lootLog.slice(0, 50);

  if (entries.length === 0) {
    return (
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <h2 className="mb-4 border-b border-white/10 pb-2 text-lg font-bold text-gray-100">
          Loot Log
        </h2>
        <p className="text-sm text-gray-500">No loot entries recorded.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <h2 className="text-lg font-bold text-gray-100">Loot Log</h2>
        <span className="text-xs text-gray-500">
          {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Source</th>
              <th className="px-3 py-2 text-left font-medium">Item</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="px-3 py-2 text-right font-medium">GE Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              const geValue = entry.geValue ?? 0;
              const isHighValue = geValue >= 1_000_000;
              return (
                <tr
                  key={idx}
                  className={`border-b border-white/5 transition-colors hover:bg-white/[0.04] ${
                    idx % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                    {entry.timestamp ? relativeTime(entry.timestamp) : "--"}
                  </td>
                  <td className="px-3 py-2 text-gray-300">{entry.source}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://static.runelite.net/cache/item/icon/${entry.itemId}.png`}
                        alt={entry.itemName}
                        width={20}
                        height={20}
                        className="item-icon"
                      />
                      <span
                        className={`font-medium ${
                          isHighValue ? "text-osrs-gold" : "text-gray-300"
                        }`}
                      >
                        {entry.itemName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-400">
                    {entry.quantity.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-medium ${
                      isHighValue ? "text-osrs-gold" : "text-gray-300"
                    }`}
                  >
                    {formatValue(geValue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
