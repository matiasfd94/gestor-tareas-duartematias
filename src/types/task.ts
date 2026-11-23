export type TaskPriority = 'alta' | 'media' | 'baja';

export type TaskStatus = 'todas' | 'pendientes' | 'completadas';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  categories?: string | null;
  notes?: string | null;
  due_date?: string | null;
  slug?: string;
  completed_at?: string | null;
};