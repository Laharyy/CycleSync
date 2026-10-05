import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000",

  headers: {
    "Content-Type": "application/json",
  },
});


/*
  Attach the logged-in user's token
  to every API request.
*/

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("cyclesync_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


/*
  Handle expired or invalid sessions.

  If the backend returns 401:
  - remove the saved token
  - remove saved user information
  - send the user back to Login
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem(
        "cyclesync_token"
      );

      localStorage.removeItem(
        "cyclesync_user"
      );

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;