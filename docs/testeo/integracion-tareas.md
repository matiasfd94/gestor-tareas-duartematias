# Pruebas de integración de tareas

Fecha: 17/11/2026

## Qué se conectó

El gestor ahora consulta las tareas del usuario en Laravel.
También permite crear tareas y cambiar su estado entre pendiente
y completada, guardando los cambios en la base de datos.

Las solicitudes usan el token obtenido al iniciar sesión.

## Pruebas manuales en el celular

### Listado real
- Al ingresar y recargar, aparecen las tareas guardadas en Laravel.
- Resultado: aprobado.
- Evidencia: evidencias/listado-real-laravel.png.

### Creación de tarea
- Se creó “Probar creación desde el celular”.
- Después de recargar, la tarea sigue apareciendo.
- Resultado: aprobado.
- Evidencia: evidencias/crear-tarea-real-desde-celular.png.

### Cambio de estado
- Se marcó la tarea como completada y se recargó el listado.
- La tarea conservó el estado completado.
- Se desmarcó y se volvió a recargar.
- La tarea conservó el estado pendiente.
- Resultado: aprobado.
- Evidencias:
  - evidencias/tarea-real-completada-despues-recargar.png.
  - evidencias/tarea-real-pendiente-despues-recargar.png.

## Archivos modificados

- src/services/taskService.ts: consultas y guardado de tareas mediante la API.
- app/tasks.tsx: conexión de la pantalla con el servicio y manejo de errores.

## Verificaciones

- npm run typecheck: sin errores.
- npm test: 9 pruebas aprobadas, distribuidas en 3 suites.
- Las pruebas automáticas existentes verifican componentes,
  filtros y validaciones. La integración con Laravel se probó
  manualmente desde el celular.

## Pendientes

- Conectar la edición de los datos de una tarea.
- Conectar el borrado lógico desde el celular.
- Completar el manejo de sesión.