import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/hooks/api/useMatches";
import { usePlayers } from "@/hooks/api/usePlayers";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";

function MmrBadge({ mmr }: { mmr: number }) {
  const color =
    mmr >= 80 ? "text-[#ff6a00] bg-[#ff6a00]/10 border-[#ff6a00]/20" :
    mmr >= 60 ? "text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20" :
    mmr >= 40 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-slate-400 bg-slate-400/10 border-slate-400/20";
  return (
    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${color}`}>
      {Math.round(mmr)}
    </span>
  );
}

const DashboardPage = () => {
  const { user } = useAuth();
  const teamId = user?.team?.id;
  const teamName = user?.team?.name || "Your Team";

  const { data: matchData, isLoading: matchesLoading } = useMatches({ teamId, limit: 10 });
  const { data: playerData, isLoading: playersLoading } = usePlayers({ teamId, limit: 20 });

  const matches = matchData?.data || [];
  const players = playerData?.data || [];

  // Compute stats from matches
  const processedMatches = matches.filter((m: any) => m.isProcessed);
  const wins = processedMatches.filter((m: any) => {
    if (!m.homeScore || !m.awayScore) return false;
    const isHome = m.homeTeamId === teamId;
    return isHome ? m.homeScore > m.awayScore : m.awayScore > m.homeScore;
  }).length;

  // Average team MMR
  const avgMmr = players.length > 0
    ? (players.reduce((sum: number, p: any) => sum + (p.mmr || 50), 0) / players.length)
    : 50;

  // Average PPG from processed matches
  const avgPpg = processedMatches.length > 0
    ? (processedMatches.reduce((sum: number, m: any) => {
        const isHome = m.homeTeamId === teamId;
        return sum + (isHome ? (m.homeScore || 0) : (m.awayScore || 0));
      }, 0) / processedMatches.length).toFixed(1)
    : "--";

  // Top performers sorted by MMR
  const topPerformers = [...players]
    .sort((a: any, b: any) => (b.mmr || 50) - (a.mmr || 50))
    .slice(0, 4);

  // Recent matches (last 5)
  const recentMatches = processedMatches.slice(0, 5);

  return (
    <AppLayout>
      <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">{teamName}</h1>
            <p className="text-[#a3a3a3] mt-1">Season Overview &bull; 2025-2026</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/app/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white transition-colors text-sm font-bold shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Upload Film
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Wins",
              value: matchesLoading ? "--" : String(wins),
              badge: `${processedMatches.length} GP`,
              badgeColor: "text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20",
              sub: `of ${processedMatches.length} processed matches`,
              icon: "emoji_events",
            },
            {
              label: "Avg Team MMR",
              value: playersLoading ? "--" : avgMmr.toFixed(1),
              badge: players.length ? `${players.length} players` : "",
              badgeColor: "text-[#14b8a6] bg-[#14b8a6]/10 border-[#14b8a6]/20",
              sub: "0-99 Scale",
              icon: "leaderboard",
            },
            {
              label: "Avg PPG",
              value: matchesLoading ? "--" : String(avgPpg),
              badge: processedMatches.length > 0 ? `${processedMatches.length} games` : "",
              badgeColor: "text-slate-300 bg-slate-500/10 border-slate-500/20",
              sub: "Points per game",
              icon: "sports_basketball",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-6 rounded-xl flex items-center justify-between group hover:border-[#ff6a00]/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="text-[#a3a3a3] text-sm font-medium mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-100">{stat.value}</span>
                  {stat.badge && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${stat.badgeColor}`}>{stat.badge}</span>
                  )}
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
            <Link className="text-sm font-medium text-[#a3a3a3] hover:text-[#ff6a00] transition-colors" to="/app/analytics">View All</Link>
          </div>
          <div className="divide-y divide-[#262626] bg-[#0a0a0a]">
            {matchesLoading ? (
              <div className="p-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentMatches.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No processed matches yet. <Link to="/app/upload" className="text-[#ff6a00] hover:underline">Upload game film</Link> to get started.
              </div>
            ) : (
              recentMatches.map((match: any) => {
                const isHome = match.homeTeamId === teamId;
                const teamScore = isHome ? match.homeScore : match.awayScore;
                const opponentScore = isHome ? match.awayScore : match.homeScore;
                const won = teamScore > opponentScore;
                const opponentTeam = isHome ? match.awayTeam : match.homeTeam;
                const date = new Date(match.scheduledDate);
                const month = date.toLocaleString("default", { month: "short" });
                const day = date.getDate();

                return (
                  <div key={match.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="flex flex-col items-center w-12 text-center">
                        <span className="text-xs font-bold text-[#a3a3a3] uppercase">{month}</span>
                        <span className="text-xl font-bold text-slate-100">{day}</span>
                      </div>
                      <div className="h-10 w-px bg-[#262626] hidden md:block" />
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3 w-32 justify-end">
                          <span className="font-bold text-slate-100 text-right truncate">{user?.team?.abbreviation || teamName}</span>
                          <div className="size-8 rounded-full bg-[#ff6a00]/20 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#ff6a00]">
                            {user?.team?.abbreviation?.charAt(0) || "H"}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded bg-[#151515] border border-[#262626] text-sm font-mono font-bold ${won ? "text-[#14b8a6]" : "text-red-400"}`}>
                          {teamScore} - {opponentScore}
                        </div>
                        <div className="flex items-center gap-3 w-32">
                          <div className="size-8 rounded-full bg-slate-700 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">
                            {opponentTeam?.abbreviation?.charAt(0) || "A"}
                          </div>
                          <span className="font-bold text-slate-400 truncate">{opponentTeam?.name || "Opponent"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        won
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}>
                        {won ? "WIN" : "LOSS"}
                      </span>
                      <Link
                        to={`/app/analytics?matchId=${match.id}`}
                        className="text-xs font-medium text-[#ff6a00] hover:text-white transition-colors flex items-center gap-1 group"
                      >
                        View Breakdown
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Key Performers */}
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Key Performers</h3>
            <Link to="/app/roster" className="text-sm font-medium text-[#a3a3a3] hover:text-[#ff6a00] transition-colors">
              View Roster
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#151515]/80 border border-[#262626] p-4 rounded-xl animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-full bg-[#262626]" />
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-24 bg-[#262626] rounded" />
                      <div className="h-2 w-16 bg-[#262626] rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-14 bg-[#0a0a0a] rounded" />
                    <div className="h-14 bg-[#0a0a0a] rounded" />
                  </div>
                </div>
              ))
            ) : topPerformers.length === 0 ? (
              <div className="col-span-4 text-center text-slate-500 text-sm py-8">
                No players on the roster yet. <Link to="/app/roster" className="text-[#ff6a00] hover:underline">Add players</Link> to see key performers.
              </div>
            ) : (
              topPerformers.map((player: any) => (
                <div key={player.id} className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="size-12 rounded-full bg-slate-800 border border-[#262626] flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500">person</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-[#ff6a00] text-white text-[10px] font-bold px-1.5 rounded-full border border-[#0a0a0a]">
                        {player.position}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-slate-100 font-bold text-sm">{player.firstName} {player.lastName}</h4>
                      <p className="text-[#a3a3a3] text-xs">#{player.jerseyNumber || "00"} &bull; {player.graduationYear}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0a0a0a]/50 rounded p-2 text-center border border-[#262626]">
                      <span className="block text-[10px] text-[#a3a3a3] uppercase">MMR</span>
                      <div className="flex items-center justify-center mt-1">
                        <MmrBadge mmr={player.mmr || 50} />
                      </div>
                    </div>
                    <div className="bg-[#0a0a0a]/50 rounded p-2 text-center border border-[#262626]">
                      <span className="block text-[10px] text-[#a3a3a3] uppercase">Stars</span>
                      <span className="text-lg font-bold text-slate-300">{"★".repeat(player.stars || 0)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
};

export default DashboardPage;
