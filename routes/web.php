<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DoorController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/door', fn() => inertia('Door'))->name('door');
Route::post('/door/toggle', [DoorController::class, 'toggle']);
Route::get('/door/control', fn() => inertia('DoorControl'))->name('door.control');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
