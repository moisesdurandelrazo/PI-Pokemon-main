Seguridad y despliegue

Usar Node 22.12 o posterior. Antes de iniciar una instalación existente, ejecutar `node migrate-security.js` con respaldo de la base de datos. Esta migración crea tablas de usuarios/sesiones y agrega attack sin borrar registros. El arranque ya no usa force:true.

Configurar CLIENT_URL_DEV y CLIENT_URL_PROD con los orígenes exactos permitidos (sin barra final). Configurar NODE_ENV=production detrás de HTTPS para cookies Secure y HttpOnly. Si frontend y API están en sitios distintos, configurar SESSION_SAME_SITE=none; se mantiene protección de origen y CSRF. No incluir secretos en variables VITE_.

La API implementa registro/login, sesión de ocho horas, logout con revocación y creación de Pokémon autenticada. Las contraseñas usan scrypt con sal aleatoria; la base de datos guarda hashes de sesión. No hay una tabla previa de usuarios que migrar.

Pruebas: `node --test tests/security.test.cjs`. Las pruebas usan una base simulada para los flujos HTTP; validar también contra PostgreSQL antes del despliegue. Los tests históricos del proyecto borran tablas: no ejecutarlos contra producción.

Los límites de solicitudes son por IP y proceso. Para varias réplicas, agregar un límite compartido en el proxy. Configurar trust proxy solo para proxies conocidos si se necesita distinguir clientes detrás del proxy.

La auditoría de dependencias debe ejecutarse por separado en api y client. Ocho avisos de api quedaron pendientes tras las actualizaciones compatibles; requieren evaluar mocha, glob y dependencias transitivas de sequelize/sequelize-cli. No ejecutar audit fix --force: puede degradar sequelize.
