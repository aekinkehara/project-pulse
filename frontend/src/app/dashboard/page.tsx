'use client';

import { useEffect, useState } from 'react';
import axiosClient from '../../lib/axios';
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  Smartphone,
  Palette,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axiosClient.get('/me').then((res) => setUser(res.data)).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* AREA KIRI & TENGAH */}
      <div className="lg:col-span-2 space-y-6">
        {/* Greeting Section */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Good morning, {user?.name || 'Developer'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here is what's happening with your workspace today.
          </p>
        </div>

        {/* BENTO GRID STATS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Pastel Kuning */}
          <div className="bg-[#F8E7A2] p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider">
                Active Projects
              </span>
              <FolderKanban className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-4xl font-black text-amber-950">12</h3>
            <p className="text-xs text-amber-800 font-medium">4 due this week</p>
          </div>

          {/* Card 2: Pastel Pink */}
          <div className="bg-[#F6C6EA] p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-fuchsia-900">
              <span className="text-xs font-bold uppercase tracking-wider">
                Hours Tracked
              </span>
              <Clock className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-4xl font-black text-fuchsia-950">38.5 hrs</h3>
            <p className="text-xs text-fuchsia-800 font-medium">+12% from last week</p>
          </div>

          {/* Card 3: Pastel Hijau */}
          <div className="bg-[#D3E4CD] p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-emerald-900">
              <span className="text-xs font-bold uppercase tracking-wider">
                Tasks Completed
              </span>
              <CheckCircle2 className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-4xl font-black text-emerald-950">24 / 30</h3>
            <p className="text-xs text-emerald-800 font-medium">80% progress rate</p>
          </div>

          {/* Card 4: Pastel Biru */}
          <div className="bg-[#ADC4CE] p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider">
                Active Clients
              </span>
              <Users className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-4xl font-black text-slate-950">8</h3>
            <p className="text-xs text-slate-800 font-medium">2 new clients this month</p>
          </div>
        </div>

        {/* RECENT PROJECTS LIST */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
            <button className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1">
              Show all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100/80 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center font-bold text-pink-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">E-Commerce Mobile App</h4>
                  <p className="text-xs text-gray-500">Client: PT Digital Nusantara</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                In Progress
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100/80 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-600">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Brand Redesign</h4>
                  <p className="text-xs text-gray-500">Client: Studio Pixel</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL KANAN */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-base">Timeline Today</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
              May 2026
            </span>
          </div>

          {/* Timeline Schedule Items */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border-l-4 border-pink-400 space-y-1">
              <span className="text-[11px] font-bold text-pink-600 uppercase">09:00 - 10:30 AM</span>
              <h5 className="font-bold text-sm text-gray-800">Client Kickoff Meeting</h5>
              <p className="text-xs text-gray-500">Google Meet - E-Commerce App</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border-l-4 border-amber-400 space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase">11:00 - 01:00 PM</span>
              <h5 className="font-bold text-sm text-gray-800">UI/UX Wireframing</h5>
              <p className="text-xs text-gray-500">Figma Design System</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border-l-4 border-emerald-400 space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">02:30 - 04:00 PM</span>
              <h5 className="font-bold text-sm text-gray-800">API Integration</h5>
              <p className="text-xs text-gray-500">Laravel Sanctum & Next.js</p>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <button className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add New Event / Task
        </button>
      </div>
    </div>
  );
}