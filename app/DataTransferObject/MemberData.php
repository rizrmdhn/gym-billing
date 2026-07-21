<?php

namespace App\DataTransferObject;

use Carbon\Carbon;

class MemberData
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public readonly string $name,
        public readonly string $phone,
        public readonly ?string $address,
        public readonly int $membershipPlanId,
        public readonly Carbon $joinDate,
        public readonly ?string $status = null
    )
    {
        //
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data["name"],
            phone:  $data["phone"],
            address:  $data["address"] ?? null,
            membershipPlanId: (int) $data["membership_plan_id"],
            joinDate: Carbon::parse($data["join_date"]),
            status:  $data["status"] ?? null
        );
    }

    public function toCreateArray(): array
    {
        return [
            'name' => $this->name,
            'phone'=> $this->phone,
            'address'=> $this->address,
            'membership_plan_id'=> $this->membershipPlanId,
            'join_date'=> $this->joinDate,
            'status'=> 'active',
            'active_until'=> $this->joinDate,
        ];
    }

    public function toUpdateArray(): array
    {
        return [
            'name' => $this->name,
            'phone'=> $this->phone,
            'address'=> $this->address,
            'membership_plan_id'=> $this->membershipPlanId,
            'join_date'=> $this->joinDate,
            'status'=> $this->status,
        ];
    }
}
