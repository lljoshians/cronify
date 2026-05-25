import { useState, useMemo } from 'react';
import { toHumanReadable } from '../parser/humanReadable';

const PRESET_LIBRARY = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 5 minutes', expression: '*/5 * * * *' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Every 30 minutes', expression: '*/30 * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Every 2 hours', expression: '0 */2 * * *' },
  { label: 'Every day at midnight', expression: '0 0 * * *' },
  { label: 'Every day at noon', expression: '0 12 * * *' },
  { label: 'Every weekday at 9am', expression: '0 9 * * 1-5' },
  { label: 'Every Monday', expression: '0 0 * * 1' },
  { label: 'Every Sunday', expression: '0 0 * * 0' },
  { label: 'Every week', expression: '0 0 * * 0' },
  { label: 'First day of month', expression: '0 0 1 * *' },
  { label: 'Last day of month', expression: '0 0 28-31 * *' },
  { label: 'Every month', expression: '0 0 1 * *' },
  { label: 'Every quarter', expression: '0 0 1 */3 *' },
  { label: 'Every year', expression: '0 0 1 1 *' },
  { label: 'Twice a day', expression: '0 0,12 * * *' },
  { label: 'Every night at midnight', expression: '0 0 * * *' },
  { label: 'Every weekend', expression: '0 0 * * 6,0' },
];

export function useCronSearch() {
  const [query, setQuery] = useState('');

  const enrichedPresets = useMemo(() => {
    return PRESET_LIBRARY.map((preset) => {
      let human = '';
      try {
        human = toHumanReadable(preset.expression);
      } catch {
        human = preset.label;
      }
      return { ...preset, human };
    });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return enrichedPresets.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.human.toLowerCase().includes(q) ||
        p.expression.includes(q)
    );
  }, [query, enrichedPresets]);

  return { query, setQuery, results, allPresets: enrichedPresets };
}
