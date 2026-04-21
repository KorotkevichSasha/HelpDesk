import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import CitySearch from './components/CitySearch.jsx';

const CITIES = {
  Минск: {
    current: {
      city: 'Минск', country: 'BY', temp: 12, feels_like: 9,
      humidity: 74, wind: 4.2, description: 'Переменная облачность',
      icon: '02d', dt: 1712570400000,
    },
    forecast: [
      { date: 'Пн', temp_min: 8,  temp_max: 13, icon: '02d', description: 'Облачно' },
      { date: 'Вт', temp_min: 6,  temp_max: 10, icon: '10d', description: 'Дождь' },
      { date: 'Ср', temp_min: 5,  temp_max: 9,  icon: '13d', description: 'Снег' },
      { date: 'Чт', temp_min: 7,  temp_max: 12, icon: '03d', description: 'Облачно' },
      { date: 'Пт', temp_min: 10, temp_max: 15, icon: '01d', description: 'Ясно' },
    ],
  },
  Москва: {
    current: {
      city: 'Москва', country: 'RU', temp: 8, feels_like: 5,
      humidity: 80, wind: 6.1, description: 'Пасмурно',
      icon: '04d', dt: 1712570400000,
    },
    forecast: [
      { date: 'Пн', temp_min: 4,  temp_max: 9,  icon: '04d', description: 'Пасмурно' },
      { date: 'Вт', temp_min: 3,  temp_max: 7,  icon: '10d', description: 'Дождь' },
      { date: 'Ср', temp_min: 2,  temp_max: 6,  icon: '13d', description: 'Снег' },
      { date: 'Чт', temp_min: 5,  temp_max: 10, icon: '03d', description: 'Облачно' },
      { date: 'Пт', temp_min: 8,  temp_max: 14, icon: '01d', description: 'Ясно' },
    ],
  },
  Лондон: {
    current: {
      city: 'Лондон', country: 'GB', temp: 15, feels_like: 13,
      humidity: 68, wind: 5.5, description: 'Лёгкий дождь',
      icon: '10d', dt: 1712570400000,
    },
    forecast: [
      { date: 'Пн', temp_min: 12, temp_max: 16, icon: '10d', description: 'Дождь' },
      { date: 'Вт', temp_min: 11, temp_max: 15, icon: '09d', description: 'Ливень' },
      { date: 'Ср', temp_min: 10, temp_max: 14, icon: '03d', description: 'Облачно' },
      { date: 'Чт', temp_min: 13, temp_max: 17, icon: '02d', description: 'Переменно' },
      { date: 'Пт', temp_min: 14, temp_max: 19, icon: '01d', description: 'Ясно' },
    ],
  },
};

export { CITIES };

export default function App({ selectedCity = 'Минск', unit = 'C', geoStatus = '' }) {
  const data = CITIES[selectedCity] || CITIES['Минск'];

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🌤 WeatherApp</h1>
        <CitySearch cities={Object.keys(CITIES)} selected={selectedCity} />
        <div className="app__controls">
          <button
            className={`app__unit-btn${unit === 'C' ? ' app__unit-btn--active' : ''}`}
            onClick={() => renderAppFull(selectedCity, 'C', geoStatus)}
          >°C</button>
          <button
            className={`app__unit-btn${unit === 'F' ? ' app__unit-btn--active' : ''}`}
            onClick={() => renderAppFull(selectedCity, 'F', geoStatus)}
          >°F</button>
          <button className="app__geo-btn" onClick={handleGeo}>📍 Геолокация</button>
        </div>
        {geoStatus === 'loading' && (
          <p className="app__geo-status">📍 Определяем местоположение...</p>
        )}
        {geoStatus === 'denied' && (
          <p className="app__geo-status app__geo-status--denied">
            📍 Геолокация недоступна
          </p>
        )}
      </header>

      <main className="app__main">
        <div className="app__results" key={selectedCity + unit}>
          <WeatherCard data={data.current} unit={unit} />
          <ForecastList forecast={data.forecast} unit={unit} />
        </div>
      </main>
    </div>
  );
}

function handleGeo() {
  if (!navigator.geolocation) return;
  renderAppFull('Минск', 'C', 'loading');
  navigator.geolocation.getCurrentPosition(
    () => renderAppFull('Минск', 'C', ''),
    () => renderAppFull('Минск', 'C', 'denied')
  );
}

// импортируем renderApp из main через глобальную переменную
function renderAppFull(city, unit, geoStatus) {
  window.__renderApp(city, unit, geoStatus);
}
