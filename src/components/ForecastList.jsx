import WeatherIcon from './WeatherIcon.jsx';
import Temperature from './Temperature.jsx';

/**
 * ForecastList — список прогноза на 5 дней
 */
export default function ForecastList({ forecast }) {
  return (
    <div className="forecast">
      <h3 className="forecast__title">Прогноз на 5 дней</h3>
      <ul className="forecast__list">
        {forecast.map((day) => (
          <li key={day.date} className="forecast__item">
            <span className="forecast__day">{day.date}</span>
            <WeatherIcon icon={day.icon} description={day.description} size={40} />
            <span className="forecast__desc">{day.description}</span>
            <div className="forecast__temps">
              <Temperature value={day.temp_max} className="forecast__temp-max" />
              <Temperature value={day.temp_min} className="forecast__temp-min" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
