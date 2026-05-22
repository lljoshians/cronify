import { useState, useCallback } from 'react';

const STORAGE_KEY = 'cronify_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore storage errors
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadFavorites());

  const addFavorite = useCallback((expression, label = '') => {
    setFavorites(prev => {
      if (prev.some(f => f.expression === expression)) return prev;
      const next = [
        ...prev,
        { expression, label: label.trim() || expression, addedAt: Date.now() }
      ];
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((expression) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.expression !== expression);
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (expression) => favorites.some(f => f.expression === expression),
    [favorites]
  );

  const renameFavorite = useCallback((expression, newLabel) => {
    setFavorites(prev => {
      const next = prev.map(f =>
        f.expression === expression ? { ...f, label: newLabel.trim() || expression } : f
      );
      saveFavorites(next);
      return next;
    });
  }, []);

  return { favorites, addFavorite, removeFavorite, isFavorite, renameFavorite };
}
