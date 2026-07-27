<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjectController;

Route::apiResource('clients', ClientController::class);
Route::apiResource('projects', ProjectController::class);