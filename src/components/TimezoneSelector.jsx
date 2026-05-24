import React, { useState, useMemo } from 'react';

/**
 * TimezoneSelector — lets the user pick a timezone for next-run previews.
 * Falls back to the browser's local timezone on first render.
 */

// Build a deduplicated, sorted list of IANA timezone strings.
// Intl.supportedValuesOf is available in modern browsers; we fall back to a
// curated shortlist so the component never crashes in older environments.
function getSupportedTimezones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch (_) {
    // ignore
  }
  // Curated fallback list covering the most common zones
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];
}

/**
 * Returns the UTC offset string (e.g. "UTC+05:30") for a given timezone.
 * Used as a visual hint next to each option.
 */
function getUtcOffset(tz) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    return offsetPart ? offsetPart.value : '';
  } catch (_) {
    return '';
  }
}

export function TimezoneSelector({ value, onChange }) {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [search, setSearch] = useState('');

  const allTimezones = useMemo(() => getSupportedTimezones(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allTimezones;
    return allTimezones.filter((tz) => tz.toLowerCase().includes(q));
  }, [search, allTimezones]);

  const current = value || localTz;

  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <div className="timezone-selector">
      <label htmlFor="tz-search" className="timezone-selector__label">
        Timezone
      </label>

      <input
        id="tz-search"
        type="search"
        className="timezone-selector__search"
        placeholder="Filter timezones…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Filter timezone list"
      />

      <select
        id="tz-select"
        className="timezone-selector__select"
        value={current}
        onChange={handleChange}
        size={5}
        aria-label="Select timezone"
      >
        {filtered.length === 0 && (
          <option disabled value="">
            No timezones match
          </option>
        )}
        {filtered.map((tz) => (
          <option key={tz} value={tz}>
            {tz} ({getUtcOffset(tz)})
          </option>
        ))}
      </select>

      <p className="timezone-selector__current">
        Selected:{' '}
        <strong>{current}</strong>
        {current === localTz && ' (local)'}
      </p>
    </div>
  );
}

export default TimezoneSelector;
