// Получаем из localStorage значения выбранных ответов или пустой объект,
// если ответы не были ранее сохранены.
let selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers')) || {};

// Получаем из localStorage значения радиуса углов для чекбоксов или пустой объект,
// если значения не были ранее сохранены.
let checkboxShapes = JSON.parse(localStorage.getItem('checkboxShapes')) || {};

// Получаем элемент контейнера вопросов
let testContainer = document.getElementById('test-container');

// Инициализируем начальный индекс вопроса
let currentIndex = 0;
let testData = null;

// Запрашиваем данные теста с сервера
fetch(`api/v1`)
    .then(response => response.json())
    .then(data => {
        // Сохраняем полученные данные
        testData = data;

        // Отображаем первый вопрос
        displayQuestion(currentIndex);
    });

// Функция отображает вопрос по переданному индексу
function displayQuestion(index) {
    // Получаем текущий вопрос данных
    let question = testData.questions[index];

    // Очищаем контейнер вопроса
    testContainer.innerHTML = '';

    // Создаем элемент для текста вопроса
    let questionElement = document.createElement('h2');
    questionElement.textContent = question.question_text;

    // Добавляем элемент вопроса в контейнер
    testContainer.appendChild(questionElement);

    // Создаем контейнер для ответов
    let answersContainer = document.createElement('div');
    answersContainer.className = 'd-flex flex-row justify-content-between align-items-center flex-wrap';

    // Цикл по ответам текущего вопроса
    // Для каждого ответа на вопрос создаем блок с чекбоксом и текстом ответа
    question.answers.forEach(answer => {
        // Создаем основной блок для ответа
        let answerDiv = document.createElement('div');
        // Применяем к нему стили
        answerDiv.className = 'answer d-flex flex-column align-items-center mx-3';

        // Создаем блок для чекбокса
        let checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'custom-checkbox';

        // Создаем сам чекбокс
        let answerCheckbox = document.createElement('input');
        answerCheckbox.type = 'checkbox';
        answerCheckbox.id = 'answer-' + answer.id;
        answerCheckbox.value = answer.id;

        // Если этот ответ уже был выбран ранее, отмечаем чекбокс
        if (selectedAnswers.hasOwnProperty(question.id) && selectedAnswers[question.id].includes(answer.id)) {
            answerCheckbox.checked = true;
            checkboxDiv.style.backgroundColor = answerCheckbox.checked ? '#4484CF' : '#aaaaaa';
        }

        // Добавляем чекбокс в блок для чекбокса
        checkboxDiv.appendChild(answerCheckbox);

        // Задаем радиус границы для блока чекбокса
        checkboxDiv.style.borderRadius = checkboxShapes[answer.id] || "50%";

        // Добавляем обработчик клика
        checkboxDiv.addEventListener('click', function () {
            // Если чекбокс не был отмечен
            if (!answerCheckbox.checked) {
                // Отмечаем его и меняем его цвет
                answerCheckbox.checked = true;
                checkboxDiv.style.backgroundColor = answerCheckbox.checked ? '#4484CF' : '#aaaaaa';

                // Если текущий вопрос еще не был выбран
                if (!selectedAnswers[question.id]) {
                    // Инициализируем его пустым массивом
                    selectedAnswers[question.id] = [];
                }

                // Добавляем текущий ответ в массив выбранных
                selectedAnswers[question.id].push(answer.id);

                // Если было выбрано более двух ответов
                if (selectedAnswers[question.id].length > 2) {
                    // Снимаем отметку с чекбокса, меняем цвет и удаляем последний добавленный ответ
                    answerCheckbox.checked = false;
                    checkboxDiv.style.backgroundColor = answerCheckbox.checked ? '#4484CF' : '#aaaaaa';
                    selectedAnswers[question.id].pop();
                    // Завершаем обработку
                    return;
                }

                // Сохраняем изменения в localStorage
                localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));

                // Если был выбран только один ответ на вопрос
                if (selectedAnswers[question.id].length === 1) {
                    // Устанавливаем форму чекбокса '50%'
                    checkboxShapes[answer.id] = "50%";
                    localStorage.setItem('checkboxShapes', JSON.stringify(checkboxShapes));
                    checkboxDiv.style.borderRadius = "50%";
                } else {
                    // Если было выбрано более одного ответа
                    // Устанавливаем форму чекбокса '0'
                    checkboxShapes[answer.id] = "0";
                    localStorage.setItem('checkboxShapes', JSON.stringify(checkboxShapes));
                    checkboxDiv.style.borderRadius = "0";
                }
            }
        });

        // Создаем элемент label, который будет содержать текст ответа
        let answerLabel = document.createElement('label');
// Атрибут 'for' связывает label с чекбоксом
        answerLabel.htmlFor = answerCheckbox.id;
// Добавляем CSS классы для стилизации элемента
        answerLabel.className = 'answertext mb-3';
// Назначаем текст ответа контентом label
        answerLabel.textContent = answer.answer_text;

// Добавляем label и блок с чекбоксом в основной блок ответа
        answerDiv.appendChild(answerLabel);
        answerDiv.appendChild(checkboxDiv);

// Добавляем блок ответа в контейнер ответов
        answersContainer.appendChild(answerDiv);
// Закрываем цикл forEach для question.answers
    });

