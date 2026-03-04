import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clutch_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → attempt token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('clutch_refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );
          localStorage.setItem('clutch_access_token', data.accessToken);
          localStorage.setItem('clutch_refresh_token', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(originalRequest);
        } catch {
          // Refresh failed — clear tokens and redirect
          localStorage.removeItem('clutch_access_token');
          localStorage.removeItem('clutch_refresh_token');
          window.location.href = '/app/login';
        }
      } else {
        window.location.href = '/app/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
