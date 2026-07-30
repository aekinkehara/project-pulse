# Take-Home Technical Test — Full Stack Developer

https://github.com/user-attachments/assets/3a0a72ac-8876-4a73-b0df-fffe4274a60a




# Pulse Mobile Portal

Aplikasi mobile web untuk portal member yang terhubung dengan backend Laravel API dan database MySQL. Project ini dibuat untuk memenuhi tugas akhir Bilcode.

---

## Tech Stack
- Frontend: React.js, Vite, Tailwind CSS, Lucide Icons
- Backend: Laravel REST API
- Database: MySQL
- Autentikasi: Laravel Sanctum Bearer Token
- Containerization & Orchestration: Docker, Docker Compose, Kubernetes

---

## Fitur Utama
1. Autentikasi Token Asli: Login menggunakan data user dari database MySQL yang menghasilkan token Sanctum valid.
2. Daftar Task Berbasis Role: Menampilkan task yang spesifik di-assign ke user yang sedang login dengan filter status Semua, Aktif, dan Selesai.
3. Indikator Unread Task: Menampilkan penanda tugas baru pada card task yang otomatis hilang ketika task dibuka.
4. Update Status Task: Mengubah status pengerjaan secara dinamis dari todo, in_progress, review, hingga done.
5. Catatan Progres: Menyimpan log aktivitas atau catatan pekerjaan pada detail task.

---

## Cara Menjalankan Project

### 1. Menjalankan via Docker Compose (Development)
Pastikan Docker dan Docker Compose sudah terinstal di komputer kamu. Jalankan perintah berikut pada root folder project:
```bash
docker-compose up --build
Layanan aplikasi akan berjalan dan mengatur otomatis container untuk backend, database, dan frontend.

2. Menjalankan via Kubernetes (Cluster Lokal / Minikube)
Jika menggunakan Kubernetes lokal (seperti Minikube atau Docker Desktop Kubernetes):

Bash
kubectl apply -f k8s/
Periksa status pod yang berjalan dengan perintah:

Bash
kubectl get pods
kubectl get services
Cara Akses Service Setelah Deploy
Secara Lokal (Manual):

Backend Laravel: http://127.0.0.1:8000

Frontend Mobile (Vite): http://localhost:5173

Via Kubernetes Port Forward (Jika menggunakan minikube/k8s):

Bash
kubectl port-forward svc/frontend-service 5173:80
kubectl port-forward svc/backend-service 8000:8000
Kemudian akses http://localhost:5173 di browser.

Cara Menjalankan Mobile di Emulator / Simulator
Buka Android Studio (untuk Emulator Android) atau Xcode (untuk Simulator iOS).

Jalankan Virtual Device (Emulator/Simulator) pilihan kamu.

Buka browser di dalam emulator/simulator tersebut.

Akses alamat http://localhost:5173 atau gunakan IP local network komputer kamu (contoh: http://192.168.x.x:5173) jika emulator membutuhkan akses jaringan host.

Gunakan tampilan Responsive/Mobile DevTools pada browser desktop jika ingin melakukan pengujian cepat secara langsung.
