import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PresetSelector, PRESETS } from '../PresetSelector';

describe('PresetSelector', () => {
  it('renders the select element with a default empty option', () => {
    render(<PresetSelector onSelect={() => {}} currentValue="" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('-- choose a preset --')).toBeInTheDocument();
  });

  it('renders all preset options', () => {
    render(<PresetSelector onSelect={() => {}} currentValue="" />);
    PRESETS.forEach((preset) => {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    });
  });

  it('calls onSelect with the chosen value when user selects a preset', () => {
    const onSelect = jest.fn();
    render(<PresetSelector onSelect={onSelect} currentValue="" />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '0 0 * * *' },
    });
    expect(onSelect).toHaveBeenCalledWith('0 0 * * *');
  });

  it('does not call onSelect when empty option is selected', () => {
    const onSelect = jest.fn();
    render(<PresetSelector onSelect={onSelect} currentValue="0 * * * *" />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '' },
    });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows the matched preset as selected when currentValue matches', () => {
    render(<PresetSelector onSelect={() => {}} currentValue="*/5 * * * *" />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('*/5 * * * *');
  });

  it('falls back to empty value when currentValue has no matching preset', () => {
    render(<PresetSelector onSelect={() => {}} currentValue="1 2 3 4 5" />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('');
  });
});
