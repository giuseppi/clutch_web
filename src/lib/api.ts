import axios from 'axios';
// import { supabase, useSupabaseAuth } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request (localStorage JWT from /auth/login).
// Supabase (disabled):
// if (useSupabaseAuth && supabase) {
//   const { data: { session } } = await supabase.auth.getSession();
//   token = session?.access_token ?? null;
// }
api.interceptors.request.use(async (config) => {
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

      // Supabase session refresh (disabled):
      // if (useSupabaseAuth && supabase) {
      //   const { data: { session } } = await supabase.auth.refreshSession();
      //   ...
      // }

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
          localStorage.removeItem('clutch_access_token');
          localStorage.removeItem('clutch_refresh_token');
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
