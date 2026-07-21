<?php

namespace App\Http\Controllers;

use App\DataTransferObject\BillingPeriodData;
use App\Http\Requests\GenerateInvoiceRequest;
use Artisan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->filled("month") && $request->filled("year")
            ? BillingPeriodData::fromArray($request->only("month", "year"))
            : BillingPeriodData::current();

            return Inertia::render("Invoice/Index", [
                "invoices" => Invoice::with("member")
                ->where("period_month", $period->month)
                ->where("period_year", $period->year)
                ->orderBy("invoice_number")
                ->get(),
                "filters" => ['month' => $period->month, 'year' => $period->year],
            ]);
    }

    public function generate(GenerateInvoiceRequest $request)
    {
        $period = BillingPeriodData::fromArray($request->validated());

        Artisan::call('billing:generate', [
            "--month" => $period->month,
            "--year" => $period->year
        ]);

        return back()->with("success",trim(Artisan::output() ?: "Invoices generated successfully."));
    }
}
