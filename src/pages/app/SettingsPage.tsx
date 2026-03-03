import { Link, useLocation } from "react-router-dom";
import AppSidebarHeader from "@/components/AppSidebarHeader";

const sidebarLinks = [
  { to: "/app/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/app/leaderboard", icon: "emoji_events", label: "Leaderboard" },
  { to: "/app/upload", icon: "cloud_upload", label: "Upload Matches" },
  { to: "/app/analytics", icon: "pie_chart", label: "Analytics" },
  { to: "/app/roster", icon: "group", label: "Roster" },
  { to: "/app/settings", icon: "settings", label: "Settings" },
];

const staffMembers = [
  {
    name: "Jon Scheyer",
    initials: "JD",
    initialsColor: "bg-indigo-600",
    role: "Head Coach",
    badge: "Admin",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    status: "Active",
    statusColor: "text-green-400",
  },
  {
    name: "Chris Carrawell",
    initials: "CW",
    initialsColor: "bg-teal-600",
    role: "Assistant Coach",
    badge: "Editor",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    status: "Active",
    statusColor: "text-green-400",
  },
  {
    name: "Mike Johnson",
    initials: "MJ",
    initialsColor: "bg-orange-600",
    role: "Video Coordinator",
    badge: "Viewer",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    status: "Pending",
    statusColor: "text-yellow-400",
  },
];

const PROFILE_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBI_XMOlbeKE9ViIcV1G_MM7xOLW-ZwdtZJ-x3Wu-_1Hmc5cQBR9tZqiLBK_SZRgZHSGr-6ISwccQ_2ogUzEKApGS-U1EeQS9NzfEHkcxl399Cx7I-sk0VrEfclToGGDNXpe53Y6bCD6YfmLGLWgTsgZa8miy-QuAbxNpTmie5GnUb9VOS6y2Acf7XwwGnzn6DBHyXEKugL6tdBIwZoeGaFFrpsZ7GZeI8xl1hW_PMlluc3jD75RLz_AC96IL1gM3UUSWnQCAvXWdUG";

const LOGO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBJeJr8XiCnMt5SEGmErMW3XapWuhfhYkywgTvufE5DpO-wW8BEc_tCjqMaGB6hJMKdXVpoTLjGGVHVbq9mLBPCjf3ARA1fKHn_PrKtxttsZiGWvlyqrKZ5FL5Ax4m9UpPylKgZxrtP76zYjK7KNTfTzVaUF5ANiNpym4tF5rKhWpapXg4L7WjC-n2KeWPJqNoiiqYsuaxH5aR9X35EI7IjAWx_TAPEFXwqWoVARA_LcIIOIx0Fw61uFMgAHbhOoHo1PucYGFXLLC";

const SettingsPage = () => {
  const location = useLocation();

  return (
    <div className="bg-[#0a0a0a] font-display text-white min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] border-r border-[#262626] flex-col hidden md:flex h-screen fixed top-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <AppSidebarHeader />
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#1f1f1f]"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#262626] space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#ff8c40] flex items-center justify-center text-sm font-bold text-white shrink-0">
              CK
            </div>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-sm font-semibold text-white truncate">Coach K</span>
              <span className="text-xs text-[#a3a3a3] truncate">Duke University</span>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#262626] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Organization Settings</h1>
            <p className="text-sm text-[#a3a3a3]">Duke University</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#1f1f1f] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6a00] rounded-full" />
            </button>
            <div
              className="w-9 h-9 rounded-full bg-cover bg-center border border-[#262626]"
              style={{ backgroundImage: `url("${PROFILE_IMAGE_URL}")` }}
            />
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl w-full mx-auto">
          {/* Profile & Branding */}
          <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Profile &amp; Branding</h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-full bg-cover bg-center border-2 border-[#333333]"
                  style={{ backgroundImage: `url("${LOGO_IMAGE_URL}")` }}
                />
                <button className="text-xs text-[#ff6a00] hover:text-[#ff8c40] font-medium transition-colors">
                  Upload Logo
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <label htmlFor="school-name" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                    School Name
                  </label>
                  <input
                    id="school-name"
                    type="text"
                    defaultValue="Duke University"
                    className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white placeholder-[#666] focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="conference" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                    Conference
                  </label>
                  <select
                    id="conference"
                    defaultValue="ACC"
                    className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all text-sm appearance-none"
                  >
                    <option value="ACC">ACC</option>
                    <option value="SEC">SEC</option>
                    <option value="Big12">Big 12</option>
                    <option value="Pac-12">Pac-12</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="team-bio" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                    Team Bio
                  </label>
                  <textarea
                    id="team-bio"
                    rows={3}
                    defaultValue="The Brotherhood."
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

          {/* Team Management */}
          <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Team Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ff6a00]/30 text-[#ff6a00] hover:bg-[#ff6a00]/10 text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Invite Staff
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#262626] text-left">
                    <th className="pb-3 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">Member</th>
                    <th className="pb-3 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">Role</th>
                    <th className="pb-3 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">Permission</th>
                    <th className="pb-3 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {staffMembers.map((member) => (
                    <tr key={member.name} className="hover:bg-[#1f1f1f]/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${member.initialsColor} flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {member.initials}
                          </div>
                          <span className="text-sm font-medium text-white">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-[#a3a3a3]">{member.role}</td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${member.badgeColor}`}
                        >
                          {member.badge}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`text-sm font-medium ${member.statusColor}`}>{member.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-[#a3a3a3] hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Notifications & Security Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notifications & Privacy */}
            <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Notifications &amp; Privacy</h2>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">AI Processing Alerts</p>
                    <p className="text-xs text-[#a3a3a3] mt-0.5">Get notified when AI finishes analyzing footage</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6a00]" />
                  </label>
                </div>

                <div className="border-t border-[#262626]" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Scout View Visibility</p>
                    <p className="text-xs text-[#a3a3a3] mt-0.5">Allow other coaches to view your scouting reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6a00]" />
                  </label>
                </div>

                <div className="border-t border-[#262626]" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Weekly Report Delivery</p>
                    <p className="text-xs text-[#a3a3a3] mt-0.5">Receive weekly performance summary via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6a00]" />
                  </label>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="bg-[#151515] border border-[#262626] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Security</h2>

              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value="coach.k@duke.edu"
                    readOnly
                    className="w-full h-11 px-4 rounded-lg bg-[#0a0a0a] border border-[#333333] text-[#a3a3a3] outline-none text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
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

            {/* Logout */}
            <section className="border border-[#262626] rounded-xl p-6 bg-[#0a0a0a]">
              <h3 className="text-sm font-semibold text-white mb-2">Account</h3>
              <p className="text-xs text-[#a3a3a3] mb-4">Sign out of your account. You will return to the home page.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </Link>
            </section>
          </div>

          {/* Footer */}
          <footer className="border-t border-[#262626] pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a3a3a3]">
            <p>&copy; 2025 Clutch. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
