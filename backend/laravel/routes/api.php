<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TimeLogController;

Route::apiResource('clients', ClientController::class);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('time-logs', TimeLogController::class)->except(['update', 'show']);