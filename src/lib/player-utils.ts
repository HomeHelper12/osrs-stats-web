import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Resolve a player name to an account_id. If the account doesn't exist, creates it.
 * Returns the account UUID.
 */
export async function resolveAccountId(
  supabase: SupabaseClient,
  playerName: string
): Promise<string | null> {
  const lower = playerName.toLowerCase()

  // Try to find existing account
  const { data: existing } = await supabase
    .from('accounts')
    .select('id')
    .eq('username', lower)
    .single()

  if (existing) return existing.id

  // Create a new account
  const { data: created, error } = await supabase
    .from('accounts')
    .insert({
      username: lower,
      display_name: playerName,
      last_updated: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error || !created) return null
  return created.id
}

/**
 * Rename a player: updates username across all tables and records the old name.
 * Returns true on success.
 */
export async function renamePlayer(
  supabase: SupabaseClient,
  oldName: string,
  newName: string
): Promise<{ success: boolean; error?: string }> {
  const oldLower = oldName.toLowerCase()
  const newLower = newName.toLowerCase()

  if (oldLower === newLower) {
    return { success: true } // Same name, nothing to do
  }

  // Find the account by old name
  const { data: account, error: findError } = await supabase
    .from('accounts')
    .select('id, previous_names')
    .eq('username', oldLower)
    .single()

  if (findError || !account) {
    return { success: false, error: 'Account not found for old name: ' + oldName }
  }

  // Check if new name is already taken by a DIFFERENT account
  const { data: conflict } = await supabase
    .from('accounts')
    .select('id')
    .eq('username', newLower)
    .single()

  if (conflict && conflict.id !== account.id) {
    return { success: false, error: 'New name is already taken by another account' }
  }

  // Add old name to previous_names history
  const prevNames: string[] = account.previous_names || []
  if (!prevNames.includes(oldLower)) {
    prevNames.push(oldLower)
  }

  // Update the accounts table
  const { error: updateError } = await supabase
    .from('accounts')
    .update({
      username: newLower,
      display_name: newName,
      previous_names: prevNames,
      last_updated: new Date().toISOString(),
    })
    .eq('id', account.id)

  if (updateError) {
    return { success: false, error: 'Failed to update account: ' + updateError.message }
  }

  // Update player_name in all task system tables
  await supabase
    .from('player_tasks')
    .update({ player_name: newLower })
    .eq('player_name', oldLower)

  await supabase
    .from('player_clog_items')
    .update({ player_name: newLower })
    .eq('player_name', oldLower)

  await supabase
    .from('player_task_settings')
    .update({ player_name: newLower })
    .eq('player_name', oldLower)

  return { success: true }
}
