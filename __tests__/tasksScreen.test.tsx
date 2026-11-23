import { act, fireEvent, render } from '@testing-library/react-native';
import TaskManagerScreen from '../app/tasks';
import { ApiError, tasksService } from '../src/services/taskService';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.requireActual('react-native').View,
}));
jest.mock('../src/services/taskService', () => ({
  ...jest.requireActual('../src/services/taskService'),
  tasksService: {
    list: jest.fn(), create: jest.fn(), setCompleted: jest.fn(), remove: jest.fn(),
  },
}));

const list = tasksService.list as jest.Mock;
const create = tasksService.create as jest.Mock;
const setCompleted = tasksService.setCompleted as jest.Mock;
const remove = tasksService.remove as jest.Mock;
const task = {
  id: 1, title: 'Matías - tarea de prueba', description: 'Descripción',
  createdAt: '2026-11-23T12:00:00Z', completed: false,
};

async function debounce() {
  await act(async () => { await jest.advanceTimersByTimeAsync(300); });
}

beforeEach(() => {
  jest.useFakeTimers();
  list.mockReset().mockResolvedValue([]);
  create.mockReset();
  setCompleted.mockReset();
  remove.mockReset();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('pantalla de tareas compartidas', () => {
  it('no permite que una respuesta vieja reemplace la búsqueda vigente', async () => {
    let resolveFirst!: (tasks: typeof task[]) => void;
    list.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce([{ ...task, id: 2, title: 'Resultado vigente' }]);
    const view = render(<TaskManagerScreen />);
    await debounce();
    fireEvent.changeText(view.getByTestId('search-input'), 'vigente');
    await debounce();
    expect(view.getByText('Resultado vigente')).toBeTruthy();
    await act(async () => { resolveFirst([task]); });
    expect(view.queryByText(task.title)).toBeNull();
    expect(view.getByText('Resultado vigente')).toBeTruthy();
    expect(list.mock.calls[1][0]).toEqual({ search: 'vigente', status: 'todas' });
  }, 15000);

  it('conserva las tarjetas si falla una recarga', async () => {
    list.mockResolvedValueOnce([task]).mockRejectedValueOnce(new ApiError(500, 'Servidor no disponible'));
    const view = render(<TaskManagerScreen />);
    await debounce();
    await act(async () => { fireEvent.press(view.getByText('Recargar datos')); });
    expect(view.getByText(task.title)).toBeTruthy();
    expect(view.getByText('Servidor no disponible')).toBeTruthy();
    expect(view.getByText('Reintentar')).toBeTruthy();
  });

  it('evita dos altas inmediatas y solo limpia el formulario al tener éxito', async () => {
    let resolveCreate!: (value: typeof task) => void;
    create.mockImplementation(() => new Promise((resolve) => { resolveCreate = resolve; }));
    const view = render(<TaskManagerScreen />);
    await debounce();
    fireEvent.changeText(view.getByTestId('new-task-input'), 'Nueva prueba');
    await act(async () => {
      fireEvent.press(view.getByTestId('add-task-button'));
      fireEvent.press(view.getByTestId('add-task-button'));
    });
    expect(create).toHaveBeenCalledTimes(1);
    expect(view.getByTestId('new-task-input').props.value).toBe('Nueva prueba');
    await act(async () => { resolveCreate(task); });
    expect(view.getByTestId('new-task-input').props.value).toBe('');
  });

  it('conserva el título si falla el alta y no reintenta el POST automáticamente', async () => {
    create.mockRejectedValue(new ApiError(0, 'Sin conexión'));
    const view = render(<TaskManagerScreen />);
    await debounce();
    fireEvent.changeText(view.getByTestId('new-task-input'), 'Conservar texto');
    await act(async () => { fireEvent.press(view.getByTestId('add-task-button')); });
    expect(view.getByTestId('new-task-input').props.value).toBe('Conservar texto');
    expect(create).toHaveBeenCalledTimes(1);
    expect(view.getByText(/Consultá el listado antes de repetir/)).toBeTruthy();
  });

  it('bloquea cambios repetidos en la misma tarea durante el PATCH', async () => {
    list.mockResolvedValue([task]);
    let resolveUpdate!: (value: typeof task) => void;
    setCompleted.mockImplementation(() => new Promise((resolve) => { resolveUpdate = resolve; }));
    const view = render(<TaskManagerScreen />);
    await debounce();
    await act(async () => {
      fireEvent.press(view.getByTestId('toggle-1'));
      fireEvent.press(view.getByTestId('toggle-1'));
    });
    expect(setCompleted).toHaveBeenCalledTimes(1);
    expect(setCompleted).toHaveBeenCalledWith(1, true);
    await act(async () => { resolveUpdate({ ...task, completed: true }); });
  });
});
