const API_KEY = '6c4e00b158fd99c014b628bf451a09d1';
const BASE = 'https://api.openweathermap.org/data/2.5';

// Моковые данные для демонстрации без API-ключа
const MOCK = {
  Минск: {
    current: {
      city: 'Минск', country: 'BY', temp: 12, feels_like: 9,
      humidity: 74, wind: 4.2, description: 'Переменная облачность',
      icon: '02d', dt: Date.now(),
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
      icon: '04d', dt: Date.now(),
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
      icon: '10d', dt: Date.now(),
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

/**
 * Получить текущую погоду и прогноз для города
 * @param {string} city
 * @returns {Promise<{current, forecast}>}
 */
export async function fetchWeather(city) {
  // Если ключ не задан — возвращаем мок
  if (API_KEY === 'demo') {
    await new Promise((r) => setTimeout(r, 600)); // имитация задержки сети
    const key = Object.keys(MOCK).find((k) => k.toLowerCase() === city.toLowerCase());
    if (!key) throw new Error(`Город "${city}" не найден`);
    return MOCK[key];
  }

  // Реальный запрос к OpenWeatherMap
  const [curRes, foreRes] = await Promise.all([
    fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`),
    fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru&cnt=40`),
  ]);

  if (!curRes.ok) throw new Error(`Город "${city}" не найден`);

  const cur = await curRes.json();
  const fore = await foreRes.json();

  const current = {
    city: cur.name, country: cur.sys.country,
    temp: Math.round(cur.main.temp),
    feels_like: Math.round(cur.main.feels_like),
    humidity: cur.main.humidity,
    wind: cur.wind.speed,
    description: cur.weather[0].description,
    icon: cur.weather[0].icon,
    dt: cur.dt * 1000,
  };

  // Берём по одному слоту на день (полдень)
  const days = {};
  fore.list.forEach((item) => {
    const d = new Date(item.dt * 1000);
    const key = d.toLocaleDateString('ru', { weekday: 'short' });
    if (!days[key]) {
      days[key] = {
        date: key,
        temp_min: Math.round(item.main.temp_min),
        temp_max: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      };
    } else {
      days[key].temp_min = Math.min(days[key].temp_min, Math.round(item.main.temp_min));
      days[key].temp_max = Math.max(days[key].temp_max, Math.round(item.main.temp_max));
    }
  });

  return { current, forecast: Object.values(days).slice(0, 5) };
}
