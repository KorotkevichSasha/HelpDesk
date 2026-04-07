/**
 * FAQ API — загрузка вопросов с сервера
 * Поддерживает: Custom JSON API, Airtable API
 * Fallback: локальные данные при оффлайне
 */

import { getFaqCache, setFaqCache } from './faqCache.js';

// ─── Конфигурация ────────────────────────────────────────────────────────────

const CONFIG = {
  // Custom JSON API (JSONBin.io — бесплатный хостинг JSON)
  jsonApi: {
    url: 'https://api.jsonbin.io/v3/b/69d5627536566621a88b13d9',
    headers: {
      'X-Master-Key': '$2a$10$KbJqie4CtkXUB9S0MXJ/Ze4a5mVC08sEIN7tzhGR3FiM29z9yw5S6',
    },
  },

  // Airtable API
  airtable: {
    baseId: 'appXXXXXXXXXXXXXX',          // замените на реальный Base ID
    tableName: 'FAQ',
    apiKey: 'patXXXXXXXXXXXXXX.XXXXXXXX', // замените на реальный Personal Access Token
    get url() {
      return `https://api.airtable.com/v0/${this.baseId}/${this.tableName}`;
    },
  },

  // Источник по умолчанию: 'json' | 'airtable' | 'local'
  source: 'json',
};

// ─── Локальные данные (fallback) ─────────────────────────────────────────────

const LOCAL_FAQ = [
  {
    id: 'local-1',
    question: 'Как сбросить пароль от аккаунта?',
    answer: 'Перейдите на страницу входа и нажмите «Забыли пароль?». Введите email — мы отправим ссылку для сброса.',
    category: 'Аккаунт',
  },
  {
    id: 'local-2',
    question: 'Сколько времени занимает обработка заявки?',
    answer: 'Стандартные заявки обрабатываются в течение 1–2 рабочих дней. Срочные — в течение 4 часов.',
    category: 'Поддержка',
  },
  {
    id: 'local-3',
    question: 'Как изменить контактные данные?',
    answer: 'Зайдите в «Настройки профиля» → «Личные данные» и обновите нужные поля. Изменения сохраняются автоматически.',
    category: 'Аккаунт',
  },
  {
    id: 'local-4',
    question: 'Какие способы оплаты поддерживаются?',
    answer: 'Мы принимаем банковские карты Visa/Mastercard, ЕРИП, а также оплату через СБПБ.',
    category: 'Оплата',
  },
  {
    id: 'local-5',
    question: 'Как отменить подписку?',
    answer: 'Перейдите в «Настройки» → «Подписка» → «Отменить». Доступ сохраняется до конца оплаченного периода.',
    category: 'Оплата',
  },
  {
    id: 'local-6',
    question: 'Есть ли мобильное приложение?',
    answer: 'Да, приложение доступно в App Store и Google Play. Поиск по названию «HelpDesk».',
    category: 'Общее',
  },
];

// ─── Загрузка с Custom JSON API ───────────────────────────────────────────────

async function fetchFromJsonApi() {
  const { url, headers } = CONFIG.jsonApi;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`JSON API: ${res.status} ${res.statusText}`);
  const json = await res.json();
  // JSONBin возвращает { record: [...] }
  const data = json.record ?? json;
  return normalizeFaqs(Array.isArray(data) ? data : data.faqs ?? []);
}

// ─── Загрузка с Airtable API ──────────────────────────────────────────────────

async function fetchFromAirtable() {
  const { url, apiKey } = CONFIG.airtable;
  const res = await fetch(`${url}?maxRecords=100&view=Grid%20view`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Airtable: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return (json.records ?? []).map((rec) => ({
    id: rec.id,
    question: rec.fields.Question ?? rec.fields.question ?? '',
    answer: rec.fields.Answer ?? rec.fields.answer ?? '',
    category: rec.fields.Category ?? rec.fields.category ?? '',
  }));
}

// ─── Нормализация данных ──────────────────────────────────────────────────────

function normalizeFaqs(raw) {
  return raw.map((item, i) => ({
    id: item.id ?? `faq-${i}`,
    question: item.question ?? item.Question ?? '',
    answer: item.answer ?? item.Answer ?? '',
    category: item.category ?? item.Category ?? '',
  }));
}

// ─── Публичный API ────────────────────────────────────────────────────────────

/**
 * Загрузить FAQ: кэш → сервер → локальные данные
 * @returns {Promise<{ faqs: Array, source: string }>}
 */
export async function loadFaqs() {
  // 1. Проверяем кэш
  const cached = getFaqCache();
  if (cached) {
    return { faqs: cached, source: 'cache' };
  }

  // 2. Пробуем загрузить с сервера
  if (CONFIG.source !== 'local') {
    try {
      const faqs =
        CONFIG.source === 'airtable'
          ? await fetchFromAirtable()
          : await fetchFromJsonApi();

      if (faqs.length > 0) {
        setFaqCache(faqs);
        return { faqs, source: CONFIG.source };
      }
    } catch (err) {
      console.warn('[API] Ошибка загрузки, используем локальные данные:', err.message);
    }
  }

  // 3. Fallback — локальные данные
  setFaqCache(LOCAL_FAQ);
  return { faqs: LOCAL_FAQ, source: 'local' };
}

/**
 * Поиск по кэшированным FAQ (оффлайн)
 * @param {string} query
 * @returns {Array}
 */
export function searchCachedFaqs(query) {
  const cached = getFaqCache() ?? LOCAL_FAQ;
  if (!query.trim()) return cached;

  const q = query.toLowerCase();
  return cached.filter(
    (item) =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
  );
}
