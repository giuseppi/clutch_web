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

interface Player {
  rank: number;
  name: string;
  pos: string;
  school: string;
  location: string;
  elo: number;
  trend: number;
  aiImpact: number;
  stars: number;
  gradYear: number;
  photo: string | null;
  initials: string | null;
}

const players: Player[] = [
  {
    rank: 1,
    name: "Davon Mitchell",
    pos: "PG",
    school: "Oak Hill Academy",
    location: "Mouth of Wilson VA",
    elo: 2485,
    trend: 12,
    aiImpact: 98.4,
    stars: 5,
    gradYear: 2025,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrXl_qSUsu57b1lObF_DLtaAy4XXs8YUROR-pgPFXtjsN0q7JSAsTtWmdX-9ESBwbVWISNAqUnHizngGFsjqxvqOj5FhVQZm3cRMcD0TTdqGx5gEVPZxStLITgSMPxMe_2ZioPyxdZOAaCIlfmoBY2aLkChclXVApFXs6lXRDH2TBPmO7R2vromPFmV6EscfWMDYVPE4N5DfqYsh7CAciJmP9A6ahzN1tJjq8PincbkuTfqUcsiXssuNjf5PhFROOZVr2Ei01-dPCS",
    initials: null,
  },
  {
    rank: 2,
    name: "Marcus Johnson",
    pos: "SG",
    school: "Garfield Heights",
    location: "Cleveland OH",
    elo: 2410,
    trend: 8,
    aiImpact: 97.1,
    stars: 5,
    gradYear: 2024,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNnTdyNt403dt7h0gfQjf2OGS73C3e2kCufNwqBOlpqxn7oVUR2Otl-FJBWLyrlbynwNCkLmX-qVIGQAn6YjeS5bmCdTtHuXMLNFl6CJXzFCigmITbB24PEoY0lzwxqMXpes7n-GQh0Qmq2R_em4uM3IE4af9mVbCkuJgiZSMZAKoK_nl5AEybCaHW5cVbhsJbZjJwi4e6Orb62Fk1zlOZ3gJG0YOJgmXe7jfxAbxRsL6BEfboc2nhOn5SFv_xR8ZP5pUJrMXPfXrp",
    initials: null,
  },
  {
    rank: 3,
    name: "Jayden Daniels",
    pos: "SF",
    school: "Prolific Prep",
    location: "Napa CA",
    elo: 2388,
    trend: -4,
    aiImpact: 96.8,
    stars: 4,
    gradYear: 2025,
    photo: null,
    initials: "JD",
  },
  {
    rank: 4,
    name: "Cooper Flagg",
    pos: "PF",
    school: "Montverde Academy",
    location: "Montverde FL",
    elo: 2350,
    trend: 24,
    aiImpact: 99.1,
    stars: 5,
    gradYear: 2025,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTf9gTSnmClMJGzM6YNHq6gBX2U8X_abfgYYiuJMhLoG0LhkPNSJY3YAZVmml-ZKXPVWekceESBlO8Sv2AHQBzlWvukxKUI7WxQc9OOYjvWQh1LzrMLypowaOJWTlASioC2pSyxR4Ut5UiAljed6-9Q8z-YC8zLeE6cZwUD89U_E6n1za2w-bCiVT8jRfscE1FKOnUm7yccpM6BCSRn7t3_dvh_mAjNxVAjf4_7VIaGG7ZUecJiJX9USHmHuL1yU2UsnUwPeblVF40",
    initials: null,
  },
  {
    rank: 5,
    name: "AJ Dybansta",
    pos: "SF",
    school: "St. Sebastian's",
    location: "Needham MA",
    elo: 2315,
    trend: 5,
    aiImpact: 95.4,
    stars: 4,
    gradYear: 2026,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZbI_9gsDGji2dFbhjlYfHF8VDv-sqQ1rSXigAeyH2MvueruoDy678EzAMjbSGqznWxXB9uHUVjGy72UQbFzyisT9kUQch_ttW38svZ2WbFVtl2r1uH3RllwZMvUteNZgVi8RbHDmMbeTUzuOMbPpFIzfVus1GqrVLMdUPHqHHOJ8HkSNL2N2PfBHzV0F4OqwdORd2IfYoJUhSlGm3sl6dxeo2lwMaTZ70LBhL3nr-wjNP1NKKdgGdoNZ6kp1dUJMyX-a57JKpRQO2",
    initials: null,
  },
  {
    rank: 6,
    name: "Trevor Baskin",
    pos: "C",
    school: "Pomona HS",
    location: "Arvada CO",
    elo: 2298,
    trend: 0,
    aiImpact: 92.2,
    stars: 4,
    gradYear: 2024,
    photo: null,
    initials: "TB",
  },
  {
    rank: 7,
    name: "Elijah Moore",
    pos: "SG",
    school: "Our Saviour Lutheran",
    location: "Bronx NY",
    elo: 2245,
    trend: 18,
    aiImpact: 90.5,
    stars: 3,
    gradYear: 2024,
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBypXCeCsm9sCzZX2xI1CFhzjG-Zn0OoRlPYW1vxCvn8JxhdTRR0rFir-AL9EdKmqn8kk62Pt5btdMzcReNfGoOGNk7vJz8Rc2Dcpl7FTYmbmbA9oyIb6JBxEXLdIVXqoR-b0b2gajufQEi1ql06ef148DnSvfNvd_a0ipqGTDU2f9bcyEINW1Ux1LCL2AMz0OdFpAeTk6M4eH8NqDN3GRg7IqM1WlChxdtg4jtFNsXR21hH4wo8PY_uGOZYG9VJ7PFLhCVXn475nEC",
    initials: null,
  },
];

