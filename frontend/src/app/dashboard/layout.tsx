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
  Search,
  Bell,
  User,
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

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Time Logs', href: '/dashboard/time-logs', icon: Clock },
    { label: 'Clients', href: '/dashboard/clients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex font-sans text-gray-800 p-3 gap-4">
      {/* 1. DARK SIDEBAR */}
      <aside className="w-64 bg-[#121212] text-white p-6 flex flex-col justify-between rounded-3xl shadow-xl shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center font-bold text-black text-base shadow-sm">
              P
            </div>
            <span className="text-xl font-extrabold tracking-tight">pulse.</span>
          </div>

          {/* Navigasi Utama */}
          <nav className="space-y-1.5">
            <p className="text-[11px] text-gray-500 font-bold px-3 mb-3 uppercase tracking-wider">
              General
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

        {/* Action Logout */}
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

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Top Header */}
        <header className="flex justify-between items-center px-4 py-2">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search projects, tasks, or clients..."
              className="w-full bg-white border border-gray-200/80 shadow-sm pl-11 pr-4 py-2.5 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
          </div>

          {/* User Profile Quick Info */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-white border border-gray-200/80 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition text-gray-600">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-black text-white font-bold rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Content Children */}
        <main className="flex-1 overflow-y-auto pr-1">{children}</main>
      </div>
    </div>
  );
}