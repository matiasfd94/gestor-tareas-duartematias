import type { CreateTaskInput, Task, TaskFilters } from '../types/task';
import { getApiUrl } from './config';
import {
  isValidTaskTitle, MAX_DESCRIPTION_BYTES, utf8ByteLength,
} from '../utils/taskValidation';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function cancelled(): Error {
  const error = new Error('Consulta cancelada.');
  error.name = 'AbortError';
  return error;
}

function parseTask(value: unknown): Task {
  if (!value || typeof value !== 'object') {
    throw new ApiError(502, 'El servidor devolvió una tarea inválida.');
  }
  const task = value as Record<string, unknown>;
  if (
    typeof task.id !== 'number' || !Number.isSafeInteger(task.id) || task.id <= 0 ||
    typeof task.title !== 'string' || typeof task.description !== 'string' ||
    typeof task.completed !== 'boolean' || typeof task.createdAt !== 'string' ||
    Number.isNaN(Date.parse(task.createdAt))
  ) {
    throw new ApiError(502, 'Los datos recibidos no coinciden con la API de tareas.');
  }
  return {
    id: task.id, title: task.title, description: task.description,
    completed: task.completed, createdAt: task.createdAt,
  };
}

function validId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new ApiError(400, 'El identificador de la tarea no es válido.');
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: object; signal?: AbortSignal } = {},
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const onAbort = () => controller.abort();
  if (options.signal?.aborted) throw cancelled();
  options.signal?.addEventListener('abort', onAbort);
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(getApiUrl() + path, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      signal: controller.signal,
    });
    if (options.signal?.aborted) throw cancelled();

    const text = await response.text();
    let data: unknown;
    if (text.trim()) {
      try { data = JSON.parse(text); } catch { /* El error HTTP puede devolver HTML. */ }
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new ApiError(
          response.status,
          'El servidor está restringiendo el acceso a la API pública. Avisá al profesor.',
        );
      }
      const payload = data && typeof data === 'object'
        ? data as Record<string, unknown> : {};
      const message = typeof payload.message === 'string' ? payload.message
        : typeof payload.error === 'string' ? payload.error
        : response.status === 404 ? 'La tarea ya no existe. Se actualizará el listado.'
        : response.status === 400 ? 'Revisá los datos y los filtros enviados.'
        : 'El servidor no pudo completar la solicitud. Probá otra vez.';
      throw new ApiError(response.status, message.slice(0, 400));
    }

    if (response.status === 204) return undefined as T;
    if (data === undefined) {
      throw new ApiError(502, 'El servidor no devolvió una respuesta JSON válida.');
    }
    return data as T;
  } catch (error) {
    if (options.signal?.aborted || isAbortError(error) && !timedOut) throw cancelled();
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      0,
      timedOut ? 'El servidor tardó demasiado. Podés reintentar.'
        : 'No pudimos conectar con la API. Revisá internet y volvé a consultar.',
    );
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', onAbort);
  }
}

const statusMap = {
  todas: 'all', pendientes: 'pending', completadas: 'completed',
} as const;

export const tasksService = {
  async list(filters: TaskFilters = {}, signal?: AbortSignal): Promise<Task[]> {
    const params = new URLSearchParams({
      status: statusMap[filters.status ?? 'todas'],
    });
    const search = filters.search?.trim();
    if (search) params.set('search', search);
    const data = await request<unknown>('/tasks?' + params.toString(), { signal });
    if (!Array.isArray(data)) {
      throw new ApiError(502, 'El listado debe ser un array de tareas, sin envoltura data.');
    }
    return data.map(parseTask);
  },

  async get(id: number, signal?: AbortSignal): Promise<Task> {
    validId(id);
    return parseTask(await request<unknown>('/tasks/' + id, { signal }));
  },

  async create(input: CreateTaskInput): Promise<Task> {
    if (!isValidTaskTitle(input.title)) {
      throw new ApiError(400, 'El título debe tener texto y admitir hasta 200 bytes UTF-8.');
    }
    const description = input.description?.trim() ?? '';
    if (utf8ByteLength(description) > MAX_DESCRIPTION_BYTES) {
      throw new ApiError(400, 'La descripción admite hasta 10000 bytes UTF-8.');
    }
    return parseTask(await request<unknown>('/tasks', {
      method: 'POST',
      body: { title: input.title.trim(), description },
    }));
  },

  async setCompleted(id: number, completed: boolean): Promise<Task> {
    validId(id);
    return parseTask(await request<unknown>('/tasks/' + id, {
      method: 'PATCH', body: { completed },
    }));
  },

  async remove(id: number): Promise<void> {
    validId(id);
    await request<void>('/tasks/' + id, { method: 'DELETE' });
  },
};
