# Gestor de tareas

Proyecto de Matías Duarte para la materia EDI.

Tomé como base el gestor que entregó el profesor. Primero lo instalé y lo probé en el celular. Después corregí los errores del taller, documenté las pruebas y adapté el login del primer parcial.

## Objetivo

La aplicación permitirá iniciar sesión y gestionar tareas personales: crearlas, cambiar su estado, editarlas y eliminarlas.

## Qué funciona hasta ahora

- El login del celular se conecta con Laravel.
- Se muestra un aviso si faltan datos o la contraseña es incorrecta.
- El token se guarda con SecureStore.
- Se corrigieron seis errores del taller.
- Las nueve pruebas actuales del frontend pasan.

El tablero todavía usa tareas simuladas. Falta conectarlo al backend y generar la APK de preview.

## Herramientas utilizadas

- React Native y Expo SDK 57.
- TypeScript y Expo Router.
- SecureStore para guardar el token de sesión.
- Laravel como backend.
- Jest para las pruebas.

## Qué necesito para ejecutarlo

- Node.js y npm. Usé Node 22.22.3 y npm 10.9.8.
- Git.
- Expo Go compatible con SDK 57 en el celular.
- El celular y la computadora conectados a la misma red Wi-Fi.
- El backend Laravel funcionando para probar el login.

## Instalación del frontend

Los avances están en la rama develop.

```powershell
git clone --branch develop https://github.com/matiasfd94/gestor-tareas-duartematias.git
cd gestor-tareas-duartematias
npm ci
```

## Configuración

Copiar el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

En .env, reemplazar IP_DE_TU_COMPUTADORA por la IPv4 de la computadora que ejecuta Laravel:

```dotenv
EXPO_PUBLIC_API_URL=http://IP_DE_TU_COMPUTADORA:8000/api
```

La IP se puede consultar con ipconfig. Desde el celular no se debe usar localhost, porque apunta al propio teléfono.

Esta variable contiene solamente la dirección de la API. No se deben guardar contraseñas ni tokens en ella. El archivo .env no se sube a GitHub.

## Cómo levantarlo en local

En la terminal del backend, con su base de datos y usuario de prueba preparados:

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

En la terminal del frontend:

```powershell
npx expo start --go --lan --clear
```

Abrir Expo Go en el celular y escanear el QR. Mantener ambos servidores abiertos.

Los datos de acceso de prueba se solicitan al responsable del proyecto; no se publican en este README.

## Pruebas

```powershell
npm run typecheck
npm test
```

Para revisar la compatibilidad de las dependencias:

```powershell
npx expo-doctor
npx expo install --check
```

## Documentación

- [Login](docs/login.md)
- [Incidencias corregidas](INFORME_INCIDENTES.md)
- [Auditoría inicial](docs/testeo/auditoria.md)
- [Capturas y resultados de pruebas](docs/testeo/evidencias)
- [Organización, arquitectura y rutas](docs/arquitectura.md)

## APK de preview

El perfil preview está configurado en eas.json para generar una APK de Android. Todavía falta compilarla, instalarla y probarla.