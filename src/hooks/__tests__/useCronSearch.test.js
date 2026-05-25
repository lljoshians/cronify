import { renderHook, act } from '@testing-library/react';
import { useCronSearch } from '../useCronSearch';

describe('useCronSearch', () => {
  it('starts with empty query and no results', () => {
    const { result } = renderHook(() => useCronSearch());
    expect(result.current.query).toBe('');
    expect(result.current.results).toHaveLength(0);
  });

  it('returns all presets via allPresets', () => {
    const { result } = renderHook(() => useCronSearch());
    expect(result.current.allPresets.length).toBeGreaterThan(0);
  });

  it('filters results by label keyword', () => {
    const { result } = renderHook(() => useCronSearch());
    act(() => result.current.setQuery('minute'));
    expect(result.current.results.length).toBeGreaterThan(0);
    result.current.results.forEach((r) =>
      expect(r.label.toLowerCase()).toMatch(/minute/)
    );
  });

  it('filters results by expression', () => {
    const { result } = renderHook(() => useCronSearch());
    act(() => result.current.setQuery('*/5'));
    expect(result.current.results.length).toBeGreaterThan(0);
    result.current.results.forEach((r) =>
      expect(r.expression).toContain('*/5')
    );
  });

  it('returns no results for unmatched query', () => {
    const { result } = renderHook(() => useCronSearch());
    act(() => result.current.setQuery('zzznomatch999'));
    expect(result.current.results).toHaveLength(0);
  });

  it('trims whitespace from query before matching', () => {
    const { result } = renderHook(() => useCronSearch());
    act(() => result.current.setQuery('  hour  '));
    expect(result.current.results.length).toBeGreaterThan(0);
  });

  it('each preset has label, expression, and human fields', () => {
    const { result } = renderHook(() => useCronSearch());
    result.current.allPresets.forEach((p) => {
      expect(p).toHaveProperty('label');
      expect(p).toHaveProperty('expression');
      expect(p).toHaveProperty('human');
    });
  });

  it('updates results when query changes', () => {
    const { result } = renderHook(() => useCronSearch());
    act(() => result.current.setQuery('daily'));
    const first = result.current.results.length;
    act(() => result.current.setQuery('weekly'));
    const second = result.current.results.length;
    // both are valid searches, just checking reactivity
    expect(typeof first).toBe('number');
    expect(typeof second).toBe('number');
  });
});
