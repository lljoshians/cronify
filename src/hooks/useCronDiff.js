import { useMemo } from 'react';
import { parseCron } from '../parser/cronParser';
import { toHumanReadable } from '../parser/humanReadable';

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];

/**
 * Compare two cron expressions and return a diff of changed fields.
 * Returns null if either expression is invalid.
 */
export function diffCrons(exprA, exprB) {
  if (!exprA || !exprB) return null;

  const parsedA = parseCron(exprA);
  const parsedB = parseCron(exprB);

  if (!parsedA || !parsedB) return null;

  const fieldsA = [parsedA.minute, parsedA.hour, parsedA.dom, parsedA.month, parsedA.dow];
  const fieldsB = [parsedB.minute, parsedB.hour, parsedB.dom, parsedB.month, parsedB.dow];

  const changes = FIELD_NAMES.map((name, i) => ({
    field: name,
    from: fieldsA[i],
    to: fieldsB[i],
    changed: fieldsA[i] !== fieldsB[i],
  }));

  return {
    changes,
    hasChanges: changes.some((c) => c.changed),
    humanA: toHumanReadable(exprA),
    humanB: toHumanReadable(exprB),
  };
}

/**
 * Hook to reactively diff two cron expressions.
 * @param {string} exprA - baseline cron expression
 * @param {string} exprB - comparison cron expression
 */
export function useCronDiff(exprA, exprB) {
  const diff = useMemo(() => {
    try {
      return diffCrons(exprA, exprB);
    } catch {
      return null;
    }
  }, [exprA, exprB]);

  return diff;
}
