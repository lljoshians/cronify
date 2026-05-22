import React, { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';

export function FavoritesPanel({ currentExpression, onSelect }) {
  const { favorites, addFavorite, removeFavorite, isFavorite, renameFavorite } = useFavorites();
  const [editingExpr, setEditingExpr] = useState(null);
  const [editLabel, setEditLabel] = useState('');

  const handleToggle = () => {
    if (isFavorite(currentExpression)) {
      removeFavorite(currentExpression);
    } else {
      addFavorite(currentExpression);
    }
  };

  const handleRenameStart = (fav) => {
    setEditingExpr(fav.expression);
    setEditLabel(fav.label);
  };

  const handleRenameSubmit = (expression) => {
    renameFavorite(expression, editLabel);
    setEditingExpr(null);
  };

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h3>Favorites</h3>
        {currentExpression && (
          <button onClick={handleToggle} className="fav-toggle-btn">
            {isFavorite(currentExpression) ? '★ Saved' : '☆ Save current'}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="favorites-empty">No favorites yet. Save a cron expression to get started.</p>
      ) : (
        <ul className="favorites-list">
          {favorites.map(fav => (
            <li key={fav.expression} className="favorite-item">
              {editingExpr === fav.expression ? (
                <input
                  autoFocus
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onBlur={() => handleRenameSubmit(fav.expression)}
                  onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(fav.expression)}
                  className="fav-rename-input"
                />
              ) : (
                <span className="fav-label" onClick={() => onSelect(fav.expression)}>
                  {fav.label}
                </span>
              )}
              <span className="fav-expr">{fav.expression}</span>
              <div className="fav-actions">
                <button onClick={() => handleRenameStart(fav)} title="Rename">✏️</button>
                <button onClick={() => removeFavorite(fav.expression)} title="Remove">🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
