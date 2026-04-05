import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_8Rt5gjsKrYzJ@ep-aged-credit-antv5fq0-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function resetDb() {
  console.log("🗑️  Dropping all tables...");

  await sql`DROP TABLE IF EXISTS invitations CASCADE`;
  console.log("   ✓ Dropped: invitations");

  await sql`DROP TABLE IF EXISTS admins CASCADE`;
  console.log("   ✓ Dropped: admins");

  await sql`DROP TABLE IF EXISTS config CASCADE`;
  console.log("   ✓ Dropped: config");

  console.log("\n🔨 Recreating tables...");

  await sql`
    CREATE TABLE invitations (
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
    )
  `;
  console.log("   ✓ Created: invitations");

  await sql`
    CREATE TABLE admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      last_accessed_at TEXT
    )
  `;
  console.log("   ✓ Created: admins");

  await sql`
    CREATE TABLE config (
      key_name TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
  console.log("   ✓ Created: config");

  // Seed default event date
  await sql`
    INSERT INTO config (key_name, value)
    VALUES ('event_date', '2026-04-20T03:00:00.000Z')
  `;
  console.log("   ✓ Seeded: event_date = 20 Apr 2026, 08:30 AM IST");

  // Verify
  const invCount = await sql`SELECT COUNT(*) as c FROM invitations`;
  const admCount = await sql`SELECT COUNT(*) as c FROM admins`;
  const cfgCount = await sql`SELECT COUNT(*) as c FROM config`;

  console.log("\n✅ Database reset complete!");
  console.log(`   Invitations: ${invCount[0].c}`);
  console.log(`   Admins: ${admCount[0].c}`);
  console.log(`   Config rows: ${cfgCount[0].c}`);
}

resetDb().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
