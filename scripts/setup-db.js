// Crea las tablas en Neon. Uso:
//   npm run setup-db            -> solo tablas
//   npm run setup-db -- --seed  -> tablas + proyectos de ejemplo
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL. Crea el archivo .env (mira .env.example).');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

function statements(file) {
  const text = readFileSync(new URL(file, import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .join('\n');
  return text.split(';').map((s) => s.trim()).filter(Boolean);
}

async function run(file) {
  for (const stmt of statements(file)) await sql.query(stmt);
  console.log('OK  ', file);
}

await run('../db/schema.sql');
if (process.argv.includes('--seed')) await run('../db/seed.sql');
console.log('Listo. Base de datos preparada.');
