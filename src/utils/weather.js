/**
 * Утилиты для работы с погодными данными
 */

/**
 * Конвертация температуры
 * @param {number} value
 * @param {'C'|'F'|'K'} from
 * @param {'C'|'F'|'K'} to
 * @returns {number}
 */
export function convertTemperature(value, from, to) {
  if (from === to) return value;

  // Сначала в Цельсий
  let celsius;
  if (from === 'C') celsius = value;
  else if (from === 'F') celsius = (value - 32) * (5 / 9);
  else if (from === 'K') celsius = value - 273.15;
  else throw new Error(`Неизвестная единица: ${from}`);

  // Из Цельсия в целевую
  if (to === 'C') return Math.round(celsius * 10) / 10;
  if (to === 'F') return Math.round((celsius * 9 / 5 + 32) * 10) / 10;
  if (to === 'K') return Math.round((celsius + 273.15) * 10) / 10;
  throw new Error(`Неизвестная единица: ${to}`);
}

/**
 * Форматирование скорости ветра
 * @param {number} mps - метры в секунду
 * @param {'ms'|'kmh'|'mph'} unit
 * @returns {string}
 */
export function formatWindSpeed(mps, unit = 'ms') {
  if (typeof mps !== 'number' || isNaN(mps)) return '—';
  if (unit === 'ms')  return `${mps.toFixed(1)} м/с`;
  if (unit === 'kmh') return `${(mps * 3.6).toFixed(1)} км/ч`;
  if (unit === 'mph') return `${(mps * 2.237).toFixed(1)} mph`;
  return `${mps} м/с`;
}

/**
 * Получить описание силы ветра по шкале Бофорта
 * @param {number} mps
 * @returns {string}
 */
export function getWindDescription(mps) {
  if (mps < 0.3)  return 'Штиль';
  if (mps < 1.6)  return 'Тихий';
  if (mps < 3.4)  return 'Лёгкий';
  if (mps < 5.5)  return 'Слабый';
  if (mps < 8.0)  return 'Умеренный';
  if (mps < 10.8) return 'Свежий';
  if (mps < 13.9) return 'Сильный';
  return 'Шторм';
}
