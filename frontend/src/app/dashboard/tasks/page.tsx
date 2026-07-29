'use client';

import { useEffect, useState } from 'react';
import axiosClient from '../../../lib/axios';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  User,
  FolderKanban,
  X,
  Loader2,
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  project_id?: number;
  assignee_id?: number;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  project?: Project;
  assignee?: Member;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    project_id: '',
    assignee_id: '',
    description: '',
    status: 'todo',
    deadline: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTasks, resProjects, resUsers] = await Promise.all([
        axiosClient.get('/tasks').catch(() => ({ data: { data: [] } })),
        axiosClient.get('/projects').catch(() => ({ data: { data: [] } })),
        axiosClient.get('/users').catch(() => ({ data: { data: [] } })),
      ]);

      const taskData = resTasks.data?.data || resTasks.data || [];
      const projectData = resProjects.data?.data || resProjects.data || [];
      const userData = resUsers.data?.data || resUsers.data || [];

      setTasks(Array.isArray(taskData) ? taskData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);
      setMembers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Error fetching tasks data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (task: Task | null = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || '',
        project_id: task.project_id ? String(task.project_id) : '',
        assignee_id: task.assignee_id ? String(task.assignee_id) : '',
        description: task.description || '',
        status: task.status || 'todo',
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        project_id: '',
        assignee_id: '',
        description: '',
        status: 'todo',
        deadline: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Disesuaikan persis dengan validasi di TaskController.php Laravel
      const payload: Record<string, any> = {
        title: formData.title,
        status: formData.status || 'todo',
      };

      if (formData.project_id) payload.project_id = Number(formData.project_id);
      if (formData.assignee_id) payload.assignee_id = Number(formData.assignee_id);
      if (formData.description) payload.description = formData.description;
      if (formData.deadline) payload.deadline = formData.deadline;

      if (editingTask) {
        await axiosClient.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await axiosClient.post('/tasks', payload);
      }

      handleCloseModal();
      fetchData();
    } catch (err: any) {
      console.error('Validation Error Details:', err.response?.data);

      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join('\n- ');
        alert(`Gagal menyimpan task:\n- ${errorMessages}`);
      } else {
        alert(
          err.response?.data?.message ||
            'Gagal menyimpan task. Periksa kembali inputan.'
        );
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah kamu yakin ingin menghapus task ini?')) return;
    try {
      await axiosClient.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Tasks
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola daftar tugas per proyek dan pembagian anggotanya.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 flex justify-center items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400 text-sm">
          Belum ada task terdaftar. Silakan tambah task baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-gray-200 transition"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 font-bold shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        {task.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <FolderKanban className="w-3 h-3" />
                        {task.project?.name || 'No Project'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full capitalize shrink-0 ${
                      task.status === 'done'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : task.status === 'review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {(task.status || 'todo').replace('_', ' ')}
                  </span>
                </div>

                {task.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'No deadline'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-1 pt-1">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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

      {/* MODAL FORM TAMBAH / EDIT TASK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingTask ? 'Edit Task' : 'Add New Task'}
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
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Design Landing Page Hero Section"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Project
                </label>
                <select
                  value={formData.project_id}
                  onChange={(e) =>
                    setFormData({ ...formData, project_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                >
                  <option value="">-- Select Project (Optional) --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Assignee (Member)
                </label>
                <select
                  value={formData.assignee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, assignee_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                >
                  <option value="">-- Select Member (Optional) --</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Deadline
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
                  placeholder="Task details and instructions..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}