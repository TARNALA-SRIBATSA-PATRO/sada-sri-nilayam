import { neon } from '@neondatabase/serverless';
import { writeFileSync } from 'fs';

const log = (msg) => {
  console.log(msg);
  writeFileSync('db_test_result.txt', (readOrDefault() + '\n' + msg), 'utf8');
};

function readOrDefault() {
  try { return (await import('fs')).readFileSync('db_test_result.txt','utf8'); } catch { return ''; }
}

const DB = "postgresql://neondb_owner:npg_8Rt5gjsKrYzJ@ep-aged-credit-antv5fq0-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

writeFileSync('db_test_result.txt', 'Starting DB test...\n', 'utf8');

try {
  const sql = neon(DB);

  writeFileSync('db_test_result.txt', 'neon() created, running query...\n', 'utf8');

  const result = await sql`SELECT 1 AS ok`;
  writeFileSync('db_test_result.txt', 'SUCCESS: ' + JSON.stringify(result) + '\n', 'utf8');

  // Drop and recreate tables
  writeFileSync('db_test_result.txt', 'Dropping tables...\n', 'utf8');
  await sql`DROP TABLE IF EXISTS invitations CASCADE`;
  await sql`DROP TABLE IF EXISTS admins CASCADE`;
  await sql`DROP TABLE IF EXISTS config CASCADE`;

  writeFileSync('db_test_result.txt', 'Creating tables...\n', 'utf8');
  await sql`CREATE TABLE invitations (
    id TEXT PRIMARY KEY,
    person_name TEXT NOT NULL DEFAULT '',
    nickname TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    sent_by TEXT NOT NULL DEFAULT '',
    with_family BOOLEAN NOT NULL DEFAULT FALSE,
    custom_message TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    last_opened_at TEXT,
    visit_count INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
  )`;
  await sql`CREATE TABLE admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    last_accessed_at TEXT
  )`;
  await sql`CREATE TABLE config (
    key_name TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`;
  await sql`INSERT INTO config (key_name, value) VALUES ('event_date', '2026-04-20T03:00:00.000Z')`;

  writeFileSync('db_test_result.txt', 'DONE: All tables created and seeded!\n', 'utf8');
} catch (err) {
  writeFileSync('db_test_result.txt', 'ERROR: ' + err.message + '\nStack: ' + err.stack + '\n', 'utf8');
}
