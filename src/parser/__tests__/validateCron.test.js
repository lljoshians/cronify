import { validateCron } from '../validateCron.js';

describe('validateCron', () => {
  test('accepts a standard valid expression', () => {
    const result = validateCron('0 9 * * 1-5');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('accepts wildcard-only expression', () => {
    expect(validateCron('* * * * *').valid).toBe(true);
  });

  test('accepts step notation', () => {
    expect(validateCron('*/15 * * * *').valid).toBe(true);
    expect(validateCron('0 */2 * * *').valid).toBe(true);
  });

  test('accepts comma-separated values', () => {
    expect(validateCron('0 8,12,18 * * *').valid).toBe(true);
  });

  test('accepts named months', () => {
    expect(validateCron('0 0 1 jan,jun *').valid).toBe(true);
  });

  test('accepts named days of week', () => {
    expect(validateCron('0 9 * * mon-fri').valid).toBe(true);
  });

  test('rejects wrong number of fields', () => {
    const result = validateCron('* * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Expected 5 fields/);
  });

  test('rejects out-of-range minute', () => {
    const result = validateCron('60 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/minute/);
  });

  test('rejects out-of-range hour', () => {
    const result = validateCron('0 24 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/hour/);
  });

  test('rejects invalid range (lo > hi)', () => {
    const result = validateCron('0 9 * * 5-1');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/day of week/);
  });

  test('rejects invalid step value', () => {
    const result = validateCron('*/0 * * * *');
    expect(result.valid).toBe(false);
  });

  test('rejects non-integer value', () => {
    const result = validateCron('abc * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/minute/);
  });

  test('returns multiple errors for multiple bad fields', () => {
    const result = validateCron('99 99 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  test('rejects null input', () => {
    const result = validateCron(null);
    expect(result.valid).toBe(false);
  });
});
