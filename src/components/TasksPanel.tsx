"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskPlayerState, PlayerTask, TaskTierProgress } from "@/lib/types";
import ProgressBar from "./ProgressBar";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const API_KEY =
  "3a220683822cfcf3cb0e48416ffeaffd2556a6d817f6982afaf0b66f94cb960a";

const TIERS = ["easy", "medium", "hard", "elite", "master"] as const;
type Tier = (typeof TIERS)[number];

const TIER_META: Record<
  Tier,
  { label: string; color: string; hex: string; dot: string; barColor: string }
> = {
  easy: {
    label: "Easy",
    color: "text-green-400",
    hex: "#22c55e",
    dot: "bg-green-400",
    barColor: "bg-green-500",
  },
  medium: {
    label: "Medium",
    color: "text-blue-400",
    hex: "#3b82f6",
    dot: "bg-blue-400",
    barColor: "bg-blue-500",
  },
  hard: {
    label: "Hard",
    color: "text-purple-400",
    hex: "#a855f7",
    dot: "bg-purple-400",
    barColor: "bg-purple-500",
  },
  elite: {
    label: "Elite",
    color: "text-yellow-400",
    hex: "#eab308",
    dot: "bg-yellow-400",
    barColor: "bg-yellow-500",
  },
  master: {
    label: "Master",
    color: "text-red-400",
    hex: "#ef4444",
    dot: "bg-red-400",
    barColor: "bg-red-500",
  },
};

function itemIconUrl(displayItemId: number | null): string | null {
  if (!displayItemId) return null;
  return `https://static.runelite.net/cache/item/icon/${displayItemId}.png`;
}

