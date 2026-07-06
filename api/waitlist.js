import { neon } from '@neondatabase/serverless'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clip = (v, n) => String(v ?? '').slice(0, n)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const body = req.body || {}
  const email = clip(body.email, 254).trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid email' })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)
    await sql`
      insert into waitlist
        (email, stake_pick, stake_other, variant, utm_source, utm_medium, utm_content, page, client_ts)
      values
        (${email}, ${clip(body.stake_pick, 100)}, ${clip(body.stake_other, 200)},
         ${clip(body.variant, 40)}, ${clip(body.utm_source, 100)}, ${clip(body.utm_medium, 100)},
         ${clip(body.utm_content, 100)}, ${clip(body.page, 40)}, ${clip(body.ts, 40)})
      on conflict (email) do nothing
    `
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('waitlist insert failed:', err)
    return res.status(500).json({ error: 'storage failed' })
  }
}
