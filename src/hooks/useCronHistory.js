import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cronify_history';
const MAX_HISTORY = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

export function useCronHistory() {
  const [history, setHistory] = useState(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addEntry = useCallback((expression, label = '') => {
    if (!expression || !expression.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(e => e.expression !== expression);
      const entry = {
        expression,
        label,
        addedAt: new Date().toISOString(),
      };
      return [entry, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeEntry = useCallback((expression) => {
    setHistory(prev => prev.filter(e => e.expression !== expression));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
