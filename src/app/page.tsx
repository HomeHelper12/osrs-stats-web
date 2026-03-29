"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) {
      router.push(`/profile/${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-osrs-gold sm:text-6xl">
          OSRS Account Stats
        </h1>
        <p className="max-w-md text-lg text-gray-400">
          Track your Old School RuneScape progress. View skills, bosses,
          collection log, quests, and more.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-4 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a player name..."
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-base text-gray-100 placeholder-gray-500 outline-none focus:border-osrs-gold focus:ring-2 focus:ring-osrs-gold/40 transition-all"
          />
          <button
            type="submit"
            className="rounded-lg bg-osrs-gold px-6 py-3 font-semibold text-gray-950 transition-colors hover:bg-osrs-gold-light active:bg-osrs-gold/80"
          >
            Search
          </button>
        </form>

        <div className="mt-12 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-gray-100">24</p>
            <p className="text-sm text-gray-500">Skills</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">50+</p>
            <p className="text-sm text-gray-500">Bosses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">1,400+</p>
            <p className="text-sm text-gray-500">Collection Slots</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">158</p>
            <p className="text-sm text-gray-500">Quests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
