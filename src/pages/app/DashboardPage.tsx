import { Link, useLocation } from "react-router-dom";
import clutchLogo from "@/assets/clutch_logo.png";
import PageTransition from "@/components/PageTransition";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
];

const DashboardPage = () => {
  const location = useLocation();

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#262626]">
          <img src={clutchLogo} alt="Clutch" className="size-8 object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
          <h2 className="text-slate-100 text-lg font-bold tracking-tight">Clutch Coach</h2>
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
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <div className="mt-auto pt-4 border-t border-[#262626]">
            <Link to="/app/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#262626]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1bvNIXmlNd1k6t3aTwwkaOdsdLBiNBk0iDQQFTJkPbNKqDdtZOHrf5rPtMzFu7aGW7xdqL_blidJ4QKOxmrrUkRodx5dCK8HaMnAQCkNpnJYcWstAtARck9OV1kaGJou8AlEIRfQFfXPt5L4rwdgpmfIw3ycqycX1qeEAkczNWJpNM0LARoelQZ1bLgzMie9diJvSZlyPOAlOOnJC6HANj6cT_CpA_k2skf-O9IE84WfaYJNKEAS51sisvSSP3tQou2UwLvuYpGl4")' }} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">Coach K.</span>
              <span className="text-xs text-[#a3a3a3] truncate">Duke Blue Devils</span>
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
            <span className="font-bold text-slate-100">Clutch Coach</span>
          </div>
          <button className="text-slate-400">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">Duke University Men's Basketball</h1>
              <p className="text-[#a3a3a3] mt-1">Season Overview &bull; 2024-2025</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#262626] text-slate-300 hover:text-white hover:bg-[#262626] transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Schedule
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white transition-colors text-sm font-bold shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)]">
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Session
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Wins", value: "24", badge: "+4", badgeColor: "text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20", sub: "Current streak: 6W", icon: "emoji_events" },
              { label: "Team Elo Rank", value: "#4", badge: "Top 1%", badgeColor: "text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20", sub: "National Standing", icon: "leaderboard" },
              { label: "Avg PPG", value: "82.5", badge: "-1.2", badgeColor: "text-red-500 bg-red-500/10 border-red-500/20", sub: "Last 5 games", icon: "sports_basketball" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-6 rounded-xl flex items-center justify-between group hover:border-[#ff6a00]/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-[#a3a3a3] text-sm font-medium mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-100">{stat.value}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${stat.badgeColor}`}>{stat.badge}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{stat.sub}</p>
                </div>
                <div className="relative z-10 size-12 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[#ff6a00] shadow-[0_0_15px_-3px_rgba(255,106,0,0.3)]">
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Matches */}
          <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden flex flex-col shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
            <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#151515]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">history</span>
                <h3 className="text-lg font-bold text-slate-100">Recent Matches</h3>
              </div>
              <a className="text-sm font-medium text-[#a3a3a3] hover:text-[#ff6a00] transition-colors" href="#">View All Schedule</a>
            </div>
            <div className="divide-y divide-[#262626] bg-[#0a0a0a]">
              {[
                { month: "Feb", day: "24", opponent: "NC State", opColor: "bg-red-900", opInitial: "N", score: "84 - 76", scoreColor: "text-[#14b8a6]", result: "WIN", resultColor: "bg-green-500/10 text-green-500 border-green-500/20" },
                { month: "Feb", day: "21", opponent: "Miami", opColor: "bg-orange-900", opInitial: "M", score: "92 - 88", scoreColor: "text-[#14b8a6]", result: "WIN", resultColor: "bg-green-500/10 text-green-500 border-green-500/20" },
                { month: "Feb", day: "17", opponent: "UNC", opColor: "bg-sky-900", opInitial: "U", score: "78 - 82", scoreColor: "text-red-400", result: "LOSS", resultColor: "bg-red-500/10 text-red-500 border-red-500/20" },
              ].map((match) => (
                <div key={match.day} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-center w-12 text-center">
                      <span className="text-xs font-bold text-[#a3a3a3] uppercase">{match.month}</span>
                      <span className="text-xl font-bold text-slate-100">{match.day}</span>
                    </div>
                    <div className="h-10 w-px bg-[#262626] hidden md:block" />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3 w-32 justify-end">
                        <span className="font-bold text-slate-100 text-right">Duke</span>
                        <div className="size-8 rounded-full bg-blue-900 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">D</div>
                      </div>
                      <div className={`px-3 py-1 rounded bg-[#151515] border border-[#262626] text-sm font-mono font-bold ${match.scoreColor}`}>
                        {match.score}
                      </div>
                      <div className="flex items-center gap-3 w-32">
                        <div className={`size-8 rounded-full ${match.opColor} border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white`}>{match.opInitial}</div>
                        <span className="font-bold text-slate-400">{match.opponent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${match.resultColor}`}>{match.result}</span>
                    <button className="text-xs font-medium text-[#ff6a00] hover:text-white transition-colors flex items-center gap-1 group">
                      View Breakdown
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Performers */}
          <div className="flex flex-col gap-4 pb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">Key Performers</h3>
              <div className="flex gap-2">
                <button className="size-8 rounded-full border border-[#262626] bg-[#151515] flex items-center justify-center text-[#a3a3a3] hover:text-white hover:border-[#ff6a00]/50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="size-8 rounded-full border border-[#262626] bg-[#151515] flex items-center justify-center text-[#a3a3a3] hover:text-white hover:border-[#ff6a00]/50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Jalen Green", num: "#4", year: "Senior", pos: "SG", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtCbPF0kMXSGfBn8OTm4vElX4YzCWkP2TPuLMTVmxcZua0QunA24KNB5BDCblGkwOV5kK3pd4kLzxP1jpqWqXpR6oRit5YngMknWx0zhXFB3bktBqexDf5e0a83OFQcsNimXY0Wpio88MGjm2MfJCHt699DLFtsr97AY142efi8v87ybxMTyiPhMbyLCOsQle6-W5Jx-xzA6KS9oAUeBijV02D947IvSw1lorC9jF7gvh20XfRSU4PiSrRmcerb9g2uuOImUb06WME", stat1: { label: "PPG", value: "24.5", color: "text-[#14b8a6]" }, stat2: { label: "RPG", value: "6.2", color: "text-slate-300" } },
                { name: "Marcus Hill", num: "#1", year: "Junior", pos: "PG", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZMxh2LPiYSR3m2_fHFLCzw7hnyWaLSuuDJhmLCAHygI9dnbRk8nXf1oUqMcPQLV5051yWhBhaE1OQjQp1dMH3DX0mmL8bCtdiOD2kdVPptGQtl2O2jA0v8Wq21tmlZaVxc-ijfNShIhZkvsXXxv6cweDntzryOXy2PXflnB5SFCHKN8T-AUJLOUhV7ElQMGXIqZ7VnccuC4GMNfSQuMsJFwDXbjDp8Iazyk1_iGfa64kn-1Fmubzwwfugw-EMzCBN9kJ2drgkYJjq", stat1: { label: "PPG", value: "18.2", color: "text-slate-300" }, stat2: { label: "APG", value: "7.8", color: "text-[#14b8a6]" } },
                { name: "David Chen", num: "#32", year: "Soph.", pos: "C", img: null, stat1: { label: "PPG", value: "12.4", color: "text-slate-300" }, stat2: { label: "RPG", value: "10.1", color: "text-[#14b8a6]" } },
                { name: "Tyrell Jones", num: "#15", year: "Freshman", pos: "SF", img: null, stat1: { label: "PPG", value: "9.8", color: "text-slate-300" }, stat2: { label: "STL", value: "2.3", color: "text-[#14b8a6]" } },
              ].map((player) => (
                <div key={player.name} className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      {player.img ? (
                        <div className="size-12 rounded-full bg-cover bg-center border border-[#262626]" style={{ backgroundImage: `url("${player.img}")` }} />
                      ) : (
                        <div className="size-12 rounded-full bg-slate-800 border border-[#262626] flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-500">person</span>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-[#ff6a00] text-white text-[10px] font-bold px-1.5 rounded-full border border-[#0a0a0a]">{player.pos}</div>
                    </div>
                    <div>
                      <h4 className="text-slate-100 font-bold text-sm">{player.name}</h4>
                      <p className="text-[#a3a3a3] text-xs">{player.num} &bull; {player.year}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0a0a0a]/50 rounded p-2 text-center border border-[#262626]">
                      <span className="block text-[10px] text-[#a3a3a3] uppercase">{player.stat1.label}</span>
                      <span className={`text-lg font-bold ${player.stat1.color}`}>{player.stat1.value}</span>
                    </div>
                    <div className="bg-[#0a0a0a]/50 rounded p-2 text-center border border-[#262626]">
                      <span className="block text-[10px] text-[#a3a3a3] uppercase">{player.stat2.label}</span>
                      <span className={`text-lg font-bold ${player.stat2.color}`}>{player.stat2.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default DashboardPage;
