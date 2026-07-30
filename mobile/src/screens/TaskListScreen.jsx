import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  // Ambil data task dan filter khusus untuk user yang sedang login
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
        
        // Filter task hanya untuk assignee_id yang sama dengan ID user login (atau tampilkan semua jika admin)
        if (currentUser && currentUser.role !== 'admin') {
          const myTasks = allTasks.filter(t => t.assignee_id === currentUser.id);
          setTasks(myTasks);
        } else {
          setTasks(allTasks); // Admin bisa melihat semua task
        }
      }
    } catch (error) {
      console.error('Koneksi database gagal:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter task berdasarkan status (Semua, Aktif, Selesai)
  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'done') return t.status === 'done';
    if (filterStatus === 'active') return t.status !== 'done';
    return true;
  });

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
            <p className="text-xs font-semibold text-neutral-500">Tidak ada task yang di-assign untuk akun ini.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setSelectedTask(task)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 hover:border-neutral-900 cursor-pointer transition group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-semibold uppercase">
                  {task.project?.name || 'Project Pulse'}
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase bg-neutral-100 text-neutral-800">
                  {task.status?.replace('_', ' ')}
                </span>
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