// Добавляем контейнер ответов в основной контейнер вопроса
    testContainer.appendChild(answersContainer);
}

// Навешиваем обработчик на клик по кнопке "Назад"
document.getElementById('prevButton').onclick = function () {
    // Если текущий вопрос не первый
    if (currentIndex > 0) {
        // Переходим к предыдущему вопросу и выводим его на экран
        currentIndex--;
        displayQuestion(currentIndex);
    }
};

// Навешиваем обработчик на клик по кнопке "Вперед"
document.getElementById('nextButton').onclick = function () {
    // Если текущий вопрос не последний
    if (currentIndex < testData.questions.length - 1) {
        // Переходим к следующему вопросу и выводим его на экран
        currentIndex++;
        displayQuestion(currentIndex);
    }
};

// Навешиваем обработчик на клик по кнопке "Отправить"
document.getElementById('submitButton').onclick = function () {
    // Создаем пустой объект для хранения отфильтрованных ответов
    let filteredAnswers = {};

    // Проходим по всем выбранным ответам
    for (let question in selectedAnswers) {
        if (selectedAnswers.hasOwnProperty(question)) {
            // Берем последний выбранный ответ
            let lastAnswer = selectedAnswers[question][selectedAnswers[question].length - 1];
            // Добавляем его в объект отфильтрованных ответов
            filteredAnswers[question] = [lastAnswer];
        }
    }

    // Выводим отфильтрованные ответы в консоль
    console.log(filteredAnswers);

    // Отправляем POST-запрос на сервер
fetch('api/v1/submit', {
    method: 'POST',  // Используем метод POST
    headers: {
        // Настраиваем заголовки запроса
        'Content-Type': 'application/json',
        // Добавляем CSRF-токен
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
    },
    // Отправляем данные в формате JSON
    body: JSON.stringify(filteredAnswers)
})
    .then(response => {
        // Проверяем, успешный ли ответ от сервера
        if (response.ok) {
            // Если да, парсим ответ в JSON
            return response.json();
        } else {
            // Если нет, кидаем ошибку
            throw new Error('Response is not OK');
        }
    })
    .then(data => {
        // Выводим полученные данные в консоль
        console.log(data);
        // Удаляем ответы из localStorage
        localStorage.removeItem('selectedAnswers');
        // Удаляем формы чекбоксов из localStorage
        localStorage.removeItem('checkboxShapes');
        // Перенаправляем пользователя на страницу результатов
        window.location.href = `/online_tests/test/results/${data.user_test_id}/`;
    })
    .catch(error => {
       // Выводим ошибку в консоль
       console.error('Error:', error);
    });
};