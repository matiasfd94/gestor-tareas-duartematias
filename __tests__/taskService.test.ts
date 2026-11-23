import { ApiError, tasksService } from '../src/services/taskService';

jest.mock('../src/services/config', () => ({
  getApiUrl: () => 'https://api-profesor.test/api/v1',
}));

const task = {
  id: 31, title: 'Matías - prueba', description: 'Estudio',
  createdAt: '2026-11-23T12:00:00.000Z', completed: false,
};
const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;
const response = (status: number, body?: unknown, raw?: string) => ({
  status, ok: status >= 200 && status < 300,
  text: jest.fn().mockResolvedValue(raw ?? (body === undefined ? '' : JSON.stringify(body))),
});

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as typeof fetch;
});
afterAll(() => { globalThis.fetch = originalFetch; });

describe('tasksService: contrato público', () => {
  it('acepta array directo y traduce filtros sin enviar credenciales', async () => {
    fetchMock.mockResolvedValue(response(200, [task]));
    expect(await tasksService.list({ status: 'pendientes', search: '  unidad á  ' })).toEqual([task]);
    const [url, options] = fetchMock.mock.calls[0];
    const parsed = new URL(url);
    expect(parsed.searchParams.get('status')).toBe('pending');
    expect(parsed.searchParams.get('search')).toBe('unidad á');
    expect(options.headers).toEqual({ Accept: 'application/json' });
    expect(options.credentials).toBeUndefined();
  });

  it('traduce todas y completadas y permite un listado vacío', async () => {
    fetchMock.mockResolvedValue(response(200, []));
    await expect(tasksService.list()).resolves.toEqual([]);
    expect(fetchMock.mock.calls[0][0]).toContain('status=all');
    await tasksService.list({ status: 'completadas' });
    expect(fetchMock.mock.calls[1][0]).toContain('status=completed');
  });

  it('rechaza la envoltura data del backend anterior', async () => {
    fetchMock.mockResolvedValue(response(200, { data: [task] }));
    await expect(tasksService.list()).rejects.toMatchObject({ status: 502 });
  });

  it('valida la forma y tipos del JSON recibido', async () => {
    for (const invalid of [
      { ...task, id: '31' }, { ...task, completed: 'false' },
      { ...task, createdAt: 'fecha inválida' },
    ]) {
      fetchMock.mockResolvedValue(response(200, [invalid]));
      await expect(tasksService.list()).rejects.toMatchObject({ status: 502 });
    }
  });

  it('crea enviando solo título y descripción', async () => {
    fetchMock.mockResolvedValue(response(201, task));
    await tasksService.create({ title: '  Matías - prueba  ', description: ' Estudio ' });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      title: 'Matías - prueba', description: 'Estudio',
    });
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });

  it('rechaza títulos y descripciones demasiado grandes antes del POST', async () => {
    await expect(tasksService.create({ title: 'á'.repeat(101) })).rejects.toMatchObject({ status: 400 });
    await expect(tasksService.create({
      title: 'Prueba', description: 'a'.repeat(10001),
    })).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('consulta una tarea por ID numérico positivo', async () => {
    fetchMock.mockResolvedValue(response(200, task));
    await expect(tasksService.get(31)).resolves.toEqual(task);
    expect(fetchMock.mock.calls[0][0]).toContain('/tasks/31');
    await expect(tasksService.get(-1)).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('PATCH envía únicamente el booleano completed', async () => {
    fetchMock.mockResolvedValue(response(200, { ...task, completed: true }));
    await expect(tasksService.setCompleted(31, true)).resolves.toMatchObject({ completed: true });
    expect(fetchMock.mock.calls[0][1].method).toBe('PATCH');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ completed: true });
  });

  it('DELETE 204 no intenta interpretar un cuerpo JSON vacío', async () => {
    fetchMock.mockResolvedValue(response(204));
    await expect(tasksService.remove(31)).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });

  it('conserva el estado HTTP y el mensaje del backend', async () => {
    fetchMock.mockResolvedValue(response(400, { message: 'Título inválido' }));
    await expect(tasksService.create({ title: 'Prueba' })).rejects.toMatchObject({
      status: 400, message: 'Título inválido',
    });
    fetchMock.mockResolvedValue(response(404));
    await expect(tasksService.get(31)).rejects.toMatchObject({ status: 404 });
  });

  it('explica una barrera Basic sin enviar claves ni mostrar HTML', async () => {
    fetchMock.mockResolvedValue(response(401, undefined, '<html>Authorization Required</html>'));
    await expect(tasksService.list()).rejects.toMatchObject({
      status: 401, message: expect.stringContaining('restringiendo'),
    });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('distingue fallo de red y respuesta inválida', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network error'));
    await expect(tasksService.list()).rejects.toMatchObject({ status: 0 });
    fetchMock.mockResolvedValue(response(200, undefined, '<html>no json</html>'));
    await expect(tasksService.list()).rejects.toBeInstanceOf(ApiError);
  });

  it('no consulta si la señal ya está cancelada', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(tasksService.list({}, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
