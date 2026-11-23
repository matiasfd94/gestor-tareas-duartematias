# Gestor de tareas · Matías

Proyecto de Matías Duarte para la materia EDI.

Tomé como base el gestor que entregó el profesor. Instalé las
dependencias, corregí los errores del taller y documenté las pruebas.
Después adapté el login y el perfil del primer parcial y conecté
la aplicación con un backend propio en Laravel.

## Objetivo

Organizar tareas personales. Cada usuario inicia sesión y puede
administrar solamente sus propias tareas.

## Funcionalidades

- Iniciar y cerrar sesión.
- Consultar el nombre y correo del usuario desde Mi perfil.
- Crear, buscar y filtrar tareas.
- Editar título, descripción y prioridad.
- Agregar categoría, notas y fecha de vencimiento.
- Marcar tareas como pendientes o completadas.
- Eliminar tareas mediante borrado lógico.
- Detectar una sesión inválida y volver al login.
- Mostrar errores de conexión y permitir reintentar.

Laravel genera automáticamente el slug de cada tarea y registra
la fecha de finalización cuando se marca como completada.

## Herramientas utilizadas

- React Native y Expo SDK 57.
- TypeScript y Expo Router.
- SecureStore para guardar el token de sesión.
- Laravel y Sanctum para la API y autenticación.
- MySQL como base de datos.
- Railway para alojar el backend.
- EAS Build para generar las APK.
- Jest para las pruebas del frontend.

## Estado actual

El login y el ABM están conectados con Laravel en Railway.

Se generaron e instalaron una primera APK Preview y una APK
Development. El trabajo diario continúa con Development.

La Preview actualizada se instaló y se verificó su recorrido completo en el celular, con Metro y Laravel local apagados.

## Instalación del frontend

Requisitos: Git, Node.js y npm.
En el proyecto se usaron Node 22.22.3 y npm 10.9.8.

Los avances están en la rama develop.

```powershell
git clone --branch develop https://github.com/matiasfd94/gestor-tareas-duartematias.git
cd gestor-tareas-duartematias
npm ci
```

## Configuración

Si todavía no existe un archivo .env, copiar el ejemplo:

```powershell
Copy-Item .env.example .env
```

Configurar la dirección del backend:

```dotenv
EXPO_PUBLIC_API_URL=https://backend-gestor-tareas-duartematias-production.up.railway.app/api
```

Esta variable contiene una dirección pública, no una contraseña.
No se deben guardar tokens ni contraseñas en ella.
El archivo .env no se sube a GitHub.

El backend alojado tiene su propia base de datos y sus propias
cuentas. Los usuarios locales no se copian automáticamente.

## Trabajar con Development

Instalar primero la APK Development del proyecto.
No se utiliza Expo Go para el flujo actual de trabajo.

Desde PowerShell, en la carpeta del frontend:

```powershell
$env:APP_VARIANT="development"
npx expo start --dev-client --lan --clear
```

Abrir Gestor Duarte DEV en el celular y conectarse al servidor
de Metro. El celular y la computadora deben poder comunicarse
por la red.

Si la red bloquea la conexión local, se puede intentar:

```powershell
npx expo start --dev-client --tunnel --clear
```

No hace falta iniciar Laravel ni XAMPP para usar el backend
alojado en Railway.

Los cambios de pantallas y estilos se prueban con Metro.
Los cambios nativos pueden requerir reconstruir la APK Development.

## Usar Preview

La APK Preview se instala como una aplicación propia de Android.

No necesita Expo Go, Metro ni la computadora encendida.
Sí necesita internet para consultar el backend en Railway.

Los datos de acceso se solicitan al responsable del proyecto.
No se publican contraseñas ni tokens en este documento.

## Generar las APK

Los perfiles están definidos en eas.json.
La variante Development tiene un identificador Android distinto
para poder instalarla junto a Preview.

### Preview

En PowerShell, quitar la selección local de Development:

```powershell
Remove-Item Env:APP_VARIANT -ErrorAction SilentlyContinue
npx --yes eas-cli@latest build --platform android --profile preview
```

### Development

```powershell
npx --yes eas-cli@latest build --platform android --profile development
```

EAS necesita una cuenta de Expo y acceso al proyecto.
La dirección de la API está configurada en los perfiles de eas.json.

## Backend local como alternativa de desarrollo

El backend se encuentra en un repositorio separado.
Para usarlo localmente se necesita PHP, Composer, la base MySQL
configurada, las migraciones aplicadas y una cuenta creada.

Desde la carpeta del backend:

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

Para probar esa alternativa desde Development, configurar .env
con la IPv4 actual de la computadora:

```dotenv
EXPO_PUBLIC_API_URL=http://IP_DE_TU_COMPUTADORA:8000/api
```

Consultar la IP con ipconfig y reiniciar Metro después del cambio.
Desde el celular, localhost apunta al teléfono, no a la computadora.
La red y el firewall deben permitir la comunicación.

La Preview está configurada para usar Railway por HTTPS.

## Pruebas y revisión

```powershell
npm run typecheck
npm test
npx --yes expo-doctor
npx expo install --check
```

Las nueve pruebas existentes del frontend comprueban filtros,
validaciones y el componente de tarjeta.

Las operaciones completas también se prueban manualmente
en el celular y se documentan por separado.

Expo Doctor verifica compatibilidad y configuración.
Su aprobación no significa que npm audit esté libre de hallazgos.
La auditoría inicial y sus pendientes están documentados.

## Estructura principal

- app/: pantallas y rutas.
- src/components/: tarjetas y filtros de estado.
- src/services/: conexión con la API y almacenamiento del token.
- src/types/: tipos de datos.
- src/utils/: filtros y validaciones.
- __tests__/: pruebas del frontend.
- assets/: recursos gráficos, incluido el ícono.
- docs/: documentación y evidencias.

## Documentación

- [Arquitectura y funcionamiento](docs/arquitectura.md)
- [Login](docs/login.md)
- [Informe de incidencias](INFORME_INCIDENTES.md)
- [Integración de tareas](docs/testeo/integracion-tareas.md)
- [Sesiones y acceso](docs/testeo/sesion.md)
- [Railway](docs/testeo/railway.md)
- [APK Preview y Development](docs/testeo/apk.md)
- [Perfil](docs/testeo/perfil.md)
- [Categoría, notas y vencimiento](docs/testeo/detalles-tareas.md)
- [Auditoría inicial](docs/testeo/auditoria.md)
- [Capturas y resultados](docs/testeo/evidencias)

## Alojamiento

El backend utiliza el crédito de prueba de Railway.
Su disponibilidad depende del saldo y las condiciones del servicio.