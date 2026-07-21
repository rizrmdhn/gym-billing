import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { SubmitEvent, useState } from 'react';
import { destroy as destroyMember, store, update } from '@/actions/App/Http/Controllers/MemberController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from "date-fns";

type MembershipPlan = {
    id: number;
    name: string;
};

type MemberRecord = {
    id: number;
    name: string;
    phone: string;
    address?: string | null;
    membership_plan_id: string | number;
    join_date?: string | null;
    status: 'active' | 'suspend' | string;
    active_until?: string | null;
    membership_plan?: MembershipPlan | null;
};

type MembersProps = {
    members: MemberRecord[];
    plans: MembershipPlan[];
};

export default function Members({ members, plans }: MembersProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const createForm = useForm({
        name: '', phone: '', address: '', membership_plan_id: '', join_date: '',
    });
    const editForm = useForm({
        name: '', phone: '', address: '', membership_plan_id: '', join_date: '', status: 'active',
    });

    function submitCreate(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        createForm.submit(store(), { onSuccess: () => createForm.reset() });
    }

    function startEdit(member: MemberRecord) {
        setEditingId(member.id);
        editForm.setData({
            name: member.name,
            phone: member.phone,
            address: member.address ?? '',
            membership_plan_id: String(member.membership_plan_id ?? ''),
            join_date: member.join_date?.substring(0, 10) ?? '',
            status: member.status,
        });
    }

    function submitEdit(e: SubmitEvent<HTMLFormElement>, member: MemberRecord) {
        e.preventDefault();
        editForm.submit(update(member.id), { onSuccess: () => setEditingId(null) });
    }

    function destroy(member: MemberRecord) {
        if (confirm(`Hapus member "${member.name}"?`)) {
            createForm.delete(destroyMember(member.id).url);
        }
    }

    return (
        <AuthLayout title="Member" description="Daftar member yang sudah terdaftar">
            <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 lg:px-6">
                <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardHeader className="space-y-2">
                        <CardTitle>Tambah member baru</CardTitle>
                        <CardDescription>Isi data member, pilih paket, lalu simpan untuk membuat member baru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitCreate} className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1.2fr_1fr_auto] xl:items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="member-name">Nama</Label>
                                <Input
                                    id="member-name"
                                    placeholder="Nama member"
                                    value={createForm.data.name}
                                    onChange={(event) => createForm.setData('name', event.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="member-phone">Telepon</Label>
                                <Input
                                    id="member-phone"
                                    placeholder="No. telepon"
                                    value={createForm.data.phone}
                                    onChange={(event) => createForm.setData('phone', event.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="member-address">Alamat</Label>
                                <Input
                                    id="member-address"
                                    placeholder="Alamat"
                                    value={createForm.data.address}
                                    onChange={(event) => createForm.setData('address', event.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="member-plan">Paket</Label>
                                <select
                                    id="member-plan"
                                    className="border-input bg-background text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    value={createForm.data.membership_plan_id}
                                    onChange={(event) => createForm.setData('membership_plan_id', event.target.value)}
                                >
                                    <option value="">Pilih paket</option>
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="member-join-date">Tanggal join</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="member-join-date"
                                        type="date"
                                        value={createForm.data.join_date}
                                        onChange={(event) => createForm.setData('join_date', event.target.value)}
                                    />
                                    <Button type="submit" disabled={createForm.processing} className="shrink-0">
                                        Tambah
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
                    <CardHeader className="border-b px-6 py-5">
                        <CardTitle>Daftar member</CardTitle>
                        <CardDescription>{members.length} member terdaftar.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Nama</th>
                                        <th className="px-6 py-4 font-medium">Telepon</th>
                                        <th className="px-6 py-4 font-medium">Paket</th>
                                        <th className="px-6 py-4 font-medium">Aktif s.d.</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.id} className="border-t border-border/60 align-top">
                                            {editingId === member.id ? (
                                                <td colSpan={6} className="px-6 py-4">
                                                    <form
                                                        onSubmit={(event) => submitEdit(event, member)}
                                                        className="grid gap-3 xl:grid-cols-[1.1fr_1fr_1fr_1fr_0.9fr_auto] xl:items-end"
                                                    >
                                                        <div className="grid gap-2">
                                                            <Label>Nama</Label>
                                                            <Input
                                                                value={editForm.data.name}
                                                                onChange={(event) => editForm.setData('name', event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Telepon</Label>
                                                            <Input
                                                                value={editForm.data.phone}
                                                                onChange={(event) => editForm.setData('phone', event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Paket</Label>
                                                            <select
                                                                className="border-input bg-background text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                                value={editForm.data.membership_plan_id}
                                                                onChange={(event) => editForm.setData('membership_plan_id', event.target.value)}
                                                            >
                                                                {plans.map((plan) => (
                                                                    <option key={plan.id} value={plan.id}>
                                                                        {plan.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Tanggal join</Label>
                                                            <Input
                                                                type="date"
                                                                value={editForm.data.join_date}
                                                                onChange={(event) => editForm.setData('join_date', event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Status</Label>
                                                            <select
                                                                className="border-input bg-background text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                                value={editForm.data.status}
                                                                onChange={(event) => editForm.setData('status', event.target.value)}
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="suspend">Suspend</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button type="submit" size="sm" disabled={editForm.processing}>
                                                                Simpan
                                                            </Button>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 font-medium">{member.name}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{member.phone}</td>
                                                    <td className="px-6 py-4">{member.membership_plan?.name ?? '-'}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{member.active_until ? format(new Date(member.active_until), 'dd MMM yyyy') : '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            variant={member.status === 'active' ? 'secondary' : 'destructive'}
                                                            className={
                                                                member.status === 'active'
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : ''
                                                            }
                                                        >
                                                            {member.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => startEdit(member)}>
                                                                Edit
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => destroy(member)}>
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                    {members.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                                                Belum ada member.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}

Members.layout = {
    title: 'Member',
    description: 'Daftar member yang sudah terdaftar',
};
