<?php

namespace Database\Seeders;

use App\Models\MembershipPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MembershipPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $plans = [
            ['name' => 'Basic', 'description' => 'Akses area gym utama, jam operasional standar.', 'monthly_price' => 150000],
            ['name' => 'Premium', 'description' => 'Akses semua area + kelas group (yoga, zumba, dll).', 'monthly_price' => 300000],
            ['name' => 'VIP', 'description' => 'Akses penuh 24 jam + personal trainer 2x/bulan.', 'monthly_price' => 500000],
        ];

        foreach ($plans as $plan) {
            MembershipPlan::firstOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
