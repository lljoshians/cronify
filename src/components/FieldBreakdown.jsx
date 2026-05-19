import React from 'react';
import { parseCron } from '../parser/cronParser';

const FIELD_LABELS = [
  { key: 'minute', label: 'Minute' },
  { key: 'hour', label: 'Hour' },
  { key: 'dayOfMonth', label: 'Day of Month' },
  { key: 'month', label: 'Month' },
  { key: 'dayOfWeek', label: 'Day of Week' },
];

const FIELD_RANGES = {
  minute: '0–59',
  hour: '0–23',
  dayOfMonth: '1–31',
  month: '1–12',
  dayOfWeek: '0–6',
};

export function FieldBreakdown({ expression }) {
  let parsed = null;
  try {
    parsed = parseCron(expression);
  } catch {
    return null;
  }

  if (!parsed) return null;

  return (
    <div className="field-breakdown">
      <h3 className="field-breakdown__title">Field Breakdown</h3>
      <div className="field-breakdown__grid">
        {FIELD_LABELS.map(({ key, label }) => (
          <div key={key} className="field-breakdown__item">
            <span className="field-breakdown__label">{label}</span>
            <code className="field-breakdown__value">{parsed[key]}</code>
            <span className="field-breakdown__range">Range: {FIELD_RANGES[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
