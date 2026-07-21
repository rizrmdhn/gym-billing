import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ plans }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ name: '', description: '', monthly_price: '' });
    const editForm = useForm({ name: '', description: '', monthly_price: '' });

    function submitCreate(e) {
        e.preventDefault();
        createForm.post(route('plans.store'), {
            onSuccess: () => createForm.reset(),
        });
    }

    function startEdit(plan) {
        setEditingId(plan.id);
        editForm.setData({
            name: plan.name,
            description: plan.description ?? '',
            monthly_price: plan.monthly_price,
        });
    }

    function submitEdit(e, plan) {
        e.preventDefault();
        editForm.put(route('plans.update', plan.id), {
            onSuccess: () => setEditingId(null),
        });
    }

    function destroy(plan) {
        if (confirm(`Hapus paket "${plan.name}"?`)) {
            createForm.delete(route('plans.destroy', plan.id));
        }
    }

    return (
        <AuthLayout title="Paket Membership" description="Daftar paket membership yang tersedia">
            <div className="py-8 max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Tambah paket baru</h3>
                    <form onSubmit={submitCreate} className="grid grid-cols-3 gap-3 items-start">
                        <div>
                            <input
                                className="border rounded w-full px-3 py-2"
                                placeholder="Nama (mis. Basic)"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                            />
                            {createForm.errors.name && <p className="text-red-600 text-sm">{createForm.errors.name}</p>}
                        </div>
                        <div>
                            <input
                                className="border rounded w-full px-3 py-2"
                                placeholder="Deskripsi"
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                step="0.01"
                                className="border rounded w-full px-3 py-2"
                                placeholder="Harga/bulan"
                                value={createForm.data.monthly_price}
                                onChange={(e) => createForm.setData('monthly_price', e.target.value)}
                            />
                            <button
                                className="bg-gray-900 text-white px-4 py-2 rounded whitespace-nowrap"
                                disabled={createForm.processing}
                            >
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Deskripsi</th>
                                <th className="px-4 py-3">Harga/bulan</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan.id} className="border-t">
                                    {editingId === plan.id ? (
                                        <td colSpan={4} className="px-4 py-3">
                                            <form
                                                onSubmit={(e) => submitEdit(e, plan)}
                                                className="grid grid-cols-4 gap-2 items-center"
                                            >
                                                <input
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                />
                                                <input
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.description}
                                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.monthly_price}
                                                    onChange={(e) => editForm.setData('monthly_price', e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <button className="text-green-700 font-medium">Simpan</button>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3">{plan.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{plan.description}</td>
                                            <td className="px-4 py-3">
                                                Rp {Number(plan.monthly_price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-3">
                                                <button
                                                    className="text-blue-600"
                                                    onClick={() => startEdit(plan)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600"
                                                    onClick={() => destroy(plan)}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {plans.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                        Belum ada paket membership.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthLayout>
    );
}
