/**
 * Computes the next N run times for a cron expression in the user's local timezone
 */

import { parseCron } from './cronParser.js';

function matchesField(value, date, fieldType) {
  const getVal = () => {
    switch (fieldType) {
      case 'minute':     return date.getMinutes();
      case 'hour':       return date.getHours();
      case 'dayOfMonth': return date.getDate();
      case 'month':      return date.getMonth() + 1;
      case 'dayOfWeek':  return date.getDay();
    }
  };

  if (value === '*') return true;
  const current = getVal();

  if (value.includes('/')) {
    const [range, step] = value.split('/');
    const stepNum = Number(step);
    if (range === '*') return current % stepNum === 0;
    const start = Number(range.split('-')[0]);
    return current >= start && (current - start) % stepNum === 0;
  }

  if (value.includes(',')) {
    return value.split(',').map(Number).includes(current);
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-').map(Number);
    return current >= start && current <= end;
  }

  const num = Number(value);
  // day-of-week: 7 is also Sunday
  if (fieldType === 'dayOfWeek' && num === 7) return current === 0;
  return current === num;
}

export function getNextRuns(expression, count = 5, fromDate = new Date()) {
  const { valid, fields, error } = parseCron(expression);
  if (!valid) return { runs: [], error };

  const runs = [];
  const cursor = new Date(fromDate);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1); // start from next minute

  const MAX_ITERATIONS = 500000;
  let iterations = 0;

  while (runs.length < count && iterations < MAX_ITERATIONS) {
    iterations++;
    const matches = ['minute','hour','dayOfMonth','month','dayOfWeek']
      .every(f => matchesField(fields[f], cursor, f));

    if (matches) {
      runs.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return { runs, error: null };
}
