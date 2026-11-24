# Arquitectura - variante pública del profesor

Esta explicación corresponde a integracion-api-profesor.
La versión con Laravel propio, autenticación y campos ampliados está en develop/main.

## Recorrido

Pantalla tasks -> tasksService -> API pública -> JSON -> estado React -> TaskCard.

No hay paso de login, SecureStore ni identidad individual.
Las rutas antiguas de login y perfil redirigen al gestor en esta rama.
Los archivos históricos de autenticación se conservan para referencia,
pero no se utilizan en las solicitudes de tareas.

## Contrato

Task contiene id numérico, title, description, createdAt y completed.
El listado es un array directo. La consulta individual, el alta y PATCH devuelven una tarea.
DELETE responde 204 sin cuerpo.

GET /tasks admite search y status=all|pending|completed.
El servicio traduce todas|pendientes|completadas a los valores del servidor.
POST solo envía title y description.
PATCH solo envía completed.
No se crean cookies, encabezados Authorization ni conexiones a la base desde la app.

## Pantalla

Conservé el diseño oscuro y el ícono del proyecto.
Ajusté los textos del encabezado y del formulario. La API mantiene el listado compartido.
Los contadores representan los resultados cargados y filtrados, no el total global.

La búsqueda espera 275 ms. Cambiar filtros cancela la consulta anterior
y cambia un número de secuencia; una respuesta vieja no reemplaza la más reciente.
Durante una recarga se conservan los datos anteriores.

El alta usa un bloqueo inmediato en ref y el estado saving.
Los cambios y borrados usan un conjunto de IDs pendientes y controles busy.
Solo después de confirmar la operación se actualiza y recarga el listado.
No se reintenta POST automáticamente ante una falla de red.
Se conserva el texto si falla el envío.

## Errores

ApiError contiene status y message.
El servicio valida la forma del JSON, interpreta errores JSON/HTML y soporta 204 vacío.
La espera tiene un límite de 20 segundos.
Una cancelación intencional no se presenta como fallo.
Un 404 de una tarea provoca una recarga.
401/403 indican una restricción inesperada para este contrato público;
no se intenta resolverla enviando claves administrativas.

## Distribución y conservación de la app original

app.config.js asigna package, nombre y scheme propios a esta rama.
eas.json incluye preview-profesor y development-profesor.
La URL usa EXPO_PUBLIC_PROFESOR_API_URL, separada del .env original de Railway.
La APK de producción anterior y su backend siguen siendo independientes.
