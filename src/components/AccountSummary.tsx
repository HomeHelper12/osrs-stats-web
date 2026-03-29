"use client";

import { AccountRow } from "@/lib/types";
import { formatNumber, relativeTime } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface AccountSummaryProps {
  account: AccountRow;
  combatLevel: number | null;
  totalLevel: number | null;
  totalXp: number | null;
  uploadedAt: string;
}

const ACCOUNT_TYPE_STYLES: Record<string, { label: string; color: string }> = {
  NORMAL: { label: "Normal", color: "bg-gray-600 text-gray-200" },
  IRONMAN: { label: "Ironman", color: "bg-gray-400 text-gray-900" },
  HARDCORE_IRONMAN: { label: "HCIM", color: "bg-red-700 text-white" },
  ULTIMATE_IRONMAN: { label: "UIM", color: "bg-white text-gray-900" },
  GROUP_IRONMAN: { label: "GIM", color: "bg-green-700 text-white" },
};

export default function AccountSummary({
  account,
  combatLevel,
  totalLevel,
  totalXp,
  uploadedAt,
}: AccountSummaryProps) {
  const accountType =
    ACCOUNT_TYPE_STYLES[account.account_type ?? "NORMAL"] ??
    ACCOUNT_TYPE_STYLES.NORMAL;

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-100">
              {account.display_name}
            </h1>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${accountType.color}`}
            >
              {accountType.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Last updated: {relativeTime(uploadedAt)}
          </p>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-osrs-gold">
              {combatLevel ?? "--"}
            </p>
            <p className="text-xs text-gray-500">Combat</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {totalLevel != null ? formatNumber(totalLevel) : "--"}
            </p>
            <p className="text-xs text-gray-500">Total Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {totalXp != null ? formatNumber(totalXp) : "--"}
            </p>
            <p className="text-xs text-gray-500">Total XP</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar
          label="Overall Completion"
          value={totalLevel ?? 0}
          max={2376}
          color="bg-osrs-gold"
          showPercentage
        />
      </div>
    </section>
  );
}
