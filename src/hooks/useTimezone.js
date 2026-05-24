import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cronify_timezone';

/**
 * Loads the saved timezone from localStorage, falling back to the
 * browser's local timezone if nothing is stored.
 */
function loadTimezone() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Validate that it's a real timezone before trusting it
      Intl.DateTimeFormat(undefined, { timeZone: saved });
      return saved;
    }
  } catch {
    // Stored value was invalid, ignore it
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Persists the selected timezone to localStorage.
 * @param {string} tz
 */
function saveTimezone(tz) {
  try {
    localStorage.setItem(STORAGE_KEY, tz);
  } catch {
    // Storage might be unavailable (e.g. private browsing limits)
  }
}

/**
 * Formats a Date object according to the given timezone.
 * Returns a human-readable local time string.
 *
 * @param {Date} date
 * @param {string} timezone
 * @returns {string}
 */
export function formatInTimezone(date, timezone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/**
 * Hook that manages the active timezone selection with persistence.
 *
 * Returns:
 *   - timezone: the currently selected IANA timezone string
 *   - setTimezone: updates and persists the timezone
 *   - localTimezone: the browser's native timezone (read-only reference)
 *   - isLocal: whether the selected timezone matches the local one
 *   - resetToLocal: convenience function to revert to the local timezone
 */
export function useTimezone() {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [timezone, setTimezoneState] = useState(() => loadTimezone());

  // Keep localStorage in sync whenever timezone changes
  useEffect(() => {
    saveTimezone(timezone);
  }, [timezone]);

  const setTimezone = useCallback((tz) => {
    try {
      // Validate before accepting
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      setTimezoneState(tz);
    } catch {
      console.warn(`[useTimezone] Invalid timezone: "${tz}", ignoring.`);
    }
  }, []);

  const resetToLocal = useCallback(() => {
    setTimezoneState(localTimezone);
  }, [localTimezone]);

  const isLocal = timezone === localTimezone;

  return {
    timezone,
    setTimezone,
    localTimezone,
    isLocal,
    resetToLocal,
  };
}
