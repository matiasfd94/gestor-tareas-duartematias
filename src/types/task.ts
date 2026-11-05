export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'todas' | 'pendientes' | 'completadas';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
};
