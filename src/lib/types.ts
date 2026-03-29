// =============================================================================
// OSRS Stats Web - TypeScript interfaces matching Java data models
// =============================================================================

/** Account metadata - basic info about the player account */
export interface AccountMeta {
  username: string
  displayName: string
  accountType: string | null // NORMAL, IRONMAN, HARDCORE_IRONMAN, ULTIMATE_IRONMAN, GROUP_IRONMAN
  combatLevel: number | null
  totalLevel: number | null
  totalXp: number | null
  questPoints: number | null
  achievementDiaryPoints: number | null
  combatAchievementPoints: number | null
  collectionLogSlotsCompleted: number | null
  collectionLogSlotsTotal: number | null
  lastUpdated: string | null // Instant -> ISO string
}

/** Individual skill data */
export interface SkillData {
  name: string
  level: number
  xp: number
  rank: number | null
  ehp: number | null
}

/** Boss kill count data */
export interface BossData {
  name: string
  killCount: number
  rank: number | null
  personalBest: number | null // time in ticks or seconds
}

/** Single collection log item */
export interface ClogItem {
  id: number
  name: string
  quantity: number
  obtained: boolean
}

/** A page in the collection log (e.g., a boss page) */
export interface ClogPage {
  name: string
  items: ClogItem[]
  killCounts: Record<string, number>
  completedCount: number
  totalCount: number
}

/** Quest completion data */
export interface QuestData {
  name: string
  state: string // NOT_STARTED, IN_PROGRESS, FINISHED
  questPoints: number | null
}

/** Achievement diary data */
export interface DiaryData {
  area: string
  easy: string   // NOT_STARTED, IN_PROGRESS, COMPLETE
  medium: string
  hard: string
  elite: string
}

/** Combat achievement tier data (aggregated per tier) */
export interface CombatAchievementData {
  completed: number
  total: number
}

/** Pet ownership data */
export interface PetData {
  name: string
  itemId: number
  owned: boolean
  source: string | null
  obtainedAt: string | null // Instant -> ISO string
}

/** Loot received entry */
export interface LootEntry {
  source: string
  itemId: number
  itemName: string
  quantity: number
  geValue: number | null
  timestamp: string | null // Instant -> ISO string
}

/** Death entry */
export interface DeathEntry {
  location: string | null
  killer: string | null
  lostItems: LootEntry[]
  valueLost: number | null
  timestamp: string | null // Instant -> ISO string
}

/** Account event (level up, quest completion, etc.) */
export interface AccountEvent {
  type: string
  description: string
  timestamp: string | null // Instant -> ISO string
  data: Record<string, unknown> | null
}

/** Snapshot summary - aggregated stats for quick display */
export interface SnapshotSummaryData {
  combatLevel: number | null
  totalLevel: number | null
  totalXp: number | null
  questPoints: number | null
  questsCompleted: number | null
  questsTotal: number | null
}

// =============================================================================
// Full account snapshot - the DTO exported by the Java plugin
// =============================================================================

/** The full account data export */
export interface AccountSnapshot {
  meta: AccountMeta
  summary: SnapshotSummaryData
  skills: Record<string, SkillData>
  bosses: Record<string, BossData>
  collectionLog: Record<string, ClogPage>
  clogTotalObtained: number | null
  clogTotalItems: number | null
  quests: QuestData[]
  diaries: DiaryData[]
  combatAchievements: Record<string, CombatAchievementData>
  pets: PetData[]
  lootLog: LootEntry[]
  deaths: DeathEntry[]
  events: AccountEvent[]
  exportedAt: string | null // Instant -> ISO string
}

// =============================================================================
// Summary type for listing snapshots without full data
// =============================================================================

/** Summary of a snapshot for listing purposes */
export interface SnapshotSummary {
  id: string
  accountId: string
  username: string
  displayName: string
  accountType: string | null
  totalLevel: number | null
  totalXp: number | null
  combatLevel: number | null
  uploadedAt: string
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
