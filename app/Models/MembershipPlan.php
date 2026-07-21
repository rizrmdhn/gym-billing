<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipPlan extends Model
{
    protected $fillable = ["name", "description", "monthly_price"];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }
}
