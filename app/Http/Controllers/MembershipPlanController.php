<?php

namespace App\Http\Controllers;

use App\DataTransferObject\MembershipPlanData;
use App\Http\Requests\StoreMembershipPlanRequest;
use App\Http\Requests\UpdateMembershipPlanRequest;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('plans/Index', [
            'plans' => MembershipPlan::orderBy('name')->get(),
        ]);
    }

    public function store(StoreMembershipPlanRequest $request)
    {
        $data = MembershipPlanData::fromArray($request->validated());

        MembershipPlan::create($data->toArray());

        return back()->with('success', 'Membership plan created successfully.');
    }

    public function update(UpdateMembershipPlanRequest $request, MembershipPlan $plan)
    {
        $data = MembershipPlanData::fromArray($request->validated());

        $plan->update($data->toArray());

        return back()->with('success', 'Membership plan updated successfully.');
    }

    public function destroy(MembershipPlan $plan)
    {
        $plan->delete();

        return back()->with('success', 'Membership plan deleted successfully.');
    }
}
