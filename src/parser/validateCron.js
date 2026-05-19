/**
 * Validates a full cron expression and returns structured error info.
 */

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];

const FIELD_RANGES = [
  { min: 0, max: 59 },  // minute
  { min: 0, max: 23 },  // hour
  { min: 1, max: 31 },  // day of month
  { min: 1, max: 12 },  // month
  { min: 0, max: 7 },   // day of week (0 and 7 = Sunday)
];

const MONTH_NAMES = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const DOW_NAMES   = ['sun','mon','tue','wed','thu','fri','sat'];

function normalizeNames(value, index) {
  if (index === 3) {
    return value.toLowerCase().replace(
      new RegExp(MONTH_NAMES.join('|'), 'gi'),
      m => String(MONTH_NAMES.indexOf(m.toLowerCase()) + 1)
    );
  }
  if (index === 4) {
    return value.toLowerCase().replace(
      new RegExp(DOW_NAMES.join('|'), 'gi'),
      d => String(DOW_NAMES.indexOf(d.toLowerCase()))
    );
  }
  return value;
}

function validateSingleValue(raw, range) {
  const n = Number(raw);
  if (!Number.isInteger(n)) return `'${raw}' is not an integer`;
  if (n < range.min || n > range.max) return `${n} out of range [${range.min}-${range.max}]`;
  return null;
}

function validateToken(token, range) {
  if (token === '*') return null;
  if (token.includes('/')) {
    const [base, step] = token.split('/');
    if (base !== '*') {
      const err = validateSingleValue(base, range);
      if (err) return err;
    }
    const s = Number(step);
    if (!Number.isInteger(s) || s < 1) return `invalid step '${step}'`;
    return null;
  }
  if (token.includes('-')) {
    const [lo, hi] = token.split('-');
    const e1 = validateSingleValue(lo, range);
    if (e1) return e1;
    const e2 = validateSingleValue(hi, range);
    if (e2) return e2;
    if (Number(lo) > Number(hi)) return `range start ${lo} > end ${hi}`;
    return null;
  }
  return validateSingleValue(token, range);
}

function validateField(value, index) {
  const normalized = normalizeNames(value, index);
  const range = FIELD_RANGES[index];
  const tokens = normalized.split(',');
  for (const token of tokens) {
    const err = validateToken(token.trim(), range);
    if (err) return { field: FIELD_NAMES[index], error: err };
  }
  return null;
}

export function validateCron(expression) {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, errors: ['Expression must be a non-empty string'] };
  }
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, errors: [`Expected 5 fields, got ${parts.length}`] };
  }
  const errors = parts
    .map((part, i) => validateField(part, i))
    .filter(Boolean)
    .map(e => `${e.field}: ${e.error}`);
  return { valid: errors.length === 0, errors };
}
