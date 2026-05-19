import { getNextRuns } from '../nextRuns.js';

describe('getNextRuns', () => {
  const baseDate = new Date('2024-01-15T10:00:00'); // Monday

  test('returns error for invalid expression', () => {
    const { runs, error } = getNextRuns('invalid');
    expect(runs).toHaveLength(0);
    expect(error).toBeTruthy();
  });

  test('returns 5 runs by default', () => {
    const { runs, error } = getNextRuns('* * * * *', 5, baseDate);
    expect(error).toBeNull();
    expect(runs).toHaveLength(5);
  });

  test('each run is 1 minute apart for * * * * *', () => {
    const { runs } = getNextRuns('* * * * *', 3, baseDate);
    expect(runs[1] - runs[0]).toBe(60000);
    expect(runs[2] - runs[1]).toBe(60000);
  });

  test('respects hour field', () => {
    const { runs } = getNextRuns('0 12 * * *', 1, baseDate);
    expect(runs[0].getHours()).toBe(12);
    expect(runs[0].getMinutes()).toBe(0);
  });

  test('respects day-of-week field (weekdays only)', () => {
    const { runs } = getNextRuns('0 9 * * 1-5', 5, baseDate);
    runs.forEach(run => {
      const dow = run.getDay();
      expect(dow).toBeGreaterThanOrEqual(1);
      expect(dow).toBeLessThanOrEqual(5);
    });
  });

  test('handles step expressions', () => {
    const { runs } = getNextRuns('*/10 * * * *', 3, baseDate);
    runs.forEach(run => {
      expect(run.getMinutes() % 10).toBe(0);
    });
  });

  test('returns requested count', () => {
    const { runs } = getNextRuns('* * * * *', 10, baseDate);
    expect(runs).toHaveLength(10);
  });
});
