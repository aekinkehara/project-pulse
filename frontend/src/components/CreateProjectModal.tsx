'use client';

import { useState } from 'react';
import { Sparkles, X, Plus, Trash2, Loader2 } from 'lucide-react';
import axiosClient from '../lib/axios';

interface SuggestedTask {
  title: string;
  description: string;
  category: string;
  estimated_hours: number;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [brief, setBrief] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [tasks, setTasks] = useState<SuggestedTask[]>([]);

  if (!isOpen) return null;

  // 1. Panggil API AI Task Breakdown
  const handleGenerateAi = async () => {
    if (!brief) return alert('Isi brief klien terlebih dahulu!');
    try {
      setLoadingAi(true);
      const res = await axiosClient.post('/projects/generate-tasks', {
        client_brief: brief,
      });
      if (res.data.suggested_tasks) {
        setTasks(res.data.suggested_tasks);
      }
    } catch (err) {
      alert('Gagal generate task dari AI');
    } finally {
      setLoadingAi(false);
    }
  };

  // 2. Fungsi Hapus Task dari Hasil AI
  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Buat Proyek Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Input Brief Klien */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">Client Brief (Teks Bebas)</label>
          <textarea
            rows={4}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Contoh: Klien minta dibuatkan landing page e-commerce dengan sistem keranjang belanja..."
            className="w-full p-3 bg-gray-50 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={loadingAi}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition"
          >
            {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Tasks dengan AI
          </button>
        </div>

        {/* List Hasil Generate AI */}
        {tasks.length > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Saran Task (AI Breakdown)</h3>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{task.title}</span>
                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 font-semibold rounded-md text-[10px]">
                      {task.category}
                    </span>
                    <p className="text-gray-500 mt-1">{task.description}</p>
                  </div>
                  <button onClick={() => handleRemoveTask(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}