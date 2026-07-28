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
        'duration_minutes',
        'notes',
    ];

    protected $appends = ['hours', 'date', 'description'];

    public function getHoursAttribute()
    {
        return isset($this->attributes['duration_minutes'])
            ? round($this->attributes['duration_minutes'] / 60, 2)
            : 0;
    }

    public function getDateAttribute()
    {
        return isset($this->attributes['created_at'])
            ? substr($this->attributes['created_at'], 0, 10)
            : date('Y-m-d');
    }

    public function getDescriptionAttribute()
    {
        return $this->attributes['notes'] ?? '-';
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}