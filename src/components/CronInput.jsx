import React, { useId } from 'react';
import { useCronValidation } from '../hooks/useCronValidation';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every Monday', value: '0 0 * * 1' },
  { label: 'Every month', value: '0 0 1 * *' },
];

export function CronInput({ value, onChange }) {
  const inputId = useId();
  const { isValid, errors, humanReadable } = useCronValidation(value);

  function handlePreset(e) {
    onChange(e.target.value);
  }

  return (
    <div className="cron-input">
      <label htmlFor={inputId} className="cron-input__label">
        Cron Expression
      </label>

      <div className="cron-input__row">
        <input
          id={inputId}
          type="text"
          className={`cron-input__field ${!isValid && value ? 'cron-input__field--error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="* * * * *"
          spellCheck={false}
          aria-describedby={`${inputId}-hint`}
        />

        <select
          className="cron-input__presets"
          defaultValue=""
          onChange={handlePreset}
          aria-label="Load a preset expression"
        >
          <option value="" disabled>Presets…</option>
          {PRESETS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <p id={`${inputId}-hint`} className="cron-input__hint">
        {isValid && humanReadable
          ? <span className="cron-input__hint--ok">✓ {humanReadable}</span>
          : errors.length > 0
          ? <span className="cron-input__hint--error">{errors[0]}</span>
          : <span className="cron-input__hint--placeholder">Enter a 5-field cron expression</span>}
      </p>
    </div>
  );
}
