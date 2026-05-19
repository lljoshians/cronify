/**
 * Converts a parsed cron expression into a human-readable description
 */

const MONTH_LABELS = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
const DOW_LABELS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function describeField(value, unit, labels = null) {
  if (value === '*') return `every ${unit}`;

  if (value.includes('/')) {
    const [range, step] = value.split('/');
    const base = range === '*' ? `every ${unit}` : `${unit}s ${range}`;
    return `every ${step} ${unit}s${range !== '*' ? ` starting at ${range}` : ''}`;
  }

  if (value.includes(',')) {
    const items = value.split(',').map(v => labels ? (labels[Number(v) - (unit === 'day of week' ? 0 : 1)] || v) : v);
    return `on ${items.join(', ')}`;
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-');
    const s = labels ? (labels[Number(start) - (unit === 'day of week' ? 0 : 1)] || start) : start;
    const e = labels ? (labels[Number(end)   - (unit === 'day of week' ? 0 : 1)] || end)   : end;
    return `from ${s} through ${e}`;
  }

  if (labels) {
    const idx = unit === 'day of week' ? Number(value) : Number(value) - 1;
    return labels[idx] || value;
  }

  return `at ${unit} ${value}`;
}

export function toHumanReadable(fields) {
  if (!fields) return '';

  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

  const minuteDesc = describeField(minute, 'minute');
  const hourDesc   = describeField(hour,   'hour');
  const domDesc    = describeField(dayOfMonth, 'day of month');
  const monthDesc  = describeField(month,  'month', MONTH_LABELS);
  const dowDesc    = describeField(dayOfWeek, 'day of week', DOW_LABELS);

  const timePart = (minute === '*' && hour === '*')
    ? 'every minute'
    : (hour === '*')
      ? `${minuteDesc} of every hour`
      : `at ${hour === '*' ? 'every hour' : hour}:${minute === '*' ? '00' : minute.padStart(2, '0')}`;

  const datePart = [];
  if (dayOfMonth !== '*') datePart.push(`on day ${domDesc} of the month`);
  if (dayOfWeek  !== '*') datePart.push(`on ${dowDesc}`);
  if (month      !== '*') datePart.push(`in ${monthDesc}`);

  return [timePart, ...datePart].join(', ');
}
