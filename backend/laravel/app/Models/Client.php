<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'company',
    ];

    // 1 Client punya banyak Project
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}