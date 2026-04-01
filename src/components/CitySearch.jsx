import { useState } from 'react';

const SUGGESTIONS = ['Минск', 'Москва', 'Лондон', 'Берлин', 'Париж', 'Токио', 'Нью-Йорк'];

/**
 * CitySearch — поиск города с подсказками
 */
export default function CitySearch({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  function handleChange(e) {
    const v = e.target.value;
    setValue(v);
    setSuggestions(
      v.length > 0
        ? SUGGESTIONS.filter((s) => s.toLowerCase().startsWith(v.toLowerCase()))
        : []
    );
  }

  function submit(city) {
    const q = city || value;
    if (!q.trim()) return;
    setValue(q);
    setSuggestions([]);
    onSearch(q.trim());
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') submit();
  }

  return (
    <div className="city-search">
      <div className="city-search__row">
        <input
          className="city-search__input"
          type="text"
          placeholder="Введите город..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Поиск города"
          disabled={loading}
        />
        <button
          className="city-search__btn"
          onClick={() => submit()}
          disabled={loading || !value.trim()}
          aria-label="Найти"
        >
          {loading ? '⏳' : '🔍'}
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="city-search__suggestions" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s}
              className="city-search__suggestion"
              role="option"
              onClick={() => submit(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
