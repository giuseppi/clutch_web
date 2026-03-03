import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppSidebarHeader from "@/components/AppSidebarHeader";
import PageTransition from "@/components/PageTransition";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PlayerProfilePanel from "./PlayerProfilePanel";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/app/upload", icon: "upload_file", label: "Upload Matches" },
  { to: "/app/analytics", icon: "analytics", label: "Analytics" },
  { to: "/app/roster", icon: "groups", label: "Roster" },
  { to: "/app/settings", icon: "settings", label: "Settings" },
];

interface Player {
  id: string;
  name: string;
  position: string;
  classYear: string;
  elo: string;
  performance: number;
  performanceColor: string;
  image: string | null;
  badge?: { label: string; color: string };
}

const players: Player[] = [
  { id: "1", name: "Jalen Green", position: "SG", classYear: "'24", elo: "2,150", performance: 88, performanceColor: "from-[#ff6a00] to-[#cc5500]", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtCbPF0kMXSGfBn8OTm4vElX4YzCWkP2TPuLMTVmxcZua0QunA24KNB5BDCblGkwOV5kK3pd4kLzxP1jpqWqXpR6oRit5YngMknWx0zhXFB3bktBqexDf5e0a83OFQcsNimXY0Wpio88MGjm2MfJCHt699DLFtsr97AY142efi8v87ybxMTyiPhMbyLCOsQle6-W5Jx-xzA6KS9oAUeBijV02D947IvSw1lorC9jF7gvh20XfRSU4PiSrRmcerb9g2uuOImUb06WME", badge: { label: "ELITE", color: "text-[#14b8a6] bg-black/60 border-white/10" } },
  { id: "2", name: "Davion Mitchell", position: "PG", classYear: "'25", elo: "1,980", performance: 75, performanceColor: "from-[#14b8a6] to-teal-600", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL7x86jQ2rjrFk9INGkjDTWiZcSzj-ovHy9SovnbgyAQrleG02Gc08DgGVGcidUOqvq1rYNpMAvTQdrzkge7ZJQKH52evNDUG-VJjz4S1mWjO1PkFB5Wt8OLKUQMzV1u3Gozf5EVWBkz5VWl-bn-1EUQARVE6S9FMA_kn4i00RuTyfhlxw3ovC_u6sex0_D6CBPIhDp3g97xyNW2PNQmRG0notPEnR1pxVIc6FUrV0I4UKH96kygYBo6OIBAZISMW698BDUWi0oBGd" },
  { id: "3", name: "Caleb Love", position: "SG", classYear: "'24", elo: "2,050", performance: 40, performanceColor: "from-red-500 to-red-700", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQOqDUKWqjeDsWh9ewAANDdl5uZbE0Yz5_qjdYWR4Rjs3Vr9n9ASYmyA20SVqb_JEyXt2I4Z9N5U7Ilxxwf6py3oRx55vhe_kBdqer6v9_VYD3oMgf_-w4U7BkwMb6NJjlkD5GtRJQgnVlaHyp7UTZ8sVEtNZC9ln3v8Lj3H0epV2VP1DDmjNB7NNoPxVqtg-xJw_Vx11uwqd6XuNnxpOwb8kVOLejY7uuAl7W9BSVx3umAMVEsIQOaJ59L-fjXFEOEEJk6MRIEYxf", badge: { label: "INJURED", color: "text-red-400 bg-red-500/20 border-red-500/30" } },
  { id: "4", name: "Mark Williams", position: "C", classYear: "'25", elo: "1,890", performance: 65, performanceColor: "from-[#14b8a6] to-teal-600", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBa6hpRzGhxmJn2wijYBeoRxWeT6SOUr8oaRCEKeJ2LeIv_crv3lQ8hG_TDc59EqpL5YSVS0DU0QJm4J7Lj0D4DgPUJRDZyVb6QzNCM-4BiRne7G0QpF7F9dQBGAmAX_WBefvFgKG-FFHXmVnzjTl3Lzd8-6wq4cV2td4BurG_LksZF8MWHExiXAATKABIwyo-LuKTo7ydQYczPDm_0m6xOl0ogJiscksdYox8eUWj3wHc8UgCwp1vRN7THzwWcdS1aXlFhfe7-itWp" },
  { id: "5", name: "Trevor Keels", position: "SF", classYear: "'26", elo: "1,750", performance: 55, performanceColor: "from-yellow-500 to-yellow-600", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsSvj_Vkl2Gn43HgJ8_3PLMqjgRvyRo4HdXA8l9zkDGxUueluhRHUOHFOf7SqGwfUat7M399QS8COz1oMru07yJEGI9xrccBG41UINrfX1NQS0Rlz6sio_RCU3lRZ0jgDhB-5eIgzjl_OaMU5YjLOWD3ZRIIaMechGmikKaKhOrz-O-91ufvcWC3uuP73aohitjyVLy70-f34ZwDC2lNMlQvvelTow3Gpd7H_hU1PYwW45l9jdJyhKi9JP9PLX-ZClxDtbWe5H-2P5" },
  { id: "6", name: "Paolo Banchero", position: "PF", classYear: "'25", elo: "2,100", performance: 82, performanceColor: "from-[#ff6a00] to-[#cc5500]", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5H0hbdFR6CRkTbc3xWvCCCaCWImPGgGv2rpyyhr8bd1SNEJ3BL7dcDaGvdzM935EarR4S-SMMNNJkO5m_9uaQOLqPjomy8l3IQrsFr3gSQzrE39kr5r0MdxANFZGCkFv9CDWLV3JwVwYix7ObPH7jlfmydvJhoZutGNHTwKfYDVeqGLJEBCmE25q8vbGftvISRtk1NLAwfktZuwjWLpXz3XNwl-7ga0bp0Ooh9-thZDIAXe9PEqTaLAdRf0yhJJr_TMb9PxvTek4x", badge: { label: "NEW", color: "text-blue-400 bg-blue-500/20 border-blue-500/30" } },
];

function getPerformanceLabel(p: Player) {
  if (p.badge?.label === "INJURED") return { label: "Recovery", color: "text-red-400" };
  return { label: "Performance", color: p.performance >= 80 ? "text-[#ff6a00]" : p.performance >= 60 ? "text-[#14b8a6]" : "text-yellow-500" };
}

const RosterPage = () => {
  const location = useLocation();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen sticky top-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <AppSidebarHeader />
        </div>
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_15px_-5px_rgba(255,106,0,0.3)]"
                    : "text-[#a3a3a3] hover:bg-[#202020] hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${!isActive ? "group-hover:text-[#ff6a00] transition-colors" : ""}`}>{link.icon}</span>
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#202020] cursor-pointer transition-colors">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-1 ring-[#262626]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1bvNIXmlNd1k6t3aTwwkaOdsdLBiNBk0iDQQFTJkPbNKqDdtZOHrf5rPtMzFu7aGW7xdqL_blidJ4QKOxmrrUkRodx5dCK8HaMnAQCkNpnJYcWstAtARck9OV1kaGJou8AlEIRfQFfXPt5L4rwdgpmfIw3ycqycX1qeEAkczNWJpNM0LARoelQZ1bLgzMie9diJvSZlyPOAlOOnJC6HANj6cT_CpA_k2skf-O9IE84WfaYJNKEAS51sisvSSP3tQou2UwLvuYpGl4")' }} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">Coach K.</span>
              <span className="text-xs text-[#a3a3a3] truncate">Duke University</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6a00]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#14b8a6]/5 rounded-full blur-[80px] pointer-events-none" />

        <header className="flex items-center justify-between px-8 py-5 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Team Roster - Duke University</h1>
            <p className="text-[#a3a3a3] text-sm mt-1">Manage your active roster and player performance metrics.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#262626] bg-[#151515] hover:bg-[#202020] text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold shadow-[0_0_15px_-3px_rgba(255,106,0,0.4)] transition-all">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Player
            </button>
          </div>
        </header>

        <PageTransition className="flex-1 overflow-y-auto p-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#a3a3a3] text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#262626] rounded-xl text-sm focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00]/50 placeholder:text-[#a3a3a3]/70 text-white transition-all" placeholder="Search players by name or position..." type="text" />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2.5 bg-[#151515] border border-[#262626] rounded-xl text-sm text-white focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00]/50 cursor-pointer min-w-[140px]">
                <option>Position: All</option>
                <option>Point Guard</option>
                <option>Shooting Guard</option>
                <option>Small Forward</option>
                <option>Power Forward</option>
                <option>Center</option>
              </select>
              <select className="px-4 py-2.5 bg-[#151515] border border-[#262626] rounded-xl text-sm text-white focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00]/50 cursor-pointer min-w-[140px]">
                <option>Class: All</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
              </select>
              <button className="px-3 py-2.5 bg-[#151515] border border-[#262626] rounded-xl hover:bg-[#202020] text-[#a3a3a3] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">sort</span>
              </button>
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => {
              const perfLabel = getPerformanceLabel(player);
              return (
                <div
                  key={player.id}
                  className="group relative bg-[#151515] border border-[#262626] rounded-xl overflow-hidden hover:border-[#ff6a00]/50 hover:shadow-[0_0_20px_-5px_rgba(255,106,0,0.15)] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPlayer(player.id)}
                >
                  <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#121212]">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${player.image}")` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <button className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#cc5500] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(255,106,0,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Profile
                      </button>
                    </div>
                    {player.badge && (
                      <div className={`absolute top-3 right-3 backdrop-blur-md border px-2 py-1 rounded-md ${player.badge.color}`}>
                        <span className="text-xs font-bold">{player.badge.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#ff6a00] transition-colors">{player.name}</h3>
                        <div className="flex items-center gap-2 text-[#a3a3a3] text-sm mt-0.5">
                          <span className="font-medium text-slate-300">{player.position}</span>
                          <span className="text-[10px] text-[#262626]">&bull;</span>
                          <span>Class of {player.classYear}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-[#a3a3a3] font-medium">Elo Score</span>
                        <span className="text-lg font-bold text-white">{player.elo}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden mt-3">
                      <div className={`bg-gradient-to-r ${player.performanceColor} h-full rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]`} style={{ width: `${player.performance}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-[#a3a3a3]">{perfLabel.label}</span>
                      <span className={`text-[10px] font-bold ${perfLabel.color}`}>{player.performance}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Player card */}
            <div className="group relative bg-[#151515]/50 border-2 border-dashed border-[#262626] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6a00]/50 hover:bg-[#151515] transition-all duration-300 aspect-[4/5] sm:aspect-auto">
              <div className="w-16 h-16 rounded-full bg-[#202020] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-[#a3a3a3] text-[32px] group-hover:text-[#ff6a00] transition-colors">add</span>
              </div>
              <h3 className="text-lg font-bold text-[#a3a3a3] group-hover:text-white transition-colors">Add New Player</h3>
              <p className="text-xs text-[#a3a3a3]/60 mt-2">Import from scout database</p>
            </div>
          </div>
        </PageTransition>

        {/* Player Detail Sheet */}
        <Sheet open={selectedPlayer !== null} onOpenChange={(open) => { if (!open) setSelectedPlayer(null); }}>
          <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#0a0a0a] border-l border-[#262626] p-0 overflow-y-auto">
            <VisuallyHidden>
              <SheetTitle>Player Profile</SheetTitle>
            </VisuallyHidden>
            <div className="p-6">
              <PlayerProfilePanel />
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default RosterPage;
