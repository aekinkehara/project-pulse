<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'start_time',
        'end_time',
        'duration',
    ];

    // TimeLog milik 1 Task
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // TimeLog dicatat oleh 1 User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}