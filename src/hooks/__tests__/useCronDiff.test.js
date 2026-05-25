import { renderHook } from '@testing-library/react';
import { diffCrons, useCronDiff } from '../useCronDiff';

describe('diffCrons', () => {
  it('returns null if either expression is missing', () => {
    expect(diffCrons('', '0 * * * *')).toBeNull();
    expect(diffCrons('0 * * * *', '')).toBeNull();
    expect(diffCrons(null, null)).toBeNull();
  });

  it('returns null for invalid expressions', () => {
    expect(diffCrons('bad expr', '0 * * * *')).toBeNull();
    expect(diffCrons('0 * * * *', 'also bad')).toBeNull();
  });

  it('detects no changes when expressions are identical', () => {
    const result = diffCrons('0 * * * *', '0 * * * *');
    expect(result).not.toBeNull();
    expect(result.hasChanges).toBe(false);
    expect(result.changes.every((c) => !c.changed)).toBe(true);
  });

  it('detects a changed minute field', () => {
    const result = diffCrons('0 * * * *', '30 * * * *');
    expect(result.hasChanges).toBe(true);
    const minuteChange = result.changes.find((c) => c.field === 'minute');
    expect(minuteChange.changed).toBe(true);
    expect(minuteChange.from).toBe('0');
    expect(minuteChange.to).toBe('30');
  });

  it('detects multiple changed fields', () => {
    const result = diffCrons('0 0 * * *', '30 12 1 * *');
    expect(result.hasChanges).toBe(true);
    const changed = result.changes.filter((c) => c.changed);
    expect(changed.length).toBe(3);
  });

  it('includes human readable descriptions for both expressions', () => {
    const result = diffCrons('0 9 * * 1', '0 17 * * 5');
    expect(typeof result.humanA).toBe('string');
    expect(typeof result.humanB).toBe('string');
    expect(result.humanA.length).toBeGreaterThan(0);
    expect(result.humanB.length).toBeGreaterThan(0);
  });
});

describe('useCronDiff', () => {
  it('returns null for empty inputs', () => {
    const { result } = renderHook(() => useCronDiff('', ''));
    expect(result.current).toBeNull();
  });

  it('returns diff object for valid expressions', () => {
    const { result } = renderHook(() => useCronDiff('0 * * * *', '30 * * * *'));
    expect(result.current).not.toBeNull();
    expect(result.current.hasChanges).toBe(true);
  });

  it('returns stable reference when inputs do not change', () => {
    const { result, rerender } = renderHook(
      ({ a, b }) => useCronDiff(a, b),
      { initialProps: { a: '0 * * * *', b: '0 * * * *' } }
    );
    const first = result.current;
    rerender({ a: '0 * * * *', b: '0 * * * *' });
    expect(result.current).toBe(first);
  });
});
