/**
 * Компонент поиска по FAQ
 * Поддерживает оффлайн-поиск по кэшированным данным
 */

import { searchCachedFaqs } from '../utils/faqApi.js';
import { renderFaqItem } from './faqLoader.js';

/**
 * Инициализация поиска
 * @param {string} inputSelector - селектор поля поиска
 * @param {string} listSelector  - селектор контейнера FAQ
 */
export function initSearch(inputSelector, listSelector) {
  const input = document.querySelector(inputSelector);
  const list = document.querySelector(listSelector);
  if (!input || !list) return;

  const noResults = document.querySelector('.faq__no-results');

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (navigator.onLine) {
      // Онлайн: фильтруем DOM
      filterFaq(query.toLowerCase(), list, noResults);
    } else {
      // Оффлайн: поиск по кэшу с перерисовкой
      offlineSearch(query, list, noResults);
    }
  });

  // Очистка поиска по Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      filterFaq('', list, noResults);
      input.blur();
    }
  });

  // Индикатор оффлайн-режима
  window.addEventListener('offline', () => showOfflineBanner(true));
  window.addEventListener('online', () => showOfflineBanner(false));
  if (!navigator.onLine) showOfflineBanner(true);

  console.log('Поиск по FAQ инициализирован');
}

/**
 * Оффлайн-поиск: перерисовывает список из кэша
 * @param {string} query
 * @param {HTMLElement} list
 * @param {HTMLElement|null} noResults
 */
function offlineSearch(query, list, noResults) {
  const results = searchCachedFaqs(query);

  // Убираем только серверные FAQ (не пользовательские)
  list.querySelectorAll('.faq__item:not(.faq__item--user)').forEach((el) => el.remove());
  results.forEach((faq) => renderFaqItem(faq, list));

  const userItems = list.querySelectorAll('.faq__item--user').length;
  const total = results.length + userItems;

  if (noResults) noResults.style.display = total === 0 ? 'block' : 'none';
  console.log(`[Offline Search] "${query}" — найдено ${results.length} результатов`);
}

/**
 * Показать/скрыть баннер оффлайн-режима
 * @param {boolean} offline
 */
function showOfflineBanner(offline) {
  let banner = document.querySelector('.faq__offline-banner');
  if (offline) {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'faq__offline-banner';
      banner.setAttribute('role', 'alert');
      banner.textContent = '📡 Нет подключения — поиск работает по кэшу';
      document.querySelector('.faq__search-wrap')?.insertAdjacentElement('afterend', banner);
    }
  } else {
    banner?.remove();
  }
}

/**
 * Фильтрация элементов FAQ по запросу
 * @param {string} query
 * @param {HTMLElement} list
 * @param {HTMLElement|null} noResults
 */
function filterFaq(query, list, noResults) {
  const items = list.querySelectorAll('.faq__item');
  let visibleCount = 0;

  items.forEach((item) => {
    const questionText = item.querySelector('.faq__question')?.textContent?.toLowerCase() || '';
    const answerText = item.querySelector('.faq__answer')?.textContent?.toLowerCase() || '';
    const matches = !query || questionText.includes(query) || answerText.includes(query);

    item.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;

    // Подсветка совпадений в вопросе
    if (query) {
      highlightText(item.querySelector('.faq__question'), query);
    } else {
      clearHighlight(item.querySelector('.faq__question'));
    }
  });

  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  console.log(`Поиск: "${query}" — найдено ${visibleCount} результатов`);
}

/**
 * Подсветка текста совпадения
 * @param {HTMLElement|null} el
 * @param {string} query
 */
function highlightText(el, query) {
  if (!el) return;
  const original = el.dataset.original || el.textContent;
  el.dataset.original = original;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  el.innerHTML = original.replace(regex, '<mark class="faq__highlight">$1</mark>');
}

/**
 * Убрать подсветку
 * @param {HTMLElement|null} el
 */
function clearHighlight(el) {
  if (!el || !el.dataset.original) return;
  el.textContent = el.dataset.original;
  delete el.dataset.original;
}

/**
 * Экранирование спецсимволов для RegExp
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
