# Control de sesión

## Cambios preparados

- Se agregó el botón Cerrar sesión.
- Se solicita a Laravel invalidar el token y después se elimina del celular.
- Antes de cargar el gestor, se consulta si la sesión es válida.
- Si no existe una sesión válida, se vuelve al login.
- Si falla la conexión al verificar la sesión, se permite reintentar.

## Archivos modificados

- src/services/authService.ts: cierre y consulta de sesión.
- app/tasks.tsx: botón de salida y comprobación de acceso.

## Verificaciones realizadas

- npm run typecheck: sin errores.
- npm test: 9 pruebas existentes aprobadas.
- Estas pruebas cubren componentes, filtros y validaciones.

## Pendiente de prueba manual

- Ingresar con una sesión válida.
- Cerrar sesión y comprobar el regreso al login.
- Intentar volver al gestor después de cerrar sesión.
- Probar una falla de conexión y el botón Reintentar.

## Pendiente de implementación

- Manejar el vencimiento del token durante el uso del gestor.

Estado: preparado, pendiente de verificación en el celular.