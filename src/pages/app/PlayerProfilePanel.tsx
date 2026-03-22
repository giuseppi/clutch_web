const PlayerProfilePanel = () => {
  return (
    <div className="flex flex-col gap-6 font-display text-slate-100">
      {/* Player Header */}
      <div className="w-full bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-6">
          <div className="flex gap-5 items-center">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-xl w-24 h-24 shadow-xl ring-1 ring-white/10"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtCbPF0kMXSGfBn8OTm4vElX4YzCWkP2TPuLMTVmxcZua0QunA24KNB5BDCblGkwOV5kK3pd4kLzxP1jpqWqXpR6oRit5YngMknWx0zhXFB3bktBqexDf5e0a83OFQcsNimXY0Wpio88MGjm2MfJCHt699DLFtsr97AY142efi8v87ybxMTyiPhMbyLCOsQle6-W5Jx-xzA6KS9oAUeBijV02D947IvSw1lorC9jF7gvh20XfRSU4PiSrRmcerb9g2uuOImUb06WME")' }}
              />
              <div className="absolute -bottom-2 -right-2 bg-[#0a0a0a] border border-[#262626] rounded-full p-1.5 shadow-lg" title="Verified Athlete">
                <span className="material-symbols-outlined text-[#14b8a6] text-[20px]">verified</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-slate-100 text-2xl font-bold leading-tight">Jalen Green</h1>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20 shadow-[0_0_10px_-2px_rgba(255,106,0,0.2)]">SG</span>
              </div>
              <p className="text-[#a3a3a3] text-sm">Prolific Prep (CA) <span className="mx-1.5 text-[#262626]">&bull;</span> Class of 2024</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">height</span>
                  <span>6'6"</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">weight</span>
                  <span>180 lbs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">calendar_month</span>
                  <span>19 yrs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="flex-1 flex items-center justify-between gap-3 bg-[#0a0a0a]/60 border border-[#262626] rounded-lg p-3 shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs text-[#a3a3a3] font-medium uppercase tracking-wider">Elo Score</span>
                <span className="text-2xl font-bold text-[#14b8a6] drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]">2,150</span>
              </div>
              <span className="material-symbols-outlined text-[#14b8a6]/20 text-[32px]">trending_up</span>
            </div>
            <div className="flex-1 flex items-center justify-between gap-3 bg-[#0a0a0a]/60 border border-[#262626] rounded-lg p-3 shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs text-[#a3a3a3] font-medium uppercase tracking-wider">Natl Rank</span>
                <span className="text-2xl font-bold text-[#ff6a00] drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]">#12</span>
              </div>
              <span className="material-symbols-outlined text-[#ff6a00]/20 text-[32px]">trophy</span>
            </div>
            <button className="flex items-center justify-center gap-2 px-5 rounded-lg border border-[#262626] bg-[#151515] hover:bg-[#202020] hover:border-[#ff6a00]/50 text-slate-300 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              <span className="font-medium">Watchlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Highlights */}
      <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl overflow-hidden flex flex-col shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
        <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#181818]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff6a00] text-[24px] drop-shadow-[0_0_5px_rgba(255,106,0,0.5)]">smart_display</span>
            <h3 className="text-lg font-bold text-slate-100">AI Highlights</h3>
          </div>
          <button className="text-xs font-medium text-[#14b8a6] hover:text-white transition-colors flex items-center gap-1">
            View Full Game
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
        <div className="relative w-full aspect-video bg-black group">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity duration-300 group-hover:opacity-60"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZMxh2LPiYSR3m2_fHFLCzw7hnyWaLSuuDJhmLCAHygI9dnbRk8nXf1oUqMcPQLV5051yWhBhaE1OQjQp1dMH3DX0mmL8bCtdiOD2kdVPptGQtl2O2jA0v8Wq21tmlZaVxc-ijfNShIhZkvsXXxv6cweDntzryOXy2PXflnB5SFCHKN8T-AUJLOUhV7ElQMGXIqZ7VnccuC4GMNfSQuMsJFwDXbjDp8Iazyk1_iGfa64kn-1Fmubzwwfugw-EMzCBN9kJ2drgkYJjq")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center justify-center rounded-full size-16 bg-[#ff6a00]/90 hover:bg-[#ff6a00] text-white shadow-[0_0_25px_rgba(255,106,0,0.4)] backdrop-blur-sm transform hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-[32px] ml-1">play_arrow</span>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between text-xs font-medium text-white mb-2">
              <span>0:37</span>
              <span>2:23</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm">
              <div className="h-full bg-[#ff6a00] w-1/4 relative shadow-[0_0_10px_rgba(255,106,0,0.5)]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-xs font-medium text-white tracking-wide">Live Analysis</span>
          </div>
        </div>
        <div className="p-4 bg-[#0f0f0f]">
          <p className="text-sm text-[#a3a3a3] mb-3">Detected Events:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { time: "0:12", label: "Off-ball Movement", color: "text-[#14b8a6]", borderHover: "hover:border-[#14b8a6]/50 hover:bg-[#14b8a6]/10 hover:shadow-[0_0_10px_rgba(20,184,166,0.15)]" },
              { time: "0:45", label: "Transition Defense", color: "text-[#ff6a00]", borderHover: "hover:border-[#ff6a00]/50 hover:bg-[#ff6a00]/10 hover:shadow-[0_0_10px_rgba(255,106,0,0.15)]" },
              { time: "1:20", label: "Pick & Roll Assist", color: "text-[#14b8a6]", borderHover: "hover:border-[#14b8a6]/50 hover:bg-[#14b8a6]/10 hover:shadow-[0_0_10px_rgba(20,184,166,0.15)]" },
              { time: "2:05", label: "Corner 3PT", color: "text-[#ff6a00]", borderHover: "hover:border-[#ff6a00]/50 hover:bg-[#ff6a00]/10 hover:shadow-[0_0_10px_rgba(255,106,0,0.15)]" },
            ].map((evt) => (
              <button key={evt.time} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] ${evt.borderHover} transition-all group`}>
                <span className={`${evt.color} font-mono text-xs`}>{evt.time}</span>
                <span className="text-sm text-slate-300 group-hover:text-white">{evt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scout's Assessment */}
      <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Scout's Assessment</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[#ff6a00] shadow-inner">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium text-sm">Basketball IQ</h4>
              <p className="text-[#a3a3a3] text-sm mt-1 leading-relaxed">Shows elite understanding of spacing in transition. Decision making in PnR situations has improved significantly over the last 5 games. Tendency to over-help on defense needs correction.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[#14b8a6] shadow-inner">
              <span className="material-symbols-outlined">sprint</span>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium text-sm">Athleticism</h4>
              <p className="text-[#a3a3a3] text-sm mt-1 leading-relaxed">Vertical leap tested at 38". Explosive first step allows him to blow by defenders consistently. Lateral quickness is above average for his size.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "PPP (Points Per Poss)", value: "1.12", sub: "+0.05 vs Avg", subColor: "text-[#14b8a6]", icon: "trending_up", iconColor: "text-[#14b8a6]", hoverBorder: "hover:border-[#14b8a6]/30" },
          { label: "eFG%", value: "54.2%", sub: "Last 10 Games", subColor: "text-[#a3a3a3]", icon: "show_chart", iconColor: "text-[#a3a3a3]", hoverBorder: "hover:border-slate-500/30" },
          { label: "USG%", value: "28.5%", sub: "High Volume", subColor: "text-[#ff6a00]", icon: "pie_chart", iconColor: "text-[#ff6a00]", hoverBorder: "hover:border-[#ff6a00]/30" },
          { label: "Turnover Rate", value: "12.1%", sub: "Needs Imp.", subColor: "text-red-400", icon: "warning", iconColor: "text-red-400", hoverBorder: "hover:border-red-400/30" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-[#151515] p-4 rounded-xl border border-[#262626] flex flex-col gap-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)] ${stat.hoverBorder} transition-colors cursor-default`}>
            <div className="flex justify-between items-start">
              <span className="text-[#a3a3a3] text-xs font-medium uppercase">{stat.label}</span>
              <span className={`material-symbols-outlined ${stat.iconColor} text-[18px]`}>{stat.icon}</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-slate-100">{stat.value}</span>
              <span className={`text-xs ${stat.subColor} ml-1`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shot Heatmap */}
      <div className="bg-[#151515]/80 backdrop-blur-md border border-[#262626] rounded-xl p-5 flex flex-col shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-100">Shot Heatmap</h3>
          <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-[#262626]">
            <button className="px-3 py-1 rounded-md bg-[#262626] text-xs font-medium text-white shadow-sm border border-white/5">Season</button>
            <button className="px-3 py-1 rounded-md text-[#a3a3a3] text-xs font-medium hover:text-white transition-colors">Last 5</button>
          </div>
        </div>
        <div className="relative w-full aspect-[4/3] bg-[#0a0a0a] rounded-lg border border-[#262626] overflow-hidden flex items-center justify-center p-4 shadow-inner">
          <svg className="w-full h-full opacity-20 stroke-slate-500" fill="none" strokeWidth="2" viewBox="0 0 500 470">
            <line x1="0" x2="500" y1="470" y2="470" />
            <path d="M 30,470 L 30,350 A 220,220 0 0 1 470,350 L 470,470" />
            <rect height="190" width="160" x="170" y="280" />
            <circle cx="250" cy="280" r="60" />
            <circle cx="250" cy="417.5" r="7.5" stroke="#ff6a00" strokeWidth="3" />
            <line strokeWidth="3" x1="220" x2="280" y1="430" y2="430" />
          </svg>
          <div className="absolute bottom-[10%] left-[45%] w-16 h-16 bg-[#ff6a00]/40 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-[12%] left-[48%] w-8 h-8 bg-red-500 rounded-full opacity-80 shadow-[0_0_15px_rgba(239,68,68,0.5)]" title="68% FG in Paint" />
          <div className="absolute bottom-[35%] right-[15%] w-12 h-12 bg-[#14b8a6]/30 rounded-full blur-lg" />
          <div className="absolute bottom-[36%] right-[18%] w-4 h-4 bg-[#14b8a6] rounded-full opacity-80 shadow-[0_0_10px_rgba(20,184,166,0.5)]" title="42% FG from Right Wing" />
          <div className="absolute bottom-[45%] left-[48%] w-10 h-10 bg-blue-500/20 rounded-full blur-lg" />
          <div className="absolute bottom-[46%] left-[49%] w-3 h-3 bg-blue-400 rounded-full opacity-60 shadow-[0_0_10px_rgba(96,165,250,0.4)]" title="31% FG from Top" />
          <div className="absolute bottom-[10%] left-[5%] w-14 h-14 bg-[#ff6a00]/30 rounded-full blur-xl" />
          <div className="absolute bottom-[12%] left-[8%] w-5 h-5 bg-orange-500 rounded-full opacity-80 shadow-[0_0_10px_rgba(249,115,22,0.5)]" title="45% FG Left Corner" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col gap-1 p-2 rounded bg-[#0a0a0a] border border-[#262626]/50">
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wide">Paint</span>
            <span className="text-sm font-bold text-[#ff6a00]">68%</span>
          </div>
          <div className="flex flex-col gap-1 p-2 rounded bg-[#0a0a0a] border border-[#262626]/50">
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wide">Mid-Range</span>
            <span className="text-sm font-bold text-blue-400">38%</span>
          </div>
          <div className="flex flex-col gap-1 p-2 rounded bg-[#0a0a0a] border border-[#262626]/50">
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wide">3-Point</span>
            <span className="text-sm font-bold text-[#14b8a6]">41%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePanel;
