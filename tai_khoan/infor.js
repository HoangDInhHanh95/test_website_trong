document.addEventListener('DOMContentLoaded', function() {
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const usernameInput = document.getElementById('usernameInput');
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    usernameInput.value = loggedInUser.username || '';
    if (loggedInUser.avatar) {
        avatarPreview.src = loggedInUser.avatar;
    }

    changeAvatarBtn.addEventListener('click', function() {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const size = Math.min(img.width, img.height);
                    canvas.width = canvas.height = size;
                    
                    ctx.drawImage(
                        img,
                        (img.width - size) / 2,
                        (img.height - size) / 2,
                        size,
                        size,
                        0,
                        0,
                        size,
                        size
                    );
                    
                    avatarPreview.src = canvas.toDataURL('image/png');
                    loggedInUser.avatar = avatarPreview.src;
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    saveChangesBtn.addEventListener('click', function() {
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            loggedInUser.username = newUsername;
            loggedInUser.avatar = avatarPreview.src;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            alert('Thay đổi đã được lưu!');
        } else {
            alert('Tên đăng nhập không được để trống!');
        }
    });
});