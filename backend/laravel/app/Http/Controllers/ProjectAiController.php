<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectAiController extends Controller
{
    public function generateTasks(Request $request)
    {
        $request->validate([
            'client_brief' => 'required|string',
        ]);

        $brief = strtolower($request->input('client_brief'));

        // Simulasi cerdas AI lokal berdasarkan keyword dari brief kamu
        $tasks = [
            [
                'title' => 'Analisis Kebutuhan & Wireframe UI/UX',
                'description' => 'Membuat rancangan tata letak halaman berdasarkan brief: ' . $request->input('client_brief'),
                'category' => 'design',
                'estimated_hours' => 6
            ],
            [
                'title' => 'Setup Frontend & Komponen Utama',
                'description' => 'Mengembangkan antarmuka halaman menggunakan framework frontend.',
                'category' => 'frontend',
                'estimated_hours' => 10
            ],
            [
                'title' => 'Pengembangan API & Integrasi Database',
                'description' => 'Membuat endpoint backend dan skema database untuk fungsionalitas sistem.',
                'category' => 'backend',
                'estimated_hours' => 12
            ],
            [
                'title' => 'Testing & Bug Fixing (QA)',
                'description' => 'Melakukan uji coba menyeluruh untuk memastikan tidak ada error sebelum rilis.',
                'category' => 'QA',
                'estimated_hours' => 4
            ]
        ];

        // Beri sedikit jeda waktu buatan (0.5 detik) supaya terasa seperti sedang "Loading AI"
        usleep(500000);

        return response()->json([
            'success' => true,
            'suggested_tasks' => $tasks
        ]);
    }

    public function storeProjectWithTasks(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'client_id' => 'nullable|exists:clients,id',
            'status' => 'required|string',
            'deadline' => 'nullable|date',
            'description' => 'nullable|string',
            'tasks' => 'nullable|array',
            'tasks.*.title' => 'required|string|max:255',
            'tasks.*.description' => 'nullable|string',
            'tasks.*.category' => 'nullable|string',
            'tasks.*.estimated_hours' => 'nullable|numeric',
        ]);

        DB::beginTransaction();
        try {
            $project = Project::create([
                'name' => $request->input('name'),
                'client_id' => $request->input('client_id'),
                'status' => $request->input('status', 'in_progress'),
                'deadline' => $request->input('deadline'),
                'description' => $request->input('description'),
            ]);

            $tasksData = $request->input('tasks', []);
            if (is_array($tasksData) && count($tasksData) > 0) {
                foreach ($tasksData as $t) {
                    Task::create([
                        'project_id' => $project->id,
                        'title' => $t['title'],
                        'description' => $t['description'] ?? null,
                        'category' => strtolower($t['category'] ?? 'frontend'),
                        'estimated_hours' => $t['estimated_hours'] ?? 0,
                        'status' => 'todo',
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Proyek dan task berhasil disimpan!',
                'data' => $project
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Store Project Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan proyek: ' . $e->getMessage()
            ], 500);
        }
    }
}