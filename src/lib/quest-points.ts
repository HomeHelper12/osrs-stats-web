/**
 * Quest point values from the OSRS Wiki.
 * Key = quest name as it appears in RuneLite's Quest enum (getName()).
 * Value = { qp: number, mini?: true } — mini indicates a miniquest/subquest.
 *
 * Source: https://oldschool.runescape.wiki/w/Quest_point
 * Last updated: 2025-03
 */

interface QuestInfo {
  qp: number;
  mini?: boolean;
}

const QUEST_POINTS: Record<string, QuestInfo> = {
  // ── Free-to-Play ──────────────────────────────────────────────────
  "Below Ice Mountain": { qp: 1 },
  "Black Knights' Fortress": { qp: 3 },
  "Cook's Assistant": { qp: 1 },
  "The Corsair Curse": { qp: 2 },
  "Demon Slayer": { qp: 3 },
  "Doric's Quest": { qp: 1 },
  "Dragon Slayer I": { qp: 2 },
  "Ernest the Chicken": { qp: 4 },
  "Goblin Diplomacy": { qp: 5 },
  "Imp Catcher": { qp: 1 },
  "The Knight's Sword": { qp: 1 },
  "Misthalin Mystery": { qp: 1 },
  "Pirate's Treasure": { qp: 2 },
  "Prince Ali Rescue": { qp: 3 },
  "The Restless Ghost": { qp: 1 },
  "Romeo & Juliet": { qp: 5 },
  "Rune Mysteries": { qp: 1 },
  "Sheep Shearer": { qp: 1 },
  "Shield of Arrav": { qp: 1 },
  "Vampire Slayer": { qp: 3 },
  "Witch's Potion": { qp: 1 },
  "X Marks the Spot": { qp: 1 },

  // ── Members Quests ────────────────────────────────────────────────
  "Animal Magnetism": { qp: 1 },
  "Another Slice of H.A.M.": { qp: 1 },
  "A Kingdom Divided": { qp: 2 },
  "A Night at the Theatre": { qp: 2 },
  "A Porcine of Interest": { qp: 1 },
  "A Soul's Bane": { qp: 1 },
  "A Tail of Two Cats": { qp: 2 },
  "A Taste of Hope": { qp: 1 },
  "At First Light": { qp: 1 },
  "Beneath Cursed Sands": { qp: 2 },
  "Between a Rock...": { qp: 2 },
  "Big Chompy Bird Hunting": { qp: 2 },
  "Biohazard": { qp: 3 },
  "Bone Voyage": { qp: 1 },
  "Cabin Fever": { qp: 2 },
  "Client of Kourend": { qp: 1 },
  "Clock Tower": { qp: 1 },
  "Cold War": { qp: 1 },
  "Contact!": { qp: 1 },
  "Creature of Fenkenstrain": { qp: 2 },
  "Darkness of Hallowvale": { qp: 2 },
  "Death Plateau": { qp: 1 },
  "Death to the Dorgeshuun": { qp: 1 },
  "Defender of Varrock": { qp: 2 },
  "Desert Treasure I": { qp: 3 },
  "Desert Treasure II - The Fallen Empire": { qp: 5 },
  "Devious Minds": { qp: 1 },
  "The Dig Site": { qp: 2 },
  "Dragon Slayer II": { qp: 5 },
  "Dream Mentor": { qp: 2 },
  "Druidic Ritual": { qp: 4 },
  "Dwarf Cannon": { qp: 1 },
  "Eadgar's Ruse": { qp: 1 },
  "Eagles' Peak": { qp: 2 },
  "Elemental Workshop I": { qp: 1 },
  "Elemental Workshop II": { qp: 1 },
  "Enakhra's Lament": { qp: 2 },
  "Enlightened Journey": { qp: 1 },
  "The Eyes of Glouphrie": { qp: 2 },
  "Fairytale I - Growing Pains": { qp: 2 },
  "Fairytale II - Cure a Queen": { qp: 2 },
  "Family Crest": { qp: 1 },
  "The Feud": { qp: 1 },
  "Fight Arena": { qp: 2 },
  "Fishing Contest": { qp: 1 },
  "Forgettable Tale...": { qp: 2 },
  "Forsaken Tower": { qp: 1 },
  "The Fremennik Exiles": { qp: 2 },
  "The Fremennik Isles": { qp: 1 },
  "The Fremennik Trials": { qp: 3 },
  "Garden of Tranquillity": { qp: 2 },
  "Gertrude's Cat": { qp: 1 },
  "Getting Ahead": { qp: 1 },
  "Ghosts Ahoy": { qp: 2 },
  "The Giant Dwarf": { qp: 2 },
  "The Golem": { qp: 1 },
  "The Grand Tree": { qp: 5 },
  "The Great Brain Robbery": { qp: 2 },
  "Grim Tales": { qp: 1 },
  "The Hand in the Sand": { qp: 1 },
  "Haunted Mine": { qp: 2 },
  "Hazeel Cult": { qp: 1 },
  "Heroes' Quest": { qp: 1 },
  "Holy Grail": { qp: 2 },
  "Horror from the Deep": { qp: 2 },
  "Ichtlarin's Little Helper": { qp: 2 },
  "In Aid of the Myreque": { qp: 2 },
  "In Search of the Myreque": { qp: 2 },
  "Jungle Potion": { qp: 1 },
  "King's Ransom": { qp: 1 },
  "Legends' Quest": { qp: 4 },
  "Land of the Goblins": { qp: 1 },
  "Lost City": { qp: 3 },
  "The Lost Tribe": { qp: 1 },
  "Lunar Diplomacy": { qp: 2 },
  "Making Friends with My Arm": { qp: 2 },
  "Making History": { qp: 3 },
  "Merlin's Crystal": { qp: 6 },
  "Monkey Madness I": { qp: 3 },
  "Monkey Madness II": { qp: 4 },
  "Monk's Friend": { qp: 1 },
  "Mountain Daughter": { qp: 2 },
  "Mourning's End Part I": { qp: 2 },
  "Mourning's End Part II": { qp: 2 },
  "Murder Mystery": { qp: 3 },
  "My Arm's Big Adventure": { qp: 1 },
  "Nature Spirit": { qp: 2 },
  "Observatory Quest": { qp: 2 },
  "Olaf's Quest": { qp: 1 },
  "One Small Favour": { qp: 2 },
  "Perilous Moons": { qp: 2 },
  "Plague City": { qp: 1 },
  "Priest in Peril": { qp: 1 },
  "The Queen of Thieves": { qp: 1 },
  "Rag and Bone Man I": { qp: 1 },
  "Rag and Bone Man II": { qp: 1 },
  "Ratcatchers": { qp: 2 },
  "Recipe for Disaster": { qp: 6 },
  "Recruitment Drive": { qp: 1 },
  "Regicide": { qp: 3 },
  "Roving Elves": { qp: 1 },
  "Royal Trouble": { qp: 1 },
  "Rum Deal": { qp: 2 },
  "Scorpion Catcher": { qp: 1 },
  "Sea Slug": { qp: 1 },
  "Secrets of the North": { qp: 2 },
  "Shades of Mort'ton": { qp: 3 },
  "Shadow of the Storm": { qp: 1 },
  "Sheep Herder": { qp: 4 },
  "Shilo Village": { qp: 2 },
  "The Slug Menace": { qp: 1 },
  "Sins of the Father": { qp: 2 },
  "Sleeping Giants": { qp: 1 },
  "Song of the Elves": { qp: 4 },
  "Spirits of the Elid": { qp: 2 },
  "Swan Song": { qp: 2 },
  "Tai Bwo Wannai Trio": { qp: 2 },
  "Tale of the Righteous": { qp: 1 },
  "Tears of Guthix": { qp: 1 },
  "Temple of Ikov": { qp: 1 },
  "Temple of the Eye": { qp: 1 },
  "Throne of Miscellania": { qp: 1 },
  "The Tourist Trap": { qp: 2 },
  "Tower of Life": { qp: 2 },
  "Tree Gnome Village": { qp: 2 },
  "Tribal Totem": { qp: 1 },
  "Troll Romance": { qp: 2 },
  "Troll Stronghold": { qp: 1 },
  "Underground Pass": { qp: 5 },
  "Wanted!": { qp: 1 },
  "Watchtower": { qp: 4 },
  "Waterfall Quest": { qp: 1 },
  "What Lies Below": { qp: 1 },
  "Witch's House": { qp: 4 },
  "Zogre Flesh Eaters": { qp: 1 },
  "The Ribbiting Tale of a Lily Pad Labour Dispute": { qp: 1 },
  "Children of the Sun": { qp: 1 },
  "Twilight's Promise": { qp: 1 },
  "The Heart of Darkness": { qp: 2 },
  "Into the Tombs": { qp: 1 },
  "The Path of Glouphrie": { qp: 2 },
  "While Guthix Sleeps": { qp: 5 },
  "Ethically Acquired Antiquities": { qp: 1 },

  // ── RFD Subquests ─────────────────────────────────────────────────
  "Recipe for Disaster/Another Cook's Quest": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing the Mountain Dwarf": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing the Goblin generals": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing Pirate Pete": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing the Lumbridge Guide": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing Evil Dave": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing Skrach Uglogwee": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing Sir Amik Varze": { qp: 1, mini: true },
  "Recipe for Disaster/Freeing King Awowogei": { qp: 1, mini: true },
  "Recipe for Disaster/Defeating the Culinaromancer": { qp: 1, mini: true },

  // ── Miniquests ────────────────────────────────────────────────────
  "Alfred Grimhand's Barcrawl": { qp: 0, mini: true },
  "Architectural Alliance": { qp: 0, mini: true },
  "Bear Your Soul": { qp: 0, mini: true },
  "The Enchanted Key": { qp: 0, mini: true },
  "Enter the Abyss": { qp: 1, mini: true },
  "Family Pest": { qp: 0, mini: true },
  "The General's Shadow": { qp: 0, mini: true },
  "In Search of Knowledge": { qp: 0, mini: true },
  "Lair of Tarn Razorlor": { qp: 0, mini: true },
  "The Mage Arena": { qp: 0, mini: true },
  "The Mage Arena II": { qp: 0, mini: true },
  "Skippy and the Mogres": { qp: 0, mini: true },
  "Curse of the Empty Lord": { qp: 0, mini: true },
  "Daddy's Home": { qp: 0, mini: true },
  "The Frozen Door": { qp: 0, mini: true },
  "His Faithful Servants": { qp: 0, mini: true },
  "Hopespear's Will": { qp: 0, mini: true },
};

/**
 * Look up the quest point value for a quest by name.
 * Returns { qp, mini } or null if not found in the mapping.
 */
export function getQuestInfo(questName: string): QuestInfo | null {
  return QUEST_POINTS[questName] ?? null;
}

/**
 * Look up just the QP value. Returns the mapped value, or the
 * fallback from the data (which is usually 0).
 */
export function getQuestPoints(questName: string, dataQp: number): number {
  const info = QUEST_POINTS[questName];
  return info ? info.qp : dataQp;
}

/**
 * Check if a quest is a miniquest/subquest.
 */
export function isMiniquest(questName: string): boolean {
  return QUEST_POINTS[questName]?.mini === true;
}
