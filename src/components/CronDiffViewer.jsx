import React from 'react';
import { useCronDiff } from '../hooks/useCronDiff';
import { toHumanReadable } from '../parser/humanReadable';

function DiffLine({ label, oldVal, newVal, changed }) {
  return (
    <div className={`diff-line ${changed ? 'diff-changed' : 'diff-unchanged'}`}>
      <span className="diff-label">{label}</span>
      {changed ? (
        <span className="diff-values">
          <span className="diff-old">{oldVal ?? '—'}</span>
          <span className="diff-arrow">→</span>
          <span className="diff-new">{newVal ?? '—'}</span>
        </span>
      ) : (
        <span className="diff-same">{oldVal ?? '—'}</span>
      )}
    </div>
  );
}

export function CronDiffViewer({ cronA, cronB }) {
  const { diff, isValid, error } = useCronDiff(cronA, cronB);

  if (!cronA && !cronB) {
    return <div className="diff-empty">Enter two cron expressions to compare.</div>;
  }

  if (error) {
    return <div className="diff-error">{error}</div>;
  }

  if (!isValid || !diff) {
    return <div className="diff-error">One or both expressions are invalid.</div>;
  }

  const humanA = (() => { try { return toHumanReadable(cronA); } catch { return null; } })();
  const humanB = (() => { try { return toHumanReadable(cronB); } catch { return null; } })();

  const fields = [
    { label: 'Minute', key: 'minute' },
    { label: 'Hour', key: 'hour' },
    { label: 'Day of Month', key: 'dayOfMonth' },
    { label: 'Month', key: 'month' },
    { label: 'Day of Week', key: 'dayOfWeek' },
  ];

  return (
    <div className="cron-diff-viewer">
      <div className="diff-headers">
        <div className="diff-header-a"><strong>A:</strong> <code>{cronA}</code>{humanA && <span> — {humanA}</span>}</div>
        <div className="diff-header-b"><strong>B:</strong> <code>{cronB}</code>{humanB && <span> — {humanB}</span>}</div>
      </div>
      <div className="diff-fields">
        {fields.map(({ label, key }) => (
          <DiffLine
            key={key}
            label={label}
            oldVal={diff[key]?.a}
            newVal={diff[key]?.b}
            changed={diff[key]?.changed}
          />
        ))}
      </div>
      {diff.identical && (
        <div className="diff-identical">✓ Expressions are identical</div>
      )}
    </div>
  );
}
