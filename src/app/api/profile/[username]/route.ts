import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const lowerUsername = username.toLowerCase()

    // 1. Look up account by lowercase username
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('username', lowerUsername)
      .single()

    if (accountError || !account) {
      return Response.json(
        { error: `Account not found: "${username}"` },
        { status: 404 }
      )
    }

    // 2. Get latest snapshot
    const { data: snapshotRow, error: snapshotError } = await supabase
      .from('snapshots')
      .select('*')
      .eq('account_id', account.id)
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single()

    if (snapshotError || !snapshotRow) {
      return Response.json(
        { error: `No snapshots found for "${username}"` },
        { status: 404 }
      )
    }

    return Response.json({
      account,
      snapshot: snapshotRow.data,
      uploadedAt: snapshotRow.uploaded_at,
    })
  } catch (err) {
    console.error('Profile lookup error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
