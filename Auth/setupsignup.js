import router from '../router/router.js';

export const setupSignupPage = () => {
    const SERVER_API = "http://103.159.51.69:2000";

    // Xử lý nút quay lại
    const btnBack = document.querySelector(".btn-back");
    btnBack.addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate('/login'); // Chuyển hướng đến trang đăng nhập
    });

    // Xử lý form đăng ký
    const registerForm = document.querySelector(".register-form");
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = document.querySelector('input[name="name"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const password = document.querySelector('input[name="password"]').value.trim();

        // Kiểm tra nếu thiếu thông tin
        if (!name || !email || !password) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            // Gửi yêu cầu đăng ký
            const response = await fetch(`${SERVER_API}/master/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": password
                })
            });


            console.log("Response status:", response.status);  // In mã trạng thái phản hồi
            const responseBody = await response.json();
            console.log("Response body:", responseBody); 
            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                throw new Error("Đăng ký tài khoản không thành công");
            }

            // Nhận dữ liệu JSON từ server
            const data = await response.json();
            console.log("Đăng ký thành công:", data);

            // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
            router.navigate('/login');

        } catch (error) {
            // Xử lý lỗi khi đăng ký thất bại
            console.log("Có lỗi trong quá trình đăng ký:", error);
            alert("Đăng ký không thành công. Vui lòng thử lại.");
        }
    });
};
