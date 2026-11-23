# Pantalla de perfil

Fecha: 19/11/2026

## Qué se hizo

Se reutilizó el diseño oscuro y verde del primer parcial.
Se adaptó para consultar el usuario autenticado en Laravel.

Se muestran el nombre y correo reales.
Se quitó el campo Rol porque nuestro backend no lo tiene.

## Archivos principales

- app/profile.tsx: pantalla, consulta del usuario y cierre de sesión.
- app/tasks.tsx: botón para abrir Mi perfil.
- src/services/authService.ts: consulta y cierre de sesión,
  reutilizando las funciones existentes.

## Prueba manual en Development

- Se abrió Mi perfil y aparecieron el nombre y correo correctos.
- La flecha permitió volver al gestor y cargar las tareas.
- Se volvió al perfil y se cerró sesión.
- La aplicación regresó al login.
- Atrás no permitió volver a los datos sin iniciar sesión.
- Resultado: aprobado.

## Evidencia

evidencias/perfil-usuario-development.jpeg

## Verificación del código

npm run typecheck: sin errores.