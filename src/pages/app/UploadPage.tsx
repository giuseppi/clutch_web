import { Link, useLocation } from "react-router-dom";
import AppSidebarHeader from "@/components/AppSidebarHeader";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
];

const UploadPage = () => {
  const location = useLocation();

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden lg:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <AppSidebarHeader />
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <div className="mt-auto pt-4 border-t border-[#262626]">
            <Link
              to="/app/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/app/settings"
                  ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)]"
                  : "text-[#9ca3af] hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
          </div>
        </nav>

        {/* Storage Indicator */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9ca3af] font-medium">Storage Used</span>
            <span className="text-xs text-[#ff6a00] font-bold">85%</span>
          </div>
          <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#ff6a00] rounded-full" />
          </div>
          <p className="text-[10px] text-[#9ca3af] mt-1.5">8.5 GB of 10 GB used</p>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#262626]"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6qnS3mKT0dGRhr0J1fh20c2WJc0gW8PpJAx5ELf-1z7ScU9kwNmlv4mgVjCCME7QeRtKaqI1Vlr-MTVXCZ2ZpO1ILFDpkCKxhFVUBv1HVwP07132C7FEHYQEQz0GzXTwPxSOYuuIFVg7qT6EYhzLkp8HezVQAkNlshaKkAXI56UvRnXFxcm4f18D5SI9pVeXWlI3WZgwYsU2TaXBAYhhYlDxrKtU0DujUe_jyekKyX5DeMW4laqgYfarHb2Co8e2lQG2P4y3E8tuJ")',
              }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">Coach Scheyer</span>
              <span className="text-xs text-[#9ca3af] truncate">Head Coach</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile header */}
        <header className="flex lg:hidden items-center justify-between border-b border-[#262626] px-4 py-3 bg-[#151515]/90 backdrop-blur-md sticky top-0 z-40">
          <AppSidebarHeader compact />
          <button type="button" className="text-slate-400" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-6">
          {/* Page Title */}
          <div>
            <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">Upload Game Film</h1>
            <p className="text-[#9ca3af] mt-1">Select a matchup and upload verified game footage for AI analysis.</p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left Panel — Matchups */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100">Upcoming / Recent Matchups</h2>
              </div>

              {/* Matchup 1 — Active */}
              <div className="bg-[#151515] border-2 border-[#ff6a00]/40 rounded-xl p-4 cursor-pointer shadow-[0_0_25px_-5px_rgba(255,106,0,0.2)] transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-blue-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">D</div>
                    <span className="text-sm font-bold text-slate-100">vs</span>
                    <div className="size-9 rounded-full bg-red-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">A</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
                    Awaiting Film
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Duke vs Alabama</h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">Mar 8, 2025 &bull; Cameron Indoor Stadium</p>
              </div>

              {/* Matchup 2 — Locked */}
              <div className="bg-[#151515] border border-[#262626] rounded-xl p-4 cursor-not-allowed opacity-60 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-blue-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">D</div>
                    <span className="text-sm font-bold text-slate-100">@</span>
                    <div className="size-9 rounded-full bg-blue-800 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">K</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Submitted by Opponent
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Duke @ Kentucky</h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">Mar 12, 2025 &bull; Rupp Arena</p>
              </div>

              {/* Matchup 3 — Complete */}
              <div className="bg-[#151515] border border-[#262626] rounded-xl p-4 cursor-pointer hover:border-[#262626]/80 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-blue-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">D</div>
                    <span className="text-sm font-bold text-slate-100">vs</span>
                    <div className="size-9 rounded-full bg-sky-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">U</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    Analysis Complete
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Duke vs UNC</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#9ca3af]">Feb 28, 2025 &bull; Dean Dome</p>
                  <span className="text-xs font-bold text-[#14b8a6]">84 - 79</span>
                </div>
              </div>
            </div>

            {/* Right Panel — Upload Area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Header */}
              <div className="bg-[#151515] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-blue-900 border border-[#262626] flex items-center justify-center text-[12px] font-bold text-white">D</div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Duke Blue Devils</h2>
                    <span className="material-symbols-outlined text-[#3b82f6] text-[18px]">verified</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#ff6a00] text-[16px]">check_circle</span>
                  <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">Validated Matchup</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Duke Blue Devils vs. Alabama Crimson Tide</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9ca3af]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    March 8, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">stadium</span>
                    Cameron Indoor Stadium
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">tag</span>
                    MATCH-2025-0308-DUKEvsALA
                  </span>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="bg-[#151515] border border-[#262626] rounded-xl p-6 flex flex-col gap-6">
                <div className="border-2 border-dashed border-[#262626] hover:border-[#ff6a00]/40 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors duration-300 cursor-pointer group">
                  <div className="size-16 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-4 group-hover:border-[#ff6a00]/30 transition-colors">
                    <span className="material-symbols-outlined text-[32px] text-[#9ca3af] group-hover:text-[#ff6a00] transition-colors">cloud_upload</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">Drag &amp; Drop Standard Game Film Here</h4>
                  <p className="text-sm text-[#9ca3af] mb-4">Supports high-quality MP4, MOV files. Up to 10GB</p>
                  <button className="px-6 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]">
                    Browse Files
                  </button>
                  <p className="text-xs text-[#9ca3af] mt-3">or import from <span className="text-[#ff6a00] font-medium cursor-pointer hover:underline">Hudl</span></p>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#9ca3af]" htmlFor="our-jersey">Our Jersey Color</label>
                    <select
                      id="our-jersey"
                      className="h-11 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white text-sm focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all appearance-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select color</option>
                      <option value="white">White (Home)</option>
                      <option value="blue">Blue (Away)</option>
                      <option value="black">Black (Alt)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#9ca3af]" htmlFor="opponent-jersey">Opponent Jersey</label>
                    <select
                      id="opponent-jersey"
                      className="h-11 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white text-sm focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all appearance-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select color</option>
                      <option value="red">Red (Home)</option>
                      <option value="white">White (Away)</option>
                      <option value="gray">Gray (Alt)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#9ca3af]" htmlFor="final-score">Final Score (Optional)</label>
                    <input
                      id="final-score"
                      type="text"
                      placeholder="e.g. 84 - 79"
                      className="h-11 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white text-sm placeholder-[#555] focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button className="w-full h-12 rounded-xl bg-[#ff6a00] hover:bg-[#cc5500] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group">
                  <span>Submit for AI Breakdown &amp; Official Elo Processing</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>
                <p className="text-center text-[10px] text-[#9ca3af] flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Film is encrypted end-to-end and only accessible to verified coaching staff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
