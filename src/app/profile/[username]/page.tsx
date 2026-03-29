"use client";

import { useState, useEffect, use } from "react";
import { ProfileResponse } from "@/lib/types";
import AccountSummary from "@/components/AccountSummary";
import SkillsGrid from "@/components/SkillsGrid";
import BossGrid from "@/components/BossGrid";
import CollectionLogPanel from "@/components/CollectionLogPanel";
import QuestList from "@/components/QuestList";
import DiaryTable from "@/components/DiaryTable";
import CombatAchievements from "@/components/CombatAchievements";
import LootLog from "@/components/LootLog";
import DeathLog from "@/components/DeathLog";
import EventFeed from "@/components/EventFeed";
import PetList from "@/components/PetList";
import TasksPanel from "@/components/TasksPanel";

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

type TabId =
  | "skills"
  | "bosses"
  | "clog"
  | "quests"
  | "diaries"
  | "combat"
  | "activity"
  | "tasks";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabDef[] = [
  {
    id: "skills",
    label: "Skills",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5M2 10l8 5 8-5" />
      </svg>
    ),
  },
  {
    id: "bosses",
    label: "Bosses",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M10 2a3 3 0 00-3 3v1H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2V5a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H9V5zm-2 5a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0zm-5 4h4a.5.5 0 010 1H8a.5.5 0 010-1z" />
      </svg>
    ),
  },
  {
    id: "clog",
    label: "Collection Log",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3h10v2H5V5zm0 4h10v2H5V9zm0 4h7v2H5v-2z" />
      </svg>
    ),
  },
  {
    id: "quests",
    label: "Quests",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M9 2a1 1 0 011 1v2.586l1.707-1.707a1 1 0 111.414 1.414L11.414 7H14a1 1 0 110 2h-4v2h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H4a1 1 0 110-2h4V9H4a1 1 0 010-2h2.586L4.879 5.293a1 1 0 011.414-1.414L8 5.586V3a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    id: "diaries",
    label: "Diaries",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 4h6a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h6a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h4a.5.5 0 010 1H7a.5.5 0 010-1z" />
      </svg>
    ),
  },
  {
    id: "combat",
    label: "Combat Achievements",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M5 2l5 4 5-4v6l-5 4-5-4V2zm0 10l5 4 5-4v2l-5 4-5-4v-2z" />
      </svg>
    ),
  },
  {
    id: "activity",
    label: "Activity",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
      </svg>
    ),
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-3a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState<TabId>("skills");
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/profile/${encodeURIComponent(username)}`
        );
        if (!res.ok) {
          if (res.status === 404) {
            setError(`Player "${username}" not found.`);
          } else {
            setError("Failed to load profile data.");
          }
          return;
        }
        const json: ProfileResponse = await res.json();
        setData(json);
      } catch {
        setError("An error occurred while fetching profile data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 animate-fade-in">
        <div className="spinner" />
        <p className="mt-4 text-sm text-gray-500">
          Loading stats for {decodeURIComponent(username)}...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Error state
  // -------------------------------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 animate-fade-in">
        <p className="text-lg text-red-400">{error}</p>
        <a
          href="/"
          className="mt-4 text-sm text-osrs-gold hover:text-osrs-gold-light transition-colors"
        >
          Back to search
        </a>
      </div>
    );
  }

  if (!data) return null;

  const { account, snapshot, uploadedAt } = data;

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  // Collection log totals — prefer VarP values, fallback to summing pages
  let clogTotalObtained = snapshot.clogTotalObtained ?? 0;
  let clogTotalItems = snapshot.clogTotalItems ?? 0;
  if (
    clogTotalObtained === 0 &&
    clogTotalItems === 0 &&
    snapshot.collectionLog
  ) {
    Object.values(snapshot.collectionLog).forEach((page) => {
      clogTotalObtained += page.obtained ?? 0;
      clogTotalItems += page.total ?? 0;
    });
  }

  // Java sends quests and diaries as Maps (objects) — convert to arrays
  const questsArray = snapshot.quests ? Object.values(snapshot.quests) : [];
  const diariesArray = snapshot.diaries ? Object.values(snapshot.diaries) : [];

  // -------------------------------------------------------------------------
  // Render the active tab content
  // -------------------------------------------------------------------------
  function renderContent() {
    if (!snapshot) return null;

    switch (activeTab) {
      case "skills":
        return snapshot.skills ? (
          <div className="animate-fade-in">
            <SkillsGrid skills={snapshot.skills} />
          </div>
        ) : (
          <EmptyState message="No skill data available." />
        );

      case "bosses":
        return snapshot.bosses ? (
          <div className="animate-fade-in">
            <BossGrid bosses={snapshot.bosses} />
          </div>
        ) : (
          <EmptyState message="No boss data available." />
        );

      case "clog":
        return snapshot.collectionLog ? (
          <div className="animate-fade-in">
            <CollectionLogPanel
              collectionLog={snapshot.collectionLog}
              totalObtained={clogTotalObtained}
              totalItems={clogTotalItems}
            />
          </div>
        ) : (
          <EmptyState message="No collection log data available." />
        );

      case "quests":
        return questsArray.length > 0 ? (
          <div className="animate-fade-in">
            <QuestList
              quests={questsArray}
              questPoints={snapshot.meta?.questPoints ?? null}
            />
          </div>
        ) : (
          <EmptyState message="No quest data available." />
        );

      case "diaries":
        return diariesArray.length > 0 ? (
          <div className="animate-fade-in">
            <DiaryTable diaries={diariesArray} />
          </div>
        ) : (
          <EmptyState message="No diary data available." />
        );

      case "combat":
        return snapshot.combatAchievements ? (
          <div className="animate-fade-in space-y-6">
            <CombatAchievements
              combatAchievements={snapshot.combatAchievements}
            />
            {snapshot.pets && <PetList pets={snapshot.pets} />}
          </div>
        ) : (
          <EmptyState message="No combat achievement data available." />
        );

      case "activity":
        return (
          <div className="animate-fade-in space-y-6">
            {snapshot.events && snapshot.events.length > 0 && (
              <EventFeed events={snapshot.events} />
            )}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {snapshot.lootLog && snapshot.lootLog.length > 0 && (
                <LootLog lootLog={snapshot.lootLog} />
              )}
              {snapshot.deaths && snapshot.deaths.length > 0 && (
                <DeathLog deaths={snapshot.deaths} />
              )}
            </div>
            {(!snapshot.events || snapshot.events.length === 0) &&
              (!snapshot.lootLog || snapshot.lootLog.length === 0) &&
              (!snapshot.deaths || snapshot.deaths.length === 0) && (
                <EmptyState message="No activity data available." />
              )}
          </div>
        );

      case "tasks":
        return (
          <div className="animate-fade-in">
            <TasksPanel playerName={username} />
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* ----------------------------------------------------------------- */}
      {/* Account summary header — full width                               */}
      {/* ----------------------------------------------------------------- */}
      <AccountSummary
        account={account}
        snapshot={snapshot}
        uploadedAt={uploadedAt}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Mobile tabs — horizontal scrollable strip                         */}
      {/* ----------------------------------------------------------------- */}
      <nav className="lg:hidden" aria-label="Profile tabs (mobile)">
        <div className="glass rounded-xl p-1.5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`glass-tab flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* Desktop layout: sidebar + content                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex gap-6">
        {/* ----- Sidebar (desktop only) ----- */}
        <aside
          className="hidden lg:block w-56 shrink-0"
          aria-label="Profile tabs"
        >
          <div className="glass sticky top-6 rounded-xl p-2">
            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`glass-tab flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ----- Main content area ----- */}
        <main className="min-w-0 flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state placeholder
// ---------------------------------------------------------------------------

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass animate-fade-in flex flex-col items-center justify-center rounded-xl py-20 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-gray-600 mb-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
