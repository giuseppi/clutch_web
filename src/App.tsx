import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/app/LoginPage";
import DashboardPage from "./pages/app/DashboardPage";
import LeaderboardPage from "./pages/app/LeaderboardPage";
import RosterPage from "./pages/app/RosterPage";
import UploadPage from "./pages/app/UploadPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import MatchAnalyticsPage from "./pages/app/MatchAnalyticsPage";
import SettingsPage from "./pages/app/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<Navigate to="/app/login" replace />} />
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/leaderboard" element={<LeaderboardPage />} />
          <Route path="/app/roster" element={<RosterPage />} />
          <Route path="/app/upload" element={<UploadPage />} />
          <Route path="/app/analytics" element={<AnalyticsPage />} />
          <Route path="/app/analytics/:matchId" element={<MatchAnalyticsPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
