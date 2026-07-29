'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from '../../lib/axios';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Users,
  Plus,
  ArrowRight,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  status: string;
  client?: { name: string };
}

interface Task {
  id: number;
  title: string;
  status: string;
  deadline?: string;
  assigned_to?: number;
  assignee?: { id: number; name: string };
}

interface TimeLog {
  id: number;
  hours: number;
  date: string;
  notes?: string;
  description?: string;
  task?: { title: string };
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE UNTUK GREETING REAL-TIME 24 JAM
  const [greeting, setGreeting] = useState<string>('Good morning');

  useEffect(() => {
    // 1. LOGIKA GREETING REAL-TIME 24 JAM
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening'); // Jam 18:00 - 03:59
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Cek ulang tiap 1 menit

    // 2. FETCH DATA DASHBOARD
    async function fetchDashboardData() {
      try {
        setLoading(true);

        axiosClient.get('/me').then((res) => setUser(res.data)).catch(() => {});

        const [resProjects, resLogs, resTasks] = await Promise.all([
          axiosClient.get('/projects').catch(() => ({ data: { data: [] } })),
          axiosClient.get('/time-logs').catch(() => ({ data: { data: [] } })),
          axiosClient.get('/tasks').catch(() => ({ data: { data: [] } })),
        ]);

        const projectData = resProjects.data?.data || resProjects.data || [];
        setProjects(Array.isArray(projectData) ? projectData : []);

        const logData = resLogs.data?.data || resLogs.data || [];
        setTimeLogs(Array.isArray(logData) ? logData : []);

        const taskData = resTasks.data?.data || resTasks.data || [];
        setTasks(Array.isArray(taskData) ? taskData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    return () => clearInterval(interval);
  }, []);

  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;

  const completedTasksCount = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'done'
  ).length;

  const overdueTasksCount = tasks.filter((t) => {
    if (!t.deadline) return false;
    const isFinished = t.status === 'completed' || t.status === 'done';
    const isPastDeadline = new Date(t.deadline) < new Date();
    return isPastDeadline && !isFinished;
  }).length;

  // Menghitung Workload per Anggota (distribusi task per member)
  const workloadMap: { [key: string]: { total: number; done: number } } = {};
  tasks.forEach((task) => {
    const memberName = task.assignee?.name || 'Unassigned';
    if (!workloadMap[memberName]) {
      workloadMap[memberName] = { total: 0, done: 0 };
    }
    workloadMap[memberName].total += 1;
    if (task.status === 'completed' || task.status === 'done') {
      workloadMap[memberName].done += 1;
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left / Main Column */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          {/* TEKS GREETING OTOMATIS BERUBAH REAL-TIME */}
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {greeting}, {user?.name || 'Admin PM'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here is what's happening with your workspace today.
          </p>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1: Proyek Aktif */}
          <div className="bg-[#F8E7A2] p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-amber-900">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Proyek Aktif
              </span>
              <FolderKanban className="w-4 h-4 opacity-80" />
            </div>
            <h3 className="text-3xl font-black text-amber-950">
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : activeProjectsCount}
            </h3>
            <p className="text-[11px] text-amber-800 font-medium">
              Dari {projects.length} total proyek
            </p>
          </div>

          {/* Card 2: Task Overdue */}
          <div className="bg-[#FFC5C5] p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-red-900">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Task Overdue
              </span>
              <AlertTriangle className="w-4 h-4 opacity-80" />
            </div>
            <h3 className="text-3xl font-black text-red-950">
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : overdueTasksCount}
            </h3>
            <p className="text-[11px] text-red-800 font-medium">Lewat deadline</p>
          </div>

          {/* Card 3: Tasks Completed */}
          <div className="bg-[#D3E4CD] p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-emerald-900">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Task Selesai
              </span>
              <CheckCircle2 className="w-4 h-4 opacity-80" />
            </div>
            <h3 className="text-3xl font-black text-emerald-950">
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : `${completedTasksCount}/${tasks.length}`}
            </h3>
            <p className="text-[11px] text-emerald-800 font-medium">
              {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% selesai
            </p>
          </div>
        </div>

        {/* Workload per Anggota Widget */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-bold text-gray-900">Workload per Anggota</h2>
            </div>
            <button
              onClick={() => router.push('/dashboard/tasks')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition"
            >
              Kelola Task <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Loading workload...</div>
          ) : Object.keys(workloadMap).length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">Belum ada task di-assign ke anggota.</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(workloadMap).map(([name, data]) => {
                const percentage = Math.round((data.done / data.total) * 100);
                return (
                  <div key={name} className="p-3.5 bg-gray-50 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800">{name}</span>
                      <span className="font-medium text-gray-500">
                        {data.done}/{data.total} Task selesai ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Projects</h2>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition"
            >
              Show all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">Belum ada proyek terdaftar.</div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center font-bold text-pink-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{project.name}</h4>
                      <p className="text-xs text-gray-500">
                        Client: {project.client?.name || 'Internal'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 font-bold text-xs rounded-full capitalize ${
                      project.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : project.status === 'review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-pink-100 text-pink-800'
                    }`}
                  >
                    {(project.status || 'in_progress').replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Activity Logs */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-base">Timeline / Activity Logs</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
              Realtime
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">Loading timeline...</div>
            ) : timeLogs.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">Belum ada activity log.</div>
            ) : (
              timeLogs.slice(0, 5).map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-4 bg-gray-50 rounded-2xl border-l-4 border-pink-400 space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-pink-600 uppercase">
                      {log.date || 'Today'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      {log.hours} hrs
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-gray-800">
                    {log.task?.title || 'Work Session'}
                  </h5>
                  <p className="text-xs text-gray-500 truncate">
                    {log.description || log.notes || 'Time entry logged'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard/time-logs')}
          className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add / Manage Time Logs
        </button>
      </div>
    </div>
  );
}