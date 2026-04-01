import WeatherIcon from './WeatherIcon.jsx';
import Temperature from './Temperature.jsx';

/**
 * WeatherCard — карточка текущей погоды
 */
export default function WeatherCard({ data }) {
  const { city, country, temp, feels_like, humidity, wind, description, icon, dt } = data;

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

      <Temperature value={temp} className="weather-card__temp" />

      <div className="weather-card__details">
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">🌡️</span>
          <span>Ощущается</span>
          <Temperature value={feels_like} className="weather-card__detail-val" />
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">💧</span>
          <span>Влажность</span>
          <span className="weather-card__detail-val">{humidity}%</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-icon">💨</span>
          <span>Ветер</span>
          <span className="weather-card__detail-val">{wind} м/с</span>
        </div>
      </div>
    </div>
  );
}
