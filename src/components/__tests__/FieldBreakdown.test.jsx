import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldBreakdown } from '../FieldBreakdown';

describe('FieldBreakdown', () => {
  it('renders all five field labels for a valid expression', () => {
    render(<FieldBreakdown expression="30 9 * * 1-5" />);
    expect(screen.getByText('Minute')).toBeInTheDocument();
    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
  });

  it('shows the correct field values', () => {
    render(<FieldBreakdown expression="30 9 * * 1-5" />);
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getAllByText('*').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('1-5')).toBeInTheDocument();
  });

  it('returns null for an invalid expression', () => {
    const { container } = render(<FieldBreakdown expression="not valid" />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null for an empty expression', () => {
    const { container } = render(<FieldBreakdown expression="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows range hints for each field', () => {
    render(<FieldBreakdown expression="* * * * *" />);
    expect(screen.getByText('Range: 0–59')).toBeInTheDocument();
    expect(screen.getByText('Range: 0–23')).toBeInTheDocument();
    expect(screen.getByText('Range: 1–31')).toBeInTheDocument();
  });
});
