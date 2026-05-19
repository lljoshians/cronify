import React, { useState } from 'react';
import { parseCron } from '../parser/cronParser';
import { toHumanReadable } from '../parser/humanReadable';
import { getNextRuns } from '../parser/nextRuns';

function formatExport(expression, format, timezone) {
  const parsed = parseCron(expression);
  if (!parsed) return null;

  const human = toHumanReadable(parsed);
  const runs = getNextRuns(expression, 5, new Date());
  const runStrings = runs.map(d => d.toLocaleString('en-US', { timeZone: timezone }));

  if (format === 'json') {
    return JSON.stringify({ expression, human, timezone, nextRuns: runStrings }, null, 2);
  }

  if (format === 'text') {
    return [
      `Expression : ${expression}`,
      `Description: ${human}`,
      `Timezone   : ${timezone}`,
      `Next runs  :`,
      ...runStrings.map(r => `  - ${r}`),
    ].join('\n');
  }

  if (format === 'curl') {
    const payload = JSON.stringify({ expression, timezone });
    return `curl -X POST https://api.example.com/schedule \\
  -H 'Content-Type: application/json' \\
  -d '${payload}'`;
  }

  return null;
}

export function ScheduleExporter({ expression, timezone = 'UTC' }) {
  const [format, setFormat] = useState('json');
  const [copied, setCopied] = useState(false);

  const output = formatExport(expression, format, timezone);

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!output) {
    return <p className="exporter-error">Invalid cron expression.</p>;
  }

  return (
    <div className="schedule-exporter">
      <div className="exporter-controls">
        {['json', 'text', 'curl'].map(f => (
          <button
            key={f}
            className={`format-btn${format === f ? ' active' : ''}`}
            onClick={() => setFormat(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="exporter-output">{output}</pre>
    </div>
  );
}
