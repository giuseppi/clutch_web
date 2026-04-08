import { useAuth } from "@/contexts/AuthContext";
import { usePlayer, usePlayerEloHistory, usePlayerStats } from "@/hooks/api/usePlayers";
import { usePlayerHighlights } from "@/hooks/api/useAnalytics";
import AppLayout from "@/components/app/AppLayout";
import PageTransition from "@/components/app/PageTransition";
import { getTierLabel, getTierRingColor, mmrFillPercent } from "@/lib/mmrTier";

function MmrRing({ mmr }: { mmr: number }) {
  const pct = mmrFillPercent(mmr);
  const circumference = 2 * Math.PI * 54;
  const dashoffset = circumference - (pct / 100) * circumference;
  const color = getTierRingColor(mmr);

  return (
    <div className="relative size-36 flex items-center justify-center">
      <svg className="size-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#262626" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-3xl font-bold text-white">{Math.round(mmr)}</span>
        <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider">MMR</span>
        <span className="text-[10px] font-semibold text-[#9ca3af]">{getTierLabel(mmr)}</span>
      </div>
    </div>
  );
}

const MyProfilePage = () => {
  const { user } = useAuth();
  const playerId = user?.playerId;

  const { data: player, isLoading: playerLoading } = usePlayer(playerId || undefined);
  const { data: eloHistory } = usePlayerEloHistory(playerId || undefined);
  const { data: stats } = usePlayerStats(playerId || undefined);
  const { data: highlights } = usePlayerHighlights(playerId || undefined);

  const history = eloHistory?.data || [];
  const careerAvg = stats?.careerAverages || {};
  const recentStats = stats?.recentStats || [];
  const highlightsList = highlights?.data || [];

  if (playerLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!player) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <span className="material-symbols-outlined text-slate-600 text-[48px]">person_off</span>
          <h2 className="text-xl font-bold text-slate-300">Profile Not Found</h2>
          <p className="text-sm text-slate-500">Your athlete profile is not linked yet. Ask your coach to set this up.</p>
        </div>
      </AppLayout>
    );
  }

  const mmr = player.mmr || 50;

  return (
    <AppLayout>
      <PageTransition className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Hero Section */}
        <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff6a00]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* MMR Ring */}
            <MmrRing mmr={mmr} />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{player.firstName} {player.lastName}</h1>
              <p className="text-[#a3a3a3] mt-1">
                {player.team?.name || "—"}
                <span className="mx-2 text-[#262626]">&bull;</span>
                {player.position}
                <span className="mx-2 text-[#262626]">&bull;</span>
                #{player.jerseyNumber || "00"}
                <span className="mx-2 text-[#262626]">&bull;</span>
                Class of {player.graduationYear}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 justify-center md:justify-start">
                {player.heightInches && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-[#a3a3a3]">height</span>
                    {Math.floor(player.heightInches / 12)}'{player.heightInches % 12}"
                  </div>
                )}
                {player.weightLbs && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-[#a3a3a3]">fitness_center</span>
                    {player.weightLbs} lbs
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <span className="material-symbols-outlined text-[18px] text-[#a3a3a3]">star</span>
                  {"★".repeat(player.stars || 0)} {player.stars || 0}-Star
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "PPG", value: careerAvg.ppg?.toFixed(1) || "--", icon: "sports_basketball", color: "text-[#ff6a00]" },
            { label: "RPG", value: careerAvg.rpg?.toFixed(1) || "--", icon: "sports", color: "text-[#14b8a6]" },
            { label: "APG", value: careerAvg.apg?.toFixed(1) || "--", icon: "handshake", color: "text-blue-400" },
            { label: "FG%", value: careerAvg.fgPct ? `${(careerAvg.fgPct * 100).toFixed(1)}%` : "--", icon: "target", color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#151515] border border-[#262626] rounded-xl p-5 group hover:border-[#ff6a00]/30 transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#a3a3a3] uppercase tracking-wider font-medium">{stat.label}</span>
                  <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
                </div>
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MMR History Chart */}
        {history.length > 0 && (
          <div className="bg-[#151515] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">show_chart</span>
              <h2 className="text-lg font-bold text-white">MMR History</h2>
            </div>
            <div className="flex items-end gap-1 h-32">
              {history.slice(-30).map((entry: any, i: number) => {
                const height = ((entry.newMmr || 50) / 99) * 100;
                const delta = entry.delta || 0;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t transition-colors cursor-default ${
                      delta > 0 ? "bg-[#14b8a6]/70 hover:bg-[#14b8a6]" : delta < 0 ? "bg-red-500/50 hover:bg-red-500/80" : "bg-slate-600/50 hover:bg-slate-600"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`MMR: ${Math.round(entry.newMmr)} (${delta > 0 ? "+" : ""}${delta?.toFixed(1)})`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
              <span>First Recorded</span>
              <span>Most Recent</span>
            </div>
          </div>
        )}

        {/* Recent Game Log */}
        {recentStats.length > 0 && (
          <div className="bg-[#151515] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#262626] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">history</span>
              <h2 className="text-lg font-bold text-white">Recent Game Log</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0a0a0a]/50">
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#9ca3af] uppercase">Date</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">PTS</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">REB</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">AST</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">STL</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">BLK</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#9ca3af] uppercase">FG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {recentStats.slice(0, 10).map((stat: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-300 font-medium">
                        {stat.match?.scheduledDate ? new Date(stat.match.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "--"}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-white">{stat.points}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{stat.rebounds}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{stat.assists}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{stat.steals}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{stat.blocks}</td>
                      <td className="px-4 py-3 text-center text-slate-400 text-xs">
                        {stat.fgMade}/{stat.fgAttempted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlightsList.length > 0 && (
          <section className="pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">smart_display</span>
              <h2 className="text-lg font-bold text-white">My Highlights</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {highlightsList.map((highlight: any) => (
                <div
                  key={highlight.id}
                  className="min-w-[260px] max-w-[300px] bg-[#151515] border border-[#262626] rounded-xl p-5 flex flex-col gap-3 snap-start hover:border-[#ff6a00]/30 transition-all cursor-pointer group shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-lg bg-[#0a0a0a] border border-[#262626] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#ff6a00]">play_circle</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
                      {highlight.clipType || "Highlight"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{highlight.label || highlight.title}</h4>
                  <p className="text-xs text-[#9ca3af]">
                    {highlight.startTime != null && highlight.endTime != null
                      ? `${Math.floor(highlight.startTime / 60)}:${String(Math.floor(highlight.startTime % 60)).padStart(2, "0")} - ${Math.floor(highlight.endTime / 60)}:${String(Math.floor(highlight.endTime % 60)).padStart(2, "0")}`
                      : "AI-generated clip"}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-[#ff6a00] mt-auto group-hover:text-white transition-colors">
                    <span>Watch</span>
                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </PageTransition>
    </AppLayout>
  );
};

export default MyProfilePage;
