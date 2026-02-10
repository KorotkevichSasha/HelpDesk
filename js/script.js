// Основной скрипт приложения

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена!');
    
    // Получаем элементы
    const h1Element = document.querySelector('h1');
    const pElement = document.querySelector('p');
    
    // Функция для обновления текста
    function updateProjectName() {
        // Можно заменить [Название проекта] на реальное название
        if (h1Element.textContent.includes('[Название проекта]')) {
            h1Element.textContent = 'Добро пожаловать в HelpDesk!';
        }
    }
    
    // Функция для добавления интерактивности
    function addInteractivity() {
        // Добавляем обработчик клика на заголовок
        h1Element.addEventListener('click', function() {
            this.style.color = this.style.color === 'tomato' ? '#2c3e50' : 'tomato';
            console.log('Цвет заголовка изменен!');
        });
        
        // Добавляем обработчик клика на параграф
        pElement.addEventListener('click', function() {
            const currentDate = new Date();
            this.textContent = `Страница обновлена: ${currentDate.toLocaleString()}`;
            setTimeout(() => {
                this.textContent = 'Это стартовая страница моего веб-приложения.';
            }, 3000);
        });
    }
    
    // Функция для отображения приветствия в консоли
    function showWelcomeMessage() {
        console.log('===================================');
        console.log('Добро пожаловать в HelpDesk System!');
        console.log('Текущее время: ' + new Date().toLocaleTimeString());
        console.log('===================================');
    }
    
    // Инициализация приложения
    function init() {
        updateProjectName();
        addInteractivity();
        showWelcomeMessage();
        
        // Добавляем простую проверку браузера
        if (typeof localStorage !== 'undefined') {
            console.log('LocalStorage доступен');
        } else {
            console.warn('LocalStorage не поддерживается');
        }
    }
    
    // Запуск приложения
    init();
});

// Глобальная функция для примера
function showAlert(message) {
    alert(message || 'Привет из HelpDesk!');
}

// Пример работы с данными
const appConfig = {
    name: 'HelpDesk',
    version: '1.0.0',
    author: 'Ваше имя',
    
    getInfo: function() {
        return `${this.name} v${this.version}`;
    }
};

console.log('Информация о приложении:', appConfig.getInfo());``