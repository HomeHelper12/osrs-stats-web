"use client";

import { PetData } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface PetListProps {
  pets: PetData[];
}

const PET_BORDER_COLORS = [
  "border-cyan-500/40",
  "border-purple-500/40",
  "border-green-500/40",
  "border-orange-500/40",
  "border-pink-500/40",
  "border-yellow-500/40",
  "border-blue-500/40",
  "border-red-500/40",
];

export default function PetList({ pets }: PetListProps) {
  const ownedPets = pets.filter((p) => p.owned);

  if (ownedPets.length === 0) {
    return (
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
          Pets
        </h2>
        <p className="text-sm text-gray-500">No pets obtained.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-gray-100">
        Pets
      </h2>

      <p className="mb-3 text-sm text-gray-500">
        {ownedPets.length} pet{ownedPets.length !== 1 ? "s" : ""} obtained
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {ownedPets.map((pet, idx) => (
          <div
            key={idx}
            className={`rounded-lg border-2 ${
              PET_BORDER_COLORS[idx % PET_BORDER_COLORS.length]
            } bg-gray-800/40 p-3`}
          >
            <p className="font-medium text-gray-200">{pet.name}</p>
            {pet.source && (
              <p className="mt-1 text-xs text-gray-500">{pet.source}</p>
            )}
            {pet.obtainedAt && (
              <p className="mt-1 text-xs text-gray-600">
                {relativeTime(pet.obtainedAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
