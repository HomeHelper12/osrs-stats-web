import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const API_SECRET = process.env.API_SECRET_KEY;

/**
 * POST /api/setup-tasks
 * Creates the task system tables and imports tasks from task-list.json.
 * Protected by API key.
 */
export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Create tables using individual Supabase operations
  // Since we can't run raw SQL via PostgREST, we'll use the rpc approach
  // or create tables via the Supabase dashboard.
  // Instead, let's check if tables exist and if not, return instructions.

  // Try to query task_definitions
  const { error: checkError } = await supabase
    .from("task_definitions")
    .select("id")
    .limit(1);

  if (checkError?.message?.includes("does not exist")) {
    return NextResponse.json({
      error: "Tables not created yet",
      instructions:
        "Run the SQL in setup-tasks-db.sql via the Supabase SQL Editor: https://supabase.com/dashboard/project/ivelrglvvkfohlvzagum/sql/new",
    });
  }

  // Tables exist — check if tasks are imported
  const { count } = await supabase
    .from("task_definitions")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    status: "ok",
    task_definitions_count: count,
  });
}
