"use client";

import { AccountRow, AccountSnapshot } from "@/lib/types";
import { formatNumber, relativeTime } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface AccountSummaryProps {
  account: AccountRow;
  snapshot: AccountSnapshot;
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

/**
 * Calculate overall account completion matching the Java formula:
 * Skills 20%, Quests 20%, CLog 25%, Diaries 15%, CAs 20%
 */
function calcCompletion(snapshot: AccountSnapshot): number {
  // Skills: count of level-99 skills / 24
  let skillPct = 0;
  if (snapshot.skills) {
    const maxed = Object.values(snapshot.skills).filter(
      (s) => s.name !== "Overall" && s.level >= 99
    ).length;
    skillPct = Math.min(1, maxed / 24);
  }

  // Quests: completed / total from meta
  let questPct = 0;
  if (snapshot.meta?.questsTotal > 0) {
    questPct = Math.min(1, snapshot.meta.questsCompleted / snapshot.meta.questsTotal);
  }

  // Collection log: obtained / total across all pages
  let clogPct = 0;
  if (snapshot.collectionLog) {
    let obtained = snapshot.clogTotalObtained ?? 0;
    let total = snapshot.clogTotalItems ?? 0;
    if (obtained === 0 && total === 0) {
      Object.values(snapshot.collectionLog).forEach((page) => {
        obtained += page.obtained ?? 0;
        total += page.total ?? 0;
      });
    }
    if (total > 0) clogPct = Math.min(1, obtained / total);
  }

  // Diaries: completed tiers / (areas * 4)
  let diaryPct = 0;
  if (snapshot.diaries) {
    const areas = Object.values(snapshot.diaries);
    const diaryTotal = areas.length * 4;
    if (diaryTotal > 0) {
      let tiersComplete = 0;
      areas.forEach((d) => {
        if (d.easyComplete) tiersComplete++;
        if (d.mediumComplete) tiersComplete++;
        if (d.hardComplete) tiersComplete++;
        if (d.eliteComplete) tiersComplete++;
      });
      diaryPct = Math.min(1, tiersComplete / diaryTotal);
    }
  }

  // Combat achievements: completed / total
  let caPct = 0;
  if (snapshot.combatAchievements) {
    let caCompleted = 0;
    let caTotal = 0;
    Object.values(snapshot.combatAchievements).forEach((tier) => {
      caCompleted += tier.completed;
      caTotal += tier.total;
    });
    if (caTotal > 0) caPct = Math.min(1, caCompleted / caTotal);
  }

  return (skillPct * 0.20) + (questPct * 0.20) + (clogPct * 0.25)
    + (diaryPct * 0.15) + (caPct * 0.20);
}

export default function AccountSummary({
  account,
  snapshot,
  uploadedAt,
}: AccountSummaryProps) {
  const accountType =
    ACCOUNT_TYPE_STYLES[account.account_type ?? "NORMAL"] ??
    ACCOUNT_TYPE_STYLES.NORMAL;

  const combatLevel = snapshot.meta?.combatLevel ?? null;
  const totalLevel = snapshot.meta?.totalLevel ?? null;
  const totalXp = snapshot.meta?.totalXp ?? null;
  const completionPct = calcCompletion(snapshot);

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

      {/* Overall completion — matches Java weighted formula */}
      <div className="mt-5">
        <ProgressBar
          label="Overall Completion"
          value={Math.round(completionPct * 1000)}
          max={1000}
          color="bg-osrs-gold"
          showPercentage
        />
      </div>
    </section>
  );
}
