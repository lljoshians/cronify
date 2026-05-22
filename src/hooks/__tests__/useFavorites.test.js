import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: key => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();

beforeEach(() => {
  mockStorage.clear();
  Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true });
});

describe('useFavorites', () => {
  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('adds a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('0 9 * * 1', 'Every Monday 9am'));
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].expression).toBe('0 9 * * 1');
    expect(result.current.favorites[0].label).toBe('Every Monday 9am');
  });

  it('does not add duplicate expressions', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('0 9 * * 1'));
    act(() => result.current.addFavorite('0 9 * * 1'));
    expect(result.current.favorites).toHaveLength(1);
  });

  it('removes a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('0 9 * * 1'));
    act(() => result.current.removeFavorite('0 9 * * 1'));
    expect(result.current.favorites).toHaveLength(0);
  });

  it('reports isFavorite correctly', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('* * * * *'));
    expect(result.current.isFavorite('* * * * *')).toBe(true);
    expect(result.current.isFavorite('0 0 * * *')).toBe(false);
  });

  it('renames a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('0 0 * * *', 'Midnight'));
    act(() => result.current.renameFavorite('0 0 * * *', 'Daily midnight'));
    expect(result.current.favorites[0].label).toBe('Daily midnight');
  });

  it('uses expression as label when none provided', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite('0 0 * * *'));
    expect(result.current.favorites[0].label).toBe('0 0 * * *');
  });
});
