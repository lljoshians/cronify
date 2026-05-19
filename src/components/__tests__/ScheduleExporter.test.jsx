import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleExporter } from '../ScheduleExporter';

const VALID_EXPR = '0 9 * * 1-5';
const INVALID_EXPR = 'bad expr';

describe('ScheduleExporter', () => {
  it('renders format buttons', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="UTC" />);
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('TEXT')).toBeInTheDocument();
    expect(screen.getByText('CURL')).toBeInTheDocument();
  });

  it('shows JSON output by default', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="UTC" />);
    const pre = screen.getByRole('code') || document.querySelector('pre');
    expect(pre.textContent).toContain('"expression"');
    expect(pre.textContent).toContain(VALID_EXPR);
  });

  it('switches to text format on click', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="UTC" />);
    fireEvent.click(screen.getByText('TEXT'));
    const pre = document.querySelector('pre');
    expect(pre.textContent).toContain('Expression :');
    expect(pre.textContent).toContain('Next runs  :');
  });

  it('switches to curl format on click', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="UTC" />);
    fireEvent.click(screen.getByText('CURL'));
    const pre = document.querySelector('pre');
    expect(pre.textContent).toContain('curl -X POST');
    expect(pre.textContent).toContain(VALID_EXPR);
  });

  it('shows error message for invalid expression', () => {
    render(<ScheduleExporter expression={INVALID_EXPR} timezone="UTC" />);
    expect(screen.getByText(/invalid cron expression/i)).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="UTC" />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('includes timezone in JSON output', () => {
    render(<ScheduleExporter expression={VALID_EXPR} timezone="America/New_York" />);
    const pre = document.querySelector('pre');
    expect(pre.textContent).toContain('America/New_York');
  });
});
