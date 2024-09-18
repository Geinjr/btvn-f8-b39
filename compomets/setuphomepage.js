
import router from '../router/router.js';
import HomePage from './HomePage.js';

const SERVER_API = "http://103.159.51.69:2000";

const getNewAccessToken = async () => {
  try {
    const response = await fetch(`${SERVER_API}/login/get_new_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "refresh": localStorage.getItem("refresh-token")
      })
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();

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

const getPosts = async (accessToken) => {
  try {
    let response = await fetch(`${SERVER_API}/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const { detail } = await response.json()
      throw new Error(detail);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error when fetching posts:", error);
    throw error;
  }
};

export const setupHomePage = async () => {
  let accessToken = localStorage.getItem("access-token");
  const refreshToken = localStorage.getItem("refresh-token");

  if (!accessToken || !refreshToken) {
    router.navigate("/login");
    return;
  }

  const setupLogoutButton = () => {
    const btnLogout = document.querySelector(".btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", function () {
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
    setupLogoutButton(); // Chỉ cần gọi sau khi render xong
  };

  const loadPosts = async () => {
    try {
      let posts = await getPosts(accessToken);
      renderPosts(posts);
    } catch (error) {
      console.log("Error when loading posts:", error);
      if (error.message === "token expired") {
        const newAccessToken = await getNewAccessToken();
        if (newAccessToken) {
          accessToken = newAccessToken;
          try {
            const posts = await getPosts(newAccessToken);
            renderPosts(posts);
          } catch (retryError) {
            console.log("Error when retrying fetch posts:", retryError);
            router.navigate("/login");
          }
        } else {
          router.navigate("/login");
        }
      } else {
        router.navigate("/login");
      }
    }
  };

  await loadPosts();
};
