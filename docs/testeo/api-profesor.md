# Integración de la API pública del profesor

Fecha: 23/11/2026.
Actualización de cierre: 24/11/2026.
Rama: integracion-api-profesor.
Origen: partí de mi versión en develop y conservé su backend y su APK.

## Objetivo

Adapté la interfaz existente al contrato de Guia_API_Tareas_Expo_Paso_a_Paso.pdf.
Las tareas son públicas y compartidas; no se requiere login según el documento.

## Diferencias respecto de mi versión anterior

- Acceso directo al gestor, sin sesión ni Perfil.
- id numérico, createdAt y array directo en el listado.
- Campos: title, description y completed.
- Sin prioridad, categoría, notas ni vencimiento.
- PATCH solo cambia completed; no se ofrece editar título/descripción.
- Borrado definitivo, con confirmación (no borrado lógico).
- Búsqueda en título y descripción y filtros ejecutados por el servidor.
- Límite de título: 200 bytes UTF-8. Descripción: 10000 bytes UTF-8.

## Cambios realizados

- Adapté el servicio HTTP al acceso público y al manejo de respuestas y errores.
- Contemplé el estado 204 sin intentar leer un JSON vacío.
- Ajusté los filtros y el envío del texto de búsqueda.
- Incorporé una espera de 275 ms, cancelación de consultas y control de respuestas viejas.
- Bloqueé los envíos repetidos al crear o modificar una tarea.
- Conservé el formulario si falla el envío, sin repetir el POST automáticamente.
- Ajusté las tarjetas para mostrar estado, descripción y fecha de creación.
- Configuré otro identificador Android para conservar la Preview de Railway instalada.
- Conservé el .env de la versión anterior.
- No incluí credenciales de Telescope en la aplicación.

## Comprobaciones reales de acceso

En la revisión inicial comprobé que GET /health y GET /api/v1/tasks?status=all devolvían
401 y WWW-Authenticate: Basic. El profesor corrigió el acceso ese mismo día.

Luego ejecuté el servicio real src/services/taskService.ts desde Node,
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

Eliminé la tarea de prueba al finalizar. No modifiqué tareas de terceros.
Evidencia: evidencias/api-profesor-prueba-real.json.
Esta ejecución verifica el servicio y la API, no reemplaza el recorrido manual
de la interfaz en el celular.

## Pruebas automatizadas

- Conservé las pruebas de utilidades del taller y adapté las tareas de ejemplo.
  taskFilters sigue como utilidad histórica; la pantalla ya no lo usa para filtrar.
- Agregué tests de UTF-8 con tildes y emojis.
- Tests de servicio: array directo, filtros, solicitudes sin credenciales,
  JSON válido/inválido, creación, PATCH, 204, 400/401/404, red y cancelación.
- Tests de pantalla: respuestas viejas, error de recarga, altas duplicadas,
  conservación del formulario y bloqueo de cambios repetidos.
- Tests de tarjeta: expansión, fecha y bloqueo busy.
- Resultado de la suite en evidencias/api-profesor-tests.json.
- La exportación Android comprueba el bundle; no equivale a una APK instalada.

## Pruebas manuales desde la Preview y Telescope (24/11/2026)

Instalé la primera Preview dedicada, abrí el gestor sin login y realicé
el recorrido con la tarea "Matías Duarte - prueba APK" y la descripción
"Comprobar integración con la API del profesor.".

| Prueba | Resultado confirmado |
|---|---|
| Crear una tarea | Comprobé que apareció en el listado. POST /api/v1/tasks, 201. |
| Completar | La marqué como completada y revisé el PATCH 200, completed: true. |
| Recargar | Recargué y comprobé que conservaba el estado completado. |
| Buscar y filtrar | Verifiqué que mi tarea aparecía en Completadas y no en Pendientes. |
| Consultar | Revisé el GET /api/v1/tasks, 200, en el registro 52 de Telescope. |
| Cancelar borrado | Cancelé y comprobé que la tarea permanecía. |
| Confirmar borrado | Confirmé el DELETE 204 y comprobé que no reaparecía al recargar. |

El resumen del registro 52 muestra método, ruta, estado y duración, pero no
los parámetros de búsqueda. Verifiqué el comportamiento de los filtros
en la interfaz, porque ese resumen no muestra los parámetros.
Eliminé únicamente mi tarea de prueba.

Registré los resultados mientras realizaba el recorrido en el celular y Telescope.
No adjunté capturas de este recorrido.
Comprobé el retorno a pendiente y la búsqueda por descripción mediante las
11 pruebas del servicio real; no los registré como pruebas manuales de la APK.

Estado: recorrido principal de la Preview verificado; actualización final
instalada y revisada según el apartado siguiente.

## Preview inicial del 24/11/2026

- Nombre visible: Matías Tareas.
- Perfil EAS: preview-profesor.
- Identificador Android: com.matiasfd94.gestortareas.profesor.
- Código preparado en el commit 217b967 de integracion-api-profesor.
- [Compilación en EAS](https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/8e940cae-5f49-4366-9177-2ffa02c0097f).
- Para el primer envío utilicé EAS_NO_VCS por un fallo de Git al preparar el archivo.
  Utilicé los archivos de la rama y las exclusiones de .gitignore; no envié
  las credenciales de Telescope ni el .env local.
- Instalé la compilación terminada y la utilicé para el recorrido manual
  descrito arriba. Después la actualicé con la Preview final.

## Preview final con textos ajustados (24/11/2026)

- Nombre: Matías Tareas. Mismo paquete y firma que la Preview inicial.
- Commit de los ajustes: 224eff7, se ajustan textos de la pantalla de tareas.
- Retiré la aclaración sobre login y tareas compartidas y ajusté
  el encabezado y el ejemplo del campo de nueva tarea.
- [Descargar APK final](https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/5333787c-0e01-4f0a-b365-6294c0efceae).
- Instalé la compilación final como actualización sobre Matías Tareas.
- Revisé los textos actualizados y comprobé la carga correcta del listado.
- Ejecuté TypeScript y git diff --check sin errores antes de compilar los ajustes.
- Realicé el recorrido completo en la Preview inicial; en la actualización
  revisé los textos y la carga, sin repetir el recorrido completo.
- Conservé la APK anterior de Railway instalada por separado.

## Primera comprobación en Telescope (24/11/2026)

Para esta prueba utilicé un GET público desde la computadora a /api/v1/tasks,
con el filtro search=Matias_Duarte_Telescope_20261124. No modifiqué tareas.
Revisé en el panel el registro con estos datos:

- ID de solicitud: 31 (no es el ID de una tarea).
- Fecha del registro: 2026-11-24T10:14:48.97737199Z.
- Método y ruta: GET /api/v1/tasks.
- Estado: 200.
- Duración: 1110 ms.

Esta observación confirma el registro de esa consulta desde la computadora.
Documenté las operaciones posteriores desde la APK por separado arriba.

## Verificación de configuración y dependencias

- TypeScript sin errores.
- Expo Doctor: 21/21 controles aprobados tras alinear tres parches de SDK 57.
- expo-constants ~57.0.25, expo-dev-client ~57.0.22 y expo-router ~57.0.32.
- npm informó 6 vulnerabilidades (3 moderadas y 3 altas); no apliqué audit fix --force ni di por resuelta la auditoría de seguridad.
- Confirmados nombres y paquetes separados con expo config.
- Al alternar ramas con dependencias distintas, ejecutar npm ci para restaurar el lock de la rama elegida.
