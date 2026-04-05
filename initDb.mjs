import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_8Rt5gjsKrYzJ@ep-aged-credit-antv5fq0-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      person_name TEXT NOT NULL,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL,
      sent_by TEXT NOT NULL,
      with_family BOOLEAN NOT NULL DEFAULT false,
      custom_message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE,
      last_opened_at TIMESTAMP WITH TIME ZONE,
      visit_count INTEGER NOT NULL DEFAULT 0
    );
  `;
  try {
    await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;`;
  } catch (e) {
    console.log("Column already exists or error: ", e.message);
  }
  try {
    await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS deleted_by TEXT NOT NULL DEFAULT '';`;
  } catch (e) {
    console.log("deleted_by column already exists or error: ", e.message);
  }
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE,
      last_accessed_at TIMESTAMP WITH TIME ZONE
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS config (
      key_name TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;
  console.log("Database initialized");
}

main().catch(console.error);
