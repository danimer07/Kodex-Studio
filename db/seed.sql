-- Proyectos de EJEMPLO para ver cómo se ve la página. Bórralos desde /admin cuando tengas los reales.

INSERT INTO proyectos (nombre, descripcion, cliente, tecnologias, estado, enlace) VALUES
  ('Sistema de inventario (ejemplo)', 'Control de stock, entradas y salidas con reportes en tiempo real.', 'Cliente de ejemplo', '["Node.js","PostgreSQL","React"]', 'produccion', 'https://example.com'),
  ('App de reservas (ejemplo)', 'Aplicación para agendar citas con recordatorios automáticos.', 'Cliente de ejemplo', '["Flutter","Firebase"]', 'desarrollo', NULL),
  ('Tienda en línea (ejemplo)', 'Catálogo, carrito y pasarela de pagos para un comercio local.', 'Cliente de ejemplo', '["HTML","JavaScript","Stripe"]', 'pruebas', NULL),
  ('Panel administrativo (ejemplo)', 'Dashboard interno con gráficos y gestión de usuarios.', 'Cliente de ejemplo', '["Vue","Express","Neon"]', 'mantenimiento', NULL),
  ('Plataforma de aprendizaje (ejemplo)', 'Idea de plataforma de cursos cortos para estudiantes.', NULL, '["Por definir"]', 'idea', NULL);
