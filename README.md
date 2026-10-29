# Kodex Studio — sitio web con Neon + Vercel

Páginas: portada (`/`), `/servicios`, `/proyectos`, `/proceso`, `/contacto` y el panel privado `/admin`.
Los proyectos y los mensajes de contacto se guardan en tu base de datos de **Neon**.

```
index.html, servicios.html, proyectos.html, proceso.html, contacto.html, admin.html
site.css, site.js        -> estilos y cabecera/pie compartidos
api/                     -> funciones de servidor (únicas que conocen la base de datos)
db/schema.sql, seed.sql  -> tablas y proyectos de ejemplo
scripts/setup-db.js      -> crea las tablas en Neon
```

## 1. Variables de entorno

1. En Neon: **Dashboard → Connect** y copia la *connection string*.
2. Copia `.env.example` a `.env` y rellénalo:
   - `DATABASE_URL`: la cadena de Neon.
   - `ADMIN_PASSWORD`: la contraseña con la que entrarás a `/admin`.
   - `SESSION_SECRET`: una cadena aleatoria. Genérala con `openssl rand -hex 32`.

> `.env` está en `.gitignore`. **Nunca** lo subas a GitHub ni compartas la cadena de Neon.

## 2. Crear las tablas

```bash
npm install
npm run setup-db -- --seed   # --seed agrega 5 proyectos de ejemplo (bórralos luego desde /admin)
```

Sin `--seed` solo crea las tablas vacías. Puedes ejecutarlo varias veces sin problema.

## 3. Probar en tu computador

```bash
npx vercel dev
```

Abre http://localhost:3000. (Abrir los `.html` con doble clic **no** sirve: las funciones `/api` necesitan el servidor.)

## 4. Publicar

1. Sube la carpeta a un repositorio de GitHub (sin `.env`).
2. En vercel.com: **Add New → Project** → importa el repositorio.
3. En **Settings → Environment Variables** agrega `DATABASE_URL`, `ADMIN_PASSWORD` y `SESSION_SECRET`.
4. Despliega. Listo: `tu-dominio/proyectos` ya lee de Neon.

## Uso diario

- Entra a `/admin` con tu contraseña.
- **Proyectos**: crea, edita y borra. El *estado* (`idea`, `desarrollo`, `pruebas`, `produccion`, `mantenimiento`) define en qué filtro aparece en `/proyectos`. Si desmarcas *Visible*, queda oculto al público.
- **Mensajes**: lo que llega desde el formulario de la portada y de `/contacto`.

## Seguridad (ya incluida)

- La cadena de Neon solo vive en el servidor; el navegador nunca la ve.
- Consultas parametrizadas (sin inyección SQL), validación de datos y URLs solo `http(s)`.
- Sesión de admin firmada (HMAC) que expira a las 8 horas; los endpoints de escritura exigen ese token.
- Campo trampa (*honeypot*) contra bots en los formularios.

Pendiente si el sitio crece: limitar la cantidad de envíos por IP (por ejemplo con Vercel WAF o Upstash Ratelimit).
