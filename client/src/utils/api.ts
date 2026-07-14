import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});


let isRefreshing = false;

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        await api.get("/auth/refresh");

        return api(originalRequest);

      } catch (err) {

        return Promise.reject(err);

      } finally {

        isRefreshing = false;

      }
    }

    return Promise.reject(error);
  }
);


export default api