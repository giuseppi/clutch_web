import { createContext, useContext } from 'react';

export interface User {
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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
