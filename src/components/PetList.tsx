"use client";

import { PetData } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface PetListProps {
  pets: PetData[];
}

const PET_BORDER_COLORS = [
  "rgba(6, 182, 212, 0.4)",   // cyan
  "rgba(168, 85, 247, 0.4)",  // purple
  "rgba(34, 197, 94, 0.4)",   // green
  "rgba(249, 115, 22, 0.4)",  // orange
  "rgba(236, 72, 153, 0.4)",  // pink
  "rgba(234, 179, 8, 0.4)",   // yellow
  "rgba(59, 130, 246, 0.4)",  // blue
  "rgba(239, 68, 68, 0.4)",   // red
];

const PET_GLOW_COLORS = [
  "rgba(6, 182, 212, 0.12)",
  "rgba(168, 85, 247, 0.12)",
  "rgba(34, 197, 94, 0.12)",
  "rgba(249, 115, 22, 0.12)",
  "rgba(236, 72, 153, 0.12)",
  "rgba(234, 179, 8, 0.12)",
  "rgba(59, 130, 246, 0.12)",
  "rgba(239, 68, 68, 0.12)",
];

export default function PetList({ pets }: PetListProps) {
  const ownedPets = pets.filter((p) => p.owned);

  if (ownedPets.length === 0) {
    return (
      <section className="glass rounded-2xl p-6 animate-fade-in">
        <h2 className="mb-4 border-b border-white/10 pb-2 text-lg font-bold text-gray-100">
          Pets
        </h2>
        <p className="text-sm text-gray-500">No pets obtained.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <h2 className="text-lg font-bold text-gray-100">Pets</h2>
        <span className="text-xs text-gray-500">
          {ownedPets.length} pet{ownedPets.length !== 1 ? "s" : ""} obtained
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {ownedPets.map((pet, idx) => {
          const colorIdx = idx % PET_BORDER_COLORS.length;
          return (
            <div
              key={idx}
              className="glass-card rounded-xl p-3"
              style={{
                borderColor: PET_BORDER_COLORS[colorIdx],
                boxShadow: `0 4px 20px ${PET_GLOW_COLORS[colorIdx]}`,
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://static.runelite.net/cache/item/icon/${pet.itemId}.png`}
                  alt={pet.name}
                  width={32}
                  height={32}
                  className="item-icon"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-200">
                    {pet.name}
                  </p>
                  {pet.source && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {pet.source}
                    </p>
                  )}
                  {pet.obtainedAt && (
                    <p className="mt-0.5 text-xs text-gray-600">
                      {relativeTime(pet.obtainedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
