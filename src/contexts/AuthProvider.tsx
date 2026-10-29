import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { AuthContext, type User } from './AuthContext';
// import { supabase, useSupabaseAuth } from '@/lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // Supabase session check (disabled):
    // if (useSupabaseAuth && supabase) {
    //   const { data: { session } } = await supabase.auth.getSession();
    //   hasSession = !!session;
    // } else {
    const hasSession = !!localStorage.getItem('clutch_access_token');
    // }

    if (!hasSession) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      localStorage.removeItem('clutch_access_token');
      localStorage.removeItem('clutch_refresh_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Supabase auth listener (disabled):
    // if (useSupabaseAuth && supabase) {
    //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //     ...
    //   });
    //   return () => subscription.unsubscribe();
    // }
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    // Supabase sign-in (disabled):
    // if (useSupabaseAuth && supabase) {
    //   const { error } = await supabase.auth.signInWithPassword({ email, password });
    //   ...
    // }

    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('clutch_access_token', data.accessToken);
    localStorage.setItem('clutch_refresh_token', data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    // Supabase sign-out (disabled):
    // if (useSupabaseAuth && supabase) {
    //   await supabase.auth.signOut();
    // }

    localStorage.removeItem('clutch_access_token');
    localStorage.removeItem('clutch_refresh_token');
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
