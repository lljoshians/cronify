import { useState, useEffect, useRef } from 'react';
import { validateCron } from '../parser/validateCron.js';
import { toHumanReadable } from '../parser/humanReadable.js';
import { getNextRuns } from '../parser/nextRuns.js';

const DEFAULT_NEXT_COUNT = 5;

/**
 * Custom hook that validates a cron expression and derives
 * human-readable description + upcoming run times.
 *
 * @param {string} expression - raw cron string from user input
 * @param {object} [options]
 * @param {number} [options.nextCount=5] - how many upcoming runs to compute
 * @param {number} [options.debounceMs=300] - debounce delay in ms
 */
export function useCronValidation(expression, options = {}) {
  const { nextCount = DEFAULT_NEXT_COUNT, debounceMs = 300 } = options;

  const [state, setState] = useState({
    valid: false,
    errors: [],
    humanReadable: '',
    nextRuns: [],
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const trimmed = (expression || '').trim();

      if (!trimmed) {
        setState({ valid: false, errors: [], humanReadable: '', nextRuns: [] });
        return;
      }

      const { valid, errors } = validateCron(trimmed);

      if (!valid) {
        setState({ valid: false, errors, humanReadable: '', nextRuns: [] });
        return;
      }

      let humanReadable = '';
      let nextRuns = [];

      try {
        humanReadable = toHumanReadable(trimmed);
      } catch (_) {
        humanReadable = '';
      }

      try {
        nextRuns = getNextRuns(trimmed, new Date(), nextCount);
      } catch (_) {
        nextRuns = [];
      }

      setState({ valid: true, errors: [], humanReadable, nextRuns });
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [expression, nextCount, debounceMs]);

  return state;
}
