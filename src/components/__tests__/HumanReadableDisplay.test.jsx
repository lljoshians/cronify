import React from 'react';
import { render, screen } from '@testing-library/react';
import { HumanReadableDisplay } from '../HumanReadableDisplay';

describe('HumanReadableDisplay', () => {
  it('shows placeholder text when expression is empty', () => {
    render(<HumanReadableDisplay expression="" />);
    expect(screen.getByText(/enter a cron expression/i)).toBeInTheDocument();
  });

  it('shows error for invalid expression', () => {
    render(<HumanReadableDisplay expression="not a cron" />);
    expect(screen.getByText(/invalid expression/i)).toBeInTheDocument();
  });

  it('renders a human-readable description for a valid expression', () => {
    render(<HumanReadableDisplay expression="0 9 * * 1-5" />);
    const el = document.querySelector('.human-readable--valid');
    expect(el).toBeInTheDocument();
    expect(el.textContent.length).toBeGreaterThan(5);
  });

  it('applies the valid class for a valid expression', () => {
    render(<HumanReadableDisplay expression="*/5 * * * *" />);
    expect(document.querySelector('.human-readable--valid')).toBeInTheDocument();
  });

  it('shows placeholder for whitespace-only input', () => {
    render(<HumanReadableDisplay expression="   " />);
    expect(screen.getByText(/enter a cron expression/i)).toBeInTheDocument();
  });
});
