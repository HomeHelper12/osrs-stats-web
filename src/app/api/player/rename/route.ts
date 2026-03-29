import { createAdminClient } from '@/lib/supabase'
import { validateApiKey } from '@/lib/task-utils'
import { renamePlayer } from '@/lib/player-utils'

/**
 * POST /api/player/rename
 * Renames a player across all tables and records the old name in history.
 * Body: { oldName: string, newName: string }
 */
export async function POST(request: Request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  let body: { oldName?: string; newName?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { oldName, newName } = body
  if (!oldName || !newName) {
    return Response.json({ error: 'oldName and newName are required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const result = await renamePlayer(supabase, oldName, newName)

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({
    success: true,
    message: `Player renamed from "${oldName}" to "${newName}"`,
    oldName,
    newName,
  })
}

/**
 * GET /api/player/rename?name=PlayerName
 * Returns the player's name history.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name) {
    return Response.json({ error: 'name parameter required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const lower = name.toLowerCase()

  // Check current name
  let { data: account } = await supabase
    .from('accounts')
    .select('id, username, display_name, previous_names')
    .eq('username', lower)
    .single()

  // If not found by current name, check previous names
  if (!account) {
    const { data: found } = await supabase
      .from('accounts')
      .select('id, username, display_name, previous_names')
      .contains('previous_names', [lower])
      .single()

    account = found
  }

  if (!account) {
    return Response.json({ error: 'Player not found' }, { status: 404 })
  }

  return Response.json({
    currentName: account.display_name,
    previousNames: account.previous_names || [],
  })
}
