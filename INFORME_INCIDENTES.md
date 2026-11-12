# Informe de incidencias · Gestor de tareas

**Estudiante:**  
**Fecha:**  
**Proyecto / rama Git:**  
**Entorno (Expo SDK, Android, dispositivo):**  

## Resumen ejecutivo
¿Qué se investigó? ¿Cuántos defectos se detectaron y solucionaron?

## Incidencia 1: búsqueda sensible a mayúsculas

- **Pasos para reproducir:** escribir VALIDAR y cambiar a Pendientes.
- **Esperado:** encontrar la tarea “Validar login”.
- **Observado:** la lista queda vacía. Con Validar, la tarea aparece.
- **Herramienta usada:** prueba manual, revisión de código y Jest.
- **Evidencia:** capturas en docs/testeo/evidencias y tests-antes.txt.
- **Archivo y función:** src/utils/taskFilters.ts, filterTasks.
- **Causa raíz:** includes compara el texto distinguiendo mayúsculas y minúsculas.
- **Corrección aplicada:** pendiente.
- **Prueba de regresión:** comprobar que VALIDAR y Validar encuentren la misma tarea.
- **Estado:** Corregido.
- **Verificación manual:** después de reiniciar el servidor y reabrir la app, buscar VALIDAR y seleccionar Pendientes   muestra “Validar login”.
- **Pendiente relacionado:** la búsqueda todavía no se recalcula al cambiar únicamente el texto.

## Incidencia 2: la búsqueda no se actualiza al escribir

- **Pasos para reproducir:** abrir el listado y escribir VALIDAR sin cambiar de filtro.
- **Esperado:** que la lista se filtre al escribir.
- **Observado:** siguen apareciendo las cinco tareas hasta cambiar de filtro.
- **Evidencia:** docs/testeo/evidencias/busqueda-antes-sin-actualizar.jpeg.
- **Archivo:** app/index.tsx.
- **Causa raíz:** falta query entre las dependencias de useMemo.
- **Corrección aplicada:** agregar query para recalcular la lista cuando cambia la búsqueda.
- **Prueba de regresión:** escribir y borrar una búsqueda sin cambiar de filtro.
- **Estado:** Corregido.
- **Verificación manual:** con Todas seleccionado, escribir VALIDAR muestra “Validar login” sin cambiar de filtro. Al borrar la búsqueda, vuelven las cinco tareas.
- **Evidencias:** busqueda-despues-actualiza-al-escribir.jpeg y busqueda-despues-restaura-listado.jpeg, en docs/testeo/evidencias/.

## Incidencia 3
Copiar los mismos campos de la incidencia 1.

## Incidencia 4
Copiar los mismos campos de la incidencia 1.

## Otras incidencias (opcional)

## Pruebas
| Prueba | Antes | Después | Evidencia |
|---|---|---|---|
| Búsqueda | | | |
| Validación | | | |
| Actualización de estado | | | |
| Error de servicio | | | |

## Conclusión y control de cambios
- **Commit final (hash):**
- **Mensaje del commit:**
- **Qué aprendí y cómo lo aplicaría a mi app final:**
