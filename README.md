# Gestor compartido - API del profesor

Rama: integracion-api-profesor.

Esta rama adapta el frontend existente a la API pública de la guía de EDI.
La versión original con login, Perfil y Railway se conserva en develop y main.
Los documentos históricos de esas ramas no describen necesariamente esta variante.

## Funciones de esta variante

- Entrar directamente al gestor, sin login ni Perfil.
- Consultar tareas compartidas, buscar por título/descripción y filtrar por estado.
- Crear tareas con título y descripción.
- Completar o volver a pendiente.
- Expandir el detalle y ver la fecha de creación.
- Eliminar definitivamente con confirmación.

No se envían prioridad, categoría, notas, vencimiento ni tokens.
La API no permite editar el título o la descripción después de crear.
Todos ven el mismo listado: usar y eliminar únicamente tareas propias de prueba.

## Estado de verificación

- Código adaptado y comprobado con TypeScript, Jest y exportación del bundle Android.
- La prueba completa desde el celular y la nueva APK están pendientes.
- El 23/11/2026, /health y /api/v1/tasks respondieron 401 de nginx,
  con autenticación Basic del laboratorio, a solicitudes públicas.
- No se incluyeron las claves de Telescope en el código ni se usaron para las tareas.
  Es necesario que el servidor permita la API pública indicada por la guía.
- Las pruebas con respuestas simuladas no demuestran disponibilidad del servidor.

## Dirección de la API y configuración

Base:
https://backend-proyecto.n7softwares.com/api/v1

Salud:
https://backend-proyecto.n7softwares.com/health

En esta rama se usa EXPO_PUBLIC_PROFESOR_API_URL para no modificar
el .env ignorado que la versión original utiliza para Railway.
Si no se define, se usa la dirección pública anterior.

.env.example documenta la variable.
No copiar contraseñas, tokens privados ni credenciales de Telescope al frontend.
No modificar el .env original para alternar entre ramas.

## Instalar y trabajar

En una copia del repositorio:

    git switch integracion-api-profesor
    npm ci

En PowerShell:

    $env:APP_VARIANT="profesor-development"
    npx expo start --dev-client --lan --clear

No se necesita Laravel local, XAMPP ni conexión directa a la base.
El backend es el proporcionado por el profesor.

Un QR de esta variante usa su scheme propio. Para tener un Development
instalable con ese identificador, generar e instalar su APK dedicada.
Un cliente de desarrollo anterior puede probar el bundle si es nativamente
compatible y se conecta manualmente a la URL de Metro; no se garantiza
que el QR de la nueva variante lo abra.

## Compilar las APK separadas

Preview:

    npx --yes eas-cli@latest build --platform android --profile preview-profesor

Development:

    npx --yes eas-cli@latest build --platform android --profile development-profesor

Preview:
- Nombre: Matías Tareas Profe.
- Android: com.matiasfd94.gestortareas.profesor.

Development:
- Nombre: Matías Tareas Profe DEV.
- Android: com.matiasfd94.gestortareas.profesor.dev.

Estos identificadores no sustituyen las APK originales de Railway.
No se generó todavía una APK de esta rama.

## Verificaciones

    npm run typecheck
    npm test -- --silent
    npx --yes expo-doctor

## Archivos para explicar

- app/index.tsx: entrada directa al gestor.
- app/tasks.tsx: interfaz, filtros remotos, carga, alta y acciones.
- src/services/taskService.ts: contrato HTTP público y errores.
- src/services/config.ts: dirección de esta API.
- src/types/task.ts: id numérico, título, descripción, createdAt y completed.
- src/utils/taskValidation.ts: límite UTF-8, sin depender de TextEncoder nativo.
- src/components/TaskCard.tsx: detalle y controles bloqueados durante operaciones.
- app.config.js y eas.json: identidad y compilación de la variante.
- __tests__/: contrato del servicio, utilidades, tarjetas y pantalla.

## Volver a la versión original

Primero guardar cualquier cambio de esta rama. Detener Metro y ejecutar:

    git switch develop

Luego iniciar Development como estaba configurada en esa rama.
No hace falta reinstalar la Preview original: permanece instalada.

## Documentación específica

- [Integración de la API del profesor](docs/testeo/api-profesor.md)
- [Arquitectura de esta variante](docs/arquitectura.md)
- [Pruebas automáticas](docs/testeo/evidencias/api-profesor-tests.json)

Los informes originales de incidencias se conservan como historia del trabajo.
