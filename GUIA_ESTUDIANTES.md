# Guía de laboratorio para estudiantes

## Objetivo general
Aplicar técnicas de debugging y testing a una aplicación existente, sin rehacerla desde cero.

## Primera exploración (10 minutos)
- Observar el tablero, el contador, los filtros, las tarjetas y los botones de servicio.
- Anotar qué debería ocurrir y qué ocurre realmente.
- Ejecutar `npm test` para obtener una primera línea base.

## Misiones técnicas
1. Investigar qué sucede con las búsquedas y cuándo la lista se actualiza.
2. Probar búsquedas con mayúsculas y espacios.
3. Marcar una tarea como completada y verificar si la interfaz responde.
4. Ejecutar el botón «Simular error API» y examinar el estado de carga.
5. Intentar agregar una tarea que solo contiene espacios.
6. Expandir el detalle de una tarjeta y cambiar el filtro. Verificar qué tarjeta permanece expandida.

## Evidencia mínima
- 4 incidencias documentadas con pasos reproducibles, archivo, causa y solución.
- Evidencia de un breakpoint, log contextualizado o inspector.
- Pruebas antes/después y commit de cierre.

## Pautas de evaluación
Diagnóstico (30), corrección técnica (30), pruebas (20), documentación (15) y explicación oral (5) = **100 puntos**.

## Preguntas para la defensa
- ¿Qué síntoma te hizo sospechar del error?
- ¿Cuál fue la diferencia entre síntoma y causa raíz?
- ¿Por qué elegiste esa corrección y no otra?
- ¿Qué prueba indica que el problema no volvió a ocurrir?
- ¿Qué técnica vas a incorporar a tu proyecto individual?
