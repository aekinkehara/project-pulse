'use client';

import { useEffect, useState } from 'react';
import axiosClient from '../../../lib/axios';
import {
  FolderKanban,
  Plus,
  Search,
  Trash2,
  Calendar,
  Building2,
  Loader2,
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  client_id?: number;
  client?: {
    name: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch data projects dari Laravel
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/projects');
      setProjects(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Handle Tambah Project Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axiosClient.post('/projects', {
        name,
        description,
        status,
      });

      // Reset Form & Close Modal
      setName('');
      setDescription('');
      setStatus('in_progress');
      setIsModalOpen(false);

      // Refresh Data List
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle Hapus Project
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;
    try {
      await axiosClient.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all ongoing client & internal projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-2xl text-sm transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Projects Grid List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">No projects yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click the "New Project" button above to create your first project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {project.name}
                  </h3>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-gray-300 hover:text-red-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                <span
                  className={`px-3 py-1 rounded-full uppercase tracking-wider text-[10px] ${
                    project.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : project.status === 'review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-pink-100 text-pink-800'
                  }`}
                >
                  {project.status.replace('_', ' ')}
                </span>

                <div className="flex items-center gap-1 text-gray-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{project.client?.name || 'Internal'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Project</h3>
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
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief details about the project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}