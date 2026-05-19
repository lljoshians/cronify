import { useState, useEffect, useCallback } from 'react';
import { getNextRuns } from '../parser/nextRuns';
import { parseCron } from '../parser/cronParser';

const DEFAULT_COUNT = 5;

export function useNextRuns(expression, options = {}) {
  const { count = DEFAULT_COUNT, timezone = Intl.DateTimeFormat().resolvedOptions().timeZone } = options;

  const [nextRuns, setNextRuns] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const compute = useCallback(() => {
    if (!expression || !expression.trim()) {
      setNextRuns([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsed = parseCron(expression);
      const runs = getNextRuns(parsed, count);

      const formatted = runs.map((date) => ({
        raw: date,
        local: date.toLocaleString('en-US', { timeZone: timezone }),
        iso: date.toISOString(),
        relative: getRelativeLabel(date),
      }));

      setNextRuns(formatted);
    } catch (err) {
      setError(err.message || 'Failed to compute next runs');
      setNextRuns([]);
    } finally {
      setIsLoading(false);
    }
  }, [expression, count, timezone]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { nextRuns, error, isLoading, refresh: compute };
}

function getRelativeLabel(date) {
  const diffMs = date.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'in less than a minute';
  if (diffMins < 60) return `in ${diffMins} minute${diffMins === 1 ? '' : 's'}`;

  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;

  const diffDays = Math.round(diffHours / 24);
  return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
}
