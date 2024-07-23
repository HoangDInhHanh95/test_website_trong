// tin_tuc.js

let editingIndex = -1;

function saveNews(news) {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    if (editingIndex === -1) {
        savedNews.push(news);
    } else {
        savedNews[editingIndex] = news;
        editingIndex = -1;
    }
    localStorage.setItem('news', JSON.stringify(savedNews));
    updateLatestNews();
}

function loadNews() {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    const newsList = document.getElementById('news-items');
    if (newsList) {
        newsList.innerHTML = ''; // Clear existing news
        savedNews.forEach((news, index) => {
            addNewsToList(news, index);
        });
    }
}

function addNewsToList(news, index) {
    const newsList = document.getElementById('news-items');
    if (newsList) {
        const newsItem = document.createElement('li');
        newsItem.innerHTML = `
            <div class="news-date">${formatDate(news.date)}</div>
            <strong>${news.title}</strong>
            <div class="news-content">${news.content}</div>
            <button class="delete-btn" data-index="${index}">Xóa</button>
            <button class="edit-btn" data-index="${index}">Chỉnh sửa</button>
        `;
        newsList.appendChild(newsItem);
    }
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function deleteNews(index) {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    savedNews.splice(index, 1);
    localStorage.setItem('news', JSON.stringify(savedNews));
    loadNews();
    updateLatestNews();
}

function editNews(index) {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    const news = savedNews[index];
    const titleInput = document.getElementById('news-title');
    const contentInput = document.getElementById('news-content');
    if (titleInput && contentInput) {
        titleInput.value = news.title;
        contentInput.value = news.content;
        editingIndex = index;
        const addNewsHeading = document.querySelector('#add-news h2');
        const submitButton = document.querySelector('#news-form button[type="submit"]');
        if (addNewsHeading) addNewsHeading.textContent = 'Chỉnh sửa tin tức';
        if (submitButton) submitButton.textContent = 'Cập nhật';
    }
}

function updateLatestNews() {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    let latestNews = savedNews.slice(-2).reverse(); // Lấy 2 tin tức mới nhất
    
    let latestNewsSection = document.querySelector('.section:nth-child(1)');
    if (latestNewsSection) {
        latestNewsSection.innerHTML = `
            <h2>Tin Tức Mới Nhất</h2>
            ${latestNews.map(news => `
                <div class="news-item">
                    <h3>${news.title}</h3>
                    <p>${news.content}</p>
                </div>
            `).join('')}
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const newsForm = document.getElementById('news-form');
    const newsList = document.getElementById('news-items');

    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('news-title');
            const contentInput = document.getElementById('news-content');
            
            if (titleInput && contentInput) {
                const title = titleInput.value;
                const content = contentInput.value;
                const date = editingIndex === -1 ? getCurrentDateTime() : JSON.parse(localStorage.getItem('news'))[editingIndex].date;
                
                const news = { title, content, date };
                saveNews(news);
                loadNews();
                
                newsForm.reset();
                const addNewsHeading = document.querySelector('#add-news h2');
                const submitButton = document.querySelector('#news-form button[type="submit"]');
                if (addNewsHeading) addNewsHeading.textContent = 'Thêm tin tức';
                if (submitButton) submitButton.textContent = 'Thêm tin';
                editingIndex = -1;
            }
        });
    }

    if (newsList) {
        newsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.getAttribute('data-index');
                deleteNews(index);
            } else if (e.target.classList.contains('edit-btn')) {
                const index = e.target.getAttribute('data-index');
                editNews(index);
            }
        });
    }

    loadNews();
    updateLatestNews();
});

// Thêm hàm này vào cuối file tin_tuc.js
function updateIndexLatestNews() {
    let savedNews = JSON.parse(localStorage.getItem('news')) || [];
    let latestNews = savedNews.slice(-2).reverse(); // Lấy 2 tin tức mới nhất
    
    let latestNewsContainer = document.getElementById('latest-news-container');
    if (latestNewsContainer) {
        latestNewsContainer.innerHTML = latestNews.map(news => `
            <div class="news-item">
                <h3>${news.title}</h3>
                <p>${news.content}</p>
            </div>
        `).join('');
    }
}