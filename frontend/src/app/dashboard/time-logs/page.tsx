'use client';

import { useEffect, useState } from 'react';
import axiosClient from '../../../lib/axios';
import {
  Clock,
  Plus,
  Trash2,
  Loader2,
  Calendar,
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  project?: {
    name: string;
  };
}

interface TimeLog {
  id: number;
  task_id: number;
  hours: number;
  date: string;
  description?: string;
  task?: Task;
  user?: {
    name: string;
  };
}

export default function TimeLogsPage() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskId, setTaskId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resLogs, resTasks] = await Promise.all([
        axiosClient.get('/time-logs'),
        axiosClient.get('/tasks').catch(() => ({ data: { data: [] } })),
      ]);
      setLogs(resLogs.data.data || resLogs.data);
      setTasks(resTasks.data.data || resTasks.data || []);
    } catch (err) {
      console.error('Failed to fetch time logs data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const totalHours = logs.reduce((acc, item) => acc + Number(item.hours || 0), 0);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        task_id: taskId ? Number(taskId) : undefined,
        hours: parseFloat(hours),
        date,
        description: description.trim() || undefined,
      };

      await axiosClient.post('/time-logs', payload);

      setTaskId('');
      setHours('');
      setDescription('');
      setIsModalOpen(false);

      fetchData();
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || 'Failed to record time log'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pencatatan waktu ini?')) return;
    try {
      await axiosClient.delete(`/time-logs/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete time log', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Time Logs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and record working hours spent on tasks & projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-2xl text-sm transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Log Hours
        </button>
      </div>

      <div className="bg-linear-to-r from-gray-900 via-zinc-800 to-black text-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
            Total Logged Work
          </p>
          <h2 className="text-3xl font-black">{totalHours.toFixed(1)} Hours</h2>
        </div>
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-pink-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading time logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">No work logged yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click the "Log Hours" button above to record your task duration.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-6">Task & Project</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">
                        {log.task?.title || 'General Work'}
                      </div>
                      <div className="text-gray-400 text-[11px] font-medium mt-0.5">
                        {log.task?.project?.name || 'Internal'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {log.description || '-'}
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{log.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-gray-900">
                      <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg">
                        {log.hours} hrs
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-gray-300 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Log Working Hours</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Select Task
                </label>
                <select
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="">-- Select Related Task --</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} {t.project ? `(${t.project.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Hours Spent
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 2.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description / Activity
                </label>
                <textarea
                  rows={3}
                  placeholder="What did you work on during this time?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-2xl text-sm transition flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}