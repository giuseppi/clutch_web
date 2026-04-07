import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { supabase, useSupabaseAuth } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'COACH' | 'SCOUT' | 'ATHLETE';
  teamId?: string;
  playerId?: string;
  avatarUrl?: string;
  team?: {
    id: string;
    name: string;
    abbreviation: string;
    level: string;
    visibilitySettings: Record<string, boolean>;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // Check for active session (Supabase or localStorage)
    let hasSession = false;

    if (useSupabaseAuth && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      hasSession = !!session;
    } else {
      hasSession = !!localStorage.getItem('clutch_access_token');
    }

    if (!hasSession) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // /auth/me always works — reads full user profile from our users table
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      if (!useSupabaseAuth) {
        localStorage.removeItem('clutch_access_token');
        localStorage.removeItem('clutch_refresh_token');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for Supabase auth state changes (sign in/out from other tabs, token refresh)
    if (useSupabaseAuth && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          refreshUser();
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    if (useSupabaseAuth && supabase) {
      // Production: sign in via Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch full user profile from our backend
      const { data } = await api.get('/auth/me');
      setUser(data);
      return data;
    } else {
      // Local dev: sign in via custom Express endpoint
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('clutch_access_token', data.accessToken);
      localStorage.setItem('clutch_refresh_token', data.refreshToken);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = async () => {
    if (useSupabaseAuth && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('clutch_access_token');
      localStorage.removeItem('clutch_refresh_token');
    }
    setUser(null);
    window.location.href = '/app/login';
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
