'use client';

import { useEffect, useState } from 'react';
import axiosClient from '../../../lib/axios';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  UserCheck,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
}

interface Project {
  id: number;
  client_id?: number;
  name: string;
  description?: string;
  status: string;
  deadline?: string;
  client?: Client;
}

interface SuggestedTask {
  title: string;
  description: string;
  category: string;
  estimated_hours: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // State Form
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    description: '',
    status: 'in_progress',
    deadline: '',
  });

  // State khusus AI Task Breakdown
  const [clientBrief, setClientBrief] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiTasks, setAiTasks] = useState<SuggestedTask[]>([]);

  const fetchProjectsAndClients = async () => {
    try {
      setLoading(true);
      const [resProjects, resClients] = await Promise.all([
        axiosClient.get('/projects').catch(() => ({ data: { data: [] } })),
        axiosClient.get('/clients').catch(() => ({ data: { data: [] } })),
      ]);

      const projectData = resProjects.data?.data || resProjects.data || [];
      const clientData = resClients.data?.data || resClients.data || [];

      setProjects(Array.isArray(projectData) ? projectData : []);
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndClients();
  }, []);

  const handleOpenModal = (project: Project | null = null) => {
    // Reset AI state setiap kali modal dibuka
    setClientBrief('');
    setAiTasks([]);

    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || '',
        client_id: project.client_id ? String(project.client_id) : '',
        description: project.description || '',
        status: project.status || 'in_progress',
        deadline: project.deadline ? project.deadline.split('T')[0] : '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        client_id: '',
        description: '',
        status: 'in_progress',
        deadline: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setClientBrief('');
    setAiTasks([]);
  };

  // 1. Panggil Endpoint AI Breakdown
  const handleGenerateAi = async () => {
    if (!clientBrief.trim()) {
      alert('Isi Client Brief terlebih dahulu!');
      return;
    }

    try {
      setLoadingAi(true);
      const res = await axiosClient.post('/projects/generate-ai-tasks', {
        client_brief: clientBrief,
      });

      if (res.data?.suggested_tasks) {
        setAiTasks(res.data.suggested_tasks);
      } else {
        alert('Gagal mendapatkan saran task dari AI.');
      }
    } catch (err) {
      console.error('Error generating AI tasks:', err);
      alert('Terjadi kesalahan saat menghubungi API AI.');
    } finally {
      setLoadingAi(false);
    }
  };

  // 2. Hapus Task dari Saran AI
  const handleRemoveAiTask = (index: number) => {
    setAiTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. Submit Proyek + Menyimpan Saran Task AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        client_id: formData.client_id ? Number(formData.client_id) : null,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline || null,
        tasks: aiTasks, // Mengirimkan task hasil AI ke backend
      };

      if (editingProject) {
        await axiosClient.put(`/projects/${editingProject.id}`, payload);
      } else {
        await axiosClient.post('/projects', payload);
      }

      handleCloseModal();
      fetchProjectsAndClients();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah kamu yakin ingin menghapus proyek ini?')) return;
    try {
      await axiosClient.delete(`/projects/${id}`);
      fetchProjectsAndClients();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola semua daftar proyek dan status pengerjaannya.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 flex justify-center items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400 text-sm">
          Belum ada proyek terdaftar. Silakan tambah proyek baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-gray-200 transition"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 font-bold">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3 h-3" />
                        {project.client?.name || 'Client Internal'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full capitalize ${
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

                {project.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'No deadline'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT PROJECT + FITUR AI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. E-Commerce Redesign"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Client
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) =>
                    setFormData({ ...formData, client_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Project Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Project details..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>

              {/* SECTION FITUR AI TASK BREAKDOWN (CUMA TAMPIL SAAT ADD PROJECT BARU) */}
              {!editingProject && (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      AI Task Breakdown
                    </label>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                      Optional
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={clientBrief}
                    onChange={(e) => setClientBrief(e.target.value)}
                    placeholder="Tempel teks brief dari klien di sini (misal: 'Buatkan landing page e-commerce lengkap dengan payment gateway')..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-pink-300 transition"
                  />

                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={loadingAi}
                    className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {loadingAi ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Tasks dengan AI
                  </button>

                  {/* DAFTAR SARAN TASK DARI AI */}
                  {aiTasks.length > 0 && (
                    <div className="space-y-2 mt-3 pt-2 border-t border-dashed border-gray-200">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Saran Task Hasil AI ({aiTasks.length})
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {aiTasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-pink-50/50 rounded-2xl flex items-center justify-between border border-pink-100 text-xs"
                          >
                            <div className="pr-2 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">
                                  {task.title}
                                </span>
                                <span className="px-1.5 py-0.5 bg-pink-200 text-pink-800 text-[9px] font-extrabold rounded-md uppercase">
                                  {task.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 line-clamp-1">
                                {task.description}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAiTask(idx)}
                              className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-black hover:bg-zinc-800 text-white transition shadow-sm"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}