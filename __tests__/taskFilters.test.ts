import { filterTasks } from '../src/utils/taskFilters';
import type { Task } from '../src/types/task';

// Conserva los casos del taller como regresión de la utilidad.
// La pantalla de esta rama consulta los filtros al servidor.
const demo: Task[] = [
  { id: 1, title: 'Validar login', description: '', createdAt: '2026-11-23T12:00:00Z', completed: false },
  { id: 2, title: 'Corregir navegación', description: '', createdAt: '2026-11-23T12:00:00Z', completed: true },
  { id: 3, title: 'Revisar validaciones', description: '', createdAt: '2026-11-23T12:00:00Z', completed: false },
];

describe('filterTasks (utilidad histórica)', () => {
  it('busca sin distinguir entre minúsculas y mayúsculas', () => {
    expect(filterTasks(demo, 'VALIDAR', 'todas')).toHaveLength(1);
  });
  it('ignora espacios antes y después de la búsqueda', () => {
    expect(filterTasks(demo, '  login  ', 'todas')).toHaveLength(1);
  });
  it('filtra pendientes', () => {
    expect(filterTasks(demo, '', 'pendientes')).toHaveLength(2);
  });
  it('filtra completadas', () => {
    expect(filterTasks(demo, '', 'completadas')).toHaveLength(1);
  });
});
