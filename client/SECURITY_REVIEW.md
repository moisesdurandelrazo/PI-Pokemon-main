Revisión de seguridad — 12 de noviembre de 2026

Estado de dependencias

- client: npm audit reporta 0 vulnerabilidades después de actualizar dependencias compatibles.
- api: bajó de 28 a 8 avisos: 7 moderados y 1 alto, sin críticos. Quedan glob/minimatch, editorconfig/js-beautify, serialize-javascript/mocha y uuid/sequelize. La instalación adicional propuesta no fue autorizada. No usar npm audit fix --force sin revisar: propone incluso degradar Sequelize.
- Los package-lock.json de ambas carpetas ahora pueden guardarse en Git para reproducir las resoluciones auditadas.

Correcciones de código

- La API exige sesión y CSRF para crear Pokémon; implementa los endpoints de autenticación que espera el cliente existente.
- Contraseñas con scrypt y sal aleatoria; sesiones de ocho horas con tokens aleatorios guardados como hashes, cookies HttpOnly y Secure en producción, revocación al cerrar sesión.
- Validación de origen y application/json para escrituras, límites de solicitudes y concurrencia de hashing.
- Entradas de Pokémon validadas mediante lista explícita de campos; asociaciones y creación en transacción.
- Límites de paginación, tamaño de cuerpos y solicitudes al proveedor. Validación de URLs de Pokémon devueltas por el proveedor.
- Respuestas de error sin detalles internos y caché desactivada en autenticación.
- Arranque de API sin force:true para evitar borrar tablas.
- Cliente: bloqueo de mutaciones sin CSRF, rechazo de redirecciones HTTP en solicitudes autenticadas y validación del destino tras iniciar sesión.

Validación ejecutada

- node --test tests/auth-api.test.mjs: 3 pruebas correctas.
- node --test ../api/tests/security.test.cjs: 5 pruebas correctas, incluyendo el flujo de Express con almacenamiento simulado, cookies, CSRF, expiración y logout.
- npm run build: correcto; advertencia existente sobre navimg.jpeg.
- ESLint de src/auth y src/components/Auth: correcto. El lint global mantiene 14 errores y 1 advertencia preexistentes en otros archivos.
- No se ejecutaron las pruebas históricas con PostgreSQL: contienen operaciones destructivas force:true. Las pruebas nuevas usan almacenamiento simulado; no verifican la persistencia real ni la migración.

Antes de desplegar

Consultar ../api/SECURITY.md. Respaldar la base de datos y ejecutar `node migrate-security.js` desde api para crear las tablas de autenticación y añadir attack sin borrar registros. Configurar los orígenes permitidos, HTTPS y NODE_ENV=production. Validar la migración y los flujos contra PostgreSQL antes de producción. No se ejecutó ninguna migración sobre tu base de datos durante esta revisión.

Los cambios previos del usuario en App, navegación, creación y autenticación se conservaron. Esta revisión no constituye una garantía de ausencia de vulnerabilidades.
