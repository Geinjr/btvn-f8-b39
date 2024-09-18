import Login from './Auth/login.js';
import { setupLoginPage } from './Auth/setuplogin.js';
import Signup from './Auth/signup.js';
import { setupSignupPage } from './Auth/setupsignup.js';
import HomePage from './compomets/homepage.js';
import { setupHomePage } from './compomets/setuphomepage.js';



const render = async (position, content, setupFn) => {
    const result = typeof content === "function" ? await content() : content();
    position.innerHTML = result;
    if (setupFn) {
        setupFn(); 
    }
};

router
    .on("/", async () => {
        await render(app, HomePage , setupHomePage);
    })
    .on("/login", () => {
        render(app, Login, setupLoginPage); // Gọi setupLoginPage sau khi render Login
    })
    .on("/signup", () => {
        render(app, Signup, setupSignupPage); // Gọi setupSignupPage sau khi render Signup
    });

router.resolve();



