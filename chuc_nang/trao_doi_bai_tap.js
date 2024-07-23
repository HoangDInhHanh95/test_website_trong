document.addEventListener('DOMContentLoaded', function() {
    const submitQuestionBtn = document.getElementById('submitQuestionBtn');
    const questionContent = document.getElementById('questionContent');
    const questionsContainer = document.getElementById('questions-container');

    // Load user info
    loadUserInfo();

    // Load existing questions
    loadQuestions();

    submitQuestionBtn.addEventListener('click', function() {
        const content = questionContent.value.trim();
        if (content) {
            submitQuestion(content);
        } else {
            alert('Vui lòng nhập nội dung câu hỏi!');
        }
    });

    function loadUserInfo() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {username: 'Người dùng', avatar: 'images/default-avatar.png'};
        document.getElementById('username').textContent = loggedInUser.username;
        document.getElementById('userAvatar').src = loggedInUser.avatar;
    }

    function submitQuestion(content) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {username: 'Người dùng'};
        const question = {
            id: Date.now(),
            content: content,
            username: loggedInUser.username,
            timestamp: new Date().toISOString(),
            answers: []
        };

        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        questions.unshift(question);
        localStorage.setItem('questions', JSON.stringify(questions));

        loadQuestions();
        questionContent.value = '';
        alert('Câu hỏi đã được gửi thành công!');
    }

    function loadQuestions() {
        const questions = JSON.parse(localStorage.getItem('questions')) || [];
        questionsContainer.innerHTML = '';

        questions.forEach(question => {
            const questionElement = createQuestionElement(question);
            questionsContainer.appendChild(questionElement);
        });
    }

    function createQuestionElement(question) {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.innerHTML = `
            <p><em>${formatDateTime(new Date(question.timestamp))}</em></p>
            <p><strong>${question.username}:</strong> ${question.content}</p>
            <button class="answer-btn" data-question-id="${question.id}">Trả lời</button>
            <button class="delete-question-btn" data-question-id="${question.id}">Xóa câu hỏi</button>
            <div class="answer-form" style="display: none;">
                <textarea placeholder="Nhập câu trả lời của bạn..."></textarea>
                <button class="submit-answer-btn" data-question-id="${question.id}">Gửi trả lời</button>
            </div>
            <div class="answers"></div>
        `;

        const answerBtn = questionElement.querySelector('.answer-btn');
        const answerForm = questionElement.querySelector('.answer-form');
        const submitAnswerBtn = questionElement.querySelector('.submit-answer-btn');
        const answersContainer = questionElement.querySelector('.answers');
        const deleteQuestionBtn = questionElement.querySelector('.delete-question-btn');

        answerBtn.addEventListener('click', () => {
            answerForm.style.display = answerForm.style.display === 'none' ? 'block' : 'none';
        });

        submitAnswerBtn.addEventListener('click', () => {
            const answerContent = answerForm.querySelector('textarea').value.trim();
            if (answerContent) {
                submitAnswer(question.id, answerContent);
                answerForm.querySelector('textarea').value = '';
                answerForm.style.display = 'none';
            } else {
                alert('Vui lòng nhập nội dung trả lời!');
            }
        });

        deleteQuestionBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
                deleteQuestion(question.id);
            }
        });

        // Load existing answers
        if (question.answers && Array.isArray(question.answers)) {
            question.answers.forEach(answer => {
                const answerElement = createAnswerElement(answer, question.id);
                answersContainer.appendChild(answerElement);
            });
        }

        return questionElement;
    }

    function formatDateTime(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
    }

    function createAnswerElement(answer, questionId) {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer-item';
        answerElement.innerHTML = `
            <p><em>${formatDateTime(new Date(answer.timestamp))}</em></p>
            <p><strong>${answer.username}:</strong> ${answer.content}</p>
            <button class="delete-answer-btn" data-question-id="${questionId}" data-answer-timestamp="${answer.timestamp}">Xóa trả lời</button>
        `;

        const deleteAnswerBtn = answerElement.querySelector('.delete-answer-btn');
        deleteAnswerBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa câu trả lời này?')) {
                deleteAnswer(questionId, answer.timestamp);
            }
        });

        return answerElement;
    }

    function submitAnswer(questionId, content) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {username: 'Người dùng'};
        const answer = {
            content: content,
            username: loggedInUser.username,
            timestamp: new Date().toISOString()
        };

        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            if (!questions[questionIndex].answers) {
                questions[questionIndex].answers = [];
            }
            questions[questionIndex].answers.push(answer);
            localStorage.setItem('questions', JSON.stringify(questions));
            loadQuestions(); // Reload all questions to update the view
        }
    }

    function deleteQuestion(questionId) {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        questions = questions.filter(q => q.id !== questionId);
        localStorage.setItem('questions', JSON.stringify(questions));
        loadQuestions();
    }

    function deleteAnswer(questionId, answerTimestamp) {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            questions[questionIndex].answers = questions[questionIndex].answers.filter(a => a.timestamp !== answerTimestamp);
            localStorage.setItem('questions', JSON.stringify(questions));
            loadQuestions();
        }
    }
});