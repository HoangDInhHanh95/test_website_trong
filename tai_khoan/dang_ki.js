document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    // Xử lý đăng ký
    alert('Đăng ký thành công!');
    // Lưu thông tin đăng ký vào localStorage
    localStorage.setItem('user', JSON.stringify({username: newUsername, password: newPassword}));
    
    // Chuyển hướng đến trang đăng nhập
    window.location.href = 'dang_nhap.html';
});