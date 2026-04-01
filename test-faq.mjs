/**
 * Быстрая проверка логики faqCache и поиска (без браузера)
 */

// Мок localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; },
};

// ── Импорт модулей ────────────────────────────────────────────────────────────
const { setFaqCache, getFaqCache, clearFaqCache, hasFaqCache } = await import('./js/utils/faqCache.js');

const SAMPLE = [
  { id: '1', question: 'Как сбросить пароль?', answer: 'Нажмите «Забыли пароль»', category: 'Аккаунт' },
  { id: '2', question: 'Способы оплаты?', answer: 'Visa, Mastercard, ЕРИП', category: 'Оплата' },
  { id: '3', question: 'Есть мобильное приложение?', answer: 'Да, App Store и Google Play', category: 'Общее' },
];

// ── Тест 1: кэш пустой ───────────────────────────────────────────────────────
console.assert(getFaqCache() === null, '❌ Тест 1: кэш должен быть пустым');
console.log('✅ Тест 1: кэш пустой');

// ── Тест 2: запись в кэш ─────────────────────────────────────────────────────
setFaqCache(SAMPLE);
console.assert(hasFaqCache() === true, '❌ Тест 2: кэш должен существовать');
console.log('✅ Тест 2: запись в кэш');

// ── Тест 3: чтение из кэша ───────────────────────────────────────────────────
const cached = getFaqCache();
console.assert(cached.length === 3, '❌ Тест 3: должно быть 3 вопроса');
console.assert(cached[0].question === 'Как сбросить пароль?', '❌ Тест 3: неверный вопрос');
console.log('✅ Тест 3: чтение из кэша');

// ── Тест 4: поиск по кэшу ────────────────────────────────────────────────────
const { searchCachedFaqs } = await import('./js/utils/faqApi.js');

const r1 = searchCachedFaqs('пароль');
console.assert(r1.length === 1 && r1[0].id === '1', '❌ Тест 4a: поиск по вопросу');
console.log('✅ Тест 4a: поиск "пароль" →', r1[0].question);

const r2 = searchCachedFaqs('ЕРИП');
console.assert(r2.length === 1 && r2[0].id === '2', '❌ Тест 4b: поиск по ответу');
console.log('✅ Тест 4b: поиск "ЕРИП" →', r2[0].question);

const r3 = searchCachedFaqs('Оплата');
console.assert(r3.length === 1, '❌ Тест 4c: поиск по категории');
console.log('✅ Тест 4c: поиск по категории "Оплата" →', r3[0].question);

const r4 = searchCachedFaqs('несуществующее');
console.assert(r4.length === 0, '❌ Тест 4d: пустой результат');
console.log('✅ Тест 4d: поиск без результатов');

const r5 = searchCachedFaqs('');
console.assert(r5.length === 3, '❌ Тест 4e: пустой запрос = все вопросы');
console.log('✅ Тест 4e: пустой запрос возвращает все вопросы');

// ── Тест 5: очистка кэша ─────────────────────────────────────────────────────
clearFaqCache();
console.assert(getFaqCache() === null, '❌ Тест 5: кэш должен быть очищен');
console.log('✅ Тест 5: очистка кэша');

// ── Тест 6: loadFaqs fallback на локальные данные ────────────────────────────
const { loadFaqs } = await import('./js/utils/faqApi.js');
const { faqs, source } = await loadFaqs();
console.assert(source === 'local', '❌ Тест 6: источник должен быть local');
console.assert(faqs.length > 0, '❌ Тест 6: должны быть локальные данные');
console.log(`✅ Тест 6: loadFaqs fallback → source="${source}", вопросов: ${faqs.length}`);

console.log('\n🎉 Все тесты пройдены!');
