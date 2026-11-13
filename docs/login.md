# Login: interfaz inicial

Fecha: 13/11/2026.

## Cambios

- Se adaptaron los colores y la presentación del primer parcial.
- Se agregó app/login.tsx con campos de correo y contraseña.
- Se incorporó la opción de mostrar u ocultar la contraseña.
- El tablero se movió de app/index.tsx a app/tasks.tsx.
- La ruta inicial ahora redirige al login.
- Se agregó un acceso provisional al gestor, visible solo en desarrollo.

## Estado actual

La autenticación todavía no está implementada. El botón Iniciar sesión está deshabilitado y no se envían credenciales a ningún servicio.

El acceso provisional usa router.push para permitir volver al login durante las pruebas. No representa una sesión autenticada ni un control de acceso.

## Verificación

- TypeScript: sin errores.
- Suite existente de Jest: 9 pruebas aprobadas.
- Pruebas automáticas específicas del login: pendientes.
- Evidencia visual: testeo/evidencias/login-interfaz-inicial.jpeg.

## Pendientes

- Integrar el backend de Programación 3.
- Implementar autenticación, sesión y cierre de sesión.
- Proteger las rutas que requieran autenticación.
- Retirar el acceso provisional antes de la entrega.
- Probar el login y la navegación en la APK de preview.