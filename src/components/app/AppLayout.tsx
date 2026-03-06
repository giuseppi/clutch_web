import { Link, useLocation, useNavigate } from "react-router-dom";
import clutchLogo from "@/assets/clutch_logo.png";
import { useAuth } from "@/contexts/AuthContext";

const COACH_LINKS = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Film" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
];

const SCOUT_LINKS = [
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
];

const ATHLETE_LINKS = [
  { to: "/app/my-profile", icon: "person", label: "My Profile" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
];

const ROLE_TITLES: Record<string, string> = {
  COACH: "Clutch Coach",
  SCOUT: "Clutch Scout",
  ATHLETE: "Clutch",
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role || "COACH";
  const sidebarTitle = ROLE_TITLES[role] || "Clutch";
  const links = role === "SCOUT" ? SCOUT_LINKS : role === "ATHLETE" ? ATHLETE_LINKS : COACH_LINKS;
  const displayName = user ? `${user.firstName} ${user.lastName?.charAt(0)}.` : "User";
  const teamName = user?.team?.name || role;

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#262626] cursor-pointer" onClick={() => navigate("/")}>
          <img src={clutchLogo} alt="Clutch" className="size-8 object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
          <h2 className="text-slate-100 text-lg font-bold tracking-tight">{sidebarTitle}</h2>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[#262626] flex flex-col gap-1">
            <Link
              to="/app/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/app/settings"
                  ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#ff6a00]/20 border border-[#262626] flex items-center justify-center text-[#ff6a00] font-bold text-sm">
              {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">{displayName}</span>
              <span className="text-xs text-[#a3a3a3] truncate">{teamName}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile header */}
        <header className="flex md:hidden items-center justify-between border-b border-[#262626] px-4 py-3 bg-[#151515]/90 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src={clutchLogo} alt="Clutch" className="size-8 object-contain" />
            <span className="font-bold text-slate-100">{sidebarTitle}</span>
          </div>
          <button className="text-slate-400">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}
