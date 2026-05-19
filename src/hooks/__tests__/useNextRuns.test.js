import { renderHook, act } from '@testing-library/react';
import { useNextRuns } from '../useNextRuns';

jest.mock('../../parser/nextRuns', () => ({
  getNextRuns: jest.fn(),
}));

jest.mock('../../parser/cronParser', () => ({
  parseCron: jest.fn(),
}));

import { getNextRuns } from '../../parser/nextRuns';
import { parseCron } from '../../parser/cronParser';

const MOCK_DATES = [
  new Date('2024-06-01T10:00:00Z'),
  new Date('2024-06-01T11:00:00Z'),
  new Date('2024-06-01T12:00:00Z'),
];

beforeEach(() => {
  jest.clearAllMocks();
  parseCron.mockReturnValue({ minute: '*', hour: '*', dom: '*', month: '*', dow: '*' });
  getNextRuns.mockReturnValue(MOCK_DATES);
});

describe('useNextRuns', () => {
  it('returns empty array for empty expression', () => {
    const { result } = renderHook(() => useNextRuns(''));
    expect(result.current.nextRuns).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('computes runs for a valid expression', () => {
    const { result } = renderHook(() => useNextRuns('0 * * * *'));
    expect(result.current.nextRuns).toHaveLength(3);
    expect(result.current.nextRuns[0]).toHaveProperty('iso');
    expect(result.current.nextRuns[0]).toHaveProperty('local');
    expect(result.current.nextRuns[0]).toHaveProperty('relative');
  });

  it('sets error when parseCron throws', () => {
    parseCron.mockImplementation(() => { throw new Error('invalid cron'); });
    const { result } = renderHook(() => useNextRuns('bad expr'));
    expect(result.current.error).toBe('invalid cron');
    expect(result.current.nextRuns).toEqual([]);
  });

  it('respects count option', () => {
    renderHook(() => useNextRuns('0 * * * *', { count: 10 }));
    expect(getNextRuns).toHaveBeenCalledWith(expect.anything(), 10);
  });

  it('refresh re-runs computation', () => {
    const { result } = renderHook(() => useNextRuns('0 * * * *'));
    act(() => { result.current.refresh(); });
    expect(getNextRuns).toHaveBeenCalledTimes(2);
  });
});
