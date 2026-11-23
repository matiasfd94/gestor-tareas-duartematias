# Integración de la API pública del profesor

Fecha: 23/11/2026.
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

Se consultaron únicamente GET /health y GET /api/v1/tasks?status=all.
Ambas devolvieron 401 y WWW-Authenticate: Basic, realm del laboratorio.
Es una barrera de nginx anterior al contrato JSON descrito por la guía.
No se crearon, completaron ni eliminaron tareas del servidor durante esta revisión.
La prueba pública de extremo a extremo queda pendiente hasta que se permita el acceso.

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

## Prueba manual pendiente (usar solo una tarea propia de prueba)

1. Abrir el gestor y consultar.
2. Crear "Matías Duarte - prueba integración" con descripción.
3. Buscar por título y descripción, alternar filtros.
4. Completar y volver a pendiente.
5. Expandir y comprobar fecha/detalle.
6. Cancelar la confirmación de borrado y luego eliminar solo esa tarea.
7. Repetir en la Preview dedicada, con Metro apagado.
8. Registrar capturas y el enlace de la nueva compilación.

Estado: código preparado; verificación pública real y APK pendientes.

## Verificación de configuración y dependencias

- TypeScript sin errores.
- Expo Doctor: 21/21 controles aprobados tras alinear tres parches de SDK 57.
- expo-constants ~57.0.25, expo-dev-client ~57.0.22 y expo-router ~57.0.32.
- npm informó 6 vulnerabilidades (3 moderadas y 3 altas); no se aplicó audit fix --force ni se declara resuelta la auditoría de seguridad.
- Confirmados nombres y paquetes separados con expo config.
- Al alternar ramas con dependencias distintas, ejecutar npm ci para restaurar el lock de la rama elegida.
