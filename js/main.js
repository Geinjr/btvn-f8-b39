import Login from '../Auth/login.js';
import { setupLoginPage } from '../Auth/setuplogin.js';
import Signup from '../Auth/signup.js';
import { setupSignupPage } from '../Auth/setupsignup.js';
import HomePage from '../compomets/homepage.js';
import { setupHomePage } from '../compomets/setuphomepage.js';
import router from '../router/router.js';

const app = document.querySelector("#app");
// const router = new Navigo('/', { hash: true });


const render = async (position, content, setupFn) => {
    const result = typeof content === "function" ? await content() : content();
    position.innerHTML = result;
    if (setupFn) {
        setupFn(); 
    }
};
s
router
    .on("/", async () => {
        await render(app, HomePage , setupHomePage);
    })
    .on("/login", async() => {
        await render(app, HomePage , setupHomePage);
        render(app, Login, setupLoginPage); // Gọi setupLoginPage sau khi render Login
    })
    .on("/signup",async () => {
        await render(app, HomePage , setupHomePage);
        render(app, Signup, setupSignupPage); // Gọi setupSignupPage sau khi render Signup
    });

router.resolve();



