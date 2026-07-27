<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // Ambil semua project beserta data client dan task-nya
    public function index()
    {
        $projects = Project::with(['client', 'tasks'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    // Tambah project baru
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:active,completed,on_hold',
        ]);

        $project = Project::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil dibuat',
            'data' => $project
        ], 201);
    }

    // Detail 1 project beserta client dan daftar tugasnya
    public function show(Project $project)
    {
        return response()->json([
            'success' => true,
            'data' => $project->load(['client', 'tasks.assignee'])
        ]);
    }

    // Update project
    public function update(Request $request, Project $project)
    {
        $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:active,completed,on_hold',
        ]);

        $project->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil diupdate',
            'data' => $project
        ]);
    }

    // Hapus project
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil dihapus'
        ]);
    }
}