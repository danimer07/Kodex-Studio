-- Esquema de Kodex Studio (Neon / PostgreSQL). Es seguro ejecutarlo varias veces.

CREATE TABLE IF NOT EXISTS proyectos (
  id             SERIAL PRIMARY KEY,
  nombre         TEXT        NOT NULL,
  descripcion    TEXT,
  cliente        TEXT,
  tecnologias    JSONB       NOT NULL DEFAULT '[]'::jsonb,
  imagen_url     TEXT,
  enlace         TEXT,
  estado         TEXT        NOT NULL DEFAULT 'desarrollo'
                 CHECK (estado IN ('idea','desarrollo','pruebas','produccion','mantenimiento')),
  visible        BOOLEAN     NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS proyectos_estado_idx ON proyectos (estado);

CREATE TABLE IF NOT EXISTS contactos (
  id        SERIAL PRIMARY KEY,
  nombre    TEXT,
  email     TEXT        NOT NULL,
  mensaje   TEXT,
  origen    TEXT        NOT NULL DEFAULT 'portada',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contactos_creado_idx ON contactos (creado_en DESC);
