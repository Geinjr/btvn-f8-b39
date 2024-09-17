const HomePage = (postsHtml = '') => {

    return `
      <div class="post-container">
        <div class="post-header">
          <h1>F8 Project</h1>
          <div class="user-header">
            <p class="username">Gein.Jr</p>
            <button class="btn-logout">Logout</button>
          </div>
        </div>
        <div class="post-body">
          <h2>List Post</h2>
          <table class="table">
            <thead>
              <tr>
                <th>id</th>
                <th>title</th>
                <th>content</th>
                <th colspan="2">action</th>
              </tr>
            </thead>
            <tbody>
              ${postsHtml}
            </tbody>
          </table>
        </div>
      </div>
      `
  };
  
  export default HomePage;