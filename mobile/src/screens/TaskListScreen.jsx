import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [logText, setLogText] = useState('');

  const fetchTasks = async () => {
    const token = localStorage.getItem('pulse_token');
    const savedUser = localStorage.getItem('pulse_db_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok && result.success) {
        const allTasks = result.data || [];
        
        const myTasks = allTasks
          .filter(t => currentUser && (currentUser.role === 'admin' || t.assignee_id === currentUser.id))
          .map(t => ({
            ...t,
            isRead: localStorage.getItem(`task_read_${t.id}`) === 'true' || t.status !== 'todo'
          }));

        setTasks(myTasks);
      }
    } catch (error) {
      console.error('Koneksi database gagal:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'done') return t.status === 'done';
    if (filterStatus === 'active') return t.status !== 'done';
    return true;
  });

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    if (!task.isRead) {
      localStorage.setItem(`task_read_${task.id}`, 'true');
      setTasks(tasks.map(t => t.id === task.id ? { ...t, isRead: true } : t));
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('pulse_token');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        fetchTasks();
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (error) {
      console.error('Gagal mengupdate status:', error);
    }
  };

  const handleAddLog = async () => {
    if (!logText.trim()) return;
    const token = localStorage.getItem('pulse_token');
    const updatedDesc = (selectedTask.description ? selectedTask.description + "\n" : "") + `[Log: ${logText}]`;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: updatedDesc })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSelectedTask({ ...selectedTask, description: updatedDesc });
        setLogText('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Gagal menyimpan log:', error);
    }
  };

  if (selectedTask) {
    return (
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
        <button 
          onClick={() => setSelectedTask(null)} 
          className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-xl transition hover:bg-neutral-200"
        >
          ← Kembali
        </button>
        <div>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-semibold uppercase tracking-wider">
            {selectedTask.project?.name || 'Project Pulse'}
          </span>
          <h2 className="text-base font-bold text-neutral-900 mt-2">{selectedTask.title}</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Deadline: {selectedTask.deadline}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Status Pengerjaan</label>
          <select 
            value={selectedTask.status} 
            onChange={(e) => handleUpdateStatus(selectedTask.id, e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-semibold cursor-pointer"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="border-t border-neutral-100 pt-3 space-y-2">
          <label className="block text-xs font-semibold text-neutral-700 uppercase">Tambah Catatan / Log Waktu</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Contoh: Selesai 2 jam (Fix bug)" 
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none"
            />
            <button 
              onClick={handleAddLog}
              className="bg-[#111111] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow hover:bg-black"
            >
              Simpan
            </button>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-700 whitespace-pre-line max-h-28 overflow-y-auto mt-2">
            {selectedTask.description || 'Belum ada catatan progres.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-4 bg-neutral-200/80 p-1.5 rounded-2xl">
        <button onClick={() => setFilterStatus('all')} className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'all' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600'}`}>Semua</button>
        <button onClick={() => setFilterStatus('active')} className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'active' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600'}`}>Aktif</button>
        <button onClick={() => setFilterStatus('done')} className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'done' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600'}`}>Selesai</button>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs font-semibold text-neutral-500">Tidak ada task untuk akun ini.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => handleSelectTask(task)}
              className={`bg-white p-4 rounded-2xl shadow-sm border transition cursor-pointer relative group ${
                !task.isRead ? 'border-pink-500 bg-pink-50/20' : 'border-neutral-200 hover:border-neutral-900'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-semibold uppercase">
                  {task.project?.name || 'Project Pulse'}
                </span>

                <div className="flex items-center gap-1.5">
                  {!task.isRead && (
                    <span className="flex items-center gap-1 bg-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                      <Sparkles size={10} /> Baru
                    </span>
                  )}
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase bg-neutral-100 text-neutral-800">
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-pink-600 transition">{task.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1.5">Deadline: {task.deadline}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}