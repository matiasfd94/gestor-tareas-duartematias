export function getApiUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!url) {
    throw new Error('Falta configurar EXPO_PUBLIC_API_URL.');
  }

  return url.replace(/\/+$/, '');
}