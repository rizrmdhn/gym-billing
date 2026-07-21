<?php

namespace App\DataTransferObject;

class MembershipPlanData
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly float $monthlyPrice,
    )
    {
        //
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data["name"],
            description:  $data["description"] ?? null,
            monthlyPrice: (float) $data["monthly_price"]
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description'=> $this->description,
            'monthly_price'=> $this->monthlyPrice,
        ];
    }
}
