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

## Pruebas manuales realizadas — 18/11/2026

- Se inició sesión y se cargaron las tareas del usuario.
- Al tocar Cerrar sesión, la aplicación volvió al login.
- Al tocar Atrás, se salió a Expo Go sin volver al gestor.
- Se inició sesión nuevamente y se recuperó el acceso.
- Resultado: aprobado.

## Separación de tareas por usuario — 18/11/2026

- Se creó previamente la cuenta matias1 desde Laravel.
- Al ingresar, el listado estaba vacío.
- Se creó “Preparar mi parcial de EDI”.
- Después de recargar, la tarea seguía apareciendo.
- Se cerró sesión y se ingresó con Demo.
- La tarea de matias1 no apareció en el listado de Demo.
- Resultado: aprobado.
- Las contraseñas no se incluyen en la documentación.

## Sesión inválida durante el uso

- Se inició sesión con Demo y se abrió el gestor.
- Se revocaron sus tokens desde Laravel.
- Al recargar las tareas, la aplicación volvió al login
  y mostró el aviso de sesión finalizada.
- Resultado: aprobado.

## Falla de conexión y recuperación — 18/11/2026

- Con una sesión iniciada, se detuvo Laravel.
- Se abrió temporalmente el gestor desde la ruta inicial.
- Apareció un aviso de conexión con el botón Reintentar.
- Se inició Laravel nuevamente y se tocó Reintentar.
- Se cargaron las tareas sin volver a ingresar la contraseña.
- La falla de conexión no eliminó el token guardado.
- Se restauró la ruta inicial al login.
- Resultado: aprobado.

Estado: cierre de sesión, acceso, token inválido y recuperación de conexión verificados manualmente en el celular.

