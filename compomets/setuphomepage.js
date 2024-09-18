import router from '../router/router.js';
import HomePage from '../compomets/homepage.js';

const SERVER_API = "http://103.159.51.69:2000";

const fetchWithToken = async (url, method, accessToken, body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SERVER_API}${url}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch");
  }

  return response.json();
};

const getNewAccessToken = async () => {
  try {
    const data = await fetchWithToken("/login/get_new_token", "POST", "", { refresh: localStorage.getItem("refresh-token") });
    localStorage.setItem("access-token", data.access);
    localStorage.setItem("refresh-token", data.refresh);
    return data.access;
  } catch (error) {
    console.log("Error when getting new access token:", error);
    localStorage.clear();
    router.navigate("/login");
    return null;
  }
};

const setupLogoutButton = () => {
  const btnLogout = document.querySelector(".btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.clear();
      router.navigate("/login");
    });
  }
};

const renderPosts = (posts) => {
  const postsHtml = posts.map(post => `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.content}</td>
      <td class="edit-container">
        <button class="edit-btn">Edit</button>
      </td>
      <td class="delete-container">
        <button class="delete-btn">Delete</button>
      </td>
    </tr>
  `).join('');

  document.querySelector("#app").innerHTML = HomePage(postsHtml);
  setupLogoutButton();
};

export const setupHomePage = async () => {
  let accessToken = localStorage.getItem("access-token");
  const refreshToken = localStorage.getItem("refresh-token");

  if (!accessToken || !refreshToken) {
    router.navigate("/login");
    return;
  }

  const loadPosts = async () => {
    try {
      const posts = await fetchWithToken("/post", "GET", accessToken);
      renderPosts(posts);
    } catch (error) {
      if (error.message === "token expired") {
        const newAccessToken = await getNewAccessToken();
        if (newAccessToken) {
          const posts = await fetchWithToken("/post", "GET", newAccessToken);
          renderPosts(posts);
        }
      } else {
        console.log("Error when fetching posts:", error);
        router.navigate("/login");
      }
    }
  };

  await loadPosts();
};
