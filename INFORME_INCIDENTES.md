# Informe de incidencias · Gestor de tareas

**Estudiante:** Matias Fabian Duarte
**Fecha:**  12/11/2026  
**Proyecto / rama Git:**  gestor-tareas-duartematias / develop
**Entorno (Expo SDK, Android, dispositivo):**  Expo SDK 57, aplicación ejecutada en un celular Android mediante Expo Go compatible. Modelo y versión de Android: completar.

## Resumen ejecutivo
Se investigaron y corrigieron cuatro defectos: búsqueda sensible a mayúsculas, falta de actualización al escribir, búsquedas con espacios externos y creación de tareas con títulos de solo espacios.

Se utilizaron revisión de código, pruebas manuales en el celular y pruebas automatizadas con Jest. El resultado inicial fue de 6 pruebas aprobadas y 3 fallidas. Después de las correcciones, las 9 pruebas existentes pasan. Se conservaron capturas y salidas de pruebas como evidencia.

## Incidencia 1: búsqueda sensible a mayúsculas

- **Pasos para reproducir:** escribir VALIDAR y cambiar a Pendientes.
- **Esperado:** encontrar la tarea “Validar login”.
- **Observado:** la lista queda vacía. Con Validar, la tarea aparece.
- **Herramienta usada:** prueba manual, revisión de código y Jest.
- **Evidencia:** capturas en docs/testeo/evidencias y tests-antes.txt.
- **Archivo y función:** src/utils/taskFilters.ts, filterTasks.
- **Causa raíz:** includes compara el texto distinguiendo mayúsculas y minúsculas.
- **Corrección aplicada:** convertir el título y la búsqueda a minúsculas antes de compararlos.
- **Prueba de regresión:** la prueba automática de búsqueda sin distinguir mayúsculas pasa. Tras esta corrección, el resultado fue de 7 pruebas aprobadas y 2 fallidas.
- **Estado:** Corregido.
- **Verificación manual:** después de reiniciar el servidor y reabrir la app, buscar VALIDAR y seleccionar Pendientes   muestra “Validar login”.
- **Incidencia relacionada:** la falta de actualización al escribir se resolvió en la incidencia 2.

## Incidencia 2: la búsqueda no se actualiza al escribir

- **Pasos para reproducir:** abrir el listado y escribir VALIDAR sin cambiar de filtro.
- **Esperado:** que la lista se filtre al escribir.
- **Observado:** siguen apareciendo las cinco tareas hasta cambiar de filtro.
- **Herramienta usada:** prueba manual en el celular y revisión de código.
- **Evidencias:** archivos en docs/testeo/evidencias/: busqueda-antes-sin-actualizar.jpeg, busqueda-despues-actualiza-escribir.jpeg y busqueda-despues-actualiza-listado.jpeg.
- **Archivo:** app/index.tsx.
- **Causa raíz:** falta query entre las dependencias de useMemo.
- **Corrección aplicada:** agregar query para recalcular la lista cuando cambia la búsqueda.
- **Prueba de regresión:** escribir y borrar una búsqueda sin cambiar de filtro.
- **Estado:** Corregido.
- **Verificación manual:** con Todas seleccionado, escribir VALIDAR muestra “Validar login” sin cambiar de filtro. Al borrar la búsqueda, vuelven las cinco tareas.


## Incidencia 3: la búsqueda no ignora espacios externos

- **Pasos para reproducir:** seleccionar Todas y buscar login con dos espacios antes y después.
- **Esperado:** mostrar “Validar login”.
- **Observado:** aparece “No hay tareas para mostrar con estos filtros”.
- **Herramienta usada:** prueba manual y Jest.
- **Evidencia:** archivos en docs/testeo/evidencias/: busqueda-antes-espacios.jpeg, busqueda-despues-espacios.jpeg, tests-antes.txt y tests-despues-incidencia-3.txt.
- **Archivo y función:** src/utils/taskFilters.ts, filterTasks.
- **Causa raíz:** el texto buscado se compara sin quitar los espacios externos.
- **Corrección aplicada:** agregar trim() al texto de búsqueda para eliminar espacios externos antes de comparar.
- **Verificación manual:** buscar login con dos espacios antes y después muestra “Validar login” sin cambiar de filtro.
- **Prueba de regresión:** la prueba automática que verifica búsquedas con espacios externos pasa. Resultado general: 8 pruebas aprobadas y 1 fallida.
- **Estado:** Corregido.

## Incidencia 4: permite crear tareas con títulos de solo espacios

- **Pasos para reproducir:** seleccionar Todas, dejar tres espacios en Nueva tarea y tocar Agregar.
- **Esperado:** rechazar la entrada y mostrar un aviso.
- **Observado:** se agrega una tarjeta sin título visible.
- **Herramienta usada:** prueba manual, revisión del código y Jest.
- **Evidencia:** archivos en docs/testeo/evidencias/: validacion-antes-solo-espacios.jpeg, validacion-despues-solo-espacios.jpeg y tests-despues-incidencia-4.txt.
- **Archivo y función:** src/utils/taskValidation.ts, isValidTaskTitle.
- **Causa raíz:** title.length cuenta los espacios como caracteres válidos.
- **Corrección aplicada:** usar title.trim().length > 0 para rechazar títulos vacíos o formados únicamente por espacios.
- **Verificación manual:** al intentar agregar una tarea de solo espacios, aparece el aviso de nombre inválido. No se agrega ninguna tarjeta ni aumenta el contador.
- **Prueba de regresión:** la prueba automática de rechazo de títulos con solo espacios pasa. Resultado general: 9 pruebas aprobadas y ninguna fallida.
- **Estado:** Corregido.

## Otras incidencias (opcional)

## Pruebas

Todas las evidencias indicadas están en docs/testeo/evidencias/.

| Prueba | Antes | Después | Evidencia |
|---|---|---|---|
| Búsqueda con mayúsculas | No encontraba la tarea | Encuentra la tarea | busqueda-despues-mayusculas.jpeg |
| Actualización al escribir | Requería cambiar de filtro | Se actualiza al escribir y borrar | busqueda-despues-actualiza-escribir.jpeg y busqueda-despues-actualiza-listado.jpeg |
| Búsqueda con espacios externos | No encontraba la tarea | Encuentra la tarea | busqueda-despues-espacios.jpeg |
| Título de solo espacios | Permitía crear la tarea | Rechaza la entrada | validacion-despues-solo-espacios.jpeg |
| Suite automatizada | 6 aprobadas y 3 fallidas | 9 aprobadas y 0 fallidas | tests-antes.txt y tests-despues-incidencia-4.txt |
| Cambio de estado de una tarea | No evaluado en este informe | Pendiente de revisión | — |
| Error simulado del servicio | No evaluado en este informe | Pendiente de revisión | — |

## Conclusión y control de cambios

- **Commit de incidencias 1 y 2:** 67dceed.
- **Commit de incidencias 3 y 4:** pendiente de registrar después del commit.
- **Aprendizaje:** normalizar las búsquedas, declarar las dependencias de useMemo y validar entradas antes de crear registros. Las pruebas y las capturas permiten comprobar las correcciones.
- **Aplicación al proyecto final:** usar el mismo proceso de reproducir, investigar, corregir y verificar en las pantallas propias.
- **Alcance:** las cuatro incidencias documentadas están corregidas. Esto no implica que toda la aplicación esté auditada ni libre de otros errores.
