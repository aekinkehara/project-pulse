<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeLog;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TimeLogController extends Controller
{
    public function index()
    {
        $logs = TimeLog::with(['task.project', 'user'])->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $logs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id'          => 'nullable|exists:tasks,id',
            'user_id'          => 'nullable|exists:users,id',
            'hours'            => 'nullable|numeric|min:0.1',
            'duration_minutes' => 'nullable|integer|min:1',
            'description'      => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        $taskId = $validated['task_id'] ?? Task::first()?->id;
        $userId = $validated['user_id'] ?? User::first()?->id;

        $inputHours      = $validated['hours'] ?? null;
        $durationMinutes = $validated['duration_minutes'] 
            ?? ($inputHours ? (int) round($inputHours * 60) : 60);

        $notesContent = $validated['notes'] ?? $validated['description'] ?? null;

        $log = TimeLog::create([
            'task_id'          => $taskId,
            'user_id'          => $userId,
            'duration_minutes' => $durationMinutes,
            'notes'            => $notesContent,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Time log berhasil disimpan',
            'data'    => $log->load(['task.project', 'user'])
        ], 201);
    }

    public function destroy(TimeLog $timeLog)
    {
        $timeLog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Time log berhasil dihapus'
        ]);
    }
}