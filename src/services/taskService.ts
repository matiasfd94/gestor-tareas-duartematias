import type { Task, TaskPriority } from '../types/task';
import { getApiUrl } from './config';
import { getToken } from './sessionStorage';

type ApiTask = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  completed: boolean;
};

export async function fetchTasks(
  simulateFailure = false
): Promise<Task[]> {
  if (simulateFailure) {
    throw new Error(
      'HTTP 503: servidor temporalmente indisponible (simulado)'
    );
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Iniciá sesión para consultar tus tareas.');
  }

  const response = await fetch(`${getApiUrl()}/tasks`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error('La sesión venció. Volvé a iniciar sesión.');
  }

  if (!response.ok) {
    throw new Error('No pudimos consultar las tareas del servidor.');
  }

  const body: { data: ApiTask[] } = await response.json();

  if (!Array.isArray(body.data)) {
    throw new Error('El servidor devolvió un listado inválido.');
  }

  return body.data.map((task) => ({
    id: String(task.id),
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    completed: task.completed,
  }));
}

export async function createTask(title: string): Promise<Task> {
  const token = await getToken();

  if (!token) {
    throw new Error('Iniciá sesión para crear una tarea.');
  }

  const response = await fetch(`${getApiUrl()}/tasks`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title.trim(),
      description: null,
      priority: 'media',
    }),
  });

  if (response.status === 401) {
    throw new Error('La sesión venció. Volvé a iniciar sesión.');
  }

  if (response.status === 422) {
    throw new Error(
      'Ingresá un título válido de hasta 150 caracteres.'
    );
  }

  if (!response.ok) {
    throw new Error('No pudimos guardar la tarea. Probá otra vez.');
  }

  const body: { data: ApiTask } = await response.json();
  const task = body.data;

  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    completed: task.completed,
  };
}

export async function updateTaskCompleted(
  id: string,
  completed: boolean
): Promise<Task> {
  const token = await getToken();

  if (!token) {
    throw new Error('Iniciá sesión para actualizar la tarea.');
  }

  const response = await fetch(`${getApiUrl()}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completed }),
  });

  if (response.status === 401) {
    throw new Error('La sesión venció. Volvé a iniciar sesión.');
  }

  if (response.status === 404) {
    throw new Error('La tarea ya no está disponible. Recargá el listado.');
  }

  if (!response.ok) {
    throw new Error('No pudimos actualizar la tarea. Probá otra vez.');
  }

  const body: { data: ApiTask } = await response.json();
  const task = body.data;

  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    completed: task.completed,
  };
}
