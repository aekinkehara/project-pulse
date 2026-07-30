import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import TaskListScreen from './screens/TaskListScreen';
import NotificationScreen from './screens/NotificationScreen';
import { FileText, Bell } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeNav, setActiveNav] = useState('tasks');
  const [tasks, setTasks] = useState([]);

  // Cek sesi login saat aplikasi dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem('pulse_db_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      fetchTasks(parsedUser.id);
    }
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks`);
      if (response.ok) {
        const result = await response.json();
        // Filter task berdasarkan assignee_id user yang sedang login
        const myTasks = (result.data || []).filter(t => t.assignee_id === userId);
        setTasks(myTasks);
      }
    } catch (error) {
      console.error('Gagal mengambil task dari database:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_db_user');
    setCurrentUser(null);
    setTasks([]);
  };

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => { setCurrentUser(user); fetchTasks(user.id); }} />;
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full sm:max-w-md h-screen sm:h-[844px] bg-[#f8f6f0] flex flex-col sm:rounded-[40px] shadow-2xl relative overflow-hidden border border-neutral-800">
        
        {/* Header */}
        <header className="bg-[#111111] text-white px-5 py-4 flex justify-between items-center shadow shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-pink-500 text-white w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs">P</div>
            <div>
              <h1 className="font-semibold text-sm tracking-wide">pulse<span className="text-pink-500">.</span> mobile</h1>
              <p className="text-[10px] text-neutral-400">{currentUser.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl text-xs text-neutral-300 transition">
            Logout
          </button>
        </header>

        {/* Dynamic Screen Area */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {activeNav === 'tasks' ? (
            <TaskListScreen tasks={tasks} onRefresh={() => fetchTasks(currentUser.id)} />
          ) : (
            <NotificationScreen tasks={tasks} />
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-3 shadow-lg shrink-0 z-10">
          <button 
            onClick={() => setActiveNav('tasks')} 
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${activeNav === 'tasks' ? 'text-pink-600 font-semibold' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <FileText size={18} />
            <span>Task Saya</span>
          </button>
          <button 
            onClick={() => setActiveNav('notifications')} 
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${activeNav === 'notifications' ? 'text-pink-600 font-semibold' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <div className="relative">
              <Bell size={18} />
              {tasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <span>Notifikasi</span>
          </button>
        </nav>

      </div>
    </div>
  );
}