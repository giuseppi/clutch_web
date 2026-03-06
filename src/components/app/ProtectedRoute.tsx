import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'COACH' | 'SCOUT' | 'ATHLETE'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  // Role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their default route
    const defaultRoutes = {
      COACH: '/app/dashboard',
      SCOUT: '/app/leaderboard',
      ATHLETE: '/app/my-profile',
    };
    return <Navigate to={defaultRoutes[user.role]} replace />;
  }

  return <>{children}</>;
}
