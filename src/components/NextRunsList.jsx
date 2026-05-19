import React from 'react';
import { useNextRuns } from '../hooks/useNextRuns';

export function NextRunsList({ expression, count = 5, timezone }) {
  const { nextRuns, error, isLoading } = useNextRuns(expression, { count, timezone });

  if (!expression || !expression.trim()) {
    return (
      <div className="next-runs next-runs--empty">
        <p className="next-runs__placeholder">Enter a cron expression to see upcoming runs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="next-runs next-runs--loading">
        <p>Computing next runs…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="next-runs next-runs--error">
        <p className="next-runs__error">⚠ {error}</p>
      </div>
    );
  }

  if (nextRuns.length === 0) {
    return (
      <div className="next-runs next-runs--empty">
        <p>No upcoming runs found.</p>
      </div>
    );
  }

  return (
    <div className="next-runs">
      <h3 className="next-runs__title">Next {nextRuns.length} runs</h3>
      <ul className="next-runs__list">
        {nextRuns.map((run, idx) => (
          <li key={run.iso} className="next-runs__item">
            <span className="next-runs__index">#{idx + 1}</span>
            <span className="next-runs__local">{run.local}</span>
            <span className="next-runs__relative">({run.relative})</span>
          </li>
        ))}
      </ul>
      <p className="next-runs__timezone">Timezone: {timezone || 'local'}</p>
    </div>
  );
}

export default NextRunsList;
