document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Lấy thông tin người dùng đã đăng ký từ localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    // Kiểm tra thông tin đăng nhập
    if (storedUser && username === storedUser.username && password === storedUser.password) {
        alert('Đăng nhập thành công!');
        // Lưu thông tin đăng nhập
        // Trong phần xử lý đăng nhập thành công
        localStorage.setItem('loggedInUser', JSON.stringify({username: username}));
        // Chuyển hướng về trang chủ
        window.location.href = '../index.html';
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
});