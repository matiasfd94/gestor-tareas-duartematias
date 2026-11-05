# Gestor de tareas — Taller de debugging y testing (Expo SDK 57)

Proyecto **independiente** de React Native + Expo Router + TypeScript para 3.º año. Contiene defectos **intencionales** que permiten enseñar diagnóstico, debugging, pruebas y documentación. No necesita backend: el servicio de tareas es simulado.

## Requisitos
- Node.js **22.13 o superior** (mínimo para SDK 57; usar una versión LTS compatible).
- npm y VS Code.
- Emulador Android, Expo Go compatible, o una development build cuya configuración nativa sea compatible.

## Ejecutar
```bash
npm install
npx expo install --fix
npx expo start --dev-client
```
Abrí la development build instalada y conectala al servidor. Si usás Expo Go (con SDK 57 compatible), ejecutá `npx expo start --go`.

> **Muy importante:** una APK de desarrollo creada para otro proyecto no garantiza compatibilidad nativa con este proyecto. Si falta un módulo, la versión de SDK no coincide o la APK no puede abrirlo, generá una development build correspondiente. Las correcciones de JS/TS **no requieren reconstrucción** de una development build compatible.

## Ejecutar tests
```bash
npm test
```
El proyecto contiene pruebas que **deben fallar antes de corregir** algunos errores. Se diseñaron para mostrar cómo un test evidencia un fallo.

## Qué puede hacer la app
- Listar tareas con un servicio mock de 700 ms.
- Buscar tareas y filtrarlas por estado.
- Agregar y eliminar tareas.
- Cambiar el estado completada/pendiente.
- Expandir tarjetas para ver el detalle.
- Simular una caída de servicio (HTTP 503 ficticio).
- Abrir una pantalla con la consigna.

## Estructura
```text
app/                      # Rutas de Expo Router (_layout, inicio, guía)
src/components/           # TaskCard, StatusTabs
src/services/             # Servicio mock, sin llamadas reales
src/types/                # Tipos TypeScript
src/utils/                # Filtrado y validaciones
__tests__/                # Pruebas unitarias y de componentes
INFORME_INCIDENTES.md     # Plantilla a completar
```

## Trabajo del estudiante
1. Crear un commit de respaldo al iniciar.
2. Navegar la app y reproducir los comportamientos inesperados.
3. Corregir **al menos 4 errores** con cambios pequeños y justificados.
4. Usar DevTools/console y ejecutar `npm test` antes y después.
5. Completar `INFORME_INCIDENTES.md` y entregar un commit final.

**Evitar:** buscar soluciones completas o cambiar muchos archivos sin hipótesis de causa raíz.

## Compatibilidad
Diseñado para SDK 57 / React Native 0.86 / React 19.2.3. `npx expo install --fix` alinea las versiones con el SDK que realmente utiliza la app; no es una orden para actualizar de SDK mayor. No se incluye APK compilada ni `node_modules` en el ZIP.
