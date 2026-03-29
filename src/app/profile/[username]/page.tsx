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

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
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

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <div className="spinner" />
        <p className="mt-4 text-sm text-gray-500">
          Loading stats for {decodeURIComponent(username)}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
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

  // Use snapshot-level clog totals from VarP, or compute from pages as fallback
  let clogTotalObtained = snapshot.clogTotalObtained ?? 0;
  let clogTotalItems = snapshot.clogTotalItems ?? 0;
  if (clogTotalObtained === 0 && clogTotalItems === 0 && snapshot.collectionLog) {
    Object.values(snapshot.collectionLog).forEach((page) => {
      clogTotalObtained += page.obtained ?? 0;
      clogTotalItems += page.total ?? 0;
    });
  }

  // Java sends quests and diaries as Maps (objects), components expect arrays
  const questsArray = snapshot.quests ? Object.values(snapshot.quests) : [];
  const diariesArray = snapshot.diaries ? Object.values(snapshot.diaries) : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Account Summary */}
      <AccountSummary
        account={account}
        combatLevel={snapshot.meta?.combatLevel ?? null}
        totalLevel={snapshot.meta?.totalLevel ?? null}
        totalXp={snapshot.meta?.totalXp ?? null}
        uploadedAt={uploadedAt}
      />

      {/* Skills and Bosses side by side on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {snapshot.skills && <SkillsGrid skills={snapshot.skills} />}
        {snapshot.bosses && <BossGrid bosses={snapshot.bosses} />}
      </div>

      {/* Collection Log */}
      {snapshot.collectionLog && (
        <CollectionLogPanel
          collectionLog={snapshot.collectionLog}
          totalObtained={clogTotalObtained}
          totalItems={clogTotalItems}
        />
      )}

      {/* Quests and Diaries side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {questsArray.length > 0 && (
          <QuestList
            quests={questsArray}
            questPoints={snapshot.meta?.questPoints ?? null}
          />
        )}
        {diariesArray.length > 0 && <DiaryTable diaries={diariesArray} />}
      </div>

      {/* Combat Achievements and Pets side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {snapshot.combatAchievements && (
          <CombatAchievements
            combatAchievements={snapshot.combatAchievements}
          />
        )}
        {snapshot.pets && <PetList pets={snapshot.pets} />}
      </div>

      {/* Event Feed */}
      {snapshot.events && <EventFeed events={snapshot.events} />}

      {/* Loot and Death Logs side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {snapshot.lootLog && <LootLog lootLog={snapshot.lootLog} />}
        {snapshot.deaths && <DeathLog deaths={snapshot.deaths} />}
      </div>
    </div>
  );
}
