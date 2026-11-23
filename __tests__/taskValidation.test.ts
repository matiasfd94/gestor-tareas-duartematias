import {
  isValidTaskTitle, utf8ByteLength,
} from '../src/utils/taskValidation';

describe('isValidTaskTitle', () => {
  it('rechaza un título vacío', () => {
    expect(isValidTaskTitle('')).toBe(false);
  });
  it('rechaza un título compuesto solo de espacios', () => {
    expect(isValidTaskTitle('   ')).toBe(false);
  });
  it('acepta un título que contiene palabras', () => {
    expect(isValidTaskTitle('  Preparar la entrega  ')).toBe(true);
  });
  it('respeta 200 bytes para texto ASCII y quita espacios externos', () => {
    expect(isValidTaskTitle(' ' + 'a'.repeat(200) + ' ')).toBe(true);
    expect(isValidTaskTitle('a'.repeat(201))).toBe(false);
  });
  it('cuenta tildes y emojis en bytes UTF-8', () => {
    expect(utf8ByteLength('á')).toBe(2);
    expect(utf8ByteLength('😀')).toBe(4);
    expect(isValidTaskTitle('á'.repeat(100))).toBe(true);
    expect(isValidTaskTitle('á'.repeat(101))).toBe(false);
    expect(isValidTaskTitle('😀'.repeat(50))).toBe(true);
    expect(isValidTaskTitle('😀'.repeat(51))).toBe(false);
  });
});
