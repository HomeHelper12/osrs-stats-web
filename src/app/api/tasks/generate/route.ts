import { createAdminClient } from '@/lib/supabase'
import { generateRandomTask, validateApiKey } from '@/lib/task-utils'

const VALID_TIERS = ['easy', 'medium', 'hard', 'elite', 'master']

/**
 * POST /api/tasks/generate
 * Generate a random task for a player in a given tier.
 * If the player already has an active task for that tier, returns it instead.
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    const authError = validateApiKey(request)
    if (authError) return authError

    // Parse body
    let body: { playerName?: string; tier?: string }
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Bad request: invalid JSON body' }, { status: 400 })
    }

    const { playerName, tier } = body

    if (!playerName || typeof playerName !== 'string') {
      return Response.json({ error: 'Bad request: playerName is required' }, { status: 400 })
    }

    if (!tier || !VALID_TIERS.includes(tier)) {
      return Response.json(
        { error: `Bad request: tier must be one of: ${VALID_TIERS.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const lowerPlayer = playerName.toLowerCase()

    // Check if player already has an active task for this tier
    const { data: existingTask, error: existingError } = await supabase
      .from('player_tasks')
      .select('*, task_definitions(*)')
      .eq('player_name', lowerPlayer)
      .eq('tier', tier)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (existingError) {
      console.error('Error checking existing tasks:', existingError)
      return Response.json({ error: 'Internal error checking existing tasks' }, { status: 500 })
    }

    if (existingTask) {
      return Response.json({
        status: 'existing',
        task: existingTask.task_definitions,
        assignment: {
          id: existingTask.id,
          player_name: existingTask.player_name,
          task_id: existingTask.task_id,
          tier: existingTask.tier,
          status: existingTask.status,
          assigned_at: existingTask.assigned_at,
          completed_at: existingTask.completed_at,
        },
      })
    }

    // Generate a new random task
    const result = await generateRandomTask(supabase, playerName, tier)

    if (result.status === 'tier_complete') {
      return Response.json({ status: 'tier_complete', tier })
    }

    if (result.status === 'error') {
      return Response.json({ error: result.message }, { status: 500 })
    }

    return Response.json({
      status: 'assigned',
      task: result.task,
      assignment: result.assignment,
    })
  } catch (err) {
    console.error('Task generate error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
