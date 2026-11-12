# Informe de incidencias · Gestor de tareas

**Estudiante:** Matias Fabian Duarte
**Fecha:**  12/11/2026  
**Proyecto / rama Git:**  gestor-tareas-duartematias / develop
**Entorno (Expo SDK, Android, dispositivo):**  Expo SDK 57, aplicación ejecutada en un celular Android mediante Expo Go compatible. Modelo y versión de Android: completar.

## Resumen ejecutivo

Se investigaron y corrigieron seis defectos: búsqueda sensible a mayúsculas, falta de actualización al escribir, búsquedas con espacios externos, creación de tareas con títulos de solo espacios, actualización incorrecta al cambiar el estado de una tarea y carga que no finalizaba cuando fallaba el servicio.

Se utilizaron revisión de código, pruebas manuales en el celular, logs y pruebas automatizadas con Jest. El resultado inicial fue de 6 pruebas aprobadas y 3 fallidas. Tras las primeras cuatro correcciones, las 9 pruebas existentes pasaron. Las incidencias 5 y 6 se verificaron manualmente. Después de esos cambios se repitió la suite existente: las 9 pruebas pasaron. Estas pruebas no cubren automáticamente los recorridos completos de cambio de estado y recuperación del servicio.

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

## Incidencia 5: marcar una tarea no actualiza correctamente la pantalla

- **Pasos para reproducir:** recargar los datos, seleccionar Todas y tocar la casilla de “Validar login”.
- **Esperado:** marcar la casilla, tachar el título y actualizar los contadores.
- **Observado antes:** la casilla y el título no cambiaban. Se observaron 3 completadas y 3 pendientes sobre un total de 5 tareas.
- **Herramienta usada:** prueba manual y revisión de código.
- **Evidencia inicial:** observación manual registrada durante la prueba, sin captura del antes.
- **Archivo y función:** app/index.tsx, toggleTask.
- **Causa raíz:** se modificaba directamente la tarea y se reutilizaba el mismo arreglo en setTasks.
- **Corrección aplicada:** usar una actualización funcional con map para crear un arreglo nuevo y copiar la tarea modificada.
- **Verificación manual:** al marcar “Validar login”, queda tachada y los contadores muestran 3 completadas y 2 pendientes. Al desmarcarla, se quita el tachado y vuelven a 2 completadas y 3 pendientes.
- **Evidencia posterior:** docs/testeo/evidencias/estado-despues-tarea-completada.jpeg.
- **Prueba de regresión:** ciclo de marcar y desmarcar comprobado manualmente, sin cambiar de filtro ni recargar.
- **Estado:** Corregido.

## Incidencia 6: la carga no finaliza cuando falla el servicio

- **Pasos para reproducir:** tocar Simular error API y esperar la respuesta.
- **Esperado:** mostrar el mensaje de error, finalizar la carga y permitir reintentar.
- **Observado antes:** aparecía el mensaje de error, pero seguían visibles el indicador de carga y “Consultando tareas…”.
- **Herramienta usada:** prueba manual, revisión de código y log de consola.
- **Evidencias:** archivos en docs/testeo/evidencias/: servicio-antes-carga-no-finaliza.jpeg y servicio-despues-error-sin-carga.jpeg.
- **Archivo y función:** app/index.tsx, loadTasks.
- **Causa raíz:** setLoading(false) solo se ejecutaba cuando la consulta terminaba correctamente.
- **Corrección aplicada:** mover setLoading(false) al bloque finally para finalizar la carga tanto en éxito como en error.
- **Verificación manual:** al simular el fallo, aparece el mensaje de error y termina la carga. Al tocar Recargar datos, desaparece el error y vuelven las cinco tareas.
- **Prueba de regresión:** recorrido manual de fallo del servicio y recuperación mediante reintento.
- **Estado:** Corregido.


## Pruebas

Todas las evidencias indicadas están en docs/testeo/evidencias/.

| Prueba | Antes | Después | Evidencia |
|---|---|---|---|
| Búsqueda con mayúsculas | No encontraba la tarea | Encuentra la tarea | busqueda-despues-mayusculas.jpeg |
| Actualización al escribir | Requería cambiar de filtro | Se actualiza al escribir y borrar | busqueda-despues-actualiza-escribir.jpeg y busqueda-despues-actualiza-listado.jpeg |
| Búsqueda con espacios externos | No encontraba la tarea | Encuentra la tarea | busqueda-despues-espacios.jpeg |
| Título de solo espacios | Permitía crear la tarea | Rechaza la entrada | validacion-despues-solo-espacios.jpeg |
| Suite automatizada | 6 aprobadas y 3 fallidas | 9 aprobadas y 0 fallidas | tests-antes.txt y tests-despues-incidencia-4.txt |
| Cambio de estado de una tarea | No actualizaba correctamente la pantalla | Marca, desmarca y actualiza los contadores | estado-despues-tarea-completada.jpeg |
| Error simulado del servicio | La carga continuaba después del error | Finaliza la carga y permite recuperar el listado | servicio-despues-error-sin-carga.jpeg |

## Conclusión y control de cambios

- **Commit de incidencias 1 y 2:** 67dceed.
- **Commit de incidencias 3 y 4:** pendiente de registrar después del commit.
- **Aprendizaje:** normalizar las búsquedas, declarar las dependencias de useMemo y validar entradas antes de crear registros. Las pruebas y las capturas permiten comprobar las correcciones.
- **Aplicación al proyecto final:** usar el mismo proceso de reproducir, investigar, corregir y verificar en las pantallas propias.
- **Alcance:** las cuatro incidencias documentadas están corregidas. Esto no implica que toda la aplicación esté auditada ni libre de otros errores.
