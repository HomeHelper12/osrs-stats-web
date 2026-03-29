// =============================================================================
// OSRS Stats Web - TypeScript interfaces matching Java data models
// Field names MUST match Java class field names (Gson uses field access)
// =============================================================================

/** Account metadata - matches Java AccountMeta.java */
export interface AccountMeta {
  username: string
  accountType: string | null // NORMAL, IRONMAN, HARDCORE_IRONMAN, ULTIMATE_IRONMAN, GROUP_IRONMAN
  combatLevel: number
  totalLevel: number
  totalXp: number
  questPoints: number
  questsCompleted: number
  questsTotal: number
  lastHiscoresFetch: string | null // Instant -> ISO string
  lastClogSync: string | null
  lastExport: string | null
}

/** Individual skill data - matches Java SkillData.java */
export interface SkillData {
  name: string
  level: number
  boostedLevel: number
  xp: number
  rank: number | null
  xpToNextLevel: number
}

/** Boss kill count data - matches Java BossData.java */
export interface BossData {
  name: string
  killCount: number
  rank: number | null
  personalBest: string | null // "1:23" format from chat
  totalLootValue: number
}

/** Single collection log item - matches Java ClogItem.java */
export interface ClogItem {
  itemId: number
  name: string
  obtained: boolean
  quantity: number
}

/** A page in the collection log - matches Java ClogPage.java */
export interface ClogPage {
  name: string
  obtained: number
  total: number
  items: ClogItem[]
  killCounts: string[] | null
  syncedAt: string | null // Instant -> ISO string
}

/** Quest completion data - matches Java QuestData.java */
export interface QuestData {
  name: string
  status: string // NOT_STARTED, IN_PROGRESS, COMPLETED
  questPoints: number
}

/** Achievement diary data - matches Java DiaryData.java */
export interface DiaryData {
  area: string
  easyComplete: boolean
  mediumComplete: boolean
  hardComplete: boolean
  eliteComplete: boolean
}

/** Combat achievement tier data - matches Java CombatAchievementData.java */
export interface CombatAchievementData {
  tier: string // EASY, MEDIUM, HARD, ELITE, MASTER, GRANDMASTER
  completed: number
  total: number
}

/** Pet ownership data - matches Java PetData.java */
export interface PetData {
  name: string
  itemId: number
  owned: boolean
  source: string | null
  obtainedAt: string | null // Instant -> ISO string
}

/** Loot received entry - matches Java LootEntry.java */
export interface LootEntry {
  source: string
  itemId: number
  itemName: string
  quantity: number
  geValue: number
  timestamp: string | null // Instant -> ISO string
}

/** Death entry - matches Java DeathEntry.java */
export interface DeathEntry {
  location: string | null
  valueLost: number
  timestamp: string | null // Instant -> ISO string
}

/** Account event - matches Java AccountEvent.java */
export interface AccountEvent {
  type: string // LEVEL_UP, NEW_CLOG_ITEM, BOSS_KC, DEATH, LOOT_DROP, etc.
  description: string
  timestamp: string | null // Instant -> ISO string
  extra: Record<string, unknown> | null
}

// =============================================================================
// Full account snapshot — the DTO uploaded by the Java plugin
// Maps are serialized as JSON objects (Record<string, T>)
// =============================================================================

export interface AccountSnapshot {
  meta: AccountMeta
  skills: Record<string, SkillData>
  bosses: Record<string, BossData>
  collectionLog: Record<string, ClogPage>
  quests: Record<string, QuestData>
  diaries: Record<string, DiaryData>
  combatAchievements: Record<string, CombatAchievementData>
  pets: PetData[]
  lootLog: LootEntry[]
  deaths: DeathEntry[]
  events: AccountEvent[]
  clogTotalObtained: number
  clogTotalItems: number
}

// =============================================================================
// Database row types (matching Supabase table schemas)
// =============================================================================

/** Row shape for the accounts table */
export interface AccountRow {
  id: string
  username: string
  display_name: string
  account_type: string | null
  first_seen: string
  last_updated: string
}

/** Row shape for the snapshots table */
export interface SnapshotRow {
  id: string
  account_id: string
  data: AccountSnapshot
  uploaded_at: string
}

// =============================================================================
// API response types
// =============================================================================

export interface UploadResponse {
  success: boolean
  message: string
}

export interface ProfileResponse {
  account: AccountRow
  snapshot: AccountSnapshot
  uploadedAt: string
}

export interface ErrorResponse {
  error: string
}
