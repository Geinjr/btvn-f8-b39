
const Login = () => {
    return `
      <div class="login-wrap">
        <h1 class="login-heading">Login</h1>
        <form class="login-form">
          <label>
            Email
            <input type="email" placeholder="Email" class="login-email" name="email" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Password" class="login-password" name="password" />
          </label>
          <div class="btn-wrap">
            <button class="btn-register">Register</button>
            <button class="btn-login">Login</button>
          </div>
        </form>
      </div>
    `
  }
  
  export default Login