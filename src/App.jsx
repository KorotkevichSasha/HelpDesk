import { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import { fetchWeather } from './api/weather.js';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoStatus, setGeoStatus] = useState(''); // 'loading' | 'denied' | ''

  // Геолокация при первом запуске
  useEffect(() => {
    if (!navigator.geolocation) return;
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async () => {
        setGeoStatus('');
        await handleSearch('Минск');
      },
      () => setGeoStatus('denied')
    );
  }, []);

  function requestGeo() {
    if (!navigator.geolocation) return;
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async () => {
        setGeoStatus('');
        await handleSearch('Минск');
      },
      () => setGeoStatus('denied')
    );
  }

  async function handleSearch(city) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (e) {
      setError(e.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🌤 WeatherApp</h1>
        <CitySearch onSearch={handleSearch} loading={loading} />
        {geoStatus === 'loading' && (
          <p className="app__geo-status">📍 Определяем местоположение...</p>
        )}
        {geoStatus === 'denied' && (
          <p className="app__geo-status app__geo-status--denied">
            📍 Геолокация недоступна (HTTP или нет разрешения) —{' '}
            <button className="app__geo-retry" onClick={requestGeo}>попробовать снова</button>
          </p>
        )}
        {geoStatus === '' && !weather && (
          <button className="app__geo-btn" onClick={requestGeo}>📍 Моё местоположение</button>
        )}
      </header>

      <main className="app__main">
        {loading && (
          <div className="app__loading">
            <span className="app__spinner" />
            Загрузка...
          </div>
        )}

        {error && <div className="app__error" role="alert">⚠️ {error}</div>}

        {!loading && weather && (
          <div className="app__results">
            <WeatherCard data={weather.current} />
            <ForecastList forecast={weather.forecast} />
          </div>
        )}

        {!loading && !weather && !error && (
          <div className="app__placeholder">
            <div className="app__placeholder-icon">🌍</div>
            <p>Введите название города для поиска погоды</p>
            <p className="app__hint">Попробуйте: Минск, Москва, Лондон</p>
          </div>
        )}
      </main>
    </div>
  );
}
