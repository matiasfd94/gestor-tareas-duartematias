import { isValidTaskTitle } from '../src/utils/taskValidation';

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
});
