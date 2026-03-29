import { createAdminClient } from '@/lib/supabase'
import { validateApiKey, verifyTaskCompletionInMemory, loadPlayerItemIds, type TaskDefinition } from '@/lib/task-utils'

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

    // 1. Upsert all items into player_clog_items (batch to avoid payload limits)
    const BATCH_SIZE = 100
    const upsertRows = items.map((item) => ({
      player_name: lowerPlayer,
      item_id: item.itemId,
      item_name: item.itemName,
      quantity: item.quantity,
      synced_at: new Date().toISOString(),
    }))

    for (let i = 0; i < upsertRows.length; i += BATCH_SIZE) {
      const batch = upsertRows.slice(i, i + BATCH_SIZE)
      const { error: upsertError } = await supabase
        .from('player_clog_items')
        .upsert(batch, { onConflict: 'player_name,item_id' })

      if (upsertError) {
        console.error('Clog upsert error (batch', Math.floor(i / BATCH_SIZE) + 1, '):', upsertError)
        return Response.json({ error: 'Internal error upserting collection log items' }, { status: 500 })
      }
    }

    // 2. Load all player's obtained item IDs (single query for in-memory verification)
    const obtainedIds = await loadPlayerItemIds(supabase, lowerPlayer)

    const tasksAutoCompleted: { taskId: string; taskName: string; tier: string }[] = []

    // 3. Auto-verify active tasks for this player
    const { data: activeTasks } = await supabase
      .from('player_tasks')
      .select('*, task_definitions(*)')
      .eq('player_name', lowerPlayer)
      .eq('status', 'active')

    for (const playerTask of activeTasks ?? []) {
      const taskDef = playerTask.task_definitions as TaskDefinition
      if (!verifyTaskCompletionInMemory(obtainedIds, taskDef)) continue

      const { error: completeError } = await supabase
        .from('player_tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', playerTask.id)

      if (!completeError) {
        tasksAutoCompleted.push({ taskId: taskDef.id, taskName: taskDef.name, tier: taskDef.tier })
      }
    }

    // 4. Scan ALL collection-log tasks for pre-existing completions
    const { data: allClogTasks } = await supabase
      .from('task_definitions')
      .select('*')
      .eq('verification_method', 'collection-log')

    if (allClogTasks) {
      const { data: existingRecords } = await supabase
        .from('player_tasks')
        .select('task_id')
        .eq('player_name', lowerPlayer)

      const existingTaskIds = new Set((existingRecords ?? []).map((r) => r.task_id))

      // Batch insert completed tasks
      const toInsert: { player_name: string; task_id: string; tier: string; status: string; assigned_at: string; completed_at: string }[] = []

      for (const taskDef of allClogTasks) {
        if (existingTaskIds.has(taskDef.id)) continue
        if (!verifyTaskCompletionInMemory(obtainedIds, taskDef as TaskDefinition)) continue

        const now = new Date().toISOString()
        toInsert.push({
          player_name: lowerPlayer,
          task_id: taskDef.id,
          tier: taskDef.tier,
          status: 'completed',
          assigned_at: now,
          completed_at: now,
        })
        tasksAutoCompleted.push({ taskId: taskDef.id, taskName: taskDef.name, tier: taskDef.tier })
      }

      // Batch insert in chunks
      for (let i = 0; i < toInsert.length; i += 100) {
        await supabase.from('player_tasks').insert(toInsert.slice(i, i + 100))
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
