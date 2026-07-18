export const config = { runtime: 'edge' };

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
/** Redis set chứa SHA-256 của các SBD đã tra cứu thành công (không lưu điểm) */
const SET_KEY = 'diemthi2026:participants';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function kv(...command: string[]): Promise<unknown> {
  const res = await fetch(`${KV_URL}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) throw new Error(`KV error: ${res.status}`);
  const body = (await res.json()) as { result: unknown };
  return body.result;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (!KV_URL || !KV_TOKEN) {
    return json({ error: 'KV not configured' }, 500);
  }

  if (req.method === 'GET') {
    const count = await kv('scard', SET_KEY);
    return json({ count: Number(count) || 0 });
  }

  if (req.method === 'POST') {
    let sbd = '';
    try {
      const body = (await req.json()) as { sbd?: unknown };
      sbd = String(body?.sbd ?? '');
    } catch {
      return json({ error: 'Invalid body' }, 400);
    }
    if (!/^\d{8}$/.test(sbd)) {
      return json({ error: 'Invalid sbd' }, 400);
    }

    const hash = await sha256Hex(sbd);
    await kv('sadd', SET_KEY, hash);
    const count = await kv('scard', SET_KEY);
    return json({ count: Number(count) || 0 });
  }

  return json({ error: 'Method not allowed' }, 405);
}
