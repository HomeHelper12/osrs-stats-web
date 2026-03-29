import { createAdminClient } from '@/lib/supabase'
import { generateRandomTask, validateApiKey } from '@/lib/task-utils'

/**
 * POST /api/tasks/skip
 * Skip the current active task and generate the next one for the same tier.
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    const authError = validateApiKey(request)
    if (authError) return authError

    // Parse body
    let body: { playerName?: string; taskId?: string }
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Bad request: invalid JSON body' }, { status: 400 })
    }

    const { playerName, taskId } = body

    if (!playerName || typeof playerName !== 'string') {
      return Response.json({ error: 'Bad request: playerName is required' }, { status: 400 })
    }

    if (!taskId || typeof taskId !== 'string') {
      return Response.json({ error: 'Bad request: taskId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const lowerPlayer = playerName.toLowerCase()

    // Find the active task
    const { data: activeTask, error: findError } = await supabase
      .from('player_tasks')
      .select('*')
      .eq('player_name', lowerPlayer)
      .eq('task_id', taskId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (findError) {
      console.error('Error finding active task:', findError)
      return Response.json({ error: 'Internal error finding active task' }, { status: 500 })
    }

    if (!activeTask) {
      return Response.json(
        { error: 'No active task found for this player and taskId' },
        { status: 404 }
      )
    }

    // Update to skipped
    const { error: updateError } = await supabase
      .from('player_tasks')
      .update({
        status: 'skipped',
        completed_at: new Date().toISOString(),
      })
      .eq('id', activeTask.id)

    if (updateError) {
      console.error('Error skipping task:', updateError)
      return Response.json({ error: 'Internal error skipping task' }, { status: 500 })
    }

    // Generate next task for the same tier
    let nextTask = null
    const result = await generateRandomTask(supabase, playerName, activeTask.tier)
    if (result.status === 'assigned') {
      nextTask = {
        task: result.task,
        assignment: result.assignment,
      }
    } else if (result.status === 'tier_complete') {
      nextTask = { status: 'tier_complete', tier: activeTask.tier }
    }

    return Response.json({
      skipped: true,
      taskId,
      tier: activeTask.tier,
      nextTask,
    })
  } catch (err) {
    console.error('Task skip error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
