# APK Preview y Development

Fecha: 19/11/2026

## Preview

Se generó con EAS usando el perfil preview.
Se instaló en el celular y se comprobó el inicio de sesión
con la cuenta de Railway.

Funciona sin Expo Go ni Metro.
Necesita internet para consultar el backend en Railway.

Compilación:
https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/5362bb94-462a-41a1-9cd1-f9c7c82eee0c

Estado: instalación y login verificados.
El recorrido completo se probará en la Preview final.

## Development

Se instaló expo-dev-client y se generó la APK usando
el perfil development, siguiendo la guía del profesor.

Tiene un identificador Android diferente para poder
instalarla junto a Preview.

Se instaló como Gestor Duarte DEV y se comprobó
la conexión con Metro y el ingreso al gestor.

Compilación:
https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/1b324284-c360-4891-9250-a67f07be4967

El nombre Matías Gestión DEV quedó configurado
para una próxima compilación.

## Cómo iniciar Development

Desde PowerShell, dentro del frontend:

    $env:APP_VARIANT="development"
    npx expo start --dev-client --lan --clear

Abrir Gestor Duarte DEV y conectarse a Metro.
El celular y la computadora deben poder comunicarse por la red.
No hace falta iniciar Laravel local porque se utiliza Railway.

## Archivos principales

- app.config.js: nombre e identificador de cada variante.
- eas.json: perfiles y dirección de la API.
- package.json y package-lock.json: dependencia expo-dev-client.

## Verificaciones

- TypeScript: sin errores.
- Expo Doctor: 21 controles aprobados.
- Preview: instalación y login comprobados.
- Development: instalación y conexión con Metro comprobadas.

## Pendientes

- Ajustes finales de diseño e ícono.
- Generar la Preview final.
- Probar y documentar su recorrido completo.