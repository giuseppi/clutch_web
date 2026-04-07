import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/app/AppLayout";
import PageTransition from "@/components/app/PageTransition";

const SettingsPage = () => {
  const { user } = useAuth();
  const teamName = user?.team?.name || "Your Team";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`;

  return (
    <AppLayout>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#262626] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Organization Settings</h1>
          <p className="text-sm text-[#a3a3a3]">{teamName}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#1f1f1f] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="size-9 rounded-full bg-[#ff6a00]/20 border border-[#262626] flex items-center justify-center text-[#ff6a00] font-bold text-sm">
            {initials}
          </div>
        </div>
      </header>

      <PageTransition className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl w-full mx-auto">
        {/* Profile & Branding */}
        <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Profile &amp; Branding</h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-[#ff6a00]/20 border-2 border-[#333333] flex items-center justify-center text-[#ff6a00] text-2xl font-bold">
                {user?.team?.abbreviation?.substring(0, 3) || initials}
              </div>
              <button className="text-xs text-[#ff6a00] hover:text-[#ff8c40] font-medium transition-colors">
                Upload Logo
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-5">
              <div>
                <label htmlFor="school-name" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                  School / Organization Name
                </label>
                <input
                  id="school-name"
                  type="text"
                  defaultValue={teamName}
                  className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white placeholder-[#666] focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                  Level / Classification
                </label>
                <select
                  id="level"
                  defaultValue={user?.team?.level || ""}
                  className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm appearance-none"
                >
                  <option value="HS_1A">High School - 1A</option>
                  <option value="HS_2A">High School - 2A</option>
                  <option value="HS_3A">High School - 3A</option>
                  <option value="HS_4A">High School - 4A</option>
                  <option value="HS_5A">High School - 5A</option>
                  <option value="D1">College - Division I</option>
                  <option value="D2">College - Division II</option>
                  <option value="D3">College - Division III</option>
                </select>
              </div>

              <div>
                <label htmlFor="team-bio" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                  Team Bio
                </label>
                <textarea
                  id="team-bio"
                  rows={3}
                  placeholder="Enter a brief description of your team..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white placeholder-[#666] focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Account</h2>
          <div className="flex flex-col gap-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-1.5">Full Name</label>
              <input
                type="text"
                defaultValue={displayName}
                className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-[#a3a3a3] outline-none text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-1.5">Role</label>
              <div className="h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-[#a3a3a3] flex items-center text-sm">
                {user?.role === "COACH" ? "Coach" : user?.role === "SCOUT" ? "Scout / Recruiter" : "Athlete"}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Notifications &amp; Privacy</h2>
            <div className="flex flex-col gap-5">
              {[
                { title: "AI Processing Alerts", desc: "Get notified when AI finishes analyzing footage", defaultChecked: true },
                { title: "Scout View Visibility", desc: "Allow scouts to view your team's player data", defaultChecked: false },
                { title: "Weekly Report Delivery", desc: "Receive weekly performance summary via email", defaultChecked: true },
              ].map((item) => (
                <div key={item.title}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-[#a3a3a3] mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6a00]" />
                    </label>
                  </div>
                  <div className="border-t border-[#262626] mt-5" />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Security</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-[#a3a3a3] mb-1.5">Password</label>
                <input
                  type="password"
                  value="••••••••••••"
                  readOnly
                  className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-[#a3a3a3] outline-none text-sm cursor-not-allowed"
                />
              </div>
              <div className="mt-1 p-4 rounded-lg bg-[#0a0a0a] border border-[#333333]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1f1f1f] border border-[#333333] flex items-center justify-center text-[#ff6a00]">
                      <span className="material-symbols-outlined">security</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-[#a3a3a3] mt-0.5">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-[#ff6a00]/30 text-[#ff6a00] hover:bg-[#ff6a00]/10 text-xs font-semibold transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#262626] pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a3a3a3]">
          <p>&copy; 2026 Clutch. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </footer>
      </PageTransition>
    </AppLayout>
  );
};

export default SettingsPage;
