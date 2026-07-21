<?php

namespace App\Http\Controllers;

use App\DataTransferObject\MemberData;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('members/Index', [
            'members' => Member::with('membershipPlan')->orderBy('name')->get(),
            'plans' => MembershipPlan::orderBy('name')->get(['id', 'name', 'monthly_price']),
        ]);
    }

    public function store(StoreMemberRequest $request)
    {
        $data = MemberData::fromArray($request->validated());

        Member::create($data->toCreateArray());

        return back()->with('success','Member created successfully.');
    }

    public function update (UpdateMemberRequest $request, Member $member)
    {
        $data = MemberData::fromArray($request->validated());

        $member->update($data->toUpdateArray());

        return back()->with('success','Member updated successfully.');
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return back()->with('success','Member deleted successfully.');
    }
}
