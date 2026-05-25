import React from 'react';
import { useCronHistory } from '../hooks/useCronHistory';

export function CronHistory({ onSelect }) {
  const { history, removeEntry, clearHistory } = useCronHistory();

  if (history.length === 0) {
    return (
      <div className="cron-history cron-history--empty">
        <p>No history yet. Valid expressions you use will appear here.</p>
      </div>
    );
  }

  return (
    <div className="cron-history">
      <div className="cron-history__header">
        <h3>Recent Expressions</h3>
        <button
          className="cron-history__clear-btn"
          onClick={clearHistory}
          aria-label="Clear all history"
        >
          Clear All
        </button>
      </div>
      <ul className="cron-history__list" role="list">
        {history.map(entry => (
          <li key={entry.expression} className="cron-history__item">
            <button
              className="cron-history__expression-btn"
              onClick={() => onSelect && onSelect(entry.expression)}
              title={`Use: ${entry.expression}`}
            >
              <code>{entry.expression}</code>
              {entry.label && (
                <span className="cron-history__label">{entry.label}</span>
              )}
              <span className="cron-history__date">
                {new Date(entry.addedAt).toLocaleDateString()}
              </span>
            </button>
            <button
              className="cron-history__remove-btn"
              onClick={() => removeEntry(entry.expression)}
              aria-label={`Remove ${entry.expression} from history`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
