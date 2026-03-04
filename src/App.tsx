import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/app/LoginPage";
import DashboardPage from "./pages/app/DashboardPage";
import LeaderboardPage from "./pages/app/LeaderboardPage";
import RosterPage from "./pages/app/RosterPage";
import UploadPage from "./pages/app/UploadPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import SettingsPage from "./pages/app/SettingsPage";
import MyProfilePage from "./pages/app/MyProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<Navigate to="/app/login" replace />} />
            <Route path="/app/login" element={<LoginPage />} />

            {/* Protected routes — all roles */}
            <Route path="/app/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Athlete-only routes */}
            <Route path="/app/my-profile" element={<ProtectedRoute allowedRoles={['ATHLETE']}><MyProfilePage /></ProtectedRoute>} />

            {/* Coach-only routes */}
            <Route path="/app/dashboard" element={<ProtectedRoute allowedRoles={['COACH']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/app/roster" element={<ProtectedRoute allowedRoles={['COACH']}><RosterPage /></ProtectedRoute>} />
            <Route path="/app/upload" element={<ProtectedRoute allowedRoles={['COACH']}><UploadPage /></ProtectedRoute>} />
            <Route path="/app/analytics" element={<ProtectedRoute allowedRoles={['COACH', 'SCOUT']}><AnalyticsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
