/* Cloudflare Pages Function — anonymous family-code progress sync.
 *
 * Dormant on GitHub Pages (static hosts ignore /functions). To activate:
 * deploy this same repo on Cloudflare Pages and bind a KV namespace named
 * PROGRESS (Pages project → Settings → Functions → KV namespace bindings).
 * The app auto-detects the API via GET /api/progress/__ping — no code
 * changes needed.
 *
 * Privacy: values are opaque progress blobs keyed by a random family code.
 * No accounts, no PII, no listing endpoint.
 */

const JSON_HEADERS = { 'content-type': 'application/json' };
const MAX_BYTES = 32 * 1024;
const TTL_DAYS = 400;

export async function onRequestGet({ params, env }) {
  if (params.code === '__ping') {
    return new Response('{"ok":true,"service":"lsm-sync"}', { headers: JSON_HEADERS });
  }
  if (!valid(params.code)) return bad('bad code');
  const v = await env.PROGRESS.get(kvKey(params.code));
  return new Response(v || 'null', { headers: JSON_HEADERS });
}

export async function onRequestPut({ params, env, request }) {
  if (!valid(params.code)) return bad('bad code');
  const body = await request.text();
  if (body.length > MAX_BYTES) return bad('too large', 413);
  try {
    const parsed = JSON.parse(body);
    if (typeof parsed !== 'object' || parsed === null || parsed.v !== 1) return bad('bad payload');
  } catch (e) {
    return bad('not json');
  }
  await env.PROGRESS.put(kvKey(params.code), body, { expirationTtl: TTL_DAYS * 86400 });
  return new Response('{"ok":true}', { headers: JSON_HEADERS });
}

const valid = c => typeof c === 'string' && /^[A-Z0-9-]{6,32}$/i.test(c);
const kvKey = c => 'fam:' + c.toUpperCase();
const bad = (msg, status = 400) =>
  new Response(JSON.stringify({ error: msg }), { status, headers: JSON_HEADERS });
