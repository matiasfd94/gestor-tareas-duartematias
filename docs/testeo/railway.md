# Despliegue y pruebas en Railway

Fecha: 18/11/2026

## Configuración realizada

- Se publicó el backend Laravel desde la rama develop.
- Se creó una base de datos MySQL en Railway.
- Se configuraron las variables de entorno del backend.
- Se ejecutaron las migraciones para crear las tablas.
- Se configuró el puerto 8080 y el dominio HTTPS.
- Se creó la cuenta matias1 en la base del servidor.
- Se configuró el frontend para consultar la API remota.

## Dirección del backend

https://backend-gestor-tareas-duartematias-production.up.railway.app

La API utiliza esa dirección seguida de /api.

## Problemas encontrados y solución

- Las migraciones se habían colocado como comando de inicio.
  Se trasladaron al paso previo al despliegue y se restauró
  el inicio automático del servidor.
- El dominio no recibía respuesta de la aplicación.
  Se configuró PORT=8080 para coincidir con el puerto del dominio.

## Pruebas manuales

Las pruebas se realizaron desde Expo Go, con Laravel local apagado.

- Inicio de sesión con la cuenta creada en Railway: aprobado.
- Creación de una tarea y persistencia después de recargar: aprobado.
- Cambio de estado y persistencia después de recargar: aprobado.
- Edición de título, descripción y prioridad: aprobado.
- Conservación de los cambios después de recargar: aprobado.
- Eliminación y ausencia de la tarea después de recargar: aprobado.

## Evidencias y pendientes

- Las pruebas se registran por observación manual.
- No se tomaron capturas de esta verificación.
- Queda pendiente generar, instalar y probar la APK preview.
- Se tomarán capturas durante las pruebas de la APK.

## Accesos

Las claves y contraseñas se administran fuera de este documento.
No se incluyen contraseñas ni tokens en el repositorio.

## Alojamiento

Se utiliza el crédito de prueba de Railway.
La disponibilidad depende del saldo y las condiciones del servicio.