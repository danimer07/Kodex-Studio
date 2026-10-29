import { neon } from '@neondatabase/serverless';

let sql;

// Conexión a Neon. La cadena vive solo en el servidor (variable de entorno).
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('Falta la variable DATABASE_URL');
  return (sql ??= neon(process.env.DATABASE_URL));
}
