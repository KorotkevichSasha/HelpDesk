/**
 * Утилиты для валидации форм
 */

/**
 * Валидация поля вопроса
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateQuestion(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: 'Поле не может быть пустым' };
  }
  if (trimmed.length < 10) {
    return { valid: false, message: 'Вопрос должен содержать не менее 10 символов' };
  }
  if (trimmed.length > 300) {
    return { valid: false, message: 'Вопрос не должен превышать 300 символов' };
  }
  return { valid: true, message: '' };
}

/**
 * Валидация email
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: 'Email обязателен' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Введите корректный email' };
  }
  return { valid: true, message: '' };
}

/**
 * Показать ошибку у поля
 * @param {HTMLElement} field
 * @param {string} message
 */
export function showFieldError(field, message) {
  field.classList.add('input--error');
  let errorEl = field.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

/**
 * Убрать ошибку у поля
 * @param {HTMLElement} field
 */
export function clearFieldError(field) {
  field.classList.remove('input--error');
  const errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) errorEl.textContent = '';
}
