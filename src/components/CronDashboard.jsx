import React from 'react';
import { CronInputWithRuns } from './CronInputWithRuns';
import { FieldBreakdown } from './FieldBreakdown';
import { HumanReadableDisplay } from './HumanReadableDisplay';
import { useCronState } from '../hooks/useCronState';
import { useCronValidation } from '../hooks/useCronValidation';

export function CronDashboard() {
  const { expression, setExpression } = useCronState();
  const { isValid } = useCronValidation(expression);

  return (
    <div className="cron-dashboard">
      <header className="cron-dashboard__header">
        <h1 className="cron-dashboard__title">Cronify</h1>
        <p className="cron-dashboard__subtitle">
          Write, test, and schedule cron expressions with ease.
        </p>
      </header>

      <main className="cron-dashboard__main">
        <section className="cron-dashboard__section">
          <CronInputWithRuns
            expression={expression}
            onChange={setExpression}
          />
        </section>

        {isValid && (
          <>
            <section className="cron-dashboard__section">
              <HumanReadableDisplay expression={expression} />
            </section>

            <section className="cron-dashboard__section">
              <FieldBreakdown expression={expression} />
            </section>
          </>
        )}
      </main>

      <footer className="cron-dashboard__footer">
        <p>Times shown in your local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
      </footer>
    </div>
  );
}
