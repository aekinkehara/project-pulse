<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Client;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // Ambil semua project beserta data client-nya
    public function index()
    {
        $projects = Project::with('client')->latest()->get();
        
        return response()->json([
            'success' => true,
            'data'    => $projects
        ]);
    }

    // Tambah project baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string',
            'client_id'   => 'nullable|exists:clients,id',
            'deadline'    => 'nullable|date',
        ]);

        // 1. Ambil/Buat Default Client jika client_id kosong (Lengkap dengan contact & company)
        if (empty($validated['client_id'])) {
            $defaultClient = Client::firstOrCreate(
                ['name' => 'Internal / Default Client'],
                [
                    'contact' => '-',
                    'company' => 'Internal'
                ]
            );
            $validated['client_id'] = $defaultClient->id;
        }

        // 2. Fallback Nilai Default untuk Semua Kolom Non-Null
        $validated['description'] = $validated['description'] ?? '';
        $validated['status']      = !empty($validated['status']) ? $validated['status'] : 'in_progress';
        $validated['deadline']    = !empty($validated['deadline']) ? $validated['deadline'] : now()->addDays(7)->toDateString();

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil dibuat',
            'data'    => $project
        ], 201);
    }

    // Detail 1 project
    public function show(Project $project)
    {
        return response()->json([
            'success' => true,
            'data'    => $project->load('client')
        ]);
    }

    // Update project
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string',
            'client_id'   => 'nullable|exists:clients,id',
            'deadline'    => 'nullable|date',
        ]);

        $project->update(array_filter($validated, fn($val) => !is_null($val)));

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil diupdate',
            'data'    => $project
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