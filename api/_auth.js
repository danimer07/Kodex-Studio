import crypto from 'node:crypto';

const TTL_MS = 8 * 60 * 60 * 1000; // la sesión de admin dura 8 horas

const hmac = (secret, data) => crypto.createHmac('sha256', secret).update(data).digest('base64url');

export function signToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString('base64url');
  return `${payload}.${hmac(process.env.SESSION_SECRET, payload)}`;
}

function verifyToken(token) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || typeof token !== 'string') return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = hmac(secret, payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function isAdmin(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') && verifyToken(h.slice(7));
}

export function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.status(401).json({ error: 'No autorizado' });
  return false;
}

export function passwordMatches(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || typeof input !== 'string') return false;
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}
