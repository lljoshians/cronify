import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesPanel } from '../FavoritesPanel';
import * as useFavoritesModule from '../../hooks/useFavorites';

const mockHook = {
  favorites: [],
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  isFavorite: jest.fn(() => false),
  renameFavorite: jest.fn()
};

beforeEach(() => {
  jest.spyOn(useFavoritesModule, 'useFavorites').mockReturnValue(mockHook);
  jest.clearAllMocks();
});

describe('FavoritesPanel', () => {
  it('renders empty state message when no favorites', () => {
    render(<FavoritesPanel currentExpression="* * * * *" onSelect={jest.fn()} />);
    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
  });

  it('shows save button for unsaved expression', () => {
    render(<FavoritesPanel currentExpression="0 9 * * 1" onSelect={jest.fn()} />);
    expect(screen.getByText(/save current/i)).toBeInTheDocument();
  });

  it('shows saved state when expression is a favorite', () => {
    mockHook.isFavorite.mockReturnValue(true);
    render(<FavoritesPanel currentExpression="0 9 * * 1" onSelect={jest.fn()} />);
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });

  it('calls addFavorite when toggling unsaved expression', () => {
    render(<FavoritesPanel currentExpression="0 9 * * 1" onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText(/save current/i));
    expect(mockHook.addFavorite).toHaveBeenCalledWith('0 9 * * 1');
  });

  it('calls removeFavorite when toggling saved expression', () => {
    mockHook.isFavorite.mockReturnValue(true);
    render(<FavoritesPanel currentExpression="0 9 * * 1" onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText(/saved/i));
    expect(mockHook.removeFavorite).toHaveBeenCalledWith('0 9 * * 1');
  });

  it('renders favorite items and calls onSelect on click', () => {
    mockHook.favorites = [{ expression: '0 0 * * *', label: 'Midnight', addedAt: 1 }];
    const onSelect = jest.fn();
    render(<FavoritesPanel currentExpression="" onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Midnight'));
    expect(onSelect).toHaveBeenCalledWith('0 0 * * *');
  });
});
