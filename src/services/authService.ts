import { getApiUrl } from './config';
import { saveToken, getToken, clearToken } from './sessionStorage';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  const url = getApiUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    let response: Response;

    try {
      response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
        signal: controller.signal,
      });
    } catch {
      throw new Error(
        'No se pudo conectar. Revisá la conexión y que el backend esté disponible.'
      );
    }

    if (response.status === 422) {
      throw new Error('Revisá el correo y la contraseña ingresados.');
    }

    if (response.status === 429) {
      throw new Error('Demasiados intentos. Esperá un minuto y probá otra vez.');
    }

    if (!response.ok) {
      throw new Error('No se pudo iniciar sesión. Intentá nuevamente.');
    }

    const data = await response.json();

    if (
      !data ||
      typeof data.access_token !== 'string' ||
      !data.access_token.trim() ||
      data.token_type !== 'Bearer' ||
      !data.user ||
      typeof data.user.id !== 'number' ||
      typeof data.user.name !== 'string' ||
      typeof data.user.email !== 'string'
    ) {
      throw new Error('El servidor devolvió una respuesta de sesión inválida.');
    }

    await saveToken(data.access_token);

    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    };
  } finally {
    clearTimeout(timeout);
  }
}
export async function logout(): Promise<void> {
  const token = await getToken();

  if (!token) {
    await clearToken();
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    let response: Response;

    try {
      response = await fetch(`${getApiUrl()}/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
    } catch {
      throw new Error(
        'No pudimos cerrar la sesión. Revisá la conexión y probá otra vez.'
      );
    }

    if (!response.ok && response.status !== 401) {
      throw new Error(
        'El servidor no pudo cerrar la sesión. Probá otra vez.'
      );
    }

    await clearToken();
  } finally {
    clearTimeout(timeout);
  }
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getToken();

  if (!token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    let response: Response;

    try {
      response = await fetch(`${getApiUrl()}/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
    } catch {
      throw new Error(
        'No pudimos verificar la sesión. Revisá la conexión y probá otra vez.'
      );
    }

    if (response.status === 401) {
      await clearToken();
      return null;
    }

    if (!response.ok) {
      throw new Error('No pudimos verificar la sesión en el servidor.');
    }

    const user = await response.json();

    if (
      !user ||
      typeof user.id !== 'number' ||
      typeof user.name !== 'string' ||
      typeof user.email !== 'string'
    ) {
      throw new Error('El servidor devolvió datos de usuario inválidos.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } finally {
    clearTimeout(timeout);
  }
}