import { db } from './_db.js';
import { isAdmin, requireAdmin } from './_auth.js';
import { ESTADOS, body, fail, intId, methodNotAllowed, text } from './_util.js';

// Valida y normaliza los datos de un proyecto. Devuelve { v } o { error }.
function clean(b) {
  const nombre = text(b.nombre, 120);
  if (!nombre) return { error: 'El nombre es obligatorio' };

  const estado = text(b.estado, 20) || 'desarrollo';
  if (!ESTADOS.includes(estado)) return { error: 'Estado no válido' };

  const urls = {};
  for (const [campo, etiqueta] of [['imagen_url', 'La imagen'], ['enlace', 'El enlace']]) {
    const s = text(b[campo], 500);
    if (s && !/^https?:\/\/\S+$/i.test(s)) return { error: `${etiqueta} debe ser una URL http(s) válida` };
    urls[campo] = s || null;
  }

  let tech = b.tecnologias;
  if (typeof tech === 'string') tech = tech.split(',');
  tech = (Array.isArray(tech) ? tech : []).map((t) => text(t, 40)).filter(Boolean).slice(0, 12);

  return {
    v: {
      nombre,
      descripcion: text(b.descripcion, 1000) || null,
      cliente: text(b.cliente, 120) || null,
      tecnologias: tech,
      estado,
      visible: b.visible !== false,
      ...urls,
    },
  };
}

export default async function handler(req, res) {
  try {
    const sql = db();

    if (req.method === 'GET') {
      const all = isAdmin(req) && req.query.all === '1';
      const estado = ESTADOS.includes(req.query.estado) ? req.query.estado : null;
      const rows = await sql`
        SELECT * FROM proyectos
        WHERE (${all}::boolean OR visible)
          AND (${estado}::text IS NULL OR estado = ${estado})
        ORDER BY creado_en DESC, id DESC`;
      res.setHeader('Cache-Control', all ? 'no-store' : 's-maxage=30, stale-while-revalidate=60');
      return res.status(200).json(rows);
    }

    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
    }
    if (!requireAdmin(req, res)) return;

    if (req.method === 'DELETE') {
      const id = intId(req.query.id);
      if (!id) return res.status(400).json({ error: 'id no válido' });
      const rows = await sql`DELETE FROM proyectos WHERE id = ${id} RETURNING id`;
      return rows.length ? res.status(200).json({ ok: true }) : res.status(404).json({ error: 'No existe' });
    }

    const { v, error } = clean(body(req));
    if (error) return res.status(400).json({ error });
    const tech = JSON.stringify(v.tecnologias);

    if (req.method === 'POST') {
      const [row] = await sql`
        INSERT INTO proyectos (nombre, descripcion, cliente, tecnologias, imagen_url, enlace, estado, visible)
        VALUES (${v.nombre}, ${v.descripcion}, ${v.cliente}, ${tech}::jsonb, ${v.imagen_url}, ${v.enlace}, ${v.estado}, ${v.visible})
        RETURNING *`;
      return res.status(201).json(row);
    }

    // PUT
    const id = intId(req.query.id);
    if (!id) return res.status(400).json({ error: 'id no válido' });
    const rows = await sql`
      UPDATE proyectos SET
        nombre = ${v.nombre}, descripcion = ${v.descripcion}, cliente = ${v.cliente},
        tecnologias = ${tech}::jsonb, imagen_url = ${v.imagen_url}, enlace = ${v.enlace},
        estado = ${v.estado}, visible = ${v.visible}, actualizado_en = now()
      WHERE id = ${id}
      RETURNING *`;
    return rows.length ? res.status(200).json(rows[0]) : res.status(404).json({ error: 'No existe' });
  } catch (err) {
    fail(res, err);
  }
}
