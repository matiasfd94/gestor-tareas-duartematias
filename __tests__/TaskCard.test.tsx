import { fireEvent, render } from '@testing-library/react-native';
import { TaskCard } from '../src/components/TaskCard';

const task = {
  id: 1, title: 'Probar navegación', description: 'Abrir un detalle.',
  createdAt: '2026-11-23T12:00:00.000Z', completed: false,
};

describe('TaskCard', () => {
  it('permite completar una tarea', () => {
    const onToggle = jest.fn();
    const { getByTestId } = render(
      <TaskCard task={task} onToggle={onToggle} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('toggle-1'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('muestra el detalle y la fecha al expandir', () => {
    const { getByTestId, getByText } = render(
      <TaskCard task={task} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('expand-1'));
    expect(getByTestId('details-1')).toBeTruthy();
    expect(getByText('Abrir un detalle.')).toBeTruthy();
    expect(getByText(/^Creada:/)).toBeTruthy();
  });

  it('bloquea estado y borrado mientras se guarda, sin bloquear el detalle', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <TaskCard task={task} onToggle={onToggle} onDelete={onDelete} busy />,
    );
    fireEvent.press(getByTestId('toggle-1'));
    fireEvent.press(getByTestId('expand-1'));
    fireEvent.press(getByText('Eliminar tarea'));
    expect(onToggle).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
    expect(queryByText('Editar tarea')).toBeNull();
  });
});
