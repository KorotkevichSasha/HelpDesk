import WeatherIcon from './WeatherIcon.jsx';
import Temperature from './Temperature.jsx';
import { convertTemperature, formatWindSpeed, getWindDescription } from '../utils/weather.js';

/**
 * WeatherCard — карточка текущей погоды
 * Props: data, unit ('C' | 'F')
 */
export default function WeatherCard({ data, unit = 'C' }) {
  const { city, country, temp, feels_like, humidity, wind, description, icon, dt } = data;

  const displayTemp = unit === 'F' ? convertTemperature(temp, 'C', 'F') : temp;
  const displayFeels = unit === 'F' ? convertTemperature(feels_like, 'C', 'F') : feels_like;
  const unitLabel = unit === 'F' ? '°F' : '°C';

  const time = new Date(dt).toLocaleString('ru', {
    weekday: 'long', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <h2 className="weather-card__city">{city}, {country}</h2>
          <p className="weather-card__time">{time}</p>
          <p className="weather-card__desc">{description}</p>
        </div>
        <WeatherIcon icon={icon} description={description} size={80} />
      </div>

      <Temperature value={displayTemp} unit={unitLabel} className="weather-card__temp" />

      <div className="weather-card__details">
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">🌡️</span>
          <span>Ощущается</span>
          <Temperature value={displayFeels} unit={unitLabel} className="weather-card__detail-val" />
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">💧</span>
          <span>Влажность</span>
          <span className="weather-card__detail-val">{humidity}%</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">💨</span>
          <span>Ветер</span>
          <span className="weather-card__detail-val">
            {formatWindSpeed(wind)} — {getWindDescription(wind)}
          </span>
        </div>
      </div>
    </div>
  );
}
