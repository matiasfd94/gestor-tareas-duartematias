import type { Task, TaskPriority } from '../types/task';
import { getApiUrl } from './config';
import { getToken, clearToken } from './sessionStorage';

export class SessionExpiredError extends Error {
  constructor() {
    super('La sesión ya no es válida. Volvé a iniciar sesión.');
    this.name = 'SessionExpiredError';
  }
}

type ApiTask = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  completed: boolean;
  categories?: string | null;
  notes?: string | null;
  due_date?: string | null;
  slug?: string;
  completed_at?: string | null;
};

function mapTask(task: ApiTask): Task {
  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    completed: task.completed,
    categories: task.categories ?? null,
    notes: task.notes ?? null,
    due_date: task.due_date ?? null,
    slug: task.slug,
    completed_at: task.completed_at ?? null,
  };
}

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
    throw new SessionExpiredError();
  }

  const response = await fetch(`${getApiUrl()}/tasks`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await clearToken();
    throw new SessionExpiredError();
  }

  if (!response.ok) {
    throw new Error('No pudimos consultar las tareas del servidor.');
  }

  const body: { data: ApiTask[] } = await response.json();

  if (!Array.isArray(body.data)) {
    throw new Error('El servidor devolvió un listado inválido.');
  }

  return body.data.map(mapTask);
}

export async function createTask(
  title: string,
  details: {
    categories?: string;
    notes?: string;
    due_date?: string;
  } = {}
): Promise<Task> {
  const token = await getToken();

  if (!token) {
    throw new SessionExpiredError();
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
      categories: details.categories?.trim() || null,
      notes: details.notes?.trim() || null,
      due_date: details.due_date?.trim() || null,
    }),
  });

  if (response.status === 401) {
    await clearToken();
    throw new SessionExpiredError();
  }

  if (response.status === 422) {
    throw new Error(
      'Revisá los campos: el título admite hasta 150 caracteres y el vencimiento debe ser una fecha válida con formato AAAA-MM-DD.'
    );
  }

  if (!response.ok) {
    throw new Error('No pudimos guardar la tarea. Probá otra vez.');
  }

  const body: { data: ApiTask } = await response.json();
  const task = body.data;

  return mapTask(task);
}

export async function updateTaskCompleted(
  id: string,
  completed: boolean
): Promise<Task> {
  const token = await getToken();

  if (!token) {
    throw new SessionExpiredError();
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
    await clearToken();
    throw new SessionExpiredError();
  }

  if (response.status === 404) {
    throw new Error('La tarea ya no está disponible. Recargá el listado.');
  }

  if (!response.ok) {
    throw new Error('No pudimos actualizar la tarea. Probá otra vez.');
  }

  const body: { data: ApiTask } = await response.json();
  const task = body.data;

  return mapTask(task);
}

export async function deleteTaskById(id: string): Promise<void> {
  const token = await getToken();

  if (!token) {
    throw new SessionExpiredError();
  }

  const response = await fetch(`${getApiUrl()}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await clearToken();
    throw new SessionExpiredError();
  }

  if (response.status === 404) {
    throw new Error('La tarea ya no está disponible. Recargá el listado.');
  }

  if (!response.ok) {
    throw new Error('No pudimos eliminar la tarea. Probá otra vez.');
  }
}

export type TaskChanges = {
  title: string;
  description: string;
  priority: TaskPriority;
  categories?: string;
  notes?: string;
  due_date?: string;
};

export async function updateTask(
  id: string,
  changes: TaskChanges
): Promise<Task> {
  const token = await getToken();

  if (!token) {
    throw new SessionExpiredError();
  }

  const response = await fetch(`${getApiUrl()}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: changes.title.trim(),
      description: changes.description.trim(),
      priority: changes.priority,
      categories: changes.categories === undefined
        ? undefined
        : changes.categories.trim() || null,
      notes: changes.notes === undefined
        ? undefined
        : changes.notes.trim() || null,
      due_date: changes.due_date === undefined
        ? undefined
        : changes.due_date.trim() || null,
    }),
  });

  if (response.status === 401) {
    await clearToken();
    throw new SessionExpiredError();
  }

  if (response.status === 404) {
    throw new Error('La tarea ya no está disponible. Recargá el listado.');
  }

  if (response.status === 422) {
    throw new Error(
      'Revisá los campos. El vencimiento debe tener formato AAAA-MM-DD y ser una fecha válida.'
    );
  }

  if (!response.ok) {
    throw new Error('No pudimos guardar los cambios. Probá otra vez.');
  }

  const body: { data: ApiTask } = await response.json();
  const task = body.data;

  return mapTask(task);
}