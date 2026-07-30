import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationScreen({ tasks }) {
  // Mapping task menjadi list notifikasi in-app
  const notifications = tasks.map(task => {
    const isNew = task.status === 'todo';
    return {
      id: task.id,
      title: isNew ? '✨ Tugas Baru Ditugaskan' : '⚠️ Peringatan Task Aktif',
      desc: isNew 
        ? `Anda mendapat tugas baru: "${task.title}" (${task.project?.name || 'Project Pulse'}).` 
        : `Task "${task.title}" berstatus ${task.status.replace('_', ' ')} dengan deadline ${task.deadline}.`,
      time: isNew ? 'Baru saja' : 'Perhatian'
    };
  });

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Notifikasi In-App Realtime</h2>
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xs text-neutral-400">Belum ada notifikasi baru.</p>
        </div>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                <Bell size={12} /> {notif.title}
              </span>
              <span className="text-[10px] text-neutral-400">{notif.time}</span>
            </div>
            <p className="text-xs text-neutral-700">{notif.desc}</p>
          </div>
        ))
      )}
    </div>
  );
}