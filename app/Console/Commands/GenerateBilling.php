<?php

namespace App\Console\Commands;

use App\DataTransferObject\BillingPeriodData;
use App\Models\Invoice;
use App\Models\InvoiceCounter;
use App\Models\Member;
use DB;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('billing:generate {--month=} {--year=}')]
#[Description('Generate billing invoices for a specific month and year.')]
class GenerateBilling extends Command
{

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $period = $this->option('month') && $this->option('year')
            ? BillingPeriodData::fromArray([
                'month' => $this->option('month'),
                'year' => $this->option('year')
            ])
            : BillingPeriodData::current();

        $members = Member::where('status', 'active')
            ->with('membershipPlan')
            ->get();

        $created = 0;
        $skipped = 0;

        foreach ($members as $member) {
            $exists = Invoice::where('member_id', $member->id)
                ->where('period_month', $period->month)
                ->where('period_year', $period->year)
                ->exists();

            if ($exists) {
                $skipped++;
                continue;
            }

            DB::transaction(function () use ($member, $period) {
                $plan = $member->membershipPlan;
                $subtotal = $plan->monthly_price;
                $tax = round($subtotal * 0.11, 2);
                $total = $subtotal + $tax;


                Invoice::create([
                    'invoice_number' => $this->generateInvoiceNumber($period),
                    'member_id' => $member->id,
                    'membership_plan_id' => $plan->id,
                    'subtotal' => $subtotal,
                    'tax_amount' => $tax,
                    'total_amount' => $total,
                    'period_month' => $period->month,
                    'period_year' => $period->year,
                    'status' => 'unpaid',
                ]);
            });

            $created++;
        }

        $this->info("Invoices generated for {$period->month}/{$period->year}: {$created} created, {$skipped} skipped.");

        return self::SUCCESS;
    }

    private function generateInvoiceNumber(BillingPeriodData $period): string
    {
        $counter = InvoiceCounter::lockForUpdate()
        ->firstOrCreate(
            ['year' => $period->year, 'month' => $period->month],
            ['last_number' => 0]
        );

        $counter->increment('last_number');

        return sprintf('INV/%d/%02d/%05d', $period->year, $period->month, $counter->last_number);
    }
}
