import { createAdminClient } from '@/lib/supabase'

const TIERS = ['easy', 'medium', 'hard', 'elite', 'master'] as const

/**
 * GET /api/tasks/[player]
 * Get all task state for a player. Public endpoint (no API key required).
 * Returns active tasks, tier progress, recent completions, and settings.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ player: string }> }
) {
  try {
    const { player } = await params
    const lowerPlayer = player.toLowerCase()
    const supabase = createAdminClient()

    // Fetch all data in parallel
    const [
      activeTasksResult,
      allPlayerTasksResult,
      recentCompletedResult,
      settingsResult,
      tierTotalsResult,
    ] = await Promise.all([
      // Active tasks with full definitions
      supabase
        .from('player_tasks')
        .select('*, task_definitions(*)')
        .eq('player_name', lowerPlayer)
        .eq('status', 'active')
        .order('assigned_at', { ascending: false }),

      // All player tasks (for tier progress counts)
      supabase
        .from('player_tasks')
        .select('tier, status')
        .eq('player_name', lowerPlayer)
        .in('status', ['completed']),

      // Last 10 completed tasks with definitions
      supabase
        .from('player_tasks')
        .select('*, task_definitions(*)')
        .eq('player_name', lowerPlayer)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10),

      // Player settings
      supabase
        .from('player_task_settings')
        .select('*')
        .eq('player_name', lowerPlayer)
        .maybeSingle(),

      // Total task counts per tier
      supabase
        .from('task_definitions')
        .select('tier'),
    ])

    if (activeTasksResult.error) {
      console.error('Error fetching active tasks:', activeTasksResult.error)
      return Response.json({ error: 'Internal error fetching active tasks' }, { status: 500 })
    }

    // Build tier totals map
    const tierTotalMap: Record<string, number> = {}
    for (const tier of TIERS) {
      tierTotalMap[tier] = 0
    }
    if (tierTotalsResult.data) {
      for (const row of tierTotalsResult.data) {
        tierTotalMap[row.tier] = (tierTotalMap[row.tier] || 0) + 1
      }
    }

    // Build tier completed map
    const tierCompletedMap: Record<string, number> = {}
    for (const tier of TIERS) {
      tierCompletedMap[tier] = 0
    }
    if (allPlayerTasksResult.data) {
      for (const row of allPlayerTasksResult.data) {
        tierCompletedMap[row.tier] = (tierCompletedMap[row.tier] || 0) + 1
      }
    }

    // Build tier progress
    const tierProgress: Record<string, { completed: number; total: number }> = {}
    for (const tier of TIERS) {
      tierProgress[tier] = {
        completed: tierCompletedMap[tier] || 0,
        total: tierTotalMap[tier] || 0,
      }
    }

    // Format active tasks
    const activeTasks = (activeTasksResult.data ?? []).map((row) => ({
      id: row.id,
      player_name: row.player_name,
      task_id: row.task_id,
      tier: row.tier,
      status: row.status,
      assigned_at: row.assigned_at,
      completed_at: row.completed_at,
      task: row.task_definitions,
    }))

    // Format recent completed
    const recentCompleted = (recentCompletedResult.data ?? []).map((row) => ({
      id: row.id,
      player_name: row.player_name,
      task_id: row.task_id,
      tier: row.tier,
      status: row.status,
      assigned_at: row.assigned_at,
      completed_at: row.completed_at,
      task: row.task_definitions,
    }))

    // Settings
    const settings = settingsResult.data ?? {
      player_name: lowerPlayer,
      auto_generate: false,
      active_tier: 'easy',
    }

    return Response.json({
      playerName: lowerPlayer,
      activeTasks,
      tierProgress,
      recentCompleted,
      settings,
    })
  } catch (err) {
    console.error('Player tasks lookup error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
