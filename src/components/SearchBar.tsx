import React, { useState, useCallback } from 'react';
import { ID } from '../model/types';
import { useTree } from '../store/treeContext';
import { searchMembers } from '../model/selectors';

interface Props {
  onHighlight: (ids: Set<ID>) => void;
}

export default function SearchBar({ onHighlight }: Props) {
  const { state, dispatch } = useTree();
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setQuery(q);
      const results = searchMembers(state.tree, q);
      onHighlight(new Set(results.map((m) => m.id)));

      // Auto-select if exactly one result.
      if (results.length === 1) {
        dispatch({ type: 'SELECT_MEMBER', payload: results[0].id });
      }
    },
    [state.tree, dispatch, onHighlight]
  );

  const handleClear = () => {
    setQuery('');
    onHighlight(new Set());
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search members…"
        value={query}
        onChange={handleChange}
        aria-label="Search family members"
      />
      {query && (
        <button className="search-clear" onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
