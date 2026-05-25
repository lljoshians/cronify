import { renderHook, act } from '@testing-library/react';
import { useCronHistory } from '../useCronHistory';

const STORAGE_KEY = 'cronify_history';

beforeEach(() => {
  localStorage.clear();
});

describe('useCronHistory', () => {
  it('initializes with empty history when storage is empty', () => {
    const { result } = renderHook(() => useCronHistory());
    expect(result.current.history).toEqual([]);
  });

  it('loads history from localStorage on init', () => {
    const stored = [{ expression: '* * * * *', label: '', addedAt: '2024-01-01T00:00:00.000Z' }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    const { result } = renderHook(() => useCronHistory());
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].expression).toBe('* * * * *');
  });

  it('adds a new entry', () => {
    const { result } = renderHook(() => useCronHistory());
    act(() => {
      result.current.addEntry('0 9 * * 1', 'Every Monday 9am');
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].expression).toBe('0 9 * * 1');
    expect(result.current.history[0].label).toBe('Every Monday 9am');
  });

  it('deduplicates entries, moving existing to top', () => {
    const { result } = renderHook(() => useCronHistory());
    act(() => result.current.addEntry('* * * * *'));
    act(() => result.current.addEntry('0 0 * * *'));
    act(() => result.current.addEntry('* * * * *'));
    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].expression).toBe('* * * * *');
  });

  it('removes a specific entry', () => {
    const { result } = renderHook(() => useCronHistory());
    act(() => result.current.addEntry('* * * * *'));
    act(() => result.current.addEntry('0 0 * * *'));
    act(() => result.current.removeEntry('* * * * *'));
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].expression).toBe('0 0 * * *');
  });

  it('clears all history', () => {
    const { result } = renderHook(() => useCronHistory());
    act(() => result.current.addEntry('* * * * *'));
    act(() => result.current.addEntry('0 0 * * *'));
    act(() => result.current.clearHistory());
    expect(result.current.history).toEqual([]);
  });

  it('ignores empty expression in addEntry', () => {
    const { result } = renderHook(() => useCronHistory());
    act(() => result.current.addEntry(''));
    act(() => result.current.addEntry('   '));
    expect(result.current.history).toHaveLength(0);
  });
});
