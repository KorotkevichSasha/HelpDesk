import { renderApp } from '../main.jsx';

const SUGGESTIONS = ['Минск', 'Москва', 'Лондон', 'Берлин', 'Париж', 'Токио', 'Нью-Йорк'];

/**
 * CitySearch — поиск города с подсказками (datalist)
 * Без useState/useEffect
 */
export default function CitySearch({ cities = [], selected = '' }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) renderApp(val);
    }
  }

  function handleSearch() {
    const input = document.querySelector('.city-search__input');
    const val = input?.value.trim();
    if (val) renderApp(val);
  }

  return (
    <div className="city-search">
      <div className="city-search__row">
        <input
          className="city-search__input"
          type="text"
          placeholder="Введите город..."
          onKeyDown={handleKeyDown}
          aria-label="Поиск города"
          list="city-suggestions"
        />
        <datalist id="city-suggestions">
          {SUGGESTIONS.map((s) => <option key={s} value={s} />)}
        </datalist>
        <button
          className="city-search__btn"
          onClick={handleSearch}
          aria-label="Найти"
        >
          🔍
        </button>
      </div>
      <div className="city-search__cities">
        {cities.map((city) => (
          <button
            key={city}
            className={`city-search__city-btn${selected === city ? ' city-search__city-btn--active' : ''}`}
            onClick={() => renderApp(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
