import React from 'react';
import { render, screen } from '@testing-library/react';
import { CronDiffViewer } from '../CronDiffViewer';

describe('CronDiffViewer', () => {
  it('shows placeholder when both inputs are empty', () => {
    render(<CronDiffViewer cronA="" cronB="" />);
    expect(screen.getByText(/enter two cron expressions/i)).toBeInTheDocument();
  });

  it('shows error for invalid expressions', () => {
    render(<CronDiffViewer cronA="bad expr" cronB="also bad" />);
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('renders field rows for two valid expressions', () => {
    render(<CronDiffViewer cronA="0 9 * * 1" cronB="0 17 * * 5" />);
    expect(screen.getByText('Minute')).toBeInTheDocument();
    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
  });

  it('shows both cron expressions in headers', () => {
    render(<CronDiffViewer cronA="0 9 * * 1" cronB="0 17 * * 5" />);
    expect(screen.getByText('0 9 * * 1')).toBeInTheDocument();
    expect(screen.getByText('0 17 * * 5')).toBeInTheDocument();
  });

  it('shows identical message when expressions match', () => {
    render(<CronDiffViewer cronA="*/5 * * * *" cronB="*/5 * * * *" />);
    expect(screen.getByText(/identical/i)).toBeInTheDocument();
  });

  it('renders arrow between changed values', () => {
    render(<CronDiffViewer cronA="0 9 * * 1" cronB="0 17 * * 1" />);
    const arrows = screen.getAllByText('→');
    expect(arrows.length).toBeGreaterThan(0);
  });
});
