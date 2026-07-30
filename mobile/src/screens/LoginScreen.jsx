import React, { useState } from 'react';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menembak endpoint API Login Laravel asli
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Menyimpan token asli Sanctum dan data user dari database MySQL
        localStorage.setItem('pulse_token', data.access_token);
        localStorage.setItem('pulse_db_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        alert(data.message || 'Login gagal! Periksa kembali email atau password Anda.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal terhubung ke backend Laravel. Pastikan server php artisan serve menyala!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-neutral-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#111111] text-white w-12 h-12 rounded-2xl font-bold text-xl mb-3 shadow">p</div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">pulse<span className="text-pink-500">.</span></h1>
          <p className="text-xs text-neutral-500 mt-1">Mobile Member Portal (Sanctum Auth)</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">Email Database</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm text-neutral-800"
              placeholder="member@example.com"
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
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl font-semibold shadow-lg transition"
          >
            {loading ? 'Memproses Token...' : 'Login Sanctum API'}
          </button>
        </form>
      </div>
    </div>
  );
}