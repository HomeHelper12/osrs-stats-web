import { createAdminClient } from '@/lib/supabase'
import type { AccountSnapshot } from '@/lib/types'

// Simple in-memory rate limiter: username -> last upload timestamp
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MS = 30_000 // 30 seconds

const USERNAME_REGEX = /^[a-zA-Z0-9 _-]{1,12}$/

export async function POST(request: Request) {
  try {
    // 1. Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
      return Response.json(
        { error: 'Unauthorized: invalid or missing API key' },
        { status: 401 }
      )
    }

    // 2. Parse body
    let snapshot: AccountSnapshot
    try {
      snapshot = await request.json()
    } catch {
      return Response.json(
        { error: 'Bad request: invalid JSON body' },
        { status: 400 }
      )
    }

    // 3. Validate username
    const username = snapshot?.meta?.username
    if (!username || !USERNAME_REGEX.test(username)) {
      return Response.json(
        { error: 'Bad request: username is missing or invalid (must match /^[a-zA-Z0-9 _-]{1,12}$/)' },
        { status: 400 }
      )
    }

    // 4. Rate limit check (per username, 30 second cooldown)
    const lowerUsername = username.toLowerCase()
    const now = Date.now()
    const lastUpload = rateLimitMap.get(lowerUsername)
    if (lastUpload && now - lastUpload < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastUpload)) / 1000)
      return Response.json(
        { error: `Rate limited: please wait ${waitSeconds} seconds before uploading again for "${username}"` },
        { status: 429 }
      )
    }

    const supabase = createAdminClient()

    // 5. Upsert account
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .upsert(
        {
          username: lowerUsername,
          display_name: snapshot.meta.displayName || username,
          account_type: snapshot.meta.accountType || null,
          last_updated: new Date().toISOString(),
        },
        { onConflict: 'username' }
      )
      .select('id')
      .single()

    if (accountError || !account) {
      console.error('Account upsert error:', accountError)
      return Response.json(
        { error: 'Internal error: failed to upsert account' },
        { status: 500 }
      )
    }

    // 6. Insert snapshot
    const { error: snapshotError } = await supabase
      .from('snapshots')
      .insert({
        account_id: account.id,
        data: snapshot,
        uploaded_at: new Date().toISOString(),
      })

    if (snapshotError) {
      console.error('Snapshot insert error:', snapshotError)
      return Response.json(
        { error: 'Internal error: failed to insert snapshot' },
        { status: 500 }
      )
    }

    // 7. Update rate limit map
    rateLimitMap.set(lowerUsername, now)

    // Clean up old entries periodically (keep map from growing unbounded)
    if (rateLimitMap.size > 10_000) {
      for (const [key, timestamp] of rateLimitMap) {
        if (now - timestamp > RATE_LIMIT_MS) {
          rateLimitMap.delete(key)
        }
      }
    }

    return Response.json({
      success: true,
      message: `Snapshot uploaded successfully for "${username}"`,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
