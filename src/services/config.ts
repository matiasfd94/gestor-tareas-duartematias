export function getApiUrl(): string {
  // Variable propia de esta rama: no altera el .env usado por la app de Railway.
  const url = process.env.EXPO_PUBLIC_PROFESOR_API_URL?.trim()
    || 'https://backend-proyecto.n7softwares.com/api/v1';

  return url.replace(/\/+$/, '');
}
