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

const ACCOUNT_TYPE_STYLES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  NORMAL: {
    label: "Normal",
    bg: "rgba(107, 114, 128, 0.3)",
    text: "text-gray-300",
  },
  IRONMAN: {
    label: "Ironman",
    bg: "rgba(156, 163, 175, 0.25)",
    text: "text-gray-200",
  },
  HARDCORE_IRONMAN: {
    label: "HCIM",
    bg: "rgba(185, 28, 28, 0.35)",
    text: "text-red-300",
  },
  ULTIMATE_IRONMAN: {
    label: "UIM",
    bg: "rgba(255, 255, 255, 0.15)",
    text: "text-white",
  },
  GROUP_IRONMAN: {
    label: "GIM",
    bg: "rgba(21, 128, 61, 0.35)",
    text: "text-green-300",
  },
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
    <section
      className="glass rounded-2xl p-6 animate-fade-in"
      style={{
        borderLeft: "3px solid rgba(212, 160, 23, 0.6)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Player identity */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">
              {account.display_name}
            </h1>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur-sm ${accountType.text}`}
              style={{
                background: accountType.bg,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {accountType.label}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            Last updated: {relativeTime(uploadedAt)}
          </p>
        </div>

        {/* Stat highlights */}
        <div className="flex gap-6 text-center">
          <div className="glass-light rounded-xl px-4 py-2">
            <p className="text-2xl font-bold text-osrs-gold tabular-nums">
              {combatLevel ?? "--"}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500">
              Combat
            </p>
          </div>
          <div className="glass-light rounded-xl px-4 py-2">
            <p className="text-2xl font-bold text-gray-100 tabular-nums">
              {totalLevel != null ? formatNumber(totalLevel) : "--"}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500">
              Total Level
            </p>
          </div>
          <div className="glass-light rounded-xl px-4 py-2">
            <p className="text-2xl font-bold text-gray-100 tabular-nums">
              {totalXp != null ? formatNumber(totalXp) : "--"}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500">
              Total XP
            </p>
          </div>
        </div>
      </div>

      {/* Overall completion */}
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
