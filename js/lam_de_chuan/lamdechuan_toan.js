// lamdechuan_toan.js

if (typeof questions === 'undefined') {
    questions = {
        toan: {
            abcd: [],
            dung_sai: [],
            tra_loi_ngan: []
        }
    };
}

// Hàm để lấy câu hỏi ngẫu nhiên từ một mảng
function getRandomQuestions(array, count) {
    console.log("getRandomQuestions called with array length:", array.length, "and count:", count);
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Hàm để tạo đề thi
function createExam() {
    console.log("createExam function called");
    const abcdQuestions = getRandomQuestions(questions.toan.abcd, 12);
    const dungSaiQuestions = getRandomQuestions(questions.toan.dung_sai, 4);
    const traLoiNganQuestions = getRandomQuestions(questions.toan.tra_loi_ngan, 6);

    isExamInProgress = true;
    setupBeforeUnloadWarning();
    
    // Store the randomized questions in a global variable
    window.currentExam = {
        abcd: abcdQuestions,
        dungSai: dungSaiQuestions,
        traLoiNgan: traLoiNganQuestions
    };

    const examContent = `
        <h2>Đề thi Toán</h2>
        </div>
        <form id="examForm">
            <section>
                <h3>I. Trắc nghiệm ABCD</h3>
                ${renderQuestions(abcdQuestions, 'abcd', 0)}
            </section>
            <section>
                <h3>II. Trắc nghiệm Đúng Sai</h3>
                ${renderQuestions(dungSaiQuestions, 'dungsai', abcdQuestions.length)}
            </section>
            <section>
                <h3>III. Trắc nghiệm Trả Lời Ngắn</h3>
                ${renderQuestions(traLoiNganQuestions, 'traloingan', abcdQuestions.length + dungSaiQuestions.length)}
            </section>
            <button type="submit" id="submitButton">Nộp Bài</button>
        </form>
        <div class="copyright">Học ăn học nói, học code học fix</div>
    `;

    document.getElementById('content').innerHTML = examContent;
    if (document.getElementById('timer')) {
        startTimer();
    } else {
        console.error('Timer element not found');
    }
     
    // Thêm event listener cho form
    document.getElementById('examForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Form submitted");
        submitExam(event);
    });

    // Thêm event listener cho nút "Nộp Bài"
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        console.log("Submit button clicked");
        submitExam(event);
    });

    isExamInProgress = true;
    setupBeforeUnloadWarning();
    startTimer();
}

// Hàm để render câu hỏi
function renderQuestions(questions, type, startIndex = 0) {
    console.log("renderQuestions called with type:", type);
    return questions.map((q, index) => `
        <div class="question">
            <p><strong>Câu ${index + 1}.</strong> ${q.question}</p>
            ${renderAnswers(q, type, index)}
        </div>
    `).join('');
}

// Hàm để render câu trả lời
function renderAnswers(question, type, index) {
    console.log("renderAnswers called with type:", type);
    if (type === 'abcd') {
        return Object.entries(question.options).map(([key, value], optionIndex) => `
            <div class="answer-option">
                <input type="radio" id="abcd_${index}_${key}" name="abcd_${index}" value="${key}">
                <label for="abcd_${index}_${key}">${key}. ${value}</label>
            </div>
        `).join('');
    } else if (type === 'dungsai') {
        return `
            <table class="true-false-table">
                <thead>
                    <tr>
                        <th class="statement-column">Đề bài</th>
                        <th class="answer-column">Đúng</th>
                        <th class="answer-column">Sai</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(question.statements).map(([key, value]) => `
                        <tr>
                            <td class="statement-column">${key}. ${value}</td>
                            <td class="answer-column"><input type="radio" name="dungsai_${index}_${key}" value="Đ"></td>
                            <td class="answer-column"><input type="radio" name="dungsai_${index}_${key}" value="S"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        return `<input type="text" name="traloingan_${index}" class="short-answer-input">`;
    }
}

// Hàm xử lý khi nộp bài
function submitExam(event) {
    if (event) {
        event.preventDefault();
    }
    stopTimer();
    isExamInProgress = false;
    console.log("submitExam function called");
    const form = document.getElementById('examForm');
    const formData = new FormData(form);
    const answers = {};
    
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        answers[key] = value;
    }
    
    console.log("Collected answers:", answers);
    console.log("Number of answers collected:", Object.keys(answers).length);
    
    // Xóa nội dung hiện tại của phần tử content
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';
    
    // Hiển thị kết quả
    displayResults(answers);
    
    // Xóa event listener để tránh tạo đề thi mới
    document.removeEventListener('DOMContentLoaded', createExam);
}

