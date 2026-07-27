<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'description',
        'deadline',
        'status',
    ];

    // Project dimiliki oleh 1 Client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Project punya banyak Task
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}