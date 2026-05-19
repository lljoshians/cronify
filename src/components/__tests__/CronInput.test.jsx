import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CronInput } from '../CronInput';

describe('CronInput', () => {
  it('renders input and preset select', () => {
    render(<CronInput value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    render(<CronInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '* * * * *' } });
    expect(onChange).toHaveBeenCalledWith('* * * * *');
  });

  it('shows human-readable hint for valid expression', () => {
    render(<CronInput value="0 * * * *" onChange={() => {}} />);
    expect(screen.getByText(/every hour/i)).toBeInTheDocument();
  });

  it('shows error hint for invalid expression', () => {
    render(<CronInput value="99 * * * *" onChange={() => {}} />);
    expect(screen.getByText(/invalid|error/i)).toBeInTheDocument();
  });

  it('loads preset when selected', () => {
    const onChange = jest.fn();
    render(<CronInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0 0 * * *' } });
    expect(onChange).toHaveBeenCalledWith('0 0 * * *');
  });

  it('applies error class to input for invalid non-empty value', () => {
    render(<CronInput value="abc" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input.className).toMatch(/error/);
  });

  it('does not apply error class when value is empty', () => {
    render(<CronInput value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input.className).not.toMatch(/error/);
  });
});
