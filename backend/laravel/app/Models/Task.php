<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'assignee_id',
        'title',
        'description',
        'category',
        'status',
        'deadline',
    ];

    // Task bagian dari 1 Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Task ditugaskan ke 1 User
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    // Task punya banyak Time Log
    public function timeLogs()
    {
        return $this->hasMany(TimeLog::class);
    }
}