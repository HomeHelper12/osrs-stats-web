import { createAdminClient } from '@/lib/supabase'
import { validateApiKey, verifyTaskCompletion, type TaskDefinition } from '@/lib/task-utils'

const TIERS = ['easy', 'medium', 'hard', 'elite', 'master'] as const

interface SyncItem {
  itemId: number
  itemName: string
  quantity: number
}

/**
 * POST /api/clog/sync
 * Bulk sync obtained collection log items, then auto-verify ALL tasks.
 * For active tasks whose requirements are now met, marks them completed.
 * For non-active tasks that have never been completed, inserts them as completed
 * (handles pre-existing drops).
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    const authError = validateApiKey(request)
    if (authError) return authError

    // Parse body
    let body: { playerName?: string; items?: SyncItem[] }
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Bad request: invalid JSON body' }, { status: 400 })
    }

    const { playerName, items } = body

    if (!playerName || typeof playerName !== 'string') {
      return Response.json({ error: 'Bad request: playerName is required' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Bad request: items array is required and must not be empty' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const lowerPlayer = playerName.toLowerCase()

    // 1. Upsert all items into player_clog_items
    const upsertRows = items.map((item) => ({
      player_name: lowerPlayer,
      item_id: item.itemId,
      item_name: item.itemName,
      quantity: item.quantity,
      synced_at: new Date().toISOString(),
    }))

    const { error: upsertError } = await supabase
      .from('player_clog_items')
      .upsert(upsertRows, { onConflict: 'player_name,item_id' })

    if (upsertError) {
      console.error('Clog upsert error:', upsertError)
      return Response.json({ error: 'Internal error upserting collection log items' }, { status: 500 })
    }

    // 2. Auto-verify active tasks for this player
    const { data: activeTasks, error: activeError } = await supabase
      .from('player_tasks')
      .select('*, task_definitions(*)')
      .eq('player_name', lowerPlayer)
      .eq('status', 'active')

    if (activeError) {
      console.error('Error fetching active tasks:', activeError)
      return Response.json({ error: 'Internal error fetching active tasks' }, { status: 500 })
    }

    const tasksAutoCompleted: { taskId: string; taskName: string; tier: string }[] = []

    // Check each active task with collection-log verification
    for (const playerTask of activeTasks ?? []) {
      const taskDef = playerTask.task_definitions as TaskDefinition
      if (taskDef.verification_method !== 'collection-log') continue

      const isComplete = await verifyTaskCompletion(supabase, lowerPlayer, taskDef)
      if (isComplete) {
        const { error: completeError } = await supabase
          .from('player_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', playerTask.id)

        if (!completeError) {
          tasksAutoCompleted.push({
            taskId: taskDef.id,
            taskName: taskDef.name,
            tier: taskDef.tier,
          })
        }
      }
    }

    // 3. Scan ALL collection-log tasks to find any that are already completable
    //    but the player has never had a record for (handles pre-existing drops)
    const { data: allClogTasks, error: allTasksError } = await supabase
      .from('task_definitions')
      .select('*')
      .eq('verification_method', 'collection-log')

    if (allTasksError) {
      console.error('Error fetching all clog tasks:', allTasksError)
      // Non-fatal: we already synced items and checked active tasks
    }

    if (allClogTasks) {
      // Get all task_ids this player already has a record for (any status)
      const { data: existingRecords } = await supabase
        .from('player_tasks')
        .select('task_id')
        .eq('player_name', lowerPlayer)

      const existingTaskIds = new Set((existingRecords ?? []).map((r) => r.task_id))

      // Check tasks the player has no record for
      for (const taskDef of allClogTasks) {
        if (existingTaskIds.has(taskDef.id)) continue

        const isComplete = await verifyTaskCompletion(
          supabase,
          lowerPlayer,
          taskDef as TaskDefinition
        )
        if (isComplete) {
          const { error: insertError } = await supabase
            .from('player_tasks')
            .insert({
              player_name: lowerPlayer,
              task_id: taskDef.id,
              tier: taskDef.tier,
              status: 'completed',
              assigned_at: new Date().toISOString(),
              completed_at: new Date().toISOString(),
            })

          if (!insertError) {
            tasksAutoCompleted.push({
              taskId: taskDef.id,
              taskName: taskDef.name,
              tier: taskDef.tier,
            })
          }
        }
      }
    }

    // 4. Build total completed counts per tier
    const { data: completedCounts } = await supabase
      .from('player_tasks')
      .select('tier')
      .eq('player_name', lowerPlayer)
      .eq('status', 'completed')

    const totalCompleted: Record<string, number> = {}
    for (const tier of TIERS) {
      totalCompleted[tier] = 0
    }
    for (const row of completedCounts ?? []) {
      totalCompleted[row.tier] = (totalCompleted[row.tier] || 0) + 1
    }

    return Response.json({
      itemsSynced: items.length,
      tasksAutoCompleted,
      totalCompleted,
    })
  } catch (err) {
    console.error('Clog sync error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
