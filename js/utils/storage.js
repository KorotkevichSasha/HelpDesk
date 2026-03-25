/**
 * Утилиты для работы с LocalStorage
 */

const STORAGE_KEY = 'helpdesk_questions';

/**
 * Получить все вопросы из LocalStorage
 * @returns {Array} массив вопросов
 */
export function getQuestions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Ошибка чтения из LocalStorage:', e);
    return [];
  }
}

/**
 * Сохранить вопросы в LocalStorage
 * @param {Array} questions - массив вопросов
 */
export function saveQuestions(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Ошибка записи в LocalStorage:', e);
  }
}

/**
 * Добавить новый вопрос
 * @param {Object} question - объект вопроса { question, answer }
 * @returns {Object} добавленный вопрос с id и датой
 */
export function addQuestion(question) {
  const questions = getQuestions();
  const newQuestion = {
    id: Date.now(),
    question: question.question,
    answer: question.answer || 'Ваш вопрос принят. Мы ответим в ближайшее время.',
    createdAt: new Date().toISOString(),
    isUserQuestion: true,
  };
  questions.push(newQuestion);
  saveQuestions(questions);
  return newQuestion;
}

/**
 * Удалить вопрос по id
 * @param {number} id
 */
export function deleteQuestion(id) {
  const questions = getQuestions().filter((q) => q.id !== id);
  saveQuestions(questions);
}
