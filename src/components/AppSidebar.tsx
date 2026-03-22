import { Link, useLocation } from "react-router-dom";
import AppSidebarHeader from "@/components/AppSidebarHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_LINKS = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
] as const;

const PROFILE_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bvNIXmlNd1k6t3aTwwkaOdsdLBiNBk0iDQQFTJkPbNKqDdtZOHrf5rPtMzFu7aGW7xdqL_blidJ4QKOxmrrUkRodx5dCK8HaMnAQCkNpnJYcWstAtARck9OV1kaGJou8AlEIRfQFfXPt5L4rwdgpmfIw3ycqycX1qeEAkczNWJpNM0LARoelQZ1bLgzMie9diJvSZlyPOAlOOnJC6HANj6cT_CpA_k2skf-O9IE84WfaYJNKEAS51sisvSSP3tQou2UwLvuYpGl4";

const STORAGE_PERCENT = 85;
const STORAGE_USED = "8.5 GB of 10 GB used";

/**
 * Shared app sidebar: same order on every page.
 * Order: Header → Nav → Upgrade Plan → Settings → Storage Used → Profile (dropdown with Logout).
 */
const AppSidebar = () => {
  const location = useLocation();

  const linkActive = (to: string) => {
    if (to === "/app/analytics") return location.pathname.startsWith("/app/analytics");
    return location.pathname === to;
  };

  const settingsActive = location.pathname === "/app/settings";

  return (
    <aside className="w-64 bg-[#151515] border-r border-[#262626] hidden md:flex flex-col h-screen sticky top-0 z-50">
      <div className="h-16 flex items-center px-6 border-b border-[#262626]">
        <AppSidebarHeader />
      </div>

      {/* Main nav: only Dashboard through Roster (no Settings here) */}
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto min-h-0">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = linkActive(link.to);
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
      </nav>

      {/* Fixed bottom block: Upgrade Plan → Settings → Storage → Profile (never scrolls, Settings stays at bottom) */}
      <div className="flex-shrink-0 border-t border-[#262626] p-4 flex flex-col gap-0">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          Upgrade Plan
        </button>
        <Link
          to="/app/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            settingsActive
              ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
      </div>

      {/* Storage Used — right above profile */}
      <div className="flex-shrink-0 p-4 border-t border-[#262626]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#a3a3a3] font-medium">Storage Used</span>
          <span className="text-xs text-[#ff6a00] font-bold">{STORAGE_PERCENT}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ff6a00] rounded-full transition-all"
            style={{ width: `${STORAGE_PERCENT}%` }}
          />
        </div>
        <p className="text-[10px] text-[#a3a3a3] mt-1.5">{STORAGE_USED}</p>
      </div>

      {/* Profile at bottom — click to open dropdown with Logout */}
      <div className="flex-shrink-0 p-4 border-t border-[#262626]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/30 focus:ring-offset-2 focus:ring-offset-[#151515]"
              aria-label="Open profile menu"
            >
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#262626] shrink-0"
                style={{ backgroundImage: `url("${PROFILE_IMAGE_URL}")` }}
              />
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-sm font-medium text-slate-200 truncate">Coach K</span>
                <span className="text-xs text-[#a3a3a3] truncate">Head Coach</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400 ml-auto shrink-0">
                expand_more
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="min-w-[12rem] bg-[#1a1a1a] border-[#262626] text-slate-100"
          >
            <DropdownMenuItem asChild>
              <Link
                to="/"
                className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default AppSidebar;
