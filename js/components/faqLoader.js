/**
 * Компонент загрузки и рендеринга FAQ с сервера
 */

import { loadFaqs } from '../utils/faqApi.js';
import { clearFaqCache } from '../utils/faqCache.js';

/**
 * Инициализация загрузчика FAQ
 * @param {string} listSelector - селектор контейнера списка FAQ
 */
export async function initFaqLoader(listSelector) {
  const list = document.querySelector(listSelector);
  if (!list) return;

  // Убираем старый бейдж перед загрузкой
  document.querySelector('.faq__source-badge')?.remove();

  showLoadingState(list);

  const { faqs, source } = await loadFaqs();

  // Сохраняем пользовательские вопросы перед очисткой
  const userItems = [...list.querySelectorAll('.faq__item--user')];

  clearStaticItems(list);
  faqs.forEach((faq) => renderFaqItem(faq, list));

  // Возвращаем пользовательские вопросы в конец списка
  userItems.forEach((item) => list.appendChild(item));

  showSourceBadge(source);
  console.log(`[FaqLoader] Загружено ${faqs.length} вопросов (источник: ${source})`);
}

/**
 * Рендер одного FAQ-элемента
 * @param {Object} faq
 * @param {HTMLElement} list
 */
export function renderFaqItem(faq, list) {
  const details = document.createElement('details');
  details.className = 'faq__item';
  details.dataset.faqId = faq.id;
  details.setAttribute('itemscope', '');
  details.setAttribute('itemprop', 'mainEntity');
  details.setAttribute('itemtype', 'https://schema.org/Question');

  details.innerHTML = `
    <summary class="faq__summary">
      <h3 class="faq__question" itemprop="name">${escapeHtml(faq.question)}</h3>
      <span class="faq__icon">+</span>
    </summary>
    <div class="faq__answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
      <p itemprop="text">${escapeHtml(faq.answer)}</p>
      ${faq.category ? `<span class="faq__category-badge">${escapeHtml(faq.category)}</span>` : ''}
    </div>
  `;

  details.addEventListener('toggle', () => {
    const icon = details.querySelector('.faq__icon');
    if (icon) icon.textContent = details.open ? '−' : '+';
  });

  list.appendChild(details);
}

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function showLoadingState(list) {
  list.innerHTML = `
    <div class="faq__loading" role="status" aria-live="polite">
      <span class="faq__loading-spinner" aria-hidden="true"></span>
      Загрузка вопросов...
    </div>
  `;
}

function clearStaticItems(list) {
  list.innerHTML = '';
}

function showSourceBadge(source) {
  // Удаляем старый бейдж если есть
  document.querySelector('.faq__source-badge')?.remove();

  const labels = {
    cache: '📦 Из кэша',
    local: '💾 Локальные данные',
    json: '🌐 JSON API',
    airtable: '🗄️ Airtable',
  };
  const label = labels[source] ?? source;

  const badge = document.createElement('div');
  badge.className = 'faq__source-badge';
  badge.setAttribute('aria-live', 'polite');
  badge.innerHTML = `
    ${label}
    <button class="faq__refresh-btn" title="Обновить FAQ" aria-label="Обновить FAQ">↻</button>
  `;

  badge.querySelector('.faq__refresh-btn').addEventListener('click', async () => {
    clearFaqCache();
    await initFaqLoader('.faq__list');
  });

  const faqSection = document.querySelector('.faq');
  const searchWrap = faqSection?.querySelector('.faq__search-wrap');
  if (searchWrap) {
    searchWrap.insertAdjacentElement('afterend', badge);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
