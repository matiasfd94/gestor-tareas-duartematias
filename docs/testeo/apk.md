# APK Preview y Development

Actualizado: 20/11/2026

## Preview final

Se generó con EAS usando el perfil preview y se instaló
como actualización de la primera Preview.

Nombre: Gestor de tareas · Matías.

Incluye:
- Login y manejo de sesión.
- Gestor con diseño oscuro.
- Perfil con nombre y correo.
- Creación, edición, cambio de estado y borrado lógico.
- Categoría, notas y fecha de vencimiento.
- Ícono propio.

Compilación:
https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/184b3bb3-722f-4847-98b4-7350b0c371ae

Funciona sin Expo Go, Metro ni Laravel local.
Necesita internet para consultar el backend de Railway.

## Prueba final en el celular

Se comprobó el siguiente recorrido con los servidores
locales apagados:

- Iniciar sesión.
- Crear una tarea con categoría, notas y vencimiento.
- Recargar y comprobar la conservación de los datos.
- Editar la tarea.
- Marcarla como completada y comprobar la persistencia.
- Eliminarla y comprobar que no vuelva al recargar.
- Abrir Mi perfil.
- Cerrar sesión y volver a ingresar.

Resultado: recorrido completo aprobado manualmente.

## Development

Se instaló expo-dev-client y se generó una APK con
el perfil development, siguiendo la guía del profesor.

Tiene un identificador Android diferente para poder
instalarla junto a Preview.

La APK instalada se llama Gestor Duarte DEV.
El nombre Matías Gestión DEV está configurado para
una próxima compilación.

Compilación:
https://expo.dev/accounts/matiasfd94/projects/gestor-tareas-duartematias/builds/1b324284-c360-4891-9250-a67f07be4967

Development se utiliza para programar y probar cambios
mediante Metro. No se utiliza Expo Go en el flujo actual.

## Cómo iniciar Development

Desde PowerShell, dentro del frontend:

```powershell
$env:APP_VARIANT="development"
npx expo start --dev-client --lan --clear
```

Abrir Gestor Duarte DEV y conectarse al servidor.
El celular y la computadora deben poder comunicarse por la red.

No hace falta iniciar Laravel local porque se usa Railway.

## Cómo generar Preview

```powershell
Remove-Item Env:APP_VARIANT -ErrorAction SilentlyContinue
npx --yes eas-cli@latest build --platform android --profile preview
```

## Cómo generar Development

```powershell
npx --yes eas-cli@latest build --platform android --profile development
```

## Archivos principales

- app.json: nombre, ícono y configuración general.
- app.config.js: configuración de cada variante.
- eas.json: perfiles de compilación y dirección de la API.
- assets/gestor-icon.png: ícono de la aplicación.
- package.json y package-lock.json: dependencias.

## Verificaciones

- TypeScript: sin errores.
- Expo Doctor: 21 controles aprobados.
- Jest: 9 pruebas existentes aprobadas.
- Development: instalación y conexión con Metro verificadas.
- Preview final: instalación y recorrido completo verificados.

