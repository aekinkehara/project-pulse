<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeLog;
use Illuminate\Http\Request;

class TimeLogController extends Controller
{
    // Ambil log waktu
    public function index()
    {
        $logs = TimeLog::with(['task', 'user'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    // Catat durasi pengerjaan baru
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration' => 'nullable|integer', // dalam menit atau detik
        ]);

        $log = TimeLog::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Log waktu berhasil dicatat',
            'data' => $log
        ], 201);
    }

    // Hapus log
    public function destroy(TimeLog $timeLog)
    {
        $timeLog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log waktu berhasil dihapus'
        ]);
    }
}