'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  LogOut,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Navigasi Khusus Web Admin (PM)
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Clients', href: '/dashboard/clients', icon: Users },
    { label: 'Time Logs', href: '/dashboard/time-logs', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex font-sans text-gray-800 p-3 gap-6">
      {/* SIDEBAR ADMIN */}
      <aside className="w-64 bg-[#121212] text-white p-6 flex flex-col justify-between rounded-3xl shadow-xl shrink-0">
        <div>
          {/* LOGO PULSE (PUNYA PADDING TOP DARI SIDEBAR P-6) */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center font-bold text-black text-base shadow-sm">
              P
            </div>
            <span className="text-xl font-extrabold tracking-tight">pulse.</span>
          </div>

          <nav className="space-y-1.5">
            <p className="text-[11px] text-gray-500 font-bold px-3 mb-3 uppercase tracking-wider">
              Admin Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-zinc-800 text-pink-300 shadow-sm font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3.5 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 font-medium text-sm transition flex items-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - DIBERI pt-6 AGAR SEJAJAR PRESISI DENGAN LOGO PULSE */}
      <main className="flex-1 overflow-y-auto pt-6 pr-1">
        {children}
      </main>
    </div>
  );
}