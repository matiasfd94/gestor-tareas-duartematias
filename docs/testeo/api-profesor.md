# Integración de la API pública del profesor

Fecha: 23/11/2026.
Actualización de cierre: 24/11/2026.
Rama: integracion-api-profesor.
Origen: versión propia en develop, conservada sin reemplazar su backend ni APK.

## Objetivo

Adaptar la interfaz existente al contrato compartido de Guia_API_Tareas_Expo_Paso_a_Paso.pdf.
Las tareas son públicas y compartidas; no se requiere login según el documento.

## Diferencias respecto de nuestra versión

- Acceso directo al gestor, sin sesión ni Perfil.
- id numérico, createdAt y array directo en el listado.
- Campos: title, description y completed.
- Sin prioridad, categoría, notas ni vencimiento.
- PATCH solo cambia completed; no se ofrece editar título/descripción.
- Borrado definitivo, con confirmación (no borrado lógico).
- Búsqueda en título y descripción y filtros ejecutados por el servidor.
- Límite de título: 200 bytes UTF-8. Descripción: 10000 bytes UTF-8.

## Cambios realizados

- Servicio HTTP público con validación de respuesta y errores HTTP/de red.
- Manejo de 204 sin intentar leer JSON vacío.
- Traducción de filtros y codificación de la búsqueda.
- Debounce de 275 ms, AbortController y secuencia para evitar respuestas obsoletas.
- Bloqueo inmediato de alta y de operaciones por tarea.
- Se conserva el formulario ante un fallo y no se reintenta el POST automáticamente.
- Tarjetas muestran estado, descripción y fecha de creación.
- Variante Android con identificador propio para convivir con la Preview de Railway.
- No se modificó el .env ignorado usado por la versión anterior.
- No se incluyeron credenciales de Telescope.

## Comprobaciones reales de acceso

En la revisión inicial, GET /health y GET /api/v1/tasks?status=all devolvieron
401 y WWW-Authenticate: Basic. El profesor corrigió el acceso ese mismo día.

Luego se ejecutó el servicio real src/services/taskService.ts desde Node,
contra el servidor público, sin autenticación ni respuestas simuladas.
Las 11 comprobaciones aprobadas fueron:

1. Listado público.
2. Crear una tarea identificada como prueba de Matías Duarte.
3. Consultar esa tarea por ID.
4. Buscar el título en mayúsculas.
5. Buscar por la descripción.
6. Completar la tarea.
7. Comprobar su inclusión/exclusión con los filtros remotos de estado.
8. Volver a pendiente.
9. Eliminar únicamente esa tarea (204).
10. Comprobar 404 al consultar la tarea eliminada.
11. Verificar que ya no aparece en el listado.

La tarea creada se eliminó al finalizar. No se modificaron tareas de terceros.
Evidencia: evidencias/api-profesor-prueba-real.json.
Esta ejecución verifica el servicio y la API, no reemplaza el recorrido manual
de la interfaz en el celular.

## Pruebas automatizadas

- Las pruebas de utilidades del taller se conservan adaptando las tareas de ejemplo.
  taskFilters sigue como utilidad histórica; la pantalla ya no lo usa para filtrar.
- Nuevos tests de UTF-8 con tildes y emojis.
- Tests de servicio: array directo, filtros, solicitudes sin credenciales,
  JSON válido/inválido, creación, PATCH, 204, 400/401/404, red y cancelación.
- Tests de pantalla: respuestas viejas, error de recarga, altas duplicadas,
  conservación del formulario y bloqueo de cambios repetidos.
- Tests de tarjeta: expansión, fecha y bloqueo busy.
- Resultado de la suite en evidencias/api-profesor-tests.json.
- La exportación Android comprueba el bundle; no equivale a una APK instalada.

## Pruebas manuales desde la Preview y Telescope (24/11/2026)

Matías instaló la primera Preview dedicada, abrió el gestor sin login y realizó
el recorrido con la tarea "Matías Duarte - prueba APK" y la descripción
"Comprobar integración con la API del profesor.".

