import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { SubmitEvent, useState } from 'react';
import { destroy as destroyPlan, store, update } from '@/actions/App/Http/Controllers/MembershipPlanController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MembershipPlan = {
    id: number;
    name: string;
    description?: string | null;
    monthly_price: number | string;
};

type PlansProps = {
    plans: MembershipPlan[];
};

export default function Plans({ plans }: PlansProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const createForm = useForm({ name: '', description: '', monthly_price: '' });
    const editForm = useForm({ name: '', description: '', monthly_price: '' });

    function submitCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createForm.submit(store(), {
            onSuccess: () => createForm.reset(),
        });
    }

    function startEdit(plan: MembershipPlan) {
        setEditingId(plan.id);
        editForm.setData({
            name: plan.name,
            description: plan.description ?? '',
            monthly_price: String(plan.monthly_price ?? ''),
        });
    }

    function submitEdit(e: SubmitEvent<HTMLFormElement>, plan: MembershipPlan) {
        e.preventDefault();
        editForm.submit(update(plan.id), {
            onSuccess: () => setEditingId(null),
        });
    }

    function destroy(plan: MembershipPlan) {
        if (confirm(`Hapus paket "${plan.name}"?`)) {
            createForm.delete(destroyPlan(plan.id).url);
        }
    }

    return (
        <AuthLayout title="Paket Membership" description="Daftar paket membership yang tersedia">
            <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 lg:px-6">
                <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardHeader className="space-y-2">
                        <CardTitle>Tambah paket baru</CardTitle>
                        <CardDescription>Atur nama paket, deskripsi, dan harga bulanan dalam satu form.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitCreate} className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="plan-name">Nama</Label>
                                <Input
                                    id="plan-name"
                                    placeholder="Nama paket, mis. Basic"
                                    value={createForm.data.name}
                                    onChange={(event) => createForm.setData('name', event.target.value)}
                                />
                                {createForm.errors.name ? (
                                    <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                ) : null}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="plan-description">Deskripsi</Label>
                                <Input
                                    id="plan-description"
                                    placeholder="Deskripsi paket"
                                    value={createForm.data.description}
                                    onChange={(event) => createForm.setData('description', event.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="plan-price">Harga/bulan</Label>
                                <Input
                                    id="plan-price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0"
                                    value={createForm.data.monthly_price}
                                    onChange={(event) => createForm.setData('monthly_price', event.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={createForm.processing} className="w-full">
                                    Tambah
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
                    <CardHeader className="border-b px-6 py-5">
                        <CardTitle>Daftar paket</CardTitle>
                        <CardDescription>{plans.length} paket membership tersedia.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Nama</th>
                                        <th className="px-6 py-4 font-medium">Deskripsi</th>
                                        <th className="px-6 py-4 font-medium">Harga/bulan</th>
                                        <th className="px-6 py-4 font-medium text-right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((plan) => (
                                        <tr key={plan.id} className="border-t border-border/60">
                                            {editingId === plan.id ? (
                                                <td colSpan={4} className="px-6 py-4">
                                                    <form
                                                        onSubmit={(event) => submitEdit(event, plan)}
                                                        className="grid gap-3 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end"
                                                    >
                                                        <div className="grid gap-2">
                                                            <Label>Nama</Label>
                                                            <Input
                                                                value={editForm.data.name}
                                                                onChange={(event) => editForm.setData('name', event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Deskripsi</Label>
                                                            <Input
                                                                value={editForm.data.description}
                                                                onChange={(event) => editForm.setData('description', event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Harga/bulan</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                value={editForm.data.monthly_price}
                                                                onChange={(event) => editForm.setData('monthly_price', event.target.value)}
                                                            />
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
                                                    <td className="px-6 py-4 font-medium">{plan.name}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {plan.description ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        Rp {Number(plan.monthly_price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => startEdit(plan)}>
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => destroy(plan)}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                    {plans.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                                Belum ada paket membership.
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


Plans.layout = {
    title: 'Paket Membership',
    description: 'Daftar paket membership yang tersedia',
};
