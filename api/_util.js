export const ESTADOS = ['idea', 'desarrollo', 'pruebas', 'produccion', 'mantenimiento'];

// Cuerpo JSON de la petición (Vercel ya lo parsea; esto cubre el caso string).
export function body(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch { b = null; }
  }
  return b && typeof b === 'object' ? b : {};
}

export function fail(res, err) {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: 'Método no permitido' });
}

export const text = (v, max) => String(v ?? '').trim().slice(0, max);

export function intId(v) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}
