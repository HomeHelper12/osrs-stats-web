import { createAdminClient } from '@/lib/supabase'
import {
  generateRandomTask,
  validateApiKey,
  verifyTaskCompletion,
  type TaskDefinition,
} from '@/lib/task-utils'

/**
 * POST /api/clog/item
 * Single item obtained (real-time from chat message).
 * Upserts the item, checks only active tasks that include this itemId,
 * and auto-completes + auto-generates if applicable.
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    const authError = validateApiKey(request)
    if (authError) return authError

    // Parse body
    let body: {
      playerName?: string
      itemId?: number
      itemName?: string
      quantity?: number
    }
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Bad request: invalid JSON body' }, { status: 400 })
    }

    const { playerName, itemId, itemName, quantity } = body

    if (!playerName || typeof playerName !== 'string') {
      return Response.json({ error: 'Bad request: playerName is required' }, { status: 400 })
    }

    if (itemId === undefined || typeof itemId !== 'number') {
      return Response.json({ error: 'Bad request: itemId is required (number)' }, { status: 400 })
    }

    if (!itemName || typeof itemName !== 'string') {
      return Response.json({ error: 'Bad request: itemName is required' }, { status: 400 })
    }

    if (quantity === undefined || typeof quantity !== 'number') {
      return Response.json({ error: 'Bad request: quantity is required (number)' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const lowerPlayer = playerName.toLowerCase()

    // 1. Upsert the item
    const { error: upsertError } = await supabase
      .from('player_clog_items')
      .upsert(
        {
          player_name: lowerPlayer,
          item_id: itemId,
          item_name: itemName,
          quantity,
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'player_name,item_id' }
      )

    if (upsertError) {
      console.error('Item upsert error:', upsertError)
      return Response.json({ error: 'Internal error upserting item' }, { status: 500 })
    }

    // 2. Check only active tasks that include this itemId
    //    We use the contains operator to check if item_ids array contains the itemId
    const { data: activeTasks, error: activeError } = await supabase
      .from('player_tasks')
      .select('*, task_definitions(*)')
      .eq('player_name', lowerPlayer)
      .eq('status', 'active')

    if (activeError) {
      console.error('Error fetching active tasks:', activeError)
      return Response.json({ error: 'Internal error fetching active tasks' }, { status: 500 })
    }

    const tasksCompleted: { taskId: string; taskName: string; tier: string }[] = []
    const completedTiers: string[] = []

    // Filter to tasks that include this itemId and have collection-log verification
    for (const playerTask of activeTasks ?? []) {
      const taskDef = playerTask.task_definitions as TaskDefinition
      if (taskDef.verification_method !== 'collection-log') continue
      if (!taskDef.item_ids || !taskDef.item_ids.includes(itemId)) continue

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
          tasksCompleted.push({
            taskId: taskDef.id,
            taskName: taskDef.name,
            tier: taskDef.tier,
          })
          completedTiers.push(taskDef.tier)
        }
      }
    }

    // 3. If any tasks were completed and auto_generate is on, generate next tasks
    let nextTask = null
    if (tasksCompleted.length > 0) {
      const { data: settings } = await supabase
        .from('player_task_settings')
        .select('auto_generate')
        .eq('player_name', lowerPlayer)
        .maybeSingle()

      if (settings?.auto_generate) {
        // Generate for the first completed tier (most common case: one task at a time)
        const tier = completedTiers[0]
        const result = await generateRandomTask(supabase, playerName, tier)
        if (result.status === 'assigned') {
          nextTask = {
            task: result.task,
            assignment: result.assignment,
          }
        } else if (result.status === 'tier_complete') {
          nextTask = { status: 'tier_complete', tier }
        }
      }
    }

    return Response.json({
      stored: true,
      itemId,
      itemName,
      tasksCompleted,
      nextTask,
    })
  } catch (err) {
    console.error('Clog item error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
