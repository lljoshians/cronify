import React from 'react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Daily at noon', value: '0 12 * * *' },
  { label: 'Every weekday', value: '0 9 * * 1-5' },
  { label: 'Weekly (Sunday)', value: '0 0 * * 0' },
  { label: 'Monthly (1st)', value: '0 0 1 * *' },
  { label: 'Yearly (Jan 1)', value: '0 0 1 1 *' },
];

export function PresetSelector({ onSelect, currentValue }) {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val) onSelect(val);
  };

  const matchedPreset = PRESETS.find((p) => p.value === currentValue);

  return (
    <div className="preset-selector">
      <label htmlFor="preset-select" className="preset-label">
        Presets
      </label>
      <select
        id="preset-select"
        onChange={handleChange}
        value={matchedPreset ? matchedPreset.value : ''}
        className="preset-select"
      >
        <option value="">-- choose a preset --</option>
        {PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { PRESETS };
