# Login conectado al backend

Fecha de actualización: 16/11/2026.

## Implementación

- app/login.tsx presenta el formulario y llama al servicio de autenticación.
- src/services/authService.ts envía las credenciales a POST /api/login y valida la respuesta.
- src/services/sessionStorage.ts guarda el token mediante SecureStore. No almacena la contraseña.
- src/services/config.ts obtiene la URL desde EXPO_PUBLIC_API_URL.
- .env.example documenta la configuración necesaria.
- Se agregó un botón con ojo para mostrar u ocultar la contraseña.
- Se retiró el acceso provisional al gestor.
- Después de un login correcto se navega a /tasks.

## Verificación

- Login correcto desde el celular: permite ingresar.
- Contraseña incorrecta: muestra un mensaje y permanece en el login.
- Campos vacíos: muestra un aviso.
- Mostrar y ocultar contraseña: funciona.
- TypeScript: sin errores.
- Suite existente: 9 pruebas aprobadas. No cubre automáticamente el login nuevo.

## Entorno local

Laravel se ejecutó en la computadora y el celular accedió mediante la misma red Wi-Fi. La app se probó con Expo Go compatible con SDK 57.

Las variables EXPO_PUBLIC_ son visibles en la aplicación. Solo se configura la URL; no deben contener secretos.

## Pendientes

- Proteger las rutas del gestor.
- Gestionar sesión vencida y cierre de sesión desde el celular.
- Conectar las tareas a la API; el tablero todavía utiliza datos simulados.
- Agregar pruebas específicas del login móvil.
- Publicar el backend y probar la APK de preview.