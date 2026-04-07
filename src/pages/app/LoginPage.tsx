import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import clutchLogo from "@/assets/clutch_logo.png";

type LoginRole = 'COACH' | 'SCOUT' | 'ATHLETE';

function loginErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: unknown } }).response;
    const data = res?.data;
    if (data && typeof data === "object" && "error" in data) {
      const msg = (data as { error: unknown }).error;
      if (typeof msg === "string") return msg;
    }
  }
  return "Invalid email or password";
}

const ROLE_CONFIG = {
  COACH: {
    label: 'Coach',
    icon: 'sports',
    description: 'Upload game film, review analytics, manage your team.',
    defaultRoute: '/app/dashboard',
    color: 'text-[#ff6a00]',
  },
  SCOUT: {
    label: 'Scout / Recruiter',
    icon: 'person_search',
    description: 'Discover talent via the Universal Player Rating leaderboard.',
    defaultRoute: '/app/leaderboard',
    color: 'text-teal-400',
  },
  ATHLETE: {
    label: 'Athlete',
    icon: 'sprint',
    description: 'View your MMR, stats, and performance analytics.',
    defaultRoute: '/app/my-profile',
    color: 'text-blue-400',
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<LoginRole>('COACH');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      const route = ROLE_CONFIG[user.role as LoginRole]?.defaultRoute || '/app/dashboard';
      navigate(route, { replace: true });
    } catch (err: unknown) {
      setError(loginErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark bg-[#0a0a0a] font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden animate-page-enter">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff6a00]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff6a00]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={clutchLogo} alt="Clutch" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold tracking-tight text-white">CLUTCH</h2>
        </Link>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#262626] text-sm font-medium text-slate-300 hover:text-white hover:border-[#ff6a00]/50 transition-colors duration-200">
          <span className="material-symbols-outlined text-[18px]">support_agent</span>
          <span>Contact Support</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full py-12">
        <div className="w-full max-w-[480px] flex flex-col">
          {/* Role Selection Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(Object.entries(ROLE_CONFIG) as [LoginRole, typeof ROLE_CONFIG.COACH][]).map(([role, config]) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  selectedRole === role
                    ? 'bg-[#1a1a1a] border-[#ff6a00]/60 shadow-[0_0_15px_rgba(255,106,0,0.15)]'
                    : 'bg-[#121212]/60 border-[#262626] hover:border-[#404040]'
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${selectedRole === role ? config.color : 'text-slate-500'}`}>
                  {config.icon}
                </span>
                <span className={`text-xs font-medium ${selectedRole === role ? 'text-white' : 'text-slate-400'}`}>
                  {config.label}
                </span>
              </button>
            ))}
          </div>

          {/* Login Card */}
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
                {ROLE_CONFIG[selectedRole].label} Login
              </h1>
              <p className="text-slate-400 text-sm">{ROLE_CONFIG[selectedRole].description}</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block" htmlFor="email">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff6a00] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white placeholder-slate-600 focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] transition-all duration-200 outline-none text-base font-sans"
                    id="email"
                    placeholder="coach@clutch.gg"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff6a00] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white placeholder-slate-600 focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] transition-all duration-200 outline-none text-base font-sans"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="mt-2 w-full h-12 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 pt-5 border-t border-[#262626]">
              <p className="text-slate-500 text-xs text-center mb-3">Demo credentials</p>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { role: 'Coach', email: 'coach@clutch.gg' },
                  { role: 'Scout', email: 'scout@clutch.gg' },
                  { role: 'Athlete', email: 'athlete@clutch.gg' },
                ].map(({ role, email: demoEmail }) => (
                  <button
                    key={role}
                    type="button"
                    className="p-2 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:border-[#ff6a00]/40 text-slate-400 hover:text-white transition-all text-center"
                    onClick={() => { setEmail(demoEmail); setPassword('clutch2026'); }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-600">
            <a className="hover:text-slate-400 transition-colors" href="#">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-slate-700 my-auto" />
            <a className="hover:text-slate-400 transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </main>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
    </div>
  );
};

export default LoginPage;
