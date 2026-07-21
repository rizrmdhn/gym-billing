<?php

namespace App\DataTransferObject;

class BillingPeriodData
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public readonly int $month,
        public readonly int $year,
    )
    {
        //
    }

    public static function fromArray(array $data): self
    {
        return new self(
            month: (int) $data["month"],
            year: (int) $data["year"]
        );
    }

    public static function current(): self
    {
        return new self(month: (int) now()->month, year: (int) now()->year);
    }
}
