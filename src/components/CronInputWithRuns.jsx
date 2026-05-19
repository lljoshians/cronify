import React from 'react';
import { CronInput } from './CronInput';
import { NextRunsList } from './NextRunsList';
import { useCronState } from '../hooks/useCronState';

/**
 * Convenience composite component: expression input + next-runs list.
 * Can be dropped into the App or used standalone in Storybook.
 */
export function CronInputWithRuns({ initialExpression }) {
  const {
    expression,
    timezone,
    validation,
    nextRuns,
    nextRunsLoading,
    nextRunsError,
    handleExpressionChange,
    handleTimezoneChange,
    reset,
  } = useCronState(initialExpression);

  return (
    <div className="cron-widget">
      <CronInput value={expression} onChange={handleExpressionChange} />

      <div className="cron-widget__tz">
        <label htmlFor="tz-select">Timezone</label>
        <input
          id="tz-select"
          list="tz-list"
          value={timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          className="cron-widget__tz-input"
        />
      </div>

      {validation.isValid && (
        <NextRunsList
          runs={nextRuns}
          loading={nextRunsLoading}
          error={nextRunsError}
          timezone={timezone}
        />
      )}

      <button
        type="button"
        className="cron-widget__reset"
        onClick={reset}
        aria-label="Reset expression"
      >
        Reset
      </button>
    </div>
  );
}
