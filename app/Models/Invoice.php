<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        "invoice_number", "member_id", "membership_plan_id", "subtotal", "tax_amount", "total_amount", "period_month", "period_year", "status"
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
