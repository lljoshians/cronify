import { useState, useCallback } from 'react';
import { useCronValidation } from './useCronValidation';
import { useNextRuns } from './useNextRuns';

/**
 * Top-level state hook that wires together the cron expression string,
 * validation, and next-run computation for use by the main App.
 */
export function useCronState(initialExpression = '* * * * *') {
  const [expression, setExpression] = useState(initialExpression);
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const validation = useCronValidation(expression);
  const { nextRuns, loading, error: runsError } = useNextRuns(
    validation.isValid ? expression : null,
    { timezone, count: 5 }
  );

  const handleExpressionChange = useCallback((val) => {
    setExpression(val);
  }, []);

  const handleTimezoneChange = useCallback((tz) => {
    setTimezone(tz);
  }, []);

  const reset = useCallback(() => {
    setExpression(initialExpression);
  }, [initialExpression]);

  return {
    expression,
    timezone,
    validation,
    nextRuns,
    nextRunsLoading: loading,
    nextRunsError: runsError,
    handleExpressionChange,
    handleTimezoneChange,
    reset,
  };
}
