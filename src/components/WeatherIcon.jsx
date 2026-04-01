/**
 * WeatherIcon — иконка погоды из OpenWeatherMap
 */
export default function WeatherIcon({ icon, description, size = 64 }) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}
