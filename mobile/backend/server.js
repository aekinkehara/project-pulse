const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke Database MySQL (Sesuai database project_pulse lu)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project_pulse'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database MySQL terhubung!');
});

// 1. API Login (Validasi tabel users)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Email atau password salah!' });
    
    // Simulasi token JWT / Bearer Token
    const user = results[0];
    const token = 'Bearer_token_user_' + user.id;
    res.json({ token, user });
  });
});

// 2. API Get Tasks Berdasarkan Assignee (Untuk Mobile)
app.get('/api/tasks/:assignee_id', (req, res) => {
  const assigneeId = req.params.assignee_id;
  const query = 'SELECT * FROM tasks WHERE assignee_id = ?';
  
  db.query(query, [assigneeId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. API Update Status Task & Tambah Log Progres
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { status, log } = req.body;
  
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(query, [status, taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task berhasil diperbarui' });
  });
});

app.listen(5000, () => {
  console.log('Backend API berjalan di http://localhost:5000');
});