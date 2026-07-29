'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, CheckCircle } from 'lucide-react';
import axiosClient from '../lib/axios';

interface UserData {
  name: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    axiosClient.get('/me').then((res) => setUser(res.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-100">
      <h2 className="font-extrabold text-xl text-gray-800">Project Pulse</h2>

      <div className="flex items-center gap-4 relative">
        {/* Bell Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-sm text-gray-800">Notifications</h4>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-50 rounded-xl flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">System Ready</p>
                    <p className="text-gray-400 text-[10px]">Your workspace is fully connected.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-gray-50 transition"
          >
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-bold text-sm text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}