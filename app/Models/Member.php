<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        "name","phone","address","membership_plan_id", "join_date", "status", "active_until"
    ];

    protected $casts = [
        'join_date' => 'date',
        'active_until' => 'date',
    ];

    public function membershipPlan()
    {
        return $this->belongsTo(MembershipPlan::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
