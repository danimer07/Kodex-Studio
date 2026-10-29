import { db } from './_db.js';
import { requireAdmin } from './_auth.js';
import { body, fail, intId, methodNotAllowed, text } from './_util.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  try {
    // Público: guardar un mensaje de contacto
    if (req.method === 'POST') {
      const b = body(req);
      if (text(b.web, 100)) return res.status(200).json({ ok: true }); // honeypot anti-bots

      const email = text(b.email, 200).toLowerCase();
      if (!EMAIL.test(email)) return res.status(400).json({ error: 'Escribe un correo válido' });

      const nombre = text(b.nombre, 120) || null;
      const mensaje = text(b.mensaje, 2000) || null;
      const origen = text(b.origen, 30) || 'portada';

      await db()`INSERT INTO contactos (nombre, email, mensaje, origen) VALUES (${nombre}, ${email}, ${mensaje}, ${origen})`;
      return res.status(201).json({ ok: true });
    }

    // Admin: ver y borrar mensajes
    if (req.method === 'GET' || req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      const sql = db();
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM contactos ORDER BY creado_en DESC, id DESC LIMIT 200`;
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(rows);
      }
      const id = intId(req.query.id);
      if (!id) return res.status(400).json({ error: 'id no válido' });
      await sql`DELETE FROM contactos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
  } catch (err) {
    fail(res, err);
  }
}
