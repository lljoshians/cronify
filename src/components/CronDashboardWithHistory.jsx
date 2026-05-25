import React, { useCallback } from 'react';
import { CronDashboard } from './CronDashboard';
import { CronHistory } from './CronHistory';
import { useCronHistory } from '../hooks/useCronHistory';
import { useCronState } from '../hooks/useCronState';
import { validateCron } from '../parser/validateCron';
import { toHumanReadable } from '../parser/humanReadable';

export function CronDashboardWithHistory() {
  const { expression, setExpression } = useCronState();
  const { addEntry } = useCronHistory();

  const handleExpressionChange = useCallback(
    (newExpression) => {
      setExpression(newExpression);
      const result = validateCron(newExpression);
      if (result.valid) {
        try {
          const label = toHumanReadable(newExpression);
          addEntry(newExpression, label);
        } catch {
          addEntry(newExpression);
        }
      }
    },
    [setExpression, addEntry]
  );

  const handleHistorySelect = useCallback(
    (selected) => {
      handleExpressionChange(selected);
    },
    [handleExpressionChange]
  );

  return (
    <div className="cron-dashboard-with-history">
      <div className="cron-dashboard-with-history__main">
        <CronDashboard
          expression={expression}
          onExpressionChange={handleExpressionChange}
        />
      </div>
      <aside className="cron-dashboard-with-history__sidebar">
        <CronHistory onSelect={handleHistorySelect} />
      </aside>
    </div>
  );
}
