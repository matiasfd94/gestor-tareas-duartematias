# Auditoría inicial de dependencias

- **Estudiante:** Matías Fabian Duarte.
- **Fecha:** 13/11/2026.
- **Proyecto:** gestor-tareas-duartematias.
- **Rama:** develop.
- **Alcance:** compatibilidad de dependencias y avisos de seguridad de npm. La revisión completa de código y seguridad queda pendiente.

## Diagnóstico inicial

Expo Doctor aprobó 20 de 21 controles. Detectó cuatro paquetes con parches pendientes: expo, expo-constants, expo-linking y expo-router.

npm audit reportó 15 vulnerabilidades: 9 bajas, 3 moderadas y 3 altas. Estos resultados requieren analizar las dependencias afectadas y su uso en el proyecto.

## Corrección aplicada

Se actualizaron los cuatro paquetes a los parches recomendados dentro de SDK 57.

No se utilizó npm audit fix --force, porque proponía cambios mayores en Router y retrocesos en herramientas de pruebas que requieren una evaluación de compatibilidad.

## Verificación posterior

- Expo Doctor: 21 de 21 controles aprobados.
- Compatibilidad: dependencias actualizadas para el SDK instalado.
- Jest: 9 pruebas aprobadas y ninguna fallida.
- npm siguió reportando 15 vulnerabilidades durante la instalación.
- La ejecución en el celular después de la actualización queda pendiente.

## Evidencias

Archivos en docs/testeo/evidencias/:

- auditoria-expo-doctor.txt
- auditoria-compatibilidad.txt
- auditoria-dependencias.txt
- auditoria-plan-correcciones.json
- auditoria-expo-doctor-despues.txt
- auditoria-compatibilidad-despues.txt
- auditoria-tests-despues.txt

El archivo de simulación contiene advertencias y texto además de JSON; se conserva como salida original del comando.

## Pendientes

- Investigar las vulnerabilidades y posibles correcciones compatibles.
- Determinar cuáles afectan al desarrollo y cuáles podrían afectar a la app distribuida.
- Revisar código, logs, permisos y manejo de sesión cuando se incorpore el login.
- Probar el gestor en el celular después de actualizar.

## Conclusión

Se resolvió el desajuste de compatibilidad y las pruebas existentes siguen pasando. La revisión de seguridad permanece abierta: estos resultados no certifican que la aplicación esté libre de vulnerabilidades.