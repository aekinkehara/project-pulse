<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin & Member
        $admin = User::create([
            'name' => 'Project Manager',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $member = User::create([
            'name' => 'Developer Member',
            'email' => 'member@example.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
        ]);

        // 2. Buat Dummy Client
        $client = Client::create([
            'name' => 'PT Teknologi Perkasa',
            'contact' => '081234567890',
            'company' => 'Teknologi Perkasa Corp',
        ]);

        // 3. Buat Dummy Project
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Redesign Website Perusahaan',
            'description' => 'Project pengerjaan ulang landing page dan dashboard client',
            'deadline' => '2026-12-31',
            'status' => 'active',
        ]);

        // 4. Buat Dummy Task
        Task::create([
            'project_id' => $project->id,
            'assignee_id' => $member->id,
            'title' => 'Setup Database & API Rest',
            'description' => 'Membuat struktur tabel dan RESTful API backend',
            'category' => 'backend',
            'status' => 'in_progress',
            'deadline' => '2026-08-15',
        ]);
    }
}