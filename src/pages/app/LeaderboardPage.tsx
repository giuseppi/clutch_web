import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeaderboard } from "@/hooks/api/useLeaderboard";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";

function StarBadge({ count }: { count: number }) {
  if (count >= 5) return <span className="text-[10px] font-bold text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/20 px-1.5 py-0.5 rounded-full">★★★★★</span>;
  if (count >= 4) return <span className="text-[10px] font-bold text-[#facc15] bg-[#facc15]/10 border border-[#facc15]/20 px-1.5 py-0.5 rounded-full">★★★★</span>;
  if (count >= 3) return <span className="text-[10px] font-bold text-[#9ca3af] bg-[#9ca3af]/10 border border-[#9ca3af]/20 px-1.5 py-0.5 rounded-full">{"★".repeat(count)}</span>;
  return null;
}

function TrendCell({ value }: { value: number }) {
  const absVal = Math.abs(value);
  if (value > 0) return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[#262626] overflow-hidden">
        <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${Math.min(absVal * 10, 100)}%` }} />
      </div>
      <span className="text-xs font-medium text-[#10b981]">+{value.toFixed(1)}</span>
    </div>
  );
  if (value < 0) return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[#262626] overflow-hidden">
        <div className="h-full rounded-full bg-[#ef4444]" style={{ width: `${Math.min(absVal * 10, 100)}%` }} />
      </div>
      <span className="text-xs font-medium text-[#ef4444]">{value.toFixed(1)}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[#262626]" />
      <span className="text-xs font-medium text-[#9ca3af]">0</span>
    </div>
  );
}

function MmrBadge({ value }: { value: number }) {
  const color = value >= 80 ? "text-[#ff6a00]" : value >= 60 ? "text-[#facc15]" : value >= 40 ? "text-slate-100" : "text-slate-400";
  return <span className={`text-sm font-bold font-mono ${color}`}>{Math.round(value)}</span>;
}

const LeaderboardPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ state?: string; classification?: string; gradYear?: number; position?: string }>({});

  const { data, isLoading } = useLeaderboard({
    ...filters,
    search: search || undefined,
    page,
    limit: 25,
  });

  const players = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 25, total: 0, totalPages: 0 };

  return (
    <AppLayout>
      <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/app/dashboard" className="text-[#9ca3af] hover:text-white transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-[16px] text-[#9ca3af]">chevron_right</span>
          <span className="text-slate-100 font-medium">Leaderboard</span>
        </nav>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">Universal Player Rating</h1>
            <p className="text-[#9ca3af] mt-1">Real-time MMR rankings powered by AI-enhanced performance analysis.</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#9ca3af]">search</span>
            <input
              type="text"
              placeholder="Search players by name or school..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#151515] border border-[#262626] text-sm text-slate-100 placeholder-[#9ca3af] focus:outline-none focus:border-[#ff6a00]/50 focus:ring-1 focus:ring-[#ff6a00]/20 transition-colors font-sans"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "State", key: "state", options: ["CA", "TX", "FL", "NY", "OH"] },
              { label: "Classification", key: "classification", options: ["1A", "2A", "3A", "4A", "5A", "D1", "D2", "D3"] },
              { label: "Position", key: "position", options: ["PG", "SG", "SF", "PF", "C"] },
            ].map((filter) => (
              <select
                key={filter.key}
                value={(filters as any)[filter.key] || ""}
                onChange={(e) => { setFilters(f => ({ ...f, [filter.key]: e.target.value || undefined })); setPage(1); }}
                className="px-3 py-2.5 rounded-lg bg-[#151515] border border-[#262626] text-sm text-[#9ca3af] hover:border-[#ff6a00]/30 transition-colors appearance-none cursor-pointer font-sans"
              >
                <option value="">{filter.label}</option>
                {filter.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#262626] bg-[#151515]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-16">Rank</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Player</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-16">Pos</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">School</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-24">MMR</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider w-36">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] bg-[#0a0a0a]">
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-4">
                        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : players.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">No players found matching your filters.</td>
                  </tr>
                ) : (
                  players.map((player: any) => (
                    <tr key={player.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${player.rank <= 3 ? "text-[#ff6a00]" : "text-slate-400"}`}>#{player.rank}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-[#262626] border border-[#262626] flex items-center justify-center text-xs font-bold text-[#9ca3af]">
                            {player.firstName?.[0]}{player.lastName?.[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-100">{player.firstName} {player.lastName}</span>
                            <div className="flex items-center gap-2">
                              {player.stars > 0 && <StarBadge count={player.stars} />}
                              <span className="text-[10px] text-[#9ca3af]">Class {player.graduationYear}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-300 bg-[#262626] px-2 py-1 rounded">{player.position}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-200">{player.team?.name}</span>
                          <span className="text-xs text-[#9ca3af]">{player.team?.state} · {player.team?.classification}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><MmrBadge value={player.mmr} /></td>
                      <td className="px-4 py-3"><TrendCell value={player.trend || 0} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#262626] bg-[#151515]">
            <span className="text-xs text-[#9ca3af]">
              Showing <span className="font-medium text-slate-300">{((page - 1) * 25) + 1}-{Math.min(page * 25, pagination.total)}</span> of <span className="font-medium text-slate-300">{pagination.total.toLocaleString()}</span> players
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="size-8 rounded-lg border border-[#262626] bg-[#151515] flex items-center justify-center text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`size-8 rounded-lg text-xs font-bold ${p === page ? "bg-[#ff6a00]/10 border border-[#ff6a00]/20 text-[#ff6a00]" : "border border-[#262626] bg-[#151515] text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30"} transition-colors`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="size-8 rounded-lg border border-[#262626] bg-[#151515] flex items-center justify-center text-[#9ca3af] hover:text-white hover:border-[#ff6a00]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
};

export default LeaderboardPage;
