/**
 * Компонент аккордеона FAQ
 * Управляет открытием/закрытием элементов <details>
 */

/**
 * Инициализация аккордеона
 * @param {string} listSelector - селектор контейнера списка FAQ
 */
export function initAccordion(listSelector) {
  const list = document.querySelector(listSelector);
  if (!list) return;

  // Делегирование событий на весь список
  list.addEventListener('click', (e) => {
    const summary = e.target.closest('.faq__summary');
    if (!summary) return;

    const item = summary.closest('.faq__item');
    if (!item) return;

    // Закрываем все остальные (аккордеон-поведение)
    list.querySelectorAll('.faq__item[open]').forEach((openItem) => {
      if (openItem !== item) {
        openItem.removeAttribute('open');
        const icon = openItem.querySelector('.faq__icon');
        if (icon) icon.textContent = '+';
      }
    });

    console.log(`FAQ: ${item.open ? 'закрыт' : 'открыт'} вопрос — "${summary.querySelector('.faq__question')?.textContent?.trim()}"`);
  });

  // Обновление иконок через событие toggle
  list.addEventListener('toggle', (e) => {
    const item = e.target;
    if (!item.classList.contains('faq__item')) return;
    const icon = item.querySelector('.faq__icon');
    if (icon) icon.textContent = item.open ? '−' : '+';
  }, true);

  console.log('Аккордеон инициализирован');
}
