import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches } from "@/hooks/api/useMatches";
import { useMatchAnalytics } from "@/hooks/api/useAnalytics";
import { usePlayTags } from "@/hooks/api/useAnalytics";
import { useMatchHighlights } from "@/hooks/api/useAnalytics";
import AppLayout from "@/components/app/AppLayout";
import PageTransition from "@/components/app/PageTransition";

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const teamId = user?.team?.id;

  // Match selector
  const { data: matchData, isLoading: matchesLoading } = useMatches({ teamId, limit: 20 });
  const allMatches = matchData?.data || [];
  const processedMatches = allMatches.filter((m: any) => m.isProcessed);

  const selectedMatchId = searchParams.get("matchId") || processedMatches[0]?.id || null;

  // Analytics data
  const { data: analytics, isLoading: analyticsLoading } = useMatchAnalytics(selectedMatchId || undefined);
  const { data: playTags } = usePlayTags(selectedMatchId || undefined);
  const { data: highlights } = useMatchHighlights(selectedMatchId || undefined);

  const [shotTeam, setShotTeam] = useState<"home" | "away">("home");

  const selectedMatch = processedMatches.find((m: any) => m.id === selectedMatchId);
  const isHome = selectedMatch?.homeTeamId === teamId;
  const teamScore = selectedMatch ? (isHome ? selectedMatch.homeScore : selectedMatch.awayScore) : null;
  const opponentScore = selectedMatch ? (isHome ? selectedMatch.awayScore : selectedMatch.homeScore) : null;
  const won = teamScore !== null && opponentScore !== null && teamScore > opponentScore;
  const homeTeam = selectedMatch?.homeTeam;
  const awayTeam = selectedMatch?.awayTeam;

  // Four factors from analytics
  const fourFactors = useMemo(() => {
    if (!analytics?.fourFactors) return [];
    const hf = analytics.fourFactors.home || {};
    const af = analytics.fourFactors.away || {};
    return [
      { metric: "PPP", home: hf.ppp?.toFixed(2) || "--", away: af.ppp?.toFixed(2) || "--", homeWin: (hf.ppp || 0) > (af.ppp || 0) },
      { metric: "eFG%", home: hf.efgPct ? `${(hf.efgPct * 100).toFixed(1)}%` : "--", away: af.efgPct ? `${(af.efgPct * 100).toFixed(1)}%` : "--", homeWin: (hf.efgPct || 0) > (af.efgPct || 0) },
      { metric: "TO%", home: hf.toPct ? `${(hf.toPct * 100).toFixed(1)}%` : "--", away: af.toPct ? `${(af.toPct * 100).toFixed(1)}%` : "--", homeWin: (hf.toPct || 0) < (af.toPct || 0) },
      { metric: "ORB%", home: hf.orbPct ? `${(hf.orbPct * 100).toFixed(1)}%` : "--", away: af.orbPct ? `${(af.orbPct * 100).toFixed(1)}%` : "--", homeWin: (hf.orbPct || 0) > (af.orbPct || 0) },
      { metric: "FTR", home: hf.ftr?.toFixed(2) || "--", away: af.ftr?.toFixed(2) || "--", homeWin: (hf.ftr || 0) > (af.ftr || 0) },
    ];
  }, [analytics]);

  const highlightsList = highlights?.data || [];
  const tagsList = playTags?.data || [];

  return (
    <AppLayout>
      {/* Header bar */}
      <div className="border-b border-[#262626] bg-[#151515]/60 backdrop-blur-sm px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Match selector dropdown */}
          <select
            value={selectedMatchId || ""}
            onChange={(e) => setSearchParams({ matchId: e.target.value })}
            className="h-10 px-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:ring-1 focus:ring-[#ff6a00] outline-none min-w-[220px]"
          >
            <option value="" disabled>Select a match...</option>
            {processedMatches.map((m: any) => {
              const date = new Date(m.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <option key={m.id} value={m.id}>
                  {m.homeTeam?.abbreviation || "Home"} vs {m.awayTeam?.abbreviation || "Away"} - {date}
                </option>
              );
            })}
          </select>

          {selectedMatch && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-slate-100 font-mono">
                  {selectedMatch.homeScore} - {selectedMatch.awayScore}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  won ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {won ? "WIN" : "LOSS"}
                </span>
              </div>
            </>
          )}
        </div>
        {selectedMatch && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-bold border border-[#14b8a6]/20">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            AI Processing Complete
          </span>
        )}
      </div>

      <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-8">
        {!selectedMatchId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-slate-600 text-[48px] mb-4">analytics</span>
              <h2 className="text-xl font-bold text-slate-300 mb-2">Select a Match</h2>
              <p className="text-sm text-slate-500">Choose a processed match above to view analytics.</p>
            </div>
          </div>
        ) : analyticsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* AI Assistant Takeaways — from highlights */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">auto_awesome</span>
                <h2 className="text-lg font-bold text-slate-100">AI Assistant Takeaways</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(highlightsList.length > 0
                  ? highlightsList.slice(0, 3).map((h: any, i: number) => ({
                      icon: i === 0 ? "trending_up" : i === 1 ? "speed" : "warning",
                      iconColor: i === 0 ? "text-[#14b8a6]" : i === 1 ? "text-[#ff6a00]" : "text-amber-400",
                      iconBg: i === 0 ? "bg-[#14b8a6]/10 border-[#14b8a6]/20" : i === 1 ? "bg-[#ff6a00]/10 border-[#ff6a00]/20" : "bg-amber-400/10 border-amber-400/20",
                      title: h.label || h.title || `Highlight ${i + 1}`,
                      detail: h.notes || "AI-detected event from game footage analysis.",
                    }))
                  : [
                      { icon: "trending_up", iconColor: "text-[#14b8a6]", iconBg: "bg-[#14b8a6]/10 border-[#14b8a6]/20", title: "Match analysis ready", detail: "Four factors and team performance metrics are available below." },
                      { icon: "speed", iconColor: "text-[#ff6a00]", iconBg: "bg-[#ff6a00]/10 border-[#ff6a00]/20", title: "Individual stats computed", detail: "View per-player box scores and advanced metrics in the roster section." },
                      { icon: "warning", iconColor: "text-amber-400", iconBg: "bg-amber-400/10 border-amber-400/20", title: "Upload more games", detail: "More data improves AI accuracy and MMR stability for your players." },
                    ]
                ).map((card: any) => (
                  <div
                    key={card.title}
                    className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] p-5 rounded-xl hover:border-[#ff6a00]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`size-9 rounded-lg ${card.iconBg} border flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined text-[18px] ${card.iconColor}`}>{card.icon}</span>
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
              {/* Shot Distribution (visual placeholder with toggle) */}
              <div className="lg:col-span-7 bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">scatter_plot</span>
                    <h3 className="text-lg font-bold text-slate-100">Shot Distribution</h3>
                  </div>
                  <div className="flex items-center bg-[#0a0a0a] rounded-lg border border-[#262626] p-0.5">
                    <button
                      onClick={() => setShotTeam("home")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        shotTeam === "home"
                          ? "bg-[#ff6a00] text-white shadow-[0_0_12px_-3px_rgba(255,106,0,0.4)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {homeTeam?.abbreviation || "Home"}
                    </button>
                    <button
                      onClick={() => setShotTeam("away")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        shotTeam === "away"
                          ? "bg-[#ff6a00] text-white shadow-[0_0_12px_-3px_rgba(255,106,0,0.4)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {awayTeam?.abbreviation || "Away"}
                    </button>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-center">
                  <svg viewBox="0 0 500 470" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                    {/* Court outline */}
                    <rect x="10" y="10" width="480" height="450" rx="4" fill="none" stroke="#262626" strokeWidth="2" />
                    <line x1="10" y1="235" x2="490" y2="235" stroke="#262626" strokeWidth="1.5" />
                    <circle cx="250" cy="235" r="40" fill="none" stroke="#262626" strokeWidth="1.5" />
                    <rect x="175" y="10" width="150" height="190" rx="2" fill="none" stroke="#262626" strokeWidth="1.5" />
                    <rect x="175" y="270" width="150" height="190" rx="2" fill="none" stroke="#262626" strokeWidth="1.5" />
                    <circle cx="250" cy="200" r="60" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="250" cy="270" r="60" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M 80 10 Q 80 190 250 200 Q 420 190 420 10" fill="none" stroke="#262626" strokeWidth="1.5" />
                    <path d="M 80 460 Q 80 280 250 270 Q 420 280 420 460" fill="none" stroke="#262626" strokeWidth="1.5" />
                    <circle cx="250" cy="55" r="8" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                    <circle cx="250" cy="415" r="8" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                    {/* Placeholder shots - will be populated from real data */}
                    <text x="250" y="240" textAnchor="middle" fill="#555" fontSize="14">
                      {shotTeam === "home" ? homeTeam?.abbreviation || "Home" : awayTeam?.abbreviation || "Away"} Shots
                    </text>
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
                  <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">compare_arrows</span>
                  <h3 className="text-lg font-bold text-slate-100">Four Factors Comparison</h3>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#262626] bg-[#0a0a0a]/50">
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Metric</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-blue-400 uppercase tracking-wider">{homeTeam?.abbreviation || "Home"}</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-red-400 uppercase tracking-wider">{awayTeam?.abbreviation || "Away"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {fourFactors.map((row) => (
                        <tr key={row.metric} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 text-slate-300 font-medium">{row.metric}</td>
                          <td className={`px-5 py-3.5 text-center font-bold ${row.homeWin ? "text-[#14b8a6]" : "text-slate-300"}`}>
                            {row.home}
                          </td>
                          <td className={`px-5 py-3.5 text-center font-bold ${!row.homeWin ? "text-[#14b8a6]" : "text-slate-400"}`}>
                            {row.away}
                          </td>
                        </tr>
                      ))}
                      {fourFactors.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-5 py-6 text-center text-slate-500 text-sm">
                            No four-factor data available for this match.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Play Tags Timeline */}
            {tagsList.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">bookmark</span>
                  <h2 className="text-lg font-bold text-slate-100">Play Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag: any) => (
                    <button
                      key={tag.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:border-[#ff6a00]/50 hover:bg-[#ff6a00]/10 transition-all group"
                    >
                      <span className="text-[#ff6a00] font-mono text-xs">
                        {Math.floor(tag.timestamp / 60)}:{String(Math.floor(tag.timestamp % 60)).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-slate-300 group-hover:text-white">{tag.label}</span>
                      {tag.statType && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#262626] text-slate-400">{tag.statType}</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Auto-Generated Playlists */}
            <section className="pb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">playlist_play</span>
                <h2 className="text-lg font-bold text-slate-100">Auto-Generated Playlists</h2>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                {highlightsList.length > 0 ? (
                  highlightsList.map((highlight: any, i: number) => {
                    const colors = [
                      { badge: "bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20", icon: "shield", gradient: "from-[#14b8a6]/20 to-transparent" },
                      { badge: "bg-[#ff6a00]/10 text-[#ff6a00] border-[#ff6a00]/20", icon: "local_fire_department", gradient: "from-[#ff6a00]/20 to-transparent" },
                      { badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", icon: "sync_problem", gradient: "from-amber-400/20 to-transparent" },
                    ];
                    const c = colors[i % colors.length];
                    return (
                      <div
                        key={highlight.id}
                        className="min-w-[260px] max-w-[300px] bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5 flex flex-col gap-3 snap-start hover:border-[#ff6a00]/30 transition-all duration-300 cursor-pointer group relative overflow-hidden shrink-0"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="size-10 rounded-lg bg-[#0a0a0a] border border-[#262626] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#ff6a00]">{c.icon}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${c.badge}`}>
                            {highlight.clipType || "Highlight"}
                          </span>
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-sm font-bold text-slate-100">{highlight.label || highlight.title}</h4>
                          <p className="text-xs text-[#9ca3af] mt-1">
                            {highlight.startTime != null ? `${Math.floor(highlight.startTime / 60)}:${String(Math.floor(highlight.startTime % 60)).padStart(2, "0")}` : ""}
                            {highlight.endTime != null ? ` - ${Math.floor(highlight.endTime / 60)}:${String(Math.floor(highlight.endTime % 60)).padStart(2, "0")}` : ""}
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-1 text-xs font-medium text-[#ff6a00] mt-auto group-hover:text-white transition-colors">
                          <span>Watch Clip</span>
                          <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="min-w-[260px] max-w-[300px] border-2 border-dashed border-[#262626] rounded-xl p-5 flex flex-col items-center justify-center gap-3 snap-start group shrink-0">
                    <span className="material-symbols-outlined text-slate-600 text-[28px]">movie</span>
                    <span className="text-sm font-medium text-slate-500 text-center">AI highlights will appear here after video processing.</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </PageTransition>
    </AppLayout>
  );
};

export default AnalyticsPage;
