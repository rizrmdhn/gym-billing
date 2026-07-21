<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MembershipPlanController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('plans', MembershipPlanController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->parameters(['plans' => 'plan']);

    Route::resource('members', MemberController::class)
    ->only(['index', 'store', 'update', 'destroy']);

    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('invoices/generate', [InvoiceController::class, 'generate'])->name('invoices.generate');

    Route::post('invoices/{invoice}/pay', [PaymentController::class, 'store'])->name('invoices.store');
});

require __DIR__.'/settings.php';
