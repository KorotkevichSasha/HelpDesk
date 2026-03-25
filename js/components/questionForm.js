/**
 * Компонент формы отправки нового вопроса
 */

import { addQuestion, deleteQuestion } from '../utils/storage.js';
import { validateQuestion, validateEmail, showFieldError, clearFieldError } from '../utils/validate.js';

/**
 * Инициализация формы вопроса
 * @param {string} formSelector   - селектор формы
 * @param {string} listSelector   - селектор списка FAQ для добавления новых вопросов
 */
export function initQuestionForm(formSelector, listSelector) {
  const form = document.querySelector(formSelector);
  const list = document.querySelector(listSelector);
  if (!form || !list) return;

  const questionInput = form.querySelector('#new-question');
  const emailInput = form.querySelector('#question-email');
  const charCounter = form.querySelector('.form__char-counter');

  // Счётчик символов
  if (questionInput && charCounter) {
    questionInput.addEventListener('input', () => {
      const len = questionInput.value.length;
      charCounter.textContent = `${len}/300`;
      charCounter.classList.toggle('form__char-counter--warn', len > 250);
    });
  }

  // Валидация в реальном времени
  if (questionInput) {
    questionInput.addEventListener('blur', () => {
      const result = validateQuestion(questionInput.value);
      if (!result.valid) showFieldError(questionInput, result.message);
      else clearFieldError(questionInput);
    });
    questionInput.addEventListener('input', () => clearFieldError(questionInput));
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const result = validateEmail(emailInput.value);
      if (!result.valid) showFieldError(emailInput, result.message);
      else clearFieldError(emailInput);
    });
    emailInput.addEventListener('input', () => clearFieldError(emailInput));
  }

  // Отправка формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const qResult = validateQuestion(questionInput?.value || '');
    const eResult = validateEmail(emailInput?.value || '');

    let isValid = true;

    if (!qResult.valid) {
      showFieldError(questionInput, qResult.message);
      isValid = false;
    }
    if (!eResult.valid) {
      showFieldError(emailInput, eResult.message);
      isValid = false;
    }

    if (!isValid) return;

    const saved = addQuestion({ question: questionInput.value.trim() });
    renderUserQuestion(saved, list);

    form.reset();
    if (charCounter) charCounter.textContent = '0/300';

    showSuccessMessage(form);
    console.log('Новый вопрос добавлен:', saved);
  });

  // Загрузка сохранённых пользовательских вопросов
  loadUserQuestions(list);

  console.log('Форма вопроса инициализирована');
}

/**
 * Отрисовать пользовательский вопрос в списке FAQ
 * @param {Object} q - объект вопроса
 * @param {HTMLElement} list
 */
function renderUserQuestion(q, list) {
  const details = document.createElement('details');
  details.className = 'faq__item faq__item--user';
  details.dataset.id = q.id;
  details.setAttribute('itemscope', '');
  details.setAttribute('itemprop', 'mainEntity');
  details.setAttribute('itemtype', 'https://schema.org/Question');

  details.innerHTML = `
    <summary class="faq__summary">
      <h3 class="faq__question" itemprop="name">${escapeHtml(q.question)}</h3>
      <div class="faq__summary-actions">
        <button class="faq__delete-btn" aria-label="Удалить вопрос" title="Удалить">✕</button>
        <span class="faq__icon">+</span>
      </div>
    </summary>
    <div class="faq__answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
      <p itemprop="text">${escapeHtml(q.answer)}</p>
      <span class="faq__user-badge">Ваш вопрос</span>
    </div>
  `;

  // Удаление вопроса
  details.querySelector('.faq__delete-btn').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteQuestion(q.id);
    details.remove();
    console.log('Вопрос удалён:', q.id);
  });

  // Иконка toggle
  details.addEventListener('toggle', () => {
    const icon = details.querySelector('.faq__icon');
    if (icon) icon.textContent = details.open ? '−' : '+';
  });

  list.appendChild(details);
}

/**
 * Загрузить пользовательские вопросы из LocalStorage
 * @param {HTMLElement} list
 */
function loadUserQuestions(list) {
  const { getQuestions } = window.__helpdesk_storage || {};
  // Импорт через динамический require невозможен в браузере без бандлера,
  // поэтому используем глобальный объект, заполненный в script.js
  const questions = window.__helpdesk_getQuestions ? window.__helpdesk_getQuestions() : [];
  questions.forEach((q) => renderUserQuestion(q, list));
  console.log(`Загружено ${questions.length} пользовательских вопросов из LocalStorage`);
}

/**
 * Показать сообщение об успехе
 * @param {HTMLElement} form
 */
function showSuccessMessage(form) {
  const existing = form.querySelector('.form__success');
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.className = 'form__success';
  msg.textContent = 'Ваш вопрос отправлен и добавлен в список!';
  form.appendChild(msg);

  setTimeout(() => msg.remove(), 4000);
}

/**
 * Экранирование HTML
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