// Hàm hiển thị kết quả
function displayResults(answers) {
    console.log("displayResults function called");
    console.log("Received answers:", answers);
    console.log("Number of answers received:", Object.keys(answers).length);

    const abcdQuestions = window.currentExam.abcd;
    const dungSaiQuestions = window.currentExam.dungSai;
    const traLoiNganQuestions = window.currentExam.traLoiNgan;
    const score = calculateScore(answers);
    
    let resultsContent = `
    <div class="results-header">
        <h2>Kết quả</h2>
        <div class="nav-buttons">
            <a href="../../index.html" class="nav-button">Quay Lại Trang Chủ</a>
            <a href="lamdechuan_toan.html" class="nav-button">Làm Đề Khác</a>
        </div>
    </div>
    <div class="total-score">
        <h3>Tổng điểm: ${score.total.toFixed(2)}</h3>
        <p>Phần 1 (ABCD): ${score.abcd.toFixed(2)} điểm</p>
        <p>Phần 2 (Đúng Sai): ${score.dungSai.toFixed(2)} điểm</p>
        <p>Phần 3 (Trả Lời Ngắn): ${score.traLoiNgan.toFixed(2)} điểm</p>
    </div>
`;

    // Kiểm tra câu trắc nghiệm ABCD
    resultsContent += '<h3>I. Trắc nghiệm ABCD</h3>';
    abcdQuestions.forEach((q, index) => {
        const userAnswer = answers[`abcd_${index}`];
        const isCorrect = userAnswer === q.answer;
        resultsContent += `
            <div class="question result ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Câu ${index + 1}.</strong> ${q.question}</p>
                ${Object.entries(q.options).map(([key, value]) => `
                    <div class="answer-option">
                        <input type="radio" id="q${index}_${key}" name="q${index}" value="${key}"
                               ${userAnswer === key ? 'checked' : ''} disabled>
                        <label for="q${index}_${key}">${key}. ${value}</label>
                        ${key === q.answer ? '<span class="correct">✓</span>' : 
                          (userAnswer === key && key !== q.answer ? '<span class="incorrect">✗</span>' : '')}
                    </div>
                `).join('')}
            </div>
        `;
    });

    // Kiểm tra câu trắc nghiệm Đúng Sai
    resultsContent += '<h3>II. Trắc nghiệm Đúng Sai</h3>';
    dungSaiQuestions.forEach((q, index) => {
        resultsContent += `
            <div class="question result">
                <p><strong>Câu ${index + 1}.</strong> ${q.question}</p>
                <table class="true-false-table">
                    <thead>
                        <tr>
                            <th>Đề bài</th>
                            <th>Đúng</th>
                            <th>Sai</th>
                            <th>Kết quả</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        Object.entries(q.statements).forEach(([key, value]) => {
            const userAnswer = answers[`dungsai_${index}_${key}`];
            const correctAnswer = q.answers[key];
            const isCorrect = userAnswer === correctAnswer;
            resultsContent += `
                <tr class="${isCorrect ? 'correct' : 'incorrect'}">
                    <td>${key}. ${value}</td>
                    <td>
                        <input type="radio" name="dungsai_${index}_${key}" value="Đ" 
                               ${userAnswer === 'Đ' ? 'checked' : ''} disabled>
                    </td>
                    <td>
                        <input type="radio" name="dungsai_${index}_${key}" value="S" 
                               ${userAnswer === 'S' ? 'checked' : ''} disabled>
                    </td>
                    <td>
                        ${isCorrect ? '<span class="correct">✓</span>' : '<span class="incorrect">✗</span>'}
                    </td>
                </tr>
            `;
        });
        resultsContent += `
                    </tbody>
                </table>
            </div>
        `;
    });

    // Kiểm tra câu trắc nghiệm Trả Lời Ngắn
    resultsContent += '<h3>III. Trắc nghiệm Trả Lời Ngắn</h3>';
    traLoiNganQuestions.forEach((q, index) => {
        const userAnswer = answers[`traloingan_${index}`] || '';
        const isCorrect = userAnswer.toLowerCase().trim() === (q.answer || '').toLowerCase().trim();
        resultsContent += `
            <div class="question result ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Câu ${index + 1}.</strong> ${q.question}</p>
                <p>Câu trả lời của bạn: ${userAnswer || 'Không có câu trả lời'}
                   <span class="${isCorrect ? 'correct' : 'incorrect'}">
                       ${isCorrect ? '✓' : '✗'}
                   </span>
                </p>
                <p>Đáp án đúng: ${q.answer || 'Không có đáp án'}</p>
            </div>
        `;
    });

    // Tạo phần tử mới để chứa kết quả
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'resultsContainer';
    resultsContainer.innerHTML = resultsContent;

    // Chèn phần tử kết quả vào đầu của phần tử content
    const contentElement = document.getElementById('content');
    contentElement.insertBefore(resultsContainer, contentElement.firstChild);

    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
}

// Khởi tạo đề thi khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    createExam();
});

console.log("lamdechuan_toan.js loaded");








function setupBeforeUnloadWarning() {
    window.addEventListener('beforeunload', function (e) {
        if (isExamInProgress) {
            e.preventDefault(); // Cancel the event
            e.returnValue = ''; // Chrome requires returnValue to be set
        }
    });
}

function handleExit() {
    if (isExamInProgress) {
        if (confirm("Nếu thoát, dữ liệu đang làm sẽ mất. Bạn có chắc chắn muốn thoát không?")) {
            isExamInProgress = false;
            window.location.href = "trang_chu.html"; // Thay đổi URL này thành trang chủ của bạn
        }
    } else {
        window.location.href = "trang_chu.html"; // Thay đổi URL này thành trang chủ của bạn
    }
}


let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Cuộn xuống
        header.style.transform = 'translateY(-100%)';
    } else {
        // Cuộn lên
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);



function calculateScore(answers) {
    let totalScore = 0;
    
    // Tính điểm phần 1: Trắc nghiệm ABCD
    currentExam.abcd.forEach((q, index) => {
        if (answers[`abcd_${index}`] === q.answer) {
            totalScore += 0.25;
        }
    });
    
    // Tính điểm phần 2: Trắc nghiệm Đúng Sai
    currentExam.dungSai.forEach((q, index) => {
        let correctCount = 0;
        Object.keys(q.answers).forEach(key => {
            if (answers[`dungsai_${index}_${key}`] === q.answers[key]) {
                correctCount++;
            }
        });
        if (correctCount === 4) totalScore += 1;
        else if (correctCount === 3) totalScore += 0.5;
        else if (correctCount === 2) totalScore += 0.25;
        else if (correctCount === 1) totalScore += 0.1;
    });
    
    // Tính điểm phần 3: Trắc nghiệm Trả Lời Ngắn
    currentExam.traLoiNgan.forEach((q, index) => {
        if (answers[`traloingan_${index}`]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
            totalScore += 0.5;
        }
    });
    
    return totalScore.toFixed(2); // Làm tròn đến 2 chữ số thập phân
}




function calculateScore(answers) {
    let score = {
        abcd: 0,
        dungSai: 0,
        traLoiNgan: 0
    };
    
    // Tính điểm phần 1: Trắc nghiệm ABCD
    currentExam.abcd.forEach((q, index) => {
        if (answers[`abcd_${index}`] === q.answer) {
            score.abcd += 0.25;
        }
    });
    
    // Tính điểm phần 2: Trắc nghiệm Đúng Sai
    currentExam.dungSai.forEach((q, index) => {
        let correctCount = 0;
        Object.keys(q.answers).forEach(key => {
            if (answers[`dungsai_${index}_${key}`] === q.answers[key]) {
                correctCount++;
            }
        });
        if (correctCount === 4) score.dungSai += 1;
        else if (correctCount === 3) score.dungSai += 0.5;
        else if (correctCount === 2) score.dungSai += 0.25;
        else if (correctCount === 1) score.dungSai += 0.1;
    });
    
    // Tính điểm phần 3: Trắc nghiệm Trả Lời Ngắn
    currentExam.traLoiNgan.forEach((q, index) => {
        if (answers[`traloingan_${index}`]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
            score.traLoiNgan += 0.5;
        }
    });
    
    score.total = score.abcd + score.dungSai + score.traLoiNgan;
    
    return score;
}



let totalSeconds = 90 * 60; // 120 phút = 7200 giây
let timerInterval;

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = '';
    }
    const timerContainer = document.getElementById('timerContainer');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = timeString;

        if (totalSeconds <= 0) {
            stopTimer();
            submitExam();
        } else {
            totalSeconds--;
        }
    } else {
        console.error('Timer element not found');
        stopTimer();
    }
}


let isExamInProgress = false;
function setupBeforeUnloadWarning() {
    window.addEventListener('beforeunload', function (e) {
        if (isExamInProgress) {
            e.preventDefault(); // Cancel the event
            e.returnValue = ''; // Chrome requires returnValue to be set
        }
    });
}