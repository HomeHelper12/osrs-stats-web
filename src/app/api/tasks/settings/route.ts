import { createAdminClient } from '@/lib/supabase'
import { validateApiKey } from '@/lib/task-utils'

const VALID_TIERS = ['easy', 'medium', 'hard', 'elite', 'master']

/**
 * GET /api/tasks/settings?player=Name
 * Get player task settings. Public endpoint.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const player = searchParams.get('player')

    if (!player) {
      return Response.json({ error: 'Bad request: player query parameter is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const lowerPlayer = player.toLowerCase()

    const { data: settings, error } = await supabase
      .from('player_task_settings')
      .select('*')
      .eq('player_name', lowerPlayer)
      .maybeSingle()

    if (error) {
      console.error('Error fetching settings:', error)
      return Response.json({ error: 'Internal error fetching settings' }, { status: 500 })
    }

    // Return defaults if no settings exist yet
    return Response.json({
      settings: settings ?? {
        player_name: lowerPlayer,
        auto_generate: false,
        active_tier: 'easy',
        updated_at: null,
      },
    })
  } catch (err) {
    console.error('Settings GET error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/tasks/settings
 * Update player task settings. Requires API key.
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    const authError = validateApiKey(request)
    if (authError) return authError

    // Parse body
    let body: {
      playerName?: string
      autoGenerate?: boolean
      activeTier?: string
    }
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Bad request: invalid JSON body' }, { status: 400 })
    }

    const { playerName, autoGenerate, activeTier } = body

    if (!playerName || typeof playerName !== 'string') {
      return Response.json({ error: 'Bad request: playerName is required' }, { status: 400 })
    }

    if (autoGenerate !== undefined && typeof autoGenerate !== 'boolean') {
      return Response.json({ error: 'Bad request: autoGenerate must be a boolean' }, { status: 400 })
    }

    if (activeTier !== undefined && !VALID_TIERS.includes(activeTier)) {
      return Response.json(
        { error: `Bad request: activeTier must be one of: ${VALID_TIERS.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const lowerPlayer = playerName.toLowerCase()

    // Build the upsert payload with only provided fields
    const upsertData: Record<string, unknown> = {
      player_name: lowerPlayer,
      updated_at: new Date().toISOString(),
    }

    if (autoGenerate !== undefined) {
      upsertData.auto_generate = autoGenerate
    }

    if (activeTier !== undefined) {
      upsertData.active_tier = activeTier
    }

    const { data: settings, error: upsertError } = await supabase
      .from('player_task_settings')
      .upsert(upsertData, { onConflict: 'player_name' })
      .select('*')
      .single()

    if (upsertError) {
      console.error('Settings upsert error:', upsertError)
      return Response.json({ error: 'Internal error updating settings' }, { status: 500 })
    }

    return Response.json({
      updated: true,
      settings,
    })
  } catch (err) {
    console.error('Settings POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