function relativeTime(isoString: string | null): string {
  if (!isoString) return "";
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TasksPanelProps {
  playerName: string;
}

export default function TasksPanel({ playerName }: TasksPanelProps) {
  const [state, setState] = useState<TaskPlayerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>("easy");
  const [actionLoading, setActionLoading] = useState(false);

  // -----------------------------------------------------------------------
  // Fetch all task state
  // -----------------------------------------------------------------------
  const fetchTaskState = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/tasks/${encodeURIComponent(playerName)}`
      );
      if (!res.ok) {
        setError("Failed to load task data.");
        return;
      }
      const json: TaskPlayerState = await res.json();
      setState(json);
      // Set the selected tier to the player's active tier setting
      if (
        json.settings?.active_tier &&
        TIERS.includes(json.settings.active_tier as Tier)
      ) {
        setSelectedTier(json.settings.active_tier as Tier);
      }
    } catch {
      setError("An error occurred while fetching task data.");
    } finally {
      setLoading(false);
    }
  }, [playerName]);

  useEffect(() => {
    fetchTaskState();
  }, [fetchTaskState]);

  // -----------------------------------------------------------------------
  // Generate task
  // -----------------------------------------------------------------------
  const generateTask = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({ playerName, tier: selectedTier }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(
          (errJson as { error?: string }).error ?? "Failed to generate task."
        );
        return;
      }
      // Refetch all state to stay in sync
      await fetchTaskState();
    } catch {
      setError("Failed to generate task.");
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // Skip task
  // -----------------------------------------------------------------------
  const skipTask = async (taskId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/tasks/skip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({ playerName, taskId }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(
          (errJson as { error?: string }).error ?? "Failed to skip task."
        );
        return;
      }
      await fetchTaskState();
    } catch {
      setError("Failed to skip task.");
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="glass animate-fade-in flex flex-col items-center justify-center rounded-2xl py-20">
        <div className="spinner" />
        <p className="mt-4 text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error state
  // -----------------------------------------------------------------------
  if (error && !state) {
    return (
      <div className="glass animate-fade-in flex flex-col items-center justify-center rounded-2xl py-20 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!state) return null;

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------
  const activeTask: PlayerTask | undefined = state.activeTasks.find(
    (t) => t.tier === selectedTier
  );

  const tierProgress: Record<string, TaskTierProgress> =
    state.tierProgress ?? {};

  const recentCompleted: PlayerTask[] = state.recentCompleted ?? [];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="animate-fade-in space-y-6">
      {/* Inline error banner */}
      {error && (
        <div className="glass-card rounded-xl border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-400 hover:text-red-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* Section B: Tier Selector                                          */}
      {/* ================================================================= */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {TIERS.map((tier) => {
            const meta = TIER_META[tier];
            const progress = tierProgress[tier];
            const completed = progress?.completed ?? 0;
            const total = progress?.total ?? 0;
            const isSelected = selectedTier === tier;

            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`glass-tab flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isSelected ? "active" : ""
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: `${meta.hex}55`,
                        boxShadow: `0 0 16px ${meta.hex}22`,
                        background: `${meta.hex}18`,
                      }
                    : undefined
                }
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${meta.dot}`}
                />
                <span className={isSelected ? meta.color : "text-gray-300"}>
                  {meta.label}
                </span>
                <span className="text-xs text-gray-500">
                  ({completed}/{total})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section A: Active Task Hero                                       */}
      {/* ================================================================= */}
      <ActiveTaskHero
        task={activeTask}
        tier={selectedTier}
        actionLoading={actionLoading}
        onGenerate={generateTask}
        onSkip={skipTask}
      />

      {/* ================================================================= */}
      {/* Section C: Tier Progress                                          */}
      {/* ================================================================= */}
      <section className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Tier Progress
        </h3>
        <div className="space-y-3">
          {TIERS.map((tier) => {
            const meta = TIER_META[tier];
            const progress = tierProgress[tier];
            const completed = progress?.completed ?? 0;
            const total = progress?.total ?? 0;
            const isComplete = completed === total && total > 0;

            return (
              <div
                key={tier}
                className={`glass-card rounded-xl p-3 ${
                  isComplete ? "gold-glow" : ""
                }`}
              >
                <ProgressBar
                  label={meta.label}
                  value={completed}
                  max={total}
                  color={meta.barColor}
                  height="h-3"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section D: Recently Completed Tasks                               */}
      {/* ================================================================= */}
      {recentCompleted.length > 0 && (
        <section className="glass rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recently Completed
          </h3>
          <div className="space-y-2">
            {recentCompleted.map((pt) => {
              const tierMeta =
                TIER_META[pt.tier as Tier] ?? TIER_META.easy;
              const iconUrl = itemIconUrl(pt.task?.display_item_id ?? null);

              return (
                <div
                  key={pt.id}
                  className="glass-card flex items-center gap-3 rounded-xl px-4 py-3"
                >
                  {/* Item icon */}
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="item-icon shrink-0"
                    />
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded bg-white/5" />
                  )}

                  {/* Task name */}
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-200">
                    {pt.task?.name ?? pt.task_id}
                  </span>

                  {/* Tier badge */}
                  <span className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`h-2 w-2 rounded-full ${tierMeta.dot}`}
                    />
                    <span className={tierMeta.color}>
                      {tierMeta.label}
                    </span>
                  </span>

                  {/* Timestamp */}
                  <span className="shrink-0 text-xs text-gray-500">
                    {relativeTime(pt.completed_at)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Task Hero sub-component
// ---------------------------------------------------------------------------

function ActiveTaskHero({
  task,
  tier,
  actionLoading,
  onGenerate,
  onSkip,
}: {
  task: PlayerTask | undefined;
  tier: Tier;
  actionLoading: boolean;
  onGenerate: () => void;
  onSkip: (taskId: string) => void;
}) {
  const meta = TIER_META[tier];

  // No active task — prompt to generate
  if (!task) {
    return (
      <section className="glass-card rounded-2xl p-8 text-center">
        <div className="mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="mx-auto h-12 w-12 text-gray-600"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              strokeLinecap="round"
              d="M12 8v4m0 0v4m0-4h4m-4 0H8"
            />
          </svg>
        </div>
        <p className="mb-1 text-gray-400">No active task for</p>
        <p className={`mb-4 text-lg font-bold ${meta.color}`}>
          {meta.label} tier
        </p>
        <button
          onClick={onGenerate}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: `${meta.hex}22`,
            border: `1px solid ${meta.hex}55`,
            color: meta.hex,
          }}
        >
          {actionLoading ? (
            <>
              <span className="spinner !h-4 !w-4 !border-2" />
              Generating...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Generate Task
            </>
          )}
        </button>
      </section>
    );
  }

  // Active task display
  const taskDef = task.task;
  const iconUrl = itemIconUrl(taskDef?.display_item_id ?? null);

  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="flex items-start gap-5">
        {/* Item icon */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `${meta.hex}12`,
            border: `1px solid ${meta.hex}33`,
          }}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              width={36}
              height={36}
              className="item-icon"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={meta.hex}
              strokeWidth={1.5}
              className="h-8 w-8"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                strokeLinecap="round"
                d="M12 8v4m0 0v4m0-4h4m-4 0H8"
              />
            </svg>
          )}
        </div>

        {/* Task info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {/* Tier badge */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: `${meta.hex}22`,
                color: meta.hex,
              }}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <span className="text-xs text-gray-600">Active</span>
          </div>

          <h3 className="mb-1 text-lg font-bold text-gray-100">
            {taskDef?.name ?? task.task_id}
          </h3>

          {taskDef?.tip && (
            <p className="mb-3 text-sm text-gray-400">{taskDef.tip}</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSkip(task.task_id)}
              disabled={actionLoading}
              className="glass-tab inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <span className="spinner !h-3.5 !w-3.5 !border-2" />
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path d="M4 4l8 6-8 6V4zm9 0v12h2V4h-2z" />
                </svg>
              )}
              Skip Task
            </button>

            {taskDef?.wiki_link && (
              <a
                href={taskDef.wiki_link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-tab inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white transition-all"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Wiki
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
