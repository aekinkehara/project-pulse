<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['client', 'tasks'])->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'   => 'nullable|exists:clients,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string',
            'deadline'    => 'nullable|date',
        ]);

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Proyek berhasil ditambahkan',
            'data'    => $project->load('client')
        ], 201);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'client_id'   => 'nullable|exists:clients,id',
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string',
            'deadline'    => 'nullable|date',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Proyek berhasil diperbarui',
            'data'    => $project->load('client')
        ]);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Proyek berhasil dihapus'
        ]);
    }
}