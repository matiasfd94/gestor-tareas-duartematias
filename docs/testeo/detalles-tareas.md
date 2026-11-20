# Categoría, notas y vencimiento

Fecha: 20/11/2026

## Cambios realizados

- Se agregaron categoría, notas y vencimiento a la creación y edición.
- Los campos son opcionales y se muestran en el detalle cuando tienen datos.
- El vencimiento se ingresa como AAAA-MM-DD.
- Se conserva la prioridad y el estado pendiente/completada.
- Se quitó el texto MACEDO del login.

## Archivos modificados

- src/types/task.ts: nuevos campos de la tarea.
- src/services/taskService.ts: recepción y envío de los datos.
- app/tasks.tsx: formularios de creación y edición.
- src/components/TaskCard.tsx: presentación de los detalles.
- app/login.tsx: ajuste del encabezado.

## Verificaciones

- TypeScript: sin errores.
- Jest: 9 pruebas existentes aprobadas.
- Edición con categoría, notas y vencimiento: probada en Development.
- Evidencia de creación: evidencias/tarea-creada-con-detalles.jpeg.

Los nuevos campos todavía deben verificarse en la Preview final.