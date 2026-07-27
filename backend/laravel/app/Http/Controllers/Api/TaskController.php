<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Ambil semua task beserta project, assignee, dan time logs-nya
    public function index()
    {
        $tasks = Task::with(['project', 'assignee', 'timeLogs'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    // Tambah task baru
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,completed',
            'deadline' => 'nullable|date',
        ]);

        $task = Task::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil dibuat',
            'data' => $task
        ], 201);
    }

    // Detail 1 task
    public function show(Task $task)
    {
        return response()->json([
            'success' => true,
            'data' => $task->load(['project', 'assignee', 'timeLogs.user'])
        ]);
    }

    // Update task (misal ubah status dari todo ke in_progress)
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,completed',
            'deadline' => 'nullable|date',
        ]);

        $task->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil diupdate',
            'data' => $task
        ]);
    }

    // Hapus task
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil dihapus'
        ]);
    }
}