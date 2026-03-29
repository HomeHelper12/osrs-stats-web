#!/usr/bin/env node
/**
 * setup-db.mjs
 *
 * Attempts to create the database tables for osrs-stats-web via Supabase CLI.
 * Falls back to printing the SQL for manual execution.
 *
 * Usage:
 *   node setup-db.mjs                          # tries CLI, then prints SQL
 *   node setup-db.mjs --db-url "postgres://..." # direct connection string
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlPath = join(__dirname, 'setup-db.sql');
const sql = readFileSync(sqlPath, 'utf-8');

console.log('OSRS Stats Web - Database Setup\n');

// Check for --db-url argument
const dbUrlIdx = process.argv.indexOf('--db-url');
const dbUrl = dbUrlIdx !== -1 ? process.argv[dbUrlIdx + 1] : null;

if (dbUrl) {
  try {
    console.log('Running SQL via Supabase CLI with --db-url...\n');
    const result = execSync(
      `npx supabase db query --db-url "${dbUrl}" -f "${sqlPath}"`,
      { cwd: __dirname, encoding: 'utf-8', timeout: 30000 }
    );
    console.log('SUCCESS! Tables created:\n');
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error('Failed to execute SQL via --db-url:', err.message);
    process.exit(1);
  }
}

// Try --linked approach
try {
  console.log('Attempting SQL via Supabase CLI (--linked)...\n');
  const result = execSync(
    `npx supabase db query --linked -f "${sqlPath}"`,
    { cwd: __dirname, encoding: 'utf-8', timeout: 30000 }
  );
  console.log('SUCCESS! Tables created:\n');
  console.log(result);
  process.exit(0);
} catch {
  console.log('Supabase CLI not linked. Falling back to manual instructions.\n');
}

// Fallback: print instructions
console.log('='.repeat(70));
console.log('MANUAL SETUP REQUIRED');
console.log('='.repeat(70));
console.log('');
console.log('Copy and paste the SQL below into the Supabase SQL Editor:');
console.log('https://supabase.com/dashboard/project/ivelrglvvkfohlvzagum/sql/new');
console.log('');
console.log('Or link your project and re-run:');
console.log('  npx supabase login');
console.log('  npx supabase link --project-ref ivelrglvvkfohlvzagum');
console.log('  node setup-db.mjs');
console.log('');
console.log('Or provide a direct database URL:');
console.log('  node setup-db.mjs --db-url "postgresql://postgres:[PASSWORD]@db.ivelrglvvkfohlvzagum.supabase.co:5432/postgres"');
console.log('');
console.log('-'.repeat(70));
console.log(sql);
console.log('-'.repeat(70));
