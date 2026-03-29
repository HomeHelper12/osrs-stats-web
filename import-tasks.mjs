#!/usr/bin/env node
/**
 * import-tasks.mjs
 *
 * Imports the 960 tasks from data/task-list.json into the task_definitions table.
 * Uses Supabase service role key for direct DB access.
 *
 * Usage: node import-tasks.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
const envPath = join(__dirname, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Load task-list.json
const taskListPath = join(__dirname, 'data', 'task-list.json');
const taskList = JSON.parse(readFileSync(taskListPath, 'utf-8'));

const tiers = ['easy', 'medium', 'hard', 'elite', 'master'];

// Flatten all tasks with tier info
const rows = [];
for (const tier of tiers) {
  const tasks = taskList[tier];
  if (!tasks) {
    console.warn(`No tasks found for tier: ${tier}`);
    continue;
  }

  for (const task of tasks) {
    const v = task.verification || {};

    rows.push({
      id: task.id,
      tier,
      name: task.name,
      tip: task.tip || null,
      wiki_link: task.wikiLink || null,
      image_link: task.imageLink || null,
      display_item_id: task.displayItemId || null,
      verification_method: v.method || null,
      item_ids: v.itemIds || [],
      required_count: v.count || 1,
      diary_region: v.region || null,
      diary_difficulty: v.difficulty || null,
      skill_experience: v.experience || null,
      tags: task.tags || [],
    });
  }
}

console.log(`Prepared ${rows.length} tasks across ${tiers.length} tiers:`);
for (const tier of tiers) {
  console.log(`  ${tier}: ${rows.filter(r => r.tier === tier).length} tasks`);
}

// Upsert in batches of 100
const BATCH_SIZE = 100;
let inserted = 0;
let errors = 0;

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);

  const { error } = await supabase
    .from('task_definitions')
    .upsert(batch, { onConflict: 'id' });

  if (error) {
    console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    errors++;
  } else {
    inserted += batch.length;
    process.stdout.write(`\rImported ${inserted}/${rows.length} tasks...`);
  }
}

console.log(`\n\nDone! ${inserted} tasks imported, ${errors} batch errors.`);
