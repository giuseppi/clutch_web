import { Link, useLocation } from "react-router-dom";
import AppSidebarHeader from "@/components/AppSidebarHeader";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "cloud_upload", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "group", label: "Roster" },
];

const profileImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1bvNIXmlNd1k6t3aTwwkaOdsdLBiNBk0iDQQFTJkPbNKqDdtZOHrf5rPtMzFu7aGW7xdqL_blidJ4QKOxmrrUkRodx5dCK8HaMnAQCkNpnJYcWstAtARck9OV1kaGJou8AlEIRfQFfXPt5L4rwdgpmfIw3ycqycX1qeEAkczNWJpNM0LARoelQZ1bLgzMie9diJvSZlyPOAlOOnJC6HANj6cT_CpA_k2skf-O9IE84WfaYJNKEAS51sisvSSP3tQou2UwLvuYpGl4";

type MatchStatus = "complete" | "processing" | "missing";

interface MatchCard {
  id: string;
  opponentAbbr: string;
  title: string;
  date: string;
  status: MatchStatus;
  statusLabel: string;
  finalScore?: string;
  teamPpp?: string;
  processingPercent?: number;
}

const matches: MatchCard[] = [
  {
    id: "duke-alabama",
    opponentAbbr: "DUK",
    title: "Duke vs. Alabama",
    date: "Nov 15, 2023",
    status: "complete",
    statusLabel: "AI Analysis Complete",
    finalScore: "W 82-76",
    teamPpp: "1.14",
  },
  {
    id: "duke-kentucky",
    opponentAbbr: "UK",
    title: "Duke @ Kentucky",
    date: "Nov 12, 2023",
    status: "processing",
    statusLabel: "Processing Film",
    finalScore: "L 71-74",
    processingPercent: 85,
  },
  {
    id: "duke-unc",
    opponentAbbr: "UNC",
    title: "Duke vs. UNC",
    date: "Nov 10, 2023",
    status: "missing",
    statusLabel: "Missing Film",
    finalScore: "W 89-81",
  },
];

const AnalyticsPage = () => {
  const location = useLocation();

  return (
    <div className="dark bg-background-dark font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface-dark border-r border-[#262626] flex flex-col h-screen">
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <AppSidebarHeader />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3">
            <div
              className="size-8 rounded-full bg-[#262626] bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url("${profileImageUrl}")` }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">Coach K</span>
              <span className="text-xs text-[#a3a3a3] truncate">Head Coach</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="flex md:hidden items-center justify-between border-b border-[#262626] px-4 py-3 bg-surface-dark/90 backdrop-blur-md sticky top-0 z-40">
          <AppSidebarHeader compact />
          <button type="button" className="text-slate-400" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        <header className="flex-shrink-0 px-4 md:px-8 py-6 border-b border-[#262626] bg-background-dark/80 backdrop-blur-md z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-white mb-6">Match Analytics Archive</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[240px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by opponent..."
                  className="w-full bg-surface-dark border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#a3a3a3] focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all"
                />
              </div>
              <div className="relative min-w-[200px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[20px]">
                  calendar_today
                </span>
                <select
                  className="w-full bg-surface-dark border border-[#262626] rounded-lg py-2 pl-10 pr-8 text-sm text-white appearance-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all cursor-pointer"
                  aria-label="Date range"
                >
                  <option>All Time</option>
                  <option>This Season</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range...</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
              <div className="relative min-w-[180px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[20px]">
                  filter_list
                </span>
                <select
                  className="w-full bg-surface-dark border border-[#262626] rounded-lg py-2 pl-10 pr-8 text-sm text-white appearance-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all cursor-pointer"
                  aria-label="Filter by status"
                >
                  <option>All Statuses</option>
                  <option>Processed</option>
                  <option>Processing</option>
                  <option>Missing Film</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-surface-dark border border-[#262626] rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)] hover:border-[#262626]/80 transition-all flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-white">{match.opponentAbbr}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-lg font-bold text-white truncate">{match.title}</h3>
                    <span className="text-sm text-[#a3a3a3]">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {match.status === "complete" && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-xs font-medium">
                        <span className="size-1.5 rounded-full bg-accent-teal shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                        {match.statusLabel}
                      </span>
                    )}
                    {match.status === "processing" && (
                      <div className="flex flex-col gap-1.5 max-w-md">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-[#ff6a00] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            {match.statusLabel}
                          </span>
                          <span className="text-[#a3a3a3]">{match.processingPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden border border-[#262626]">
                          <div
                            className="h-full bg-[#ff6a00] relative shadow-[0_0_10px_rgba(255,106,0,0.5)]"
                            style={{ width: `${match.processingPercent ?? 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {match.status === "missing" && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        {match.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`hidden lg:flex items-center gap-8 px-6 border-l border-[#262626] ${
                    match.status !== "complete" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider font-medium">
                      Final Score
                    </span>
                    <span className="font-display text-lg font-bold text-white">
                      {match.finalScore ?? "—"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider font-medium">
                      Team PPP
                    </span>
                    <span
                      className={`font-display text-lg font-bold ${
                        match.teamPpp ? "text-accent-teal" : "text-slate-400"
                      }`}
                    >
                      {match.teamPpp ?? "—"}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto flex justify-end">
                  {match.status === "complete" && (
                    <Link
                      to={`/app/analytics/${match.id}`}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-surface-dark border border-[#262626] hover:border-accent-teal/50 hover:text-accent-teal transition-all text-sm font-medium text-white shadow-sm"
                    >
                      View Dashboard
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  )}
                  {match.status === "processing" && (
                    <a
                      href="#"
                      className="text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors underline decoration-[#262626] hover:decoration-white underline-offset-4"
                    >
                      Monitor Progress
                    </a>
                  )}
                  {match.status === "missing" && (
                    <button
                      type="button"
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] transition-all text-sm font-bold text-white shadow-[0_0_15px_-3px_rgba(255,106,0,0.4)]"
                    >
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      Upload Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
