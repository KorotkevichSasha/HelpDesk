import WeatherIcon from './WeatherIcon.jsx';
import Temperature from './Temperature.jsx';
import { convertTemperature } from '../utils/weather.js';

/**
 * ForecastList — список прогноза на 5 дней
 * Props: forecast, unit ('C' | 'F')
 */
export default function ForecastList({ forecast, unit = 'C' }) {
  const unitLabel = unit === 'F' ? '°F' : '°C';

  function convert(val) {
    return unit === 'F' ? convertTemperature(val, 'C', 'F') : val;
  }

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
              <Temperature value={convert(day.temp_max)} unit={unitLabel} className="forecast__temp-max" />
              <Temperature value={convert(day.temp_min)} unit={unitLabel} className="forecast__temp-min" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
