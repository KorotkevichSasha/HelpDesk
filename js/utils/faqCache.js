/**
 * Кэширование FAQ в localStorage
 * TTL по умолчанию — 1 час
 */

const CACHE_KEY = 'helpdesk_faq_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 час в мс

/**
 * Сохранить FAQ в кэш
 * @param {Array} faqs - массив вопросов
 */
export function setFaqCache(faqs) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: faqs, timestamp: Date.now() })
    );
    console.log(`[Cache] Сохранено ${faqs.length} вопросов`);
  } catch (e) {
    console.error('[Cache] Ошибка записи:', e);
  }
}

/**
 * Получить FAQ из кэша (если не истёк TTL)
 * @returns {Array|null} массив вопросов или null
 */
export function getFaqCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      console.log('[Cache] Кэш устарел');
      return null;
    }
    console.log(`[Cache] Загружено ${data.length} вопросов из кэша`);
    return data;
  } catch (e) {
    console.error('[Cache] Ошибка чтения:', e);
    return null;
  }
}

/**
 * Принудительно очистить кэш
 */
export function clearFaqCache() {
  localStorage.removeItem(CACHE_KEY);
  console.log('[Cache] Кэш очищен');
}

/**
 * Проверить, есть ли валидный кэш
 * @returns {boolean}
 */
export function hasFaqCache() {
  return getFaqCache() !== null;
}