function StarBadge({ count }: { count: number }) {
  if (count >= 5)
    return (
      <span className="text-[10px] font-bold text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/20 px-1.5 py-0.5 rounded-full">
        ★★★★★
      </span>
    );
  if (count >= 4)
    return (
      <span className="text-[10px] font-bold text-[#facc15] bg-[#facc15]/10 border border-[#facc15]/20 px-1.5 py-0.5 rounded-full">
        ★★★★
      </span>
    );
  return (
    <span className="text-[10px] font-bold text-[#9ca3af] bg-[#9ca3af]/10 border border-[#9ca3af]/20 px-1.5 py-0.5 rounded-full">
      {"★".repeat(count)}
    </span>
  );
}

function TrendCell({ value }: { value: number }) {
  if (value > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-[#262626] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#10b981]"
            style={{ width: `${Math.min(value * 3, 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-[#10b981]">+{value}</span>
      </div>
    );
  }
  if (value < 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-[#262626] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#ef4444]"
            style={{ width: `${Math.min(Math.abs(value) * 3, 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-[#ef4444]">{value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[#262626]" />
      <span className="text-xs font-medium text-[#9ca3af]">0</span>
    </div>
  );
}

const LeaderboardPage = () => {
  const location = useLocation();

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#262626]">
          <img src={clutchLogo} alt="Clutch" className="size-8 object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
          <h2 className="text-slate-100 text-lg font-bold tracking-tight">
            Clutch Coach
          </h2>
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
          </div>
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]">
            <span className="material-symbols-outlined text-[18px]">
              bolt
            </span>
            Upgrade Plan
          </button>
        </div>
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#262626]"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1bvNIXmlNd1k6t3aTwwkaOdsdLBiNBk0iDQQFTJkPbNKqDdtZOHrf5rPtMzFu7aGW7xdqL_blidJ4QKOxmrrUkRodx5dCK8HaMnAQCkNpnJYcWstAtARck9OV1kaGJou8AlEIRfQFfXPt5L4rwdgpmfIw3ycqycX1qeEAkczNWJpNM0LARoelQZ1bLgzMie9diJvSZlyPOAlOOnJC6HANj6cT_CpA_k2skf-O9IE84WfaYJNKEAS51sisvSSP3tQou2UwLvuYpGl4")',
              }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">
                Coach K.
              </span>
              <span className="text-xs text-[#a3a3a3] truncate">
                Duke Blue Devils
              </span>
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

        <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/app/dashboard"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-[16px] text-[#9ca3af]">
              chevron_right
            </span>
            <span className="text-slate-100 font-medium">Leaderboard</span>
          </nav>

          {/* Title + Export */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">
                Universal Elo Leaderboard
              </h1>
              <p className="text-[#9ca3af] mt-1">
                Real-time rankings powered by AI-enhanced Elo scoring across all
                tracked competitions.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#262626] text-slate-300 hover:text-white hover:bg-[#262626] transition-colors text-sm font-medium shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Export CSV
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#9ca3af]">
                search
              </span>
              <input
                type="text"
                placeholder="Search players by name, school, or location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#151515] border border-[#262626] text-sm text-slate-100 placeholder-[#9ca3af] focus:outline-none focus:border-[#ff6a00]/50 focus:ring-1 focus:ring-[#ff6a00]/20 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["State/Region", "HS Class", "Grad Year", "Position"].map(
                (filter) => (
                  <button
                    key={filter}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#151515] border border-[#262626] text-sm text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors"
                  >
                    {filter}
                    <span className="material-symbols-outlined text-[16px]">
                      expand_more
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#151515]">
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-16">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-16">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                      School / Loc
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-28">
                      Elo Score
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-36">
                      Trend (30d)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-24">
                      AI Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626] bg-[#0a0a0a]">
                  {players.map((player) => (
                    <tr
                      key={player.rank}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-bold ${player.rank <= 3 ? "text-[#ff6a00]" : "text-slate-400"}`}
                        >
                          #{player.rank}
                        </span>
                      </td>

                      {/* Player Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {player.photo ? (
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="size-9 rounded-full object-cover border border-[#262626]"
                            />
                          ) : (
                            <div className="size-9 rounded-full bg-[#262626] border border-[#262626] flex items-center justify-center text-xs font-bold text-[#9ca3af]">
                              {player.initials}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-100">
                              {player.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <StarBadge count={player.stars} />
                              <span className="text-[10px] text-[#9ca3af]">
                                Class {player.gradYear}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-300 bg-[#262626] px-2 py-1 rounded">
                          {player.pos}
                        </span>
                      </td>

                      {/* School / Location */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-200">
                            {player.school}
                          </span>
                          <span className="text-xs text-[#9ca3af]">
                            {player.location}
                          </span>
                        </div>
                      </td>

                      {/* Elo Score */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-slate-100 font-mono">
                          {player.elo.toLocaleString()}
                        </span>
                      </td>

                      {/* Trend */}
                      <td className="px-4 py-3">
                        <TrendCell value={player.trend} />
                      </td>

                      {/* AI Impact */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-bold ${player.aiImpact >= 95 ? "text-[#10b981]" : player.aiImpact >= 90 ? "text-[#facc15]" : "text-slate-400"}`}
                        >
                          {player.aiImpact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#262626] bg-[#151515]">
              <span className="text-xs text-[#9ca3af]">
                Showing <span className="font-medium text-slate-300">1-7</span>{" "}
                of{" "}
                <span className="font-medium text-slate-300">
                  2,458
                </span>{" "}
                players
              </span>
              <div className="flex items-center gap-1">
                <button className="size-8 rounded-lg border border-[#262626] bg-[#151515] flex items-center justify-center text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button className="size-8 rounded-lg bg-[#ff6a00]/10 border border-[#ff6a00]/20 text-[#ff6a00] text-xs font-bold">
                  1
                </button>
                <button className="size-8 rounded-lg border border-[#262626] bg-[#151515] text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors text-xs font-medium">
                  2
                </button>
                <button className="size-8 rounded-lg border border-[#262626] bg-[#151515] text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors text-xs font-medium">
                  3
                </button>
                <span className="text-[#9ca3af] text-xs px-1">...</span>
                <button className="size-8 rounded-lg border border-[#262626] bg-[#151515] text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors text-xs font-medium">
                  351
                </button>
                <button className="size-8 rounded-lg border border-[#262626] bg-[#151515] flex items-center justify-center text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default LeaderboardPage;
