import { filterTasks } from '../src/utils/taskFilters';
import type { Task } from '../src/types/task';

const demo: Task[] = [
  { id: '1', title: 'Validar login', description: '', priority: 'alta', completed: false },
  { id: '2', title: 'Corregir navegación', description: '', priority: 'media', completed: true },
  { id: '3', title: 'Revisar validaciones', description: '', priority: 'baja', completed: false },
];

describe('filterTasks', () => {
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
