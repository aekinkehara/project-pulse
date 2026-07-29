import React, { useState } from 'react';
import { LogOut, FileText, Clock, CheckCircle2, Bell, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeNav, setActiveNav] = useState('tasks'); // 'tasks' | 'notifications'
  const [filterStatus, setFilterStatus] = useState('all');

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implementasi UI Dashboard', project: 'Project Alpha', status: 'todo', deadline: '2026-07-30', logs: [] },
    { id: 2, title: 'Fix API Endpoint Login', project: 'Project Beta', status: 'in_progress', deadline: '2026-07-31', logs: ['Kerja 2 jam: setup controller'] },
    { id: 3, title: 'Optimasi Query Database', project: 'Project Alpha', status: 'review', deadline: '2026-08-01', logs: ['Indexing tabel user'] },
    { id: 4, title: 'Setup Dockerfile', project: 'Project Gamma', status: 'done', deadline: '2026-07-28', logs: ['Selesai build container'] },
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Deadline Mendekat (H-1)', desc: 'Task "Fix API Endpoint Login" jatuh tempo besok!', time: '10 min ago' },
    { id: 2, title: 'Task Baru Ditugaskan', desc: 'PM menambahkan task baru pada Project Alpha.', time: '2 jam lalu' }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [newLog, setNewLog] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(email && password) setIsLoggedIn(true);
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if(selectedTask && selectedTask.id === id) {
      setSelectedTask({...selectedTask, status: newStatus});
    }
  };

  const addTimeLog = (id) => {
    if(!newLog) return;
    setTasks(tasks.map(t => {
      if(t.id === id) {
        const updatedLogs = [...t.logs, newLog];
        const updatedTask = { ...t, logs: updatedLogs };
        setSelectedTask(updatedTask);
        return updatedTask;
      }
      return t;
    }));
    setNewLog('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-neutral-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-[#111111] text-white w-12 h-12 rounded-2xl font-bold text-xl mb-3 shadow">p</div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">pulse<span className="text-pink-500">.</span></h1>
            <p className="text-xs text-neutral-500 mt-1">Mobile Member Workspace (JWT Auth)</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm text-neutral-800"
                placeholder="member@pulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm text-neutral-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl font-semibold shadow-lg transition">
              Login Member
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'done') return t.status === 'done';
    if (filterStatus === 'active') return t.status !== 'done';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Frame HP Responsif */}
      <div className="w-full sm:max-w-md h-screen sm:h-[844px] bg-[#f8f6f0] flex flex-col sm:rounded-[40px] shadow-2xl relative overflow-hidden border border-neutral-800">
        
        {/* Header Dinamis */}
        <header className="bg-[#111111] text-white px-5 py-4 flex justify-between items-center shadow shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-pink-500 text-white w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs">P</div>
            <div>
              <h1 className="font-semibold text-sm tracking-wide">pulse<span className="text-pink-500">.</span> mobile</h1>
              <p className="text-[10px] text-neutral-400">Developer Portal</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-xl text-neutral-300 transition" title="Logout">
            <LogOut size={16} />
          </button>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {selectedTask ? (
            /* DETAIL TASK VIEW */
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200 space-y-4">
              <button 
                onClick={() => setSelectedTask(null)} 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black bg-neutral-100 px-3 py-1.5 rounded-xl transition"
              >
                <ArrowLeft size={14} /> Kembali ke Daftar Task
              </button>
              
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-semibold tracking-wider uppercase">{selectedTask.project}</span>
                <h2 className="text-base font-bold text-neutral-900 mt-2">{selectedTask.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Deadline: {selectedTask.deadline}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Status Pengerjaan</label>
                <select 
                  value={selectedTask.status} 
                  onChange={(e) => updateStatus(selectedTask.id, e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:outline-none font-medium"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <h3 className="text-xs font-semibold text-neutral-700 uppercase mb-2">Log Waktu & Catatan Progres</h3>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  {selectedTask.logs.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">Belum ada catatan waktu kerja.</p>
                  ) : (
                    selectedTask.logs.map((log, index) => (
                      <div key={index} className="bg-neutral-50 p-2.5 rounded-xl text-xs border border-neutral-200 text-neutral-700 flex items-center gap-2">
                        <Clock size={14} className="text-pink-500 shrink-0" />
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Misal: Slicing UI 2 jam..." 
                    value={newLog}
                    onChange={(e) => setNewLog(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                  />
                  <button onClick={() => addTimeLog(selectedTask.id)} className="bg-[#111111] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow">
                    Catat
                  </button>
                </div>
              </div>
            </div>
          ) : activeNav === 'notifications' ? (
            /* NOTIFIKASI IN-APP VIEW */
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-2">Notifikasi In-App</h2>
              {notifications.map(notif => (
                <div key={notif.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                      <Bell size={12} /> {notif.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-neutral-700">{notif.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            /* TASK LIST VIEW */
            <div>
              {/* Filter Tabs */}
              <div className="flex gap-1.5 mb-4 bg-neutral-200/80 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'all' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600 hover:text-black'}`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setFilterStatus('active')}
                  className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'active' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600 hover:text-black'}`}
                >
                  Aktif
                </button>
                <button 
                  onClick={() => setFilterStatus('done')}
                  className={`flex-1 py-2 text-xs rounded-xl font-semibold transition ${filterStatus === 'done' ? 'bg-[#111111] text-white shadow' : 'text-neutral-600 hover:text-black'}`}
                >
                  Selesai
                </button>
              </div>

              {/* List Task Card */}
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 hover:border-neutral-900 cursor-pointer transition group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider">{task.project}</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                        task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                        task.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                        task.status === 'review' ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-pink-600 transition">{task.title}</h3>
                        <p className="text-xs text-neutral-400 mt-1.5">Deadline: {task.deadline}</p>
                      </div>
                      <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Nav Sesuai Standar Mobile & Kebutuhan In-App Notif */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-3 shadow-lg shrink-0 z-10">
          <button 
            onClick={() => { setActiveNav('tasks'); setSelectedTask(null); }} 
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${activeNav === 'tasks' ? 'text-pink-600 font-semibold' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <FileText size={18} />
            <span>Task Saya</span>
          </button>
          <button 
            onClick={() => { setActiveNav('notifications'); setSelectedTask(null); }} 
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${activeNav === 'notifications' ? 'text-pink-600 font-semibold' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            </div>
            <span>Notifikasi</span>
          </button>
        </nav>

      </div>
    </div>
  );
}