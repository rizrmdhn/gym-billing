<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use DB;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request, Invoice $invoice)
    {
        if ($invoice->status == "paid") {
            return back()->with("error","Invoice is already paid.");
        }

        DB::transaction(function () use ($invoice, $request) {
            Payment::create([
                'invoice_id'=> $invoice->id,
                'member_id' => $invoice->member_id,
                'staff_id'=> $request->user()->id,
                'amount' => $invoice->total_amount,
                'paid_at' => now(),
            ]);

            $invoice->update([
                'status'=> 'paid',
            ]);

            $member = $invoice->member;
            $base = $member->active_until && $member->active_until->isFuture()
            ? $member->active_until
            : now();

            $member->update([
                "active_until" => $base->copy()->addMonth(),
                'status' => 'active',
            ]);

        });

        return back()->with('success','Payment recorded successfully.');
    }
}
