document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const usernameSpan = document.getElementById('username');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const userDropdown = document.getElementById('userDropdown');

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        userInfo.style.display = 'inline-flex';
        usernameSpan.textContent = loggedInUser.username;
        if (loggedInUser.avatar) {
            userAvatar.src = loggedInUser.avatar;
        }
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
    } else {
        userInfo.style.display = 'none';
        loginLink.style.display = 'inline-block';
        registerLink.style.display = 'inline-block';
    }

    userInfo.addEventListener('click', function(event) {
        userDropdown.classList.toggle('show');
        event.stopPropagation();
    });

    window.addEventListener('click', function(event) {
        if (!userInfo.contains(event.target)) {
            userDropdown.classList.remove('show');
        }
    });

    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.reload();
    });
});