| Prueba | Resultado confirmado |
|---|---|
| Crear una tarea | Apareció en el listado. Solicitud POST /api/v1/tasks, 201. |
| Completar | Cambió a completada. PATCH /api/v1/tasks/{id}, 200, completed: true. |
| Recargar | La tarea conservó el estado completado. |
| Buscar y filtrar | Con su búsqueda apareció en Completadas y no apareció en Pendientes. |
| Consultar | GET /api/v1/tasks, 200. Se compartió el registro 52 de Telescope. |
| Cancelar borrado | Se confirmó que la tarea permaneció al cancelar. |
| Confirmar borrado | DELETE /api/v1/tasks/{id}, 204. No reapareció al recargar. |

El resumen del registro 52 muestra método, ruta, estado y duración, pero no
los parámetros de búsqueda. El comportamiento de los filtros se verificó
en la interfaz; no se atribuye a ese resumen información que no muestra.
La eliminación se realizó únicamente sobre la tarea propia de prueba.

Evidencia manual: resultados comunicados por Matías durante el recorrido
guiado en el celular y Telescope. No se adjuntaron capturas de este recorrido.
El retorno a pendiente y la búsqueda por descripción se comprobaron en las
11 pruebas del servicio real; no se registran como pruebas manuales de la APK.

Estado: recorrido principal de la Preview verificado; actualización final
instalada y revisada según el apartado siguiente.

## Preview inicial del 24/11/2026

- Nombre visible: Matías Tareas.
- Perfil EAS: preview-profesor.
- Identificador Android: com.matiasfd94.gestortareas.profesor.
- Código preparado en el commit 217b967 de integracion-api-profesor.
- [Compilación en EAS](https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/8e940cae-5f49-4366-9177-2ffa02c0097f).
- Envío realizado con EAS_NO_VCS por un fallo de Git al preparar el archivo
  desde esta sesión. Se usaron los archivos de la rama y las exclusiones
  de .gitignore; no se enviaron las credenciales de Telescope ni el .env local.
- Estado final: compilación terminada, instalada y usada para el recorrido
  manual descrito arriba. Esta compilación fue reemplazada por la actualización final.

## Preview final con textos ajustados (24/11/2026)

- Nombre: Matías Tareas. Mismo paquete y firma que la Preview inicial.
- Commit de los ajustes: 224eff7, se ajustan textos de la pantalla de tareas.
- Se retiró la aclaración sobre login y tareas compartidas y se ajustaron
  el encabezado y el ejemplo del campo de nueva tarea.
- [Descargar APK final](https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/5333787c-0e01-4f0a-b365-6294c0efceae).
- Compilación terminada e instalada como actualización sobre Matías Tareas.
- Matías confirmó los textos actualizados y la carga correcta del listado.
- TypeScript y git diff --check pasaron antes de compilar los ajustes.
- El recorrido completo se realizó en la Preview inicial; en la actualización
  se verificaron los cambios de texto y la carga, sin afirmar otra repetición completa.
- La APK anterior de Railway permanece separada y sin reemplazar.

## Primera comprobación en Telescope (24/11/2026)

Se envió desde la computadora un GET público a /api/v1/tasks, con el filtro
search=Matias_Duarte_Telescope_20261124. No se modificaron tareas.
Matías confirmó que vio en el panel el registro con estos datos:

- ID de solicitud: 31 (no es el ID de una tarea).
- Fecha del registro: 2026-11-24T10:14:48.97737199Z.
- Método y ruta: GET /api/v1/tasks.
- Estado: 200.
- Duración: 1110 ms.

Esta observación confirma el registro de esa consulta desde la computadora.
Las operaciones posteriores desde la APK se documentan por separado arriba.

## Verificación de configuración y dependencias

- TypeScript sin errores.
- Expo Doctor: 21/21 controles aprobados tras alinear tres parches de SDK 57.
- expo-constants ~57.0.25, expo-dev-client ~57.0.22 y expo-router ~57.0.32.
- npm informó 6 vulnerabilidades (3 moderadas y 3 altas); no se aplicó audit fix --force ni se declara resuelta la auditoría de seguridad.
- Confirmados nombres y paquetes separados con expo config.
- Al alternar ramas con dependencias distintas, ejecutar npm ci para restaurar el lock de la rama elegida.
