import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
];

const profileImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6qnS3mKT0dGRhr0J1fh20c2WJc0gW8PpJAx5ELf-1z7ScU9kwNmlv4mgVjCCME7QeRtKaqI1Vlr-MTVXCZ2ZpO1ILFDpkCKxhFVUBv1HVwP07132C7FEHYQEQz0GzXTwPxSOYuuIFVg7qT6EYhzLkp8HezVQAkNlshaKkAXI56UvRnXFxcm4f18D5SI9pVeXWlI3WZgwYsU2TaXBAYhhYlDxrKtU0DujUe_jyekKyX5DeMW4laqgYfarHb2Co8e2lQG2P4y3E8tuJ";

const AnalyticsPage = () => {
  const location = useLocation();
  const [shotTeam, setShotTeam] = useState<"duke" | "alabama">("duke");

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#262626]">
          <div className="size-8 text-[#ff6a00] drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-slate-100 text-lg font-bold tracking-tight">Clutch Coach</h2>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#262626]"
              style={{ backgroundImage: `url("${profileImageUrl}")` }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">Coach Scheyer</span>
              <span className="text-xs text-[#a3a3a3] truncate">Head Coach</span>
            </div>
          </div>
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
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
          </div>
        </nav>

        {/* Storage indicator */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a3a3a3] font-medium">Storage</span>
            <span className="text-xs text-slate-300 font-bold">85%</span>
          </div>
          <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#ff6a00] rounded-full" />
          </div>
          <p className="text-[10px] text-[#a3a3a3] mt-1.5">8.5 GB of 10 GB used</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile header */}
        <header className="flex md:hidden items-center justify-between border-b border-[#262626] px-4 py-3 bg-[#151515]/90 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="size-8 text-[#ff6a00]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-100">Clutch Coach</span>
          </div>
          <button className="text-slate-400">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Header bar */}
        <div className="border-b border-[#262626] bg-[#151515]/60 backdrop-blur-sm px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-slate-100 text-xl md:text-2xl font-bold leading-tight">
                Duke vs. Alabama
              </h1>
              <p className="text-[#a3a3a3] text-sm">Nov 15, 2025</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-bold text-slate-100 font-mono">78 - 74</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                WIN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-bold border border-[#14b8a6]/20">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              AI Processing Complete
            </span>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-[#262626]"
              style={{ backgroundImage: `url("${profileImageUrl}")` }}
            />
          </div>
        </div>

        <div className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-8">
          {/* AI Assistant Takeaways */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">auto_awesome</span>
              <h2 className="text-lg font-bold text-slate-100">AI Assistant Takeaways</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "trending_up",
                  iconColor: "text-[#14b8a6]",
                  iconBg: "bg-[#14b8a6]/10 border-[#14b8a6]/20",
                  title: "Duke outscored Alabama by +12 net rating in the first half",
                  detail:
                    "Strong offensive execution and defensive pressure led to a commanding 44-32 halftime lead, primarily driven by transition scoring and 3-point shooting.",
                },
                {
                  icon: "speed",
                  iconColor: "text-[#ff6a00]",
                  iconBg: "bg-[#ff6a00]/10 border-[#ff6a00]/20",
                  title: "Alabama averaged 1.15 PPP in transition",
                  detail:
                    "Alabama's transition offense was their most efficient scoring method, converting at 1.15 points per possession. Duke's transition defense needs attention.",
                },
                {
                  icon: "warning",
                  iconColor: "text-amber-400",
                  iconBg: "bg-amber-400/10 border-amber-400/20",
                  title: "8 missed defensive assignments in the second half",
                  detail:
                    "Breakdown in help-side rotations led to 8 open looks for Alabama shooters in the second half, resulting in a 42-34 run that nearly erased the lead.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-5 rounded-xl hover:border-[#ff6a00]/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`size-9 rounded-lg ${card.iconBg} border flex items-center justify-center shrink-0`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${card.iconColor}`}>
                        {card.icon}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">{card.title}</h3>
                  </div>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">{card.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Two-column: Shot Distribution + Four Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Shot Distribution */}
            <div className="lg:col-span-7 bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">
                    scatter_plot
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">Shot Distribution</h3>
                </div>
                <div className="flex items-center bg-[#0a0a0a] rounded-lg border border-[#262626] p-0.5">
                  <button
                    onClick={() => setShotTeam("duke")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      shotTeam === "duke"
                        ? "bg-[#ff6a00] text-white shadow-[0_0_12px_-3px_rgba(255,106,0,0.4)]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Duke
                  </button>
                  <button
                    onClick={() => setShotTeam("alabama")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      shotTeam === "alabama"
                        ? "bg-[#ff6a00] text-white shadow-[0_0_12px_-3px_rgba(255,106,0,0.4)]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Alabama
                  </button>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center">
                <svg viewBox="0 0 500 470" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                  {/* Court outline */}
                  <rect x="10" y="10" width="480" height="450" rx="4" fill="none" stroke="#262626" strokeWidth="2" />
                  {/* Half-court line */}
                  <line x1="10" y1="235" x2="490" y2="235" stroke="#262626" strokeWidth="1.5" />
                  {/* Center circle */}
                  <circle cx="250" cy="235" r="40" fill="none" stroke="#262626" strokeWidth="1.5" />
                  {/* Paint top */}
                  <rect x="175" y="10" width="150" height="190" rx="2" fill="none" stroke="#262626" strokeWidth="1.5" />
                  {/* Paint bottom */}
                  <rect x="175" y="270" width="150" height="190" rx="2" fill="none" stroke="#262626" strokeWidth="1.5" />
                  {/* Free throw circle top */}
                  <circle cx="250" cy="200" r="60" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Free throw circle bottom */}
                  <circle cx="250" cy="270" r="60" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Three-point arc top */}
                  <path d="M 80 10 Q 80 190 250 200 Q 420 190 420 10" fill="none" stroke="#262626" strokeWidth="1.5" />
                  {/* Three-point arc bottom */}
                  <path d="M 80 460 Q 80 280 250 270 Q 420 280 420 460" fill="none" stroke="#262626" strokeWidth="1.5" />
                  {/* Basket top */}
                  <circle cx="250" cy="55" r="8" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                  {/* Basket bottom */}
                  <circle cx="250" cy="415" r="8" fill="none" stroke="#9ca3af" strokeWidth="1.5" />

                  {shotTeam === "duke" ? (
                    <>
                      {/* Makes (teal) */}
                      <circle cx="230" cy="80" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="270" cy="95" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="200" cy="120" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="310" cy="110" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="250" cy="145" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="120" cy="60" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="380" cy="55" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="100" cy="100" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="400" cy="105" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="250" cy="170" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="290" cy="60" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="160" cy="150" r="6" fill="#14b8a6" opacity="0.85" />
                      {/* Misses (orange) */}
                      <circle cx="340" cy="140" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="150" cy="80" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="360" cy="70" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="220" cy="160" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="280" cy="170" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="190" cy="50" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="130" cy="130" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="370" cy="130" r="6" fill="#ff6a00" opacity="0.85" />
                    </>
                  ) : (
                    <>
                      {/* Makes (teal) */}
                      <circle cx="240" cy="340" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="260" cy="370" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="300" cy="355" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="200" cy="360" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="250" cy="395" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="130" cy="420" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="370" cy="415" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="110" cy="380" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="390" cy="370" r="6" fill="#14b8a6" opacity="0.85" />
                      <circle cx="280" cy="320" r="6" fill="#14b8a6" opacity="0.85" />
                      {/* Misses (orange) */}
                      <circle cx="330" cy="400" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="170" cy="410" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="350" cy="340" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="150" cy="350" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="220" cy="310" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="290" cy="430" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="210" cy="430" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="380" cy="350" r="6" fill="#ff6a00" opacity="0.85" />
                      <circle cx="120" cy="350" r="6" fill="#ff6a00" opacity="0.85" />
                    </>
                  )}
                </svg>
              </div>
              <div className="px-5 pb-4 flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#14b8a6]" />
                  <span className="text-xs text-[#9ca3af]">Make</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#ff6a00]" />
                  <span className="text-xs text-[#9ca3af]">Miss</span>
                </div>
              </div>
            </div>

            {/* Four Factors Comparison */}
            <div className="lg:col-span-5 bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-[#262626] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">
                  compare_arrows
                </span>
                <h3 className="text-lg font-bold text-slate-100">Four Factors Comparison</h3>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#0a0a0a]/50">
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Duke
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-bold text-red-400 uppercase tracking-wider">
                        Alabama
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {[
                      { metric: "PPP", duke: "1.08", alabama: "0.98", dukeWin: true },
                      { metric: "+/-", duke: "+4", alabama: "-4", dukeWin: true },
                      { metric: "eFG%", duke: "54.2%", alabama: "48.7%", dukeWin: true },
                      { metric: "TO%", duke: "12.1%", alabama: "15.8%", dukeWin: true },
                      { metric: "ORB%", duke: "32.4%", alabama: "28.1%", dukeWin: true },
                      { metric: "FTR", duke: "0.34", alabama: "0.29", dukeWin: true },
                    ].map((row) => (
                      <tr key={row.metric} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3.5 text-slate-300 font-medium">{row.metric}</td>
                        <td
                          className={`px-5 py-3.5 text-center font-bold ${
                            row.dukeWin ? "text-[#14b8a6]" : "text-slate-300"
                          }`}
                        >
                          {row.duke}
                        </td>
                        <td
                          className={`px-5 py-3.5 text-center font-bold ${
                            !row.dukeWin ? "text-[#14b8a6]" : "text-slate-400"
                          }`}
                        >
                          {row.alabama}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Auto-Generated Playlists */}
          <section className="pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">
                playlist_play
              </span>
              <h2 className="text-lg font-bold text-slate-100">Auto-Generated Playlists</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
              {[
                {
                  title: "All Defensive Stops",
                  clips: 24,
                  badge: "A+",
                  badgeColor: "bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20",
                  icon: "shield",
                  gradient: "from-[#14b8a6]/20 to-transparent",
                },
                {
                  title: "Catch & Shoot 3s",
                  clips: 12,
                  badge: "58%",
                  badgeColor: "bg-[#ff6a00]/10 text-[#ff6a00] border-[#ff6a00]/20",
                  icon: "local_fire_department",
                  gradient: "from-[#ff6a00]/20 to-transparent",
                },
                {
                  title: "Turnovers & Missed Rotations",
                  clips: 9,
                  badge: "Needs Work",
                  badgeColor: "bg-amber-400/10 text-amber-400 border-amber-400/20",
                  icon: "sync_problem",
                  gradient: "from-amber-400/20 to-transparent",
                },
              ].map((playlist) => (
                <div
                  key={playlist.title}
                  className="min-w-[260px] max-w-[300px] bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5 flex flex-col gap-3 snap-start hover:border-[#ff6a00]/30 transition-all duration-300 cursor-pointer group relative overflow-hidden shrink-0"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${playlist.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="size-10 rounded-lg bg-[#0a0a0a] border border-[#262626] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#ff6a00]">{playlist.icon}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold border ${playlist.badgeColor}`}
                    >
                      {playlist.badge}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold text-slate-100">{playlist.title}</h4>
                    <p className="text-xs text-[#9ca3af] mt-1">{playlist.clips} clips</p>
                  </div>
                  <div className="relative z-10 flex items-center gap-1 text-xs font-medium text-[#ff6a00] mt-auto group-hover:text-white transition-colors">
                    <span>Watch Reel</span>
                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ))}

              {/* Create Custom Reel placeholder */}
              <div className="min-w-[260px] max-w-[300px] border-2 border-dashed border-[#262626] rounded-xl p-5 flex flex-col items-center justify-center gap-3 snap-start hover:border-[#ff6a00]/40 transition-all duration-300 cursor-pointer group shrink-0">
                <div className="size-12 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center group-hover:border-[#ff6a00]/40 transition-colors">
                  <span className="material-symbols-outlined text-[#9ca3af] group-hover:text-[#ff6a00] transition-colors">
                    add
                  </span>
                </div>
                <span className="text-sm font-bold text-[#9ca3af] group-hover:text-slate-200 transition-colors">
                  Create Custom Reel
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
