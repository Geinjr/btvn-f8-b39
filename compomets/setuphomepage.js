

import router from "../router/router.js";
import HomePage from "./homepage.js";

const SERVER_API = "http://103.159.51.69:2000";

const getNewToken = async () => {
    try {
        const response = await fetch(`${SERVER_API}/get_new_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "refresh": localStorage.getItem("refresh_token")  // Sửa thành refresh_token
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to refresh access token`);
        }

        // Sửa để sử dụng response.json() đúng cách
        const data = await response.json();

        // Sử dụng biến data để lấy access và refresh
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        return data.access;
    } catch (error) {
        console.error('Failed to get new tokens:', error);
        localStorage.clear();
        router.navigate("/login");
        return null;
    }
};

const getPost = async (access_token) => {
    try {
        const response = await fetch(`${SERVER_API}/post`, {
            method: "POST",  // Sửa thành chuỗi "POST"
            headers: {       // Sửa "header" thành "headers"
                "Content-Type": "application/json",
                "Authorization": "bearer <access_token>"
            }
        });

       

        if (!response.ok) {
            const { detail } = await response.json();  // Sửa để gọi response.json() đúng cách
            throw new Error(detail);
        }

        const data = await response.json();  // Sửa để gọi response.json() đúng cách
        return data;

    } catch (error) {
        console.error("Error when fetching posts:", error);  // Sửa thành 'error' thay vì 'e'
        throw error;
    }
};


export const setupHomePage = async () => {
    let access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
  
    if (!access_token || !refresh_token) {
      router.navigate("/login");
      return;
    }
    const logoutBtn = () => {
        const btnLogout = document.querySelector(".btn-logout");
        btnLogout.addEventListener("click", function(e) {
          localStorage.clear();
          router.navigate("/login");
        });
      };
    
      const renderPost = (posts) => {
        const postsHtml = posts.map(post =>
          `
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
          `
        ).join("");
        
        document.querySelector("#app").innerHTML = HomePage(postsHtml);
        logoutBtn();
      };
    
      
      const loadPosts = async () => {
        try {
          let posts = await getPosts(access_token);
          renderPosts(posts);
        } catch (error) {
          console.log("Error when loading posts:", error);
          if (error.message === "token expired") {
            const newAccessToken = await getNewToken();
            if (newAccessToken) {
              try {
                // Cập nhật access_token bằng token mới
                access_token = newAccessToken;
                const posts = await getPosts(newAccessToken);
                renderPosts(posts);
              } catch (error2) {
                console.log("Error when retrying fetch posts:", error2);
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
    logoutBtn()
    
  };
  

  
