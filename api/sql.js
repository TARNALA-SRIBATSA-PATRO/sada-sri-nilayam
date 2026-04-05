import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_8Rt5gjsKrYzJ@ep-aged-credit-antv5fq0-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, params = [] } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const rows = await sql.query(query, params);
    return res.status(200).json({ rows });
  } catch (err) {
    console.error('SQL error:', err);
    return res.status(500).json({ error: err.message || 'Database error' });
  }
}
