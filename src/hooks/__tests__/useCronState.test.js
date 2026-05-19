import { renderHook, act } from '@testing-library/react';
import { useCronState } from '../useCronState';

describe('useCronState', () => {
  it('initialises with the provided expression', () => {
    const { result } = renderHook(() => useCronState('0 9 * * 1'));
    expect(result.current.expression).toBe('0 9 * * 1');
  });

  it('defaults to every-minute when no initial value given', () => {
    const { result } = renderHook(() => useCronState());
    expect(result.current.expression).toBe('* * * * *');
  });

  it('updates expression via handleExpressionChange', () => {
    const { result } = renderHook(() => useCronState());
    act(() => result.current.handleExpressionChange('0 0 * * *'));
    expect(result.current.expression).toBe('0 0 * * *');
  });

  it('updates timezone via handleTimezoneChange', () => {
    const { result } = renderHook(() => useCronState());
    act(() => result.current.handleTimezoneChange('America/New_York'));
    expect(result.current.timezone).toBe('America/New_York');
  });

  it('resets expression to initial value', () => {
    const { result } = renderHook(() => useCronState('0 6 * * *'));
    act(() => result.current.handleExpressionChange('*/5 * * * *'));
    expect(result.current.expression).toBe('*/5 * * * *');
    act(() => result.current.reset());
    expect(result.current.expression).toBe('0 6 * * *');
  });

  it('exposes validation object', () => {
    const { result } = renderHook(() => useCronState('* * * * *'));
    expect(result.current.validation).toHaveProperty('isValid');
    expect(result.current.validation).toHaveProperty('errors');
    expect(result.current.validation).toHaveProperty('humanReadable');
  });

  it('marks invalid expression in validation', () => {
    const { result } = renderHook(() => useCronState('99 * * * *'));
    expect(result.current.validation.isValid).toBe(false);
  });
});
