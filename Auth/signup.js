const Signup = () => {
  return `
    <div class="register-wrap">
      <h1 class="register-heading">Create new account</h1>
      <form class="register-form">
        <label>
          Name
          <input type="text" placeholder="Name" class="register-email" name="name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="Email" class="register-email" name="email" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Password" class="register-password" name="password" />
        </label>
        <div class="btn-wrap">
        <button class="btn-back">Back</button>
        <button type="submit" class="btn-registerSub">Register</button>
      </div>
      </form>
    </div>
  `
}

export default Signup