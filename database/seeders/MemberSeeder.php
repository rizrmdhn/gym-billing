<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\MembershipPlan;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $basic = MembershipPlan::where('name', 'Basic')->first();
        $premium = MembershipPlan::where('name', 'Premium')->first();
        $vip = MembershipPlan::where('name', 'VIP')->first();

        $members = [
            [
                'name' => 'Andi Saputra',
                'phone' => '081234567001',
                'address' => 'Jl. Ahmad Yani No. 10, Samarinda',
                'membership_plan_id' => $basic->id,
                'join_date' => Carbon::now()->subMonths(3),
                'status' => 'active',
                'active_until' => Carbon::now()->addDays(10),
            ],
            [
                'name' => 'Budi Hartono',
                'phone' => '081234567002',
                'address' => 'Jl. Pahlawan No. 5, Samarinda',
                'membership_plan_id' => $premium->id,
                'join_date' => Carbon::now()->subMonths(1),
                'status' => 'active',
                'active_until' => Carbon::now()->addDays(20),
            ],
            [
                'name' => 'Citra Dewi',
                'phone' => '081234567003',
                'address' => 'Jl. Sudirman No. 22, Samarinda',
                'membership_plan_id' => $vip->id,
                'join_date' => Carbon::now()->subMonths(6),
                'status' => 'active',
                'active_until' => Carbon::now()->subDays(5), // sudah lewat, cocok buat tes suspend
            ],
            [
                'name' => 'Dedi Kurniawan',
                'phone' => '081234567004',
                'address' => 'Jl. Gatot Subroto No. 8, Samarinda',
                'membership_plan_id' => $basic->id,
                'join_date' => Carbon::now()->subMonths(2),
                'status' => 'suspend', // contoh member yang sudah di-suspend
                'active_until' => Carbon::now()->subMonths(1),
            ],
        ];

        foreach ($members as $member) {
            Member::firstOrCreate(['phone' => $member['phone']], $member);
        }
    }
}
