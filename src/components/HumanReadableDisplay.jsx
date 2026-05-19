import React from 'react';
import { toHumanReadable } from '../parser/humanReadable';
import { validateCron } from '../parser/validateCron';

export function HumanReadableDisplay({ expression }) {
  if (!expression || !expression.trim()) {
    return (
      <p className="human-readable human-readable--empty">
        Enter a cron expression above to see a description.
      </p>
    );
  }

  const validation = validateCron(expression);

  if (!validation.valid) {
    return (
      <p className="human-readable human-readable--error">
        Invalid expression: {validation.error}
      </p>
    );
  }

  let description;
  try {
    description = toHumanReadable(expression);
  } catch {
    return (
      <p className="human-readable human-readable--error">
        Could not describe this expression.
      </p>
    );
  }

  return (
    <p className="human-readable human-readable--valid">
      <span className="human-readable__icon" aria-hidden="true">🕐</span>
      {description}
    </p>
  );
}
