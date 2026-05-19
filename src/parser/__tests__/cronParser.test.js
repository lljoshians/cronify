import { parseCron } from '../cronParser.js';

describe('parseCron', () => {
  test('parses a valid wildcard expression', () => {
    const result = parseCron('* * * * *');
    expect(result.valid).toBe(true);
    expect(result.fields).toEqual({
      minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*'
    });
  });

  test('parses a standard schedule', () => {
    const result = parseCron('30 9 * * 1-5');
    expect(result.valid).toBe(true);
    expect(result.fields.minute).toBe('30');
    expect(result.fields.hour).toBe('9');
    expect(result.fields.dayOfWeek).toBe('1-5');
  });

  test('parses step expressions', () => {
    const result = parseCron('*/15 * * * *');
    expect(result.valid).toBe(true);
  });

  test('rejects wrong field count', () => {
    const result = parseCron('* * * *');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Expected 5 fields/);
  });

  test('rejects out-of-range minute', () => {
    const result = parseCron('60 * * * *');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/out of range/);
  });

  test('rejects out-of-range hour', () => {
    const result = parseCron('0 24 * * *');
    expect(result.valid).toBe(false);
  });

  test('accepts month names', () => {
    const result = parseCron('0 0 1 jan *');
    expect(result.valid).toBe(true);
  });

  test('accepts day-of-week names', () => {
    const result = parseCron('0 9 * * mon');
    expect(result.valid).toBe(true);
  });

  test('rejects empty string', () => {
    const result = parseCron('');
    expect(result.valid).toBe(false);
  });

  test('rejects invalid range', () => {
    const result = parseCron('5-2 * * * *');
    expect(result.valid).toBe(false);
  });
});
