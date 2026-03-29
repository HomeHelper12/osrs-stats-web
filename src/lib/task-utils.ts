import { SupabaseClient } from '@supabase/supabase-js'

// =============================================================================
// Shared task system utilities
// =============================================================================

export interface TaskDefinition {
  id: string
  tier: string
  name: string
  tip: string | null
  wiki_link: string | null
  image_link: string | null
  display_item_id: number | null
  verification_method: string | null
  item_ids: number[]
  required_count: number
  diary_region: string | null
  diary_difficulty: string | null
  skill_experience: Record<string, number> | null
  tags: string[]
  created_at: string
}

export interface PlayerTask {
  id: number
  player_name: string
  task_id: string
  tier: string
  status: string
  assigned_at: string
  completed_at: string | null
}

export interface PlayerTaskWithDefinition extends PlayerTask {
  task_definitions: TaskDefinition
}

/**
 * Verify whether a player has completed a task based on their collection log items.
 * Returns true if the player has obtained enough of the task's required items.
 */
export async function verifyTaskCompletion(
  supabase: SupabaseClient,
  playerName: string,
  task: TaskDefinition
): Promise<boolean> {
  if (task.verification_method !== 'collection-log') {
    return false
  }

  if (!task.item_ids || task.item_ids.length === 0) {
    return false
  }

  // Get the player's obtained items that match the task's item_ids
  const { data: obtainedItems, error } = await supabase
    .from('player_clog_items')
    .select('item_id')
    .eq('player_name', playerName)
    .in('item_id', task.item_ids)

  if (error || !obtainedItems) {
    return false
  }

  return obtainedItems.length >= task.required_count
}

/**
 * Generate a random task for a player in a given tier.
 * Returns the task definition and the player_tasks record, or null if the tier is complete.
 */
export async function generateRandomTask(
  supabase: SupabaseClient,
  playerName: string,
  tier: string
): Promise<
  | { status: 'assigned'; task: TaskDefinition; assignment: PlayerTask }
  | { status: 'tier_complete' }
  | { status: 'error'; message: string }
> {
  const lowerPlayer = playerName.toLowerCase()

  // Get all task IDs for this tier
  const { data: allTasks, error: tasksError } = await supabase
    .from('task_definitions')
    .select('id')
    .eq('tier', tier)

  if (tasksError) {
    return { status: 'error', message: `Failed to fetch task definitions: ${tasksError.message}` }
  }

  if (!allTasks || allTasks.length === 0) {
    return { status: 'error', message: `No tasks found for tier: ${tier}` }
  }

  const allTaskIds = allTasks.map((t) => t.id)

  // Get all task IDs this player has already completed or has active
  const { data: playerTasks, error: playerError } = await supabase
    .from('player_tasks')
    .select('task_id')
    .eq('player_name', lowerPlayer)
    .eq('tier', tier)
    .in('status', ['active', 'completed'])

  if (playerError) {
    return { status: 'error', message: `Failed to fetch player tasks: ${playerError.message}` }
  }

  const usedTaskIds = new Set((playerTasks ?? []).map((t) => t.task_id))

  // Pick from remaining pool
  const availableIds = allTaskIds.filter((id) => !usedTaskIds.has(id))

  if (availableIds.length === 0) {
    return { status: 'tier_complete' }
  }

  // Pick a random task
  const randomId = availableIds[Math.floor(Math.random() * availableIds.length)]

  // Fetch the full definition
  const { data: taskDef, error: defError } = await supabase
    .from('task_definitions')
    .select('*')
    .eq('id', randomId)
    .single()

  if (defError || !taskDef) {
    return { status: 'error', message: `Failed to fetch task definition: ${defError?.message}` }
  }

  // Insert into player_tasks
  const { data: assignment, error: insertError } = await supabase
    .from('player_tasks')
    .insert({
      player_name: lowerPlayer,
      task_id: randomId,
      tier,
      status: 'active',
    })
    .select('*')
    .single()

  if (insertError || !assignment) {
    return { status: 'error', message: `Failed to assign task: ${insertError?.message}` }
  }

  return {
    status: 'assigned',
    task: taskDef as TaskDefinition,
    assignment: assignment as PlayerTask,
  }
}

/**
 * Validate the x-api-key header against the configured API_SECRET_KEY.
 * Returns null if valid, or a Response with 401 if invalid.
 */
export function validateApiKey(request: Request): Response | null {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return Response.json(
      { error: 'Unauthorized: invalid or missing API key' },
      { status: 401 }
    )
  }
  return null
}
