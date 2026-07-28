<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Ambil semua task sama relasinya
    public function index()
    {
        $tasks = Task::with(['project', 'assignee', 'timeLogs'])->latest()->get();
        return response()->json([
            'success' => true,
            'data'    => $tasks
        ]);
    }

    // Tambah task baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id'  => 'nullable|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'nullable|string',
            'status'      => 'nullable|in:todo,in_progress,review,done',
            'deadline'    => 'nullable|date',
        ]);

        // Fallback jika project_id belum dipilih, kaitkan ke project pertama
        if (empty($validated['project_id'])) {
            $firstProject = Project::first();
            if ($firstProject) {
                $validated['project_id'] = $firstProject->id;
            }
        }

        // Fallback untuk field optional/non-null
        $validated['description'] = $validated['description'] ?? '';
        $validated['category']    = $validated['category'] ?? 'General';
        $validated['status']      = $validated['status'] ?? 'todo';
        $validated['deadline']    = $validated['deadline'] ?? now()->addDays(3)->toDateString();

        $task = Task::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil dibuat',
            'data'    => $task
        ], 201);
    }

    // Detail 1 task
    public function show(Task $task)
    {
        return response()->json([
            'success' => true,
            'data'    => $task->load(['project', 'assignee', 'timeLogs.user'])
        ]);
    }

    // Update task
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id'  => 'nullable|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'nullable|string',
            'status'      => 'nullable|in:todo,in_progress,review,done',
            'deadline'    => 'nullable|date',
        ]);

        $task->update(array_filter($validated, fn($val) => !is_null($val)));

        return response()->json([
            'success' => true,
            'message' => 'Task berhasil diupdate',
            'data'    => $task
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