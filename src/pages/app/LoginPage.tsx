import { Link } from "react-router-dom";
import clutchLogo from "@/assets/clutch_logo.png";

const LoginPage = () => {
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

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full py-12">
        <div className="w-full max-w-[440px] flex flex-col">
          {/* Glassmorphic Card */}
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10">
            {/* Card Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Enterprise Access</h1>
              <p className="text-slate-400 text-sm font-normal">Secure login for professional scouts and coaching staff.</p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block" htmlFor="email">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff6a00] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white placeholder-slate-600 focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] transition-all duration-200 outline-none text-base"
                    id="email"
                    placeholder="coach@team.com"
                    type="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                  <a className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff6a00] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white placeholder-slate-600 focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] transition-all duration-200 outline-none text-base"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                  <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-3 py-1">
                <input className="w-4 h-4 rounded bg-[#1a1a1a] border-[#262626] text-[#ff6a00] focus:ring-offset-0 focus:ring-[#ff6a00]/50 cursor-pointer" id="remember" type="checkbox" />
                <label className="text-sm text-slate-400 select-none cursor-pointer" htmlFor="remember">Keep me logged in for 30 days</label>
              </div>

              {/* Submit Button */}
              <button
                className="mt-2 w-full h-12 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
                type="button"
                onClick={() => window.location.href = '/app/dashboard'}
              >
                <span>Sign In to Dashboard</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-[#262626] text-center">
              <p className="text-slate-500 text-sm">
                New organization?
                <a className="text-[#ff6a00] hover:text-orange-400 font-medium ml-1 transition-colors" href="#">Request Coach Access</a>
              </p>
            </div>
          </div>

          {/* Footer Compliance */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-600">
            <a className="hover:text-slate-400 transition-colors" href="#">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-slate-700 my-auto" />
            <a className="hover:text-slate-400 transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </main>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
    </div>
  );
};

export default LoginPage;
