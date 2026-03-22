import axios from 'axios';
import { supabase, useSupabaseAuth } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request.
// Production (Supabase): token from Supabase session.
// Local dev: token from localStorage.
api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  if (useSupabaseAuth && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token ?? null;
  } else {
    token = localStorage.getItem('clutch_access_token');
  }

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

      if (useSupabaseAuth && supabase) {
        // Supabase auto-refreshes; if we still get 401, session is truly expired
        const { data: { session } } = await supabase.auth.refreshSession();
        if (session) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api.request(originalRequest);
        }
        window.location.href = '/app/login';
      } else {
        // Local dev: manual refresh token flow
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
            window.location.href = '/app/login';
          }
        } else {
          window.location.href = '/app/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
