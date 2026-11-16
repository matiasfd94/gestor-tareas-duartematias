import { getApiUrl } from './config';
import { saveToken } from './sessionStorage';

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