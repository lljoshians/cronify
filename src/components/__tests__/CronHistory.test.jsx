import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CronHistory } from '../CronHistory';
import * as useCronHistoryModule from '../../hooks/useCronHistory';

const mockHistory = [
  { expression: '0 9 * * 1', label: 'Monday 9am', addedAt: '2024-06-01T09:00:00.000Z' },
  { expression: '*/5 * * * *', label: '', addedAt: '2024-06-02T10:00:00.000Z' },
];

const mockHook = (overrides = {}) => ({
  history: mockHistory,
  addEntry: jest.fn(),
  removeEntry: jest.fn(),
  clearHistory: jest.fn(),
  ...overrides,
});

describe('CronHistory', () => {
  it('shows empty state when history is empty', () => {
    jest.spyOn(useCronHistoryModule, 'useCronHistory').mockReturnValue(mockHook({ history: [] }));
    render(<CronHistory />);
    expect(screen.getByText(/no history yet/i)).toBeInTheDocument();
  });

  it('renders history entries', () => {
    jest.spyOn(useCronHistoryModule, 'useCronHistory').mockReturnValue(mockHook());
    render(<CronHistory />);
    expect(screen.getByText('0 9 * * 1')).toBeInTheDocument();
    expect(screen.getByText('*/5 * * * *')).toBeInTheDocument();
    expect(screen.getByText('Monday 9am')).toBeInTheDocument();
  });

  it('calls onSelect with the expression when entry is clicked', () => {
    jest.spyOn(useCronHistoryModule, 'useCronHistory').mockReturnValue(mockHook());
    const onSelect = jest.fn();
    render(<CronHistory onSelect={onSelect} />);
    fireEvent.click(screen.getByTitle('Use: 0 9 * * 1'));
    expect(onSelect).toHaveBeenCalledWith('0 9 * * 1');
  });

  it('calls removeEntry when remove button is clicked', () => {
    const removeEntry = jest.fn();
    jest.spyOn(useCronHistoryModule, 'useCronHistory').mockReturnValue(mockHook({ removeEntry }));
    render(<CronHistory />);
    fireEvent.click(screen.getByLabelText('Remove 0 9 * * 1 from history'));
    expect(removeEntry).toHaveBeenCalledWith('0 9 * * 1');
  });

  it('calls clearHistory when Clear All is clicked', () => {
    const clearHistory = jest.fn();
    jest.spyOn(useCronHistoryModule, 'useCronHistory').mockReturnValue(mockHook({ clearHistory }));
    render(<CronHistory />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(clearHistory).toHaveBeenCalled();
  });

  afterEach(() => jest.restoreAllMocks());
});
