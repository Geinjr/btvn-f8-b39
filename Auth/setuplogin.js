
import router from '../router/router.js';

export const setupLoginPage = async () => {
    const SERVER_API = "http://103.159.51.69:2000";

    const SignupBtn = document.querySelector(".btn-register");
    if (SignupBtn) {
        SignupBtn.addEventListener("click", function(e) { 
            e.preventDefault();
            router.navigate('/signup');  
        });
    }

    const loginForm = document.querySelector(".login-form");

    // Kiểm tra sự tồn tại của form trước khi gắn sự kiện
    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const email = document.querySelector('input[name="email"]').value.trim();
            const password = document.querySelector('input[name="password"]').value.trim();

            // Kiểm tra nếu thông tin bị thiếu
            if (!email || !password) {
                alert("Vui lòng điền đầy đủ thông tin");
                return;
            }

            try {
                const response = await fetch(`${SERVER_API}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "email": email,
                        "password": password
                    })
                });

                // const errorData = await response.json();
                if (!response.ok) {
                    // Thêm logic xử lý lỗi chi tiết dựa trên mã phản hồi HTTP
                    throw new Error(errorData.message || "Đăng nhập tài khoản không thành công");
                }

                const { access, refresh } = await response.json();
                localStorage.setItem("access-token", access);
                localStorage.setItem("refresh-token", refresh);

                // Điều hướng về trang chính
                router.navigate('/');

            } catch (error) {
                console.error("Lỗi khi đăng nhập: ", error);
                alert(error.message || "Đăng nhập không thành công. Vui lòng thử lại.");
            }
        });
    } else {
        console.error("Không tìm thấy form đăng nhập.");
    }
};


