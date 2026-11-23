export const MAX_TITLE_BYTES = 200;
export const MAX_DESCRIPTION_BYTES = 10000;

// Cuenta UTF-8 sin depender de TextEncoder en el entorno nativo.
export function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const character of value) {
    const point = character.codePointAt(0)!;
    bytes += point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
  }
  return bytes;
}

export function isValidTaskTitle(title: string): boolean {
  const text = title.trim();
  return text.length > 0 && utf8ByteLength(text) <= MAX_TITLE_BYTES;
}
