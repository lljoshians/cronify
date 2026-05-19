/**
 * Parses and validates cron expressions (5-field standard format)
 * Fields: minute hour day-of-month month day-of-week
 */

const FIELD_RANGES = {
  minute:     { min: 0, max: 59 },
  hour:       { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month:      { min: 1, max: 12 },
  dayOfWeek:  { min: 0, max: 7 },
};

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const MONTH_NAMES = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const DOW_NAMES   = ['sun','mon','tue','wed','thu','fri','sat'];

function replaceNames(value, names, offset = 1) {
  let result = value.toLowerCase();
  names.forEach((name, i) => {
    result = result.replace(new RegExp(name, 'g'), String(i + offset));
  });
  return result;
}

function validateField(raw, fieldName) {
  const { min, max } = FIELD_RANGES[fieldName];
  let value = raw;

  if (fieldName === 'month')    value = replaceNames(value, MONTH_NAMES, 1);
  if (fieldName === 'dayOfWeek') value = replaceNames(value, DOW_NAMES, 0);

  if (value === '*') return { valid: true };

  const parts = value.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      if (!step || isNaN(step) || Number(step) < 1) return { valid: false, error: `Invalid step in "${part}"` };
      if (range !== '*') {
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || start < min || start > max) return { valid: false, error: `Out of range in "${part}"` };
        if (end !== undefined && (isNaN(end) || end < start || end > max)) return { valid: false, error: `Invalid range in "${part}"` };
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end)
        return { valid: false, error: `Invalid range "${part}" for ${fieldName}` };
    } else {
      const num = Number(part);
      if (isNaN(num) || num < min || num > max)
        return { valid: false, error: `Value ${part} out of range [${min}-${max}] for ${fieldName}` };
    }
  }
  return { valid: true };
}

export function parseCron(expression) {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: 'Expression must be a non-empty string', fields: null };
  }

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: `Expected 5 fields, got ${parts.length}`, fields: null };
  }

  const fields = {};
  for (let i = 0; i < FIELD_NAMES.length; i++) {
    const name = FIELD_NAMES[i];
    const result = validateField(parts[i], name);
    if (!result.valid) return { valid: false, error: result.error, fields: null };
    fields[name] = parts[i];
  }

  return { valid: true, error: null, fields };
}

export { FIELD_NAMES, FIELD_RANGES };
