# Gestor compartido - API del profesor

Rama: integracion-api-profesor.

En esta rama adapté el frontend existente a la API pública de la guía de EDI.
Conservé la versión original con login, Perfil y Railway en develop y main.
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

- Adapté y comprobé el código con TypeScript, Jest y la exportación Android.
- Instalé la Preview en el celular y probé creación, cambio de estado,
  persistencia al recargar, búsqueda, filtros y eliminación.
- Revisé las solicitudes en Telescope: POST 201, PATCH 200, GET 200 y DELETE 204.
- El 23/11/2026 detecté inicialmente un 401 de nginx. El profesor corrigió
  el acceso y ejecuté 11 comprobaciones con el servicio real de la app:
  listado, alta, detalle, búsqueda, filtros, cambio de estado y eliminación.
- Evidencia: docs/testeo/evidencias/api-profesor-prueba-real.json.
- No incluí las claves de Telescope en el código ni las usé para las tareas.
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
- Nombre: Matías Tareas.
- Android: com.matiasfd94.gestortareas.profesor.

Development:
- Nombre: Matías Tareas DEV.
- Android: com.matiasfd94.gestortareas.profesor.dev.

Estos identificadores no sustituyen las APK originales de Railway.
Generé e instalé la Preview final en el celular el 24/11/2026.
Incluye los ajustes de textos del commit 224eff7; revisé los textos y la carga.

[Descargar Preview final de Matías Tareas](https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/5333787c-0e01-4f0a-b365-6294c0efceae).

Para usar esta Preview instalada solo se necesita internet; no hace falta Metro,
Expo Go, Laravel local ni XAMPP.
Todavía no compilé la variante Development dedicada de esta rama.

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

Conservé los informes originales de incidencias como historia del trabajo.
