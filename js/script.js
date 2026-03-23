/**
 * HelpDesk — главный скрипт приложения
 * Вариант 6: FAQ система
 * Реализует: аккордеон, поиск по FAQ, форму отправки вопроса
 */

import { initAccordion } from './components/accordion.js';
import { initSearch } from './components/search.js';
import { initQuestionForm } from './components/questionForm.js';
import { getQuestions } from './utils/storage.js';

// Делаем getQuestions доступным для компонента формы (без бандлера)
window.__helpdesk_getQuestions = getQuestions;

document.addEventListener('DOMContentLoaded', () => {
  console.log('===================================');
  console.log('HelpDesk FAQ System загружен');
  console.log('Текущее время: ' + new Date().toLocaleTimeString());
  console.log('===================================');

  // 1. Аккордеон
  initAccordion('.faq__list');

  // 2. Поиск по FAQ
  initSearch('#faq-search', '.faq__list');

  // 3. Форма нового вопроса
  initQuestionForm('#question-form', '.faq__list');

  // 4. Бургер-меню
  initBurger();

  // 5. Кнопка "Наверх"
  initScrollTop();

  // 6. Кнопка "Shoot a Direct Mail" — плавный скролл к форме
  const mailBtn = document.querySelector('.contact-card__button');
  if (mailBtn) {
    mailBtn.addEventListener('click', () => {
      document.querySelector('#ask-section')?.scrollIntoView({ behavior: 'smooth' });
      console.log('Переход к форме вопроса');
    });
  }

  if (typeof localStorage !== 'undefined') {
    console.log('LocalStorage доступен');
  } else {
    console.warn('LocalStorage не поддерживается');
  }
});

/**
 * Бургер-меню
 */
function initBurger() {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--open', open);
    burger.setAttribute('aria-expanded', String(open));
    console.log(`Меню ${open ? 'открыто' : 'закрыто'}`);
  });

  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Кнопка прокрутки наверх
 */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('scroll-top--visible', window.scrollY > 300);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Прокрутка наверх');
  });
}
