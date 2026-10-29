import { passwordMatches, signToken } from './_auth.js';
import { body, methodNotAllowed } from './_util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return res.status(500).json({ error: 'Faltan ADMIN_PASSWORD o SESSION_SECRET en el servidor' });
  }
  if (!passwordMatches(body(req).password)) {
    await new Promise((r) => setTimeout(r, 500)); // frena la fuerza bruta
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  res.status(200).json({ token: signToken() });
}
