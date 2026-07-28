<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // Ambil semua data client
    public function index()
    {
        $clients = Client::with('projects')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $clients
        ]);
    }

    // Tambah client baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string',
            'company' => 'nullable|string',
        ]);

       $validated = $request->validate([
        'name'    => 'required|string|max:255',
        'contact' => 'nullable|string',
        'company' => 'nullable|string',
    ]);

    // Gunakan $validated agar hanya data yang lolos validasi yang di-insert ke DB
    $client = Client::create([
        'name'    => $validated['name'],
        'contact' => $validated['contact'] ?? '-',
        'company' => $validated['company'] ?? $validated['name'],
    ]);

        return response()->json([
            'success' => true,
            'message' => 'Client berhasil ditambahkan',
            'data' => $client
        ], 201);
    }

    // Detail 1 client beserta project-nya
    public function show(Client $client)
    {
        return response()->json([
            'success' => true,
            'data' => $client->load('projects')
        ]);
    }

    // Update data client
    public function update(Request $request, Client $client)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'contact' => 'nullable|string',
            'company' => 'nullable|string',
        ]);

        $client->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Client berhasil diupdate',
            'data' => $client
        ]);
    }

    // Hapus client
    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client berhasil dihapus'
        ]);
    }
}