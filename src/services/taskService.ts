import type { Task } from '../types/task';

const INITIAL_TASKS: Task[] = [
  { id: 't01', title: 'Validar login', description: 'Comprobar campos vacíos y credenciales incorrectas.', priority: 'alta', completed: false },
  { id: 't02', title: 'Corregir navegación', description: 'Validar el regreso desde el detalle.', priority: 'media', completed: true },
  { id: 't03', title: 'Probar API lenta', description: 'Simular una demora y verificar los indicadores de carga.', priority: 'alta', completed: false },
  { id: 't04', title: 'Generar reporte', description: 'Documentar los fallos detectados y su corrección.', priority: 'baja', completed: false },
  { id: 't05', title: 'Revisar validaciones', description: 'Asegurar el tratamiento de espacios y datos vacíos.', priority: 'media', completed: true },
];

// Servicio mock: 700 ms de latencia, no requiere conexión ni servidor backend.
export async function fetchTasks(simulateFailure = false): Promise<Task[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 700));
  if (simulateFailure) {
    throw new Error('HTTP 503: servidor temporalmente indisponible (simulado)');
  }
  return INITIAL_TASKS.map((task) => ({ ...task }));
}
