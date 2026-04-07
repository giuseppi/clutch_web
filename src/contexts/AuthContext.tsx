import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
// import { supabase, useSupabaseAuth } from '@/lib/supabase';

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
