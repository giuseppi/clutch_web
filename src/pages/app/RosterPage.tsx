import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayers, usePlayer, usePlayerEloHistory, usePlayerStats } from "@/hooks/api/usePlayers";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AppLayout from "@/components/app/AppLayout";
import PageTransition from "@/components/app/PageTransition";
import { getTierBarGradient, getTierLabel, getTierTextClass, mmrFillPercent } from "@/lib/mmrTier";

function MmrBadge({ mmr }: { mmr: number }) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className={`text-2xl font-bold ${getTierTextClass(mmr)} drop-shadow-[0_0_8px_rgba(255,106,0,0.15)]`}>
        {Math.round(mmr)}
      </span>
      <span className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wide">{getTierLabel(mmr)}</span>
    </div>
  );
}

function PerformanceBar({ mmr }: { mmr: number }) {
  const pct = mmrFillPercent(mmr);
  const gradientColor = getTierBarGradient(mmr);
  return (
    <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
      <div className={`bg-gradient-to-r ${gradientColor} h-full rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function PlayerDetailPanel({ playerId }: { playerId: string }) {
  const { data: player, isLoading } = usePlayer(playerId);
  const { data: eloHistory } = usePlayerEloHistory(playerId);
  const { data: stats } = usePlayerStats(playerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return <div className="text-center text-slate-500 py-16">Player not found.</div>;
  }

  const history = eloHistory?.data || [];
  const careerAvg = stats?.careerAverages || {};

  return (
    <div className="flex flex-col gap-6 font-display text-slate-100">
      {/* Player Header */}
      <div className="w-full bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5">
        <div className="flex gap-5 items-center">
          <div className="relative">
            <div className="size-24 rounded-xl bg-slate-800 border border-[#262626] flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500 text-[36px]">person</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#ff6a00] text-white text-xs font-bold px-2 py-0.5 rounded-full border border-[#0a0a0a]">
              {player.position}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-100 text-2xl font-bold leading-tight">{player.firstName} {player.lastName}</h1>
            <p className="text-[#a3a3a3] text-sm">
              {player.team?.name || "—"}
              <span className="mx-1.5 text-[#262626]">&bull;</span>
              Class of {player.graduationYear}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-400">
              {player.heightInches && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">height</span>
                  <span>{Math.floor(player.heightInches / 12)}'{player.heightInches % 12}"</span>
                </div>
              )}
              {player.weightLbs && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">fitness_center</span>
                  <span>{player.weightLbs} lbs</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">tag</span>
                <span>#{player.jerseyNumber || "00"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full mt-6">
          <div className="flex-1 flex items-center justify-between gap-3 bg-[#0a0a0a]/60 border border-[#262626] rounded-lg p-3">
            <div className="flex flex-col">
              <span className="text-xs text-[#a3a3a3] font-medium uppercase tracking-wider">MMR</span>
              <MmrBadge mmr={player.mmr || 50} />
            </div>
            <span className="material-symbols-outlined text-[#14b8a6]/20 text-[32px]">trending_up</span>
          </div>
          <div className="flex-1 flex items-center justify-between gap-3 bg-[#0a0a0a]/60 border border-[#262626] rounded-lg p-3">
            <div className="flex flex-col">
              <span className="text-xs text-[#a3a3a3] font-medium uppercase tracking-wider">Stars</span>
              <span className="text-2xl font-bold text-[#ff6a00]">{"★".repeat(player.stars || 0)}</span>
            </div>
            <span className="material-symbols-outlined text-[#ff6a00]/20 text-[32px]">star</span>
          </div>
        </div>
      </div>

      {/* Elo History */}
      {history.length > 0 && (
        <div className="bg-[#151515]/80 border border-[#262626] rounded-xl p-5">
          <h3 className="text-lg font-bold text-slate-100 mb-4">MMR History</h3>
          <div className="flex items-end gap-1 h-24">
            {history.slice(-20).map((entry: any, i: number) => {
              const height = ((entry.newMmr || 50) / 99) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-[#ff6a00]/60 hover:bg-[#ff6a00] rounded-t transition-colors cursor-default"
                  style={{ height: `${height}%` }}
                  title={`MMR: ${Math.round(entry.newMmr)} (${entry.delta > 0 ? "+" : ""}${entry.delta?.toFixed(1)})`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Oldest</span>
            <span>Latest</span>
          </div>
        </div>
      )}

      {/* Career Averages */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "PPG", value: careerAvg.ppg?.toFixed(1) || "--", icon: "sports_basketball" },
          { label: "RPG", value: careerAvg.rpg?.toFixed(1) || "--", icon: "sports" },
          { label: "APG", value: careerAvg.apg?.toFixed(1) || "--", icon: "handshake" },
          { label: "FG%", value: careerAvg.fgPct ? `${(careerAvg.fgPct * 100).toFixed(1)}%` : "--", icon: "target" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#151515] p-4 rounded-xl border border-[#262626] flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="text-[#a3a3a3] text-xs font-medium uppercase">{stat.label}</span>
              <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">{stat.icon}</span>
            </div>
            <span className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const RosterPage = () => {
  const { user } = useAuth();
  const teamId = user?.team?.id;
  const teamName = user?.team?.name || "Your Team";

  const [search, setSearch] = useState("");
  const [posFilter, setPositionFilter] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const { data: playerData, isLoading } = usePlayers({
    teamId,
    position: posFilter || undefined,
    search: search || undefined,
    limit: 50,
  });

  const players = playerData?.data || [];

  return (
    <AppLayout>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6a00]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#14b8a6]/5 rounded-full blur-[80px] pointer-events-none" />

        <header className="flex items-center justify-between px-8 py-5 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Team Roster - {teamName}</h1>
            <p className="text-[#a3a3a3] text-sm mt-1">Manage your active roster and player performance metrics.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#262626] bg-[#151515] hover:bg-[#202020] text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </header>

        <PageTransition className="flex-1 overflow-y-auto p-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#a3a3a3] text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#262626] rounded-xl text-sm focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00]/50 placeholder:text-[#a3a3a3]/70 text-white transition-all"
                placeholder="Search players by name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={posFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#151515] border border-[#262626] rounded-xl text-sm text-white focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00]/50 cursor-pointer min-w-[140px]"
              >
                <option value="">Position: All</option>
                <option value="PG">Point Guard</option>
                <option value="SG">Shooting Guard</option>
                <option value="SF">Small Forward</option>
                <option value="PF">Power Forward</option>
                <option value="C">Center</option>
              </select>
            </div>
          </div>

          {/* Player Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#151515] border border-[#262626] rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-[#121212]" />
                  <div className="p-4">
                    <div className="h-4 w-24 bg-[#262626] rounded mb-2" />
                    <div className="h-3 w-16 bg-[#262626] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player: any) => {
                const mmr = player.mmr || 50;
                return (
                  <div
                    key={player.id}
                    className="group relative bg-[#151515] border border-[#262626] rounded-xl overflow-hidden hover:border-[#ff6a00]/50 hover:shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)] transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedPlayer(player.id)}
                  >
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#121212] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[64px] text-[#262626]">person</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <button className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#cc5500] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(255,106,0,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          View Profile
                        </button>
                      </div>
                      <div className="absolute top-3 right-3 backdrop-blur-md border bg-black/60 border-white/10 px-2 py-1 rounded-md">
                        <span className="text-xs font-bold text-[#ff6a00]">{player.position}</span>
                      </div>
                    </div>
                    <div className="p-4 relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#ff6a00] transition-colors">{player.firstName} {player.lastName}</h3>
                          <div className="flex items-center gap-2 text-[#a3a3a3] text-sm mt-0.5">
                            <span className="font-medium text-slate-300">#{player.jerseyNumber || "00"}</span>
                            <span className="text-[10px] text-[#262626]">&bull;</span>
                            <span>Class of {player.graduationYear}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-wider text-[#a3a3a3] font-medium">MMR</span>
                          <span className="text-lg font-bold text-white">{Math.round(mmr)}</span>
                        </div>
                      </div>
                      <PerformanceBar mmr={mmr} />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-[#a3a3a3]">Performance</span>
                        <span className="text-[10px] font-bold text-slate-400">{Math.round(mmr)}/99</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {players.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <span className="material-symbols-outlined text-slate-600 text-[48px] mb-4">group_off</span>
                  <p className="text-slate-500">No players found.</p>
                </div>
              )}
            </div>
          )}
        </PageTransition>

        {/* Player Detail Sheet */}
        <Sheet open={selectedPlayer !== null} onOpenChange={(open) => { if (!open) setSelectedPlayer(null); }}>
          <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#0a0a0a] border-l border-[#262626] p-0 overflow-y-auto">
            <VisuallyHidden>
              <SheetTitle>Player Profile</SheetTitle>
            </VisuallyHidden>
            <div className="p-6">
              {selectedPlayer && <PlayerDetailPanel playerId={selectedPlayer} />}
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </AppLayout>
  );
};

export default RosterPage;
