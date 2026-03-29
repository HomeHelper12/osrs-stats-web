"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATS = [
  { value: "24", label: "Skills" },
  { value: "50+", label: "Bosses" },
  { value: "1,400+", label: "Collection Slots" },
  { value: "209", label: "Quests" },
];

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
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight text-osrs-gold sm:text-7xl">
          OSRS Stats
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-gray-400">
          Track your Old School RuneScape progress. View skills, bosses,
          collection log, quests, and more.
        </p>

        <form
          onSubmit={handleSearch}
          className="glass mt-6 flex w-full max-w-lg items-center gap-0 rounded-2xl p-1.5"
        >
          <div className="flex flex-1 items-center gap-3 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 shrink-0 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a player name..."
              className="w-full bg-transparent py-3 text-base text-gray-100 placeholder-gray-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-osrs-gold px-6 py-3 font-semibold text-gray-950 transition-all hover:bg-osrs-gold-light hover:shadow-lg hover:shadow-osrs-gold/20 active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="mt-12 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl px-4 py-5 text-center"
            >
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
