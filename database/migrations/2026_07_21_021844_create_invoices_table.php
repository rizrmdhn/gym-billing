<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('membership_plan_id')->constrained('membership_plans')->onDelete('cascade');

            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount',12,2);
            $table->decimal('total_amount',12,2);

            $table->unsignedTinyInteger('period_month');
            $table->unsignedSmallInteger('period_year');

            $table->enum('status', ['paid', 'unpaid'])->default('unpaid');
            $table->timestamps();

            $table->unique(['member_id', 'period_month', 'period_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
