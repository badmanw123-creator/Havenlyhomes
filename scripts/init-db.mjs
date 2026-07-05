import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT NOT NULL DEFAULT '',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;
console.log("leads table ready");
const r = await sql`SELECT count(*) as c FROM leads`;
console.log("existing leads:", r[0].c